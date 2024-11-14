import csv 
from fastapi import APIRouter, HTTPException
from typing import List, Dict
from recipes import RECIPES_DATABASE, get_recipe_by_name

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