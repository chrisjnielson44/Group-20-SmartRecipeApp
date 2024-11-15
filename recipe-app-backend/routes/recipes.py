import csv
import os
from fastapi import APIRouter, HTTPException
from typing import Dict, Any

router = APIRouter()

def get_recipes() -> Dict[str, Dict[str, Any]]:
    """
    Retrieve recipes from the recipes.csv file and organize them by recipe name.

    Returns:
        A dictionary where each key is a recipe name (lowercased) and the value is the recipe details.
    """
    recipes_dict = {}
    # Determine the path to the CSV file relative to this script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, "../recipes.csv")  # Adjusted path to 'data' directory

    try:
        with open(csv_path, "r", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Parse the Ingredients field into a dictionary
                ingredients_str = row.get("Ingredients", "")
                ingredients = {}
                for item in ingredients_str.split(";"):
                    if ":" in item:
                        name, qty = item.strip().split(":")
                        try:
                            ingredients[name.strip()] = int(qty.strip())
                        except ValueError:
                            ingredients[name.strip()] = qty.strip()  # Handle non-integer quantities if any

                # Construct the recipe dictionary
                recipe_name = row.get("Recipe Name", "").strip()
                if not recipe_name:
                    continue  # Skip entries without a recipe name

                recipe = {
                    "name": recipe_name,
                    "diet": row.get("Diet", "").strip(),
                    "ingredients": ingredients,
                    "calories": int(row.get("Calories", 0)),
                    "protein_g": float(row.get("Protein (g)", 0)),
                    "carbs_g": float(row.get("Carbs (g)", 0)),
                    "fat_g": float(row.get("Fat (g)", 0))
                }

                recipe_name_lower = recipe_name.lower()
                if recipe_name_lower in recipes_dict:
                    print(f"⚠️ Duplicate recipe name found: {recipe_name}. Overwriting previous entry.")
                recipes_dict[recipe_name_lower] = recipe
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="recipes.csv file not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the CSV file: {e}")

    return recipes_dict

RECIPES_DATABASE = get_recipes()

@router.get("/recipes")
def get_recipes_endpoint() -> Dict[str, Dict]:
    """
    Retrieve all recipes indexed by their name.

    Returns:
        A dictionary of recipes where keys are recipe names and values are recipe details.
    """
    if not RECIPES_DATABASE:
        raise HTTPException(status_code=404, detail="No recipes found.")
    return RECIPES_DATABASE

@router.get("/recipes/{recipe_name}")
def get_recipe_by_name(recipe_name: str) -> Dict:
    """
    Retrieve a specific recipe by its name.

    Args:
        recipe_name (str): The name of the recipe to retrieve.

    Returns:
        The recipe details as a dictionary.

    Raises:
        HTTPException: If the recipe is not found.
    """
    recipe = RECIPES_DATABASE.get(recipe_name.lower())
    if not recipe:
        raise HTTPException(status_code=404, detail=f"Recipe '{recipe_name}' not found.")
    return recipe



