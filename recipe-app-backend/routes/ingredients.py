import csv
import os
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Tuple, Any
from recipes import get_recipe_by_name
from collections import defaultdict

router = APIRouter()

# Define the path to your CSV file
CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), '../available_ingredients.csv')

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
    
    #convert list of recipe names to list of recipe data dictionaries
    recipes = [get_recipe_by_name(recipe) for recipe in recipes]
    
    # Aggregate required ingredients
    required_ingredients = defaultdict(int)
    for recipe in recipes:
        for ingredient, amount in recipe['ingredients'].items():
            required_ingredients[ingredient.lower()] += amount
    
    # Load available ingredients
    available_ingredients = get_available_ingredients()
    
    missing_ingredients = []
    
    for ingredient, required_amount in required_ingredients.items():
        if ingredient not in available_ingredients:
            #convert to grams
            required_amount = convert_to_grams(required_amount, "grams")
            # Ingredient is completely missing
            missing_ingredients.append({
                "ingredient": ingredient,
                "missing_amount": required_amount,
                "unit": "grams"  # Assuming default unit; adjust if necessary
            })
            continue
        
        available_amount, unit = available_ingredients[ingredient]
        available_grams = convert_to_grams(available_amount, unit)
        
        if available_grams < required_amount:
            # Calculate the additional amount needed
            additional_amount = required_amount - available_grams
            missing_ingredients.append({
                "ingredient": ingredient,
                "missing_amount": additional_amount,
                "unit": "grams"  # Assuming default unit; adjust if necessary
            })
    
    return missing_ingredients

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