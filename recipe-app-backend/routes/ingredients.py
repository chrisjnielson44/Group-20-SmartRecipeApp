import csv
import os
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from collections import defaultdict
from routes.recipes import get_recipe_by_name

router = APIRouter()

# Define the path to your CSV file
CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), '../user_available_ingredients.csv')

@router.get("/ingredients", response_model=List[Dict[str, str]])
def get_available_ingredients():
    """
    Retrieve a list of available ingredients from a CSV file.

    Returns:
        A list of dictionaries containing ingredient details.
    """
    try:
        ingredients = []
        with open(CSV_FILE_PATH, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                ingredient = {
                    "name": row.get("Ingredient", "").strip(),
                    "quantity": row.get("Quantity", "").strip(),
                    "unit": row.get("Unit", "").strip()
                }
                if not ingredient["name"]:
                    continue  # Skip entries without a name
                ingredients.append(ingredient)
        return ingredients
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Ingredients CSV file not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while reading the CSV file: {e}")

def get_ingredients_dict() -> Dict[str, tuple]:
    """
    Get available ingredients as a dictionary for easier lookup.

    Returns:
        Dict[str, tuple]: Dictionary with ingredient names as keys and (quantity, unit) as values
    """
    ingredients_list = get_available_ingredients()
    return {
        ingredient["name"].lower(): (float(ingredient["quantity"]), ingredient["unit"])
        for ingredient in ingredients_list
    }

@router.post("/ingredients/grocery-list")
def get_grocery_list(recipes: List[str]) -> List[Dict[str, Any]]:
    """
    Determine missing and insufficient ingredients based on a list of recipes.

    Args:
        recipes (List[str]): List of recipe names.

    Returns:
        List[Dict[str, Any]]: A list of dictionaries, each containing:
            - ingredient: Name of the ingredient.
            - missing_amount: Quantity missing (in grams).
    """
    # Convert list of recipe names to list of recipe data dictionaries
    recipe_data = [get_recipe_by_name(recipe) for recipe in recipes]

    # Aggregate required ingredients
    required_ingredients = defaultdict(int)
    for recipe in recipe_data:
        for ingredient, amount in recipe['ingredients'].items():
            try:
                amount_value = float(amount) if isinstance(amount, str) else amount
                required_ingredients[ingredient.lower()] += amount_value
            except (ValueError, TypeError):
                print(f"Warning: Could not convert amount '{amount}' for ingredient '{ingredient}'")
                continue

    # Load available ingredients
    available_ingredients = get_ingredients_dict()

    missing_ingredients = []

    for ingredient, required_amount in required_ingredients.items():
        if ingredient not in available_ingredients:
            # Convert to grams
            required_amount = convert_to_grams(required_amount, "grams")
            # Ingredient is completely missing
            missing_ingredients.append({
                "ingredient": ingredient,
                "missing_amount": required_amount,
                "unit": "grams"  # Assuming default unit; adjust if necessary
            })
            continue

        available_amount, unit = available_ingredients[ingredient]
        available_grams = convert_to_grams(float(available_amount), unit)
        required_grams = convert_to_grams(float(required_amount), "grams")

        if available_grams < required_grams:
            # Calculate the additional amount needed
            additional_amount = required_grams - available_grams
            missing_ingredients.append({
                "ingredient": ingredient,
                "missing_amount": additional_amount,
                "unit": "grams"  # Assuming default unit; adjust if necessary
            })

    return missing_ingredients

def convert_to_grams(quantity: float, unit: str) -> float:
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
    return quantity * conversion_rates.get(unit.lower(), 1)
