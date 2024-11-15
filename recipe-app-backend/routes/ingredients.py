import csv
import os
from fastapi import APIRouter, HTTPException
from typing import List, Dict

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

