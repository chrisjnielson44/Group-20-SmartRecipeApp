import csv
import os
from fastapi import APIRouter
from typing import List, Dict

router = APIRouter()

@router.get("/recipes")
def get_recipes() -> Dict[str, List[Dict]]:
    """
    Retrieve a list of recipes from the recipes.csv file.

    Returns:
        A dictionary containing a list of recipe dictionaries or an error message.
    """
    recipes = []
    # Determine the path to the CSV file relative to this script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, "../recipes.csv")

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
                        ingredients[name.strip()] = int(qty.strip())
                
                # Construct the recipe dictionary
                recipe = {
                    "name": row.get("Recipe Name", "").strip(),
                    "diet": row.get("Diet", "").strip(),
                    "ingredients": ingredients,
                    "calories": int(row.get("Calories", 0)),
                    "protein_g": float(row.get("Protein (g)", 0)),
                    "carbs_g": float(row.get("Carbs (g)", 0)),
                    "fat_g": float(row.get("Fat (g)", 0))
                }
                recipes.append(recipe)
    except FileNotFoundError:
        return {"error": "recipes.csv file not found."}
    except Exception as e:
        return {"error": f"An error occurred while processing the CSV file: {str(e)}"}

    return {"recipes": recipes}


