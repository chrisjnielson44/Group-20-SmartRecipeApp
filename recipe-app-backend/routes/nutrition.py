import csv 
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Tuple
from recipes import RECIPES_DATABASE, get_recipe_by_name
from collections import defaultdict

router = APIRouter()

def calculate_nutritional_value(meals: List[str]) -> Dict[str, float]:
    """
    Calculate the total nutritional values for a list of meals.

    Args:
        meals (List[str]): List of meal names.

    Returns:
        Dict[str, float]: Total nutritional values (calories, protein, carbs, fat).
    """
    # Initialize total nutritional values
    total_nutrition = {
        "calories": 0.0,
        "protein": 0.0,
        "carbs": 0.0,
        "fat": 0.0,
    }

    missing_recipes = []

    for meal in meals:
        recipe = get_recipe_by_name(meal.lower())
        if recipe:
            print(total_nutrition["calories"])
            total_nutrition["calories"] += total_nutrition["calories"] + recipe.get("calories")
            total_nutrition["protein"] += total_nutrition["protein"] + recipe.get("protein_g")
            total_nutrition["carbs"] += total_nutrition["carbs"] + recipe.get("carbs_g")
            total_nutrition["fat"] += total_nutrition["fat"] + recipe.get("fat_g")
        else:
            missing_recipes.append(meal)
        #print name + nutrition
        

    if missing_recipes:
        missing = ", ".join(missing_recipes)
        print(f"⚠️ Recipes not found in the database: {missing}")
    return total_nutrition

@router.post("/calculate-nutrition", response_model=Dict[str, float])
def get_total_nutrition(meals: List[str]):
    """
    Endpoint to calculate total nutritional values for a list of meals.

    Args:
        meals (List[str]): List of meal names.

    Returns:
        Dict[str, float]: Total nutritional values.
    """
    total_nutrition = calculate_nutritional_value(meals)
    return total_nutrition



def check_recipes_compatibility(
    recipes: List[Dict],
    available_ingredients: Dict[str, Tuple[int, str]],
    diet_type: str,
    diet_preferences: Dict
) -> Tuple[bool, str, Dict[str, float]]:
    """
    Check if a list of recipes is compatible with available ingredients and diet preferences.
    
    Args:
        recipes (List[Dict]): List of recipe data dictionaries.
        available_ingredients (Dict[str, Tuple[int, str]]): Dictionary of available ingredients.
        diet_type (str): Selected diet type.
        diet_preferences (Dict): Dictionary of diet preferences.
        
    Returns:
        Tuple of (is_compatible, reason, total_nutrition)
    """
    # Initialize total required ingredients and nutrition
    total_required_ingredients = defaultdict(int)
    total_nutrition = {
        "calories": 0.0,
        "protein": 0.0,
        "carbs": 0.0,
        "fat": 0.0,
    }
    
    is_diet_compatible = True
    diet_incompatibilities = []
    
    for recipe in recipes:
        # Check diet type compatibility for each recipe
        if recipe['diet'].lower() != diet_type.lower():
            is_diet_compatible = False
            diet_incompatibilities.append(f"Recipe '{recipe['name']}' is not suitable for {diet_type} diet.")
            continue  # Skip incompatible recipes
        
        # Aggregate ingredients
        for ingredient, amount in recipe['ingredients'].items():
            total_required_ingredients[ingredient] += amount
        
        # Aggregate nutrition
        total_nutrition["calories"] += recipe.get("calories", 0)
        total_nutrition["protein"] += recipe.get("protein_g", 0)
        total_nutrition["carbs"] += recipe.get("carbs_g", 0)
        total_nutrition["fat"] += recipe.get("fat_g", 0)
    
    # Check if any recipes were incompatible
    if not is_diet_compatible:
        reasons = "; ".join(diet_incompatibilities)
        return False, reasons, total_nutrition
    
    # Check ingredients availability
    missing_ingredients = []
    insufficient_ingredients = []
    
    for ingredient, required_amount in total_required_ingredients.items():
        if ingredient not in available_ingredients:
            missing_ingredients.append(ingredient)
            continue
        
        available_amount, unit = available_ingredients[ingredient]
        available_grams = convert_to_grams(available_amount, unit)
        
        if available_grams < required_amount:
            insufficient_ingredients.append(ingredient)
    
    reasons = []
    if missing_ingredients:
        reasons.append(f"Missing ingredients: {', '.join(missing_ingredients)}.")
    if insufficient_ingredients:
        reasons.append(f"Insufficient amounts of: {', '.join(insufficient_ingredients)}.")
    
    if reasons:
        return False, " ".join(reasons), total_nutrition
    
    # Check aggregated nutritional goals
    diet_info = next((d for d in diet_preferences['user_preferences'] 
                     if d['diet'].lower() == diet_type.lower()), None)
    if diet_info:
        goals = diet_info['nutritional_goals']
        nutrition = total_nutrition
        
        if nutrition['calories'] > goals.get('calories', 0) * 0.4:
            reasons.append("Total calories exceed 40% of daily goals.")
        
        for key in ['protein', 'carbs', 'fat']:
            goal_key = f"{key}_goal" if f"{key}_goal" in goals else key
            if key in goals and key in nutrition:
                if nutrition[key] > goals[key] * 0.4:
                    reasons.append(f"Total {key} exceeds 40% of daily goals.")
        
        if reasons:
            return False, " ".join(reasons), total_nutrition
    
    # If all checks pass
    return True, "All recipes are compatible.", total_nutrition





def convert_to_grams(quantity: int, unit: str) -> float:
    """
    Convert various units to grams for comparison.
    
    Args:
        quantity: Amount of ingredient
        unit: Unit of measurement
        
    Returns:
        Equivalent amount in grams
    """
    conversion_rates = {
        "grams": 1,
        "ml": 1,  # Assuming density of 1g/ml for liquids
        "pieces": 100,  # Rough approximation
        "cups": 240,
        "tablespoons": 15
    }
    return quantity * conversion_rates.get(unit, 1)