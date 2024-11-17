
from typing import List, Dict, Any, Optional
import pandas as pd
import json
from datetime import datetime
from .database import get_db

def execute_sql(query: str) -> Dict[str, Any]:
    """
    Execute a SQL query and return formatted results
    """
    try:
        db = get_db()
        results = db.execute_query(query)
        return {
            "status": "success",
            "data": results.to_dict('records'),
            "columns": results.columns.tolist()
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def find_recipes_by_ingredients(available_ingredients: List[str], diet: Optional[str] = None) -> Dict[str, Any]:
    """
    Find recipes that can be made with available ingredients
    """
    query = """
    WITH available_recipes AS (
        SELECT
            r.id,
            r.Recipe_Name,
            r.Diet,
            COUNT(DISTINCT ri.ingredient_name) as matching_ingredients,
            (
                SELECT COUNT(DISTINCT ingredient_name)
                FROM recipe_ingredients
                WHERE recipe_id = r.id
            ) as total_ingredients
        FROM recipes r
        JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        WHERE ri.ingredient_name IN (
            SELECT DISTINCT Ingredient
            FROM ingredients
            WHERE source IN ('main', 'user')
        )
        GROUP BY r.id, r.Recipe_Name, r.Diet
    )
    SELECT
        Recipe_Name,
        Diet,
        matching_ingredients,
        total_ingredients,
        ROUND(CAST(matching_ingredients AS FLOAT) / total_ingredients * 100, 2) as match_percentage
    FROM available_recipes
    {diet_clause}
    ORDER BY match_percentage DESC
    """

    if diet:
        diet_clause = f"WHERE Diet = '{diet}'"
    else:
        diet_clause = ""

    query = query.format(diet_clause=diet_clause)
    return execute_sql(query)

def analyze_nutritional_content(recipe_name: str) -> Dict[str, Any]:
    """
    Analyze nutritional content of a recipe
    """
    query = """
    SELECT
        Recipe_Name,
        Calories,
        Protein_g as protein,
        Carbs_g as carbs,
        Fat_g as fat,
        ROUND(Protein_g * 4 + Carbs_g * 4 + Fat_g * 9, 2) as total_calories,
        ROUND(Protein_g * 4 / (Protein_g * 4 + Carbs_g * 4 + Fat_g * 9) * 100, 2) as protein_percentage,
        ROUND(Carbs_g * 4 / (Protein_g * 4 + Carbs_g * 4 + Fat_g * 9) * 100, 2) as carbs_percentage,
        ROUND(Fat_g * 9 / (Protein_g * 4 + Carbs_g * 4 + Fat_g * 9) * 100, 2) as fat_percentage
    FROM recipes
    WHERE Recipe_Name = ?
    """

    db = get_db()
    df = pd.read_sql_query(query, db.conn, params=[recipe_name])
    return df.to_dict('records')[0] if not df.empty else None

def suggest_meal_plan(
    days: int,
    diet: Optional[str] = None,
    max_calories: Optional[int] = None,
    min_protein: Optional[int] = None
) -> Dict[str, Any]:
    """
    Suggest a meal plan based on criteria
    """
    conditions = []
    if diet:
        conditions.append(f"Diet = '{diet}'")
    if max_calories:
        conditions.append(f"Calories <= {max_calories}")
    if min_protein:
        conditions.append(f"Protein_g >= {min_protein}")

    where_clause = " AND ".join(conditions)
    where_clause = f"WHERE {where_clause}" if where_clause else ""

    query = f"""
    SELECT
        Recipe_Name,
        Diet,
        Calories,
        Protein_g,
        Carbs_g,
        Fat_g,
        (
            SELECT GROUP_CONCAT(ingredient_name || ': ' || quantity)
            FROM recipe_ingredients
            WHERE recipe_id = r.id
        ) as ingredients
    FROM recipes r
    {where_clause}
    ORDER BY RANDOM()
    LIMIT {days * 3}  -- 3 meals per day
    """

    results = execute_sql(query)

    if results["status"] == "success":
        # Organize into meals per day
        meal_plan = {}
        meals = results["data"]
        for i, meal in enumerate(meals):
            day = i // 3 + 1
            meal_type = ["breakfast", "lunch", "dinner"][i % 3]

            if day not in meal_plan:
                meal_plan[day] = {}

            meal_plan[day][meal_type] = meal

        return {
            "status": "success",
            "meal_plan": meal_plan
        }

    return results

def check_ingredient_availability(recipe_name: str) -> Dict[str, Any]:
    """
    Check which ingredients are available and missing for a recipe
    """
    query = """
    WITH recipe_requirements AS (
        SELECT
            ri.ingredient_name,
            ri.quantity
        FROM recipes r
        JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        WHERE r.Recipe_Name = ?
    )
    SELECT
        rr.ingredient_name,
        rr.quantity as required_quantity,
        i.Quantity as available_quantity,
        i.Unit as available_unit,
        i.source,
        CASE
            WHEN i.Ingredient IS NULL THEN 'missing'
            ELSE 'available'
        END as status
    FROM recipe_requirements rr
    LEFT JOIN ingredients i ON rr.ingredient_name = i.Ingredient
    """

    db = get_db()
    df = pd.read_sql_query(query, db.conn, params=[recipe_name])

    available = df[df['status'] == 'available'].to_dict('records')
    missing = df[df['status'] == 'missing'].to_dict('records')

    return {
        "status": "success",
        "recipe_name": recipe_name,
        "available_ingredients": available,
        "missing_ingredients": missing
    }

def get_recipe_details(recipe_name: str) -> Dict[str, Any]:
    """
    Get comprehensive details about a recipe
    """
    # Get basic recipe info
    recipe_query = """
    SELECT
        r.*,
        GROUP_CONCAT(DISTINCT ri.ingredient_name || ': ' || ri.quantity) as ingredients_list
    FROM recipes r
    LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
    WHERE r.Recipe_Name = ?
    GROUP BY r.id
    """

    db = get_db()
    recipe_df = pd.read_sql_query(recipe_query, db.conn, params=[recipe_name])

    if recipe_df.empty:
        return {
            "status": "error",
            "message": f"Recipe '{recipe_name}' not found"
        }

    recipe_data = recipe_df.to_dict('records')[0]

    # Get ingredient availability
    availability = check_ingredient_availability(recipe_name)

    # Get nutritional analysis
    nutrition = analyze_nutritional_content(recipe_name)

    return {
        "status": "success",
        "recipe_data": recipe_data,
        "ingredient_availability": availability,
        "nutritional_analysis": nutrition
    }

def search_recipes(
    diet: Optional[str] = None,
    min_protein: Optional[float] = None,
    max_calories: Optional[int] = None,
    ingredients: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Search recipes based on multiple criteria
    """
    conditions = []
    if diet:
        conditions.append(f"r.Diet = '{diet}'")
    if min_protein:
        conditions.append(f"r.Protein_g >= {min_protein}")
    if max_calories:
        conditions.append(f"r.Calories <= {max_calories}")

    where_clause = " AND ".join(conditions)
    where_clause = f"WHERE {where_clause}" if where_clause else ""

    if ingredients:
        ingredient_list = ", ".join([f"'{i}'" for i in ingredients])
        query = f"""
        WITH matching_recipes AS (
            SELECT
                r.*,
                COUNT(DISTINCT CASE WHEN ri.ingredient_name IN ({ingredient_list}) THEN ri.ingredient_name END) as matching_ingredients,
                COUNT(DISTINCT ri.ingredient_name) as total_ingredients
            FROM recipes r
            JOIN recipe_ingredients ri ON r.id = ri.recipe_id
            {where_clause}
            GROUP BY r.id
        )
        SELECT
            Recipe_Name,
            Diet,
            Calories,
            Protein_g,
            Carbs_g,
            Fat_g,
            matching_ingredients,
            total_ingredients,
            ROUND(CAST(matching_ingredients AS FLOAT) / total_ingredients * 100, 2) as match_percentage
        FROM matching_recipes
        ORDER BY match_percentage DESC, Calories ASC
        """
    else:
        query = f"""
        SELECT
            r.Recipe_Name,
            r.Diet,
            r.Calories,
            r.Protein_g,
            r.Carbs_g,
            r.Fat_g
        FROM recipes r
        {where_clause}
        ORDER BY r.Calories ASC
        """

    return execute_sql(query)

# List of available functions for the agent
functions = [
    {
        "name": "execute_sql",
        "description": "Execute a custom SQL query on the recipe database",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "SQL query to execute"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "find_recipes_by_ingredients",
        "description": "Find recipes that can be made with available ingredients",
        "parameters": {
            "type": "object",
            "properties": {
                "available_ingredients": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of available ingredient names"
                },
                "diet": {
                    "type": "string",
                    "description": "Optional dietary restriction"
                }
            },
            "required": ["available_ingredients"]
        }
    },
    {
        "name": "analyze_nutritional_content",
        "description": "Get detailed nutritional analysis of a recipe",
        "parameters": {
            "type": "object",
            "properties": {
                "recipe_name": {"type": "string", "description": "Name of the recipe"}
            },
            "required": ["recipe_name"]
        }
    },
    {
        "name": "suggest_meal_plan",
        "description": "Generate a meal plan based on criteria",
        "parameters": {
            "type": "object",
            "properties": {
                "days": {"type": "integer", "description": "Number of days to plan"},
                "diet": {"type": "string", "description": "Dietary restriction"},
                "max_calories": {"type": "integer", "description": "Maximum calories per meal"},
                "min_protein": {"type": "integer", "description": "Minimum protein per meal"}
            },
            "required": ["days"]
        }
    },
    {
        "name": "check_ingredient_availability",
        "description": "Check which ingredients are available for a recipe",
        "parameters": {
            "type": "object",
            "properties": {
                "recipe_name": {"type": "string", "description": "Name of the recipe"}
            },
            "required": ["recipe_name"]
        }
    }
]

# Function mapping for the agent
function_map = {
    "execute_sql": execute_sql,
    "find_recipes_by_ingredients": find_recipes_by_ingredients,
    "analyze_nutritional_content": analyze_nutritional_content,
    "suggest_meal_plan": suggest_meal_plan,
    "check_ingredient_availability": check_ingredient_availability,
    "get_recipe_details": get_recipe_details,
    "search_recipes": search_recipes
}
