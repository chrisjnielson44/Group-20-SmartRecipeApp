# from fastapi import APIRouter, Depends
# from db import get_db
# from sqlalchemy.orm import Session

# router = APIRouter()

# @router.get("/recipes")
# def get_recipes(db: Session = Depends(get_db)):
#     # Implement database query here
#     return {"message": "List of recipes"}

#Must have JSON and CSV in same directory to work
 
import csv
import json
from typing import Dict, List, Tuple
from dataclasses import dataclass
import random

@dataclass
class Recipe:
    """Class to hold recipe information"""
    name: str
    ingredients: Dict[str, int]  # ingredient: amount in grams/ml
    diet: str
    nutritional_info: Dict[str, float]

# Comprehensive recipe database
RECIPES_DATABASE = {
    "Vegetarian Pasta Primavera": {
        "ingredients": {
            "pasta": 200,
            "tomatoes": 150,
            "broccoli": 100,
            "garlic": 15,
            "onions": 50
        },
        "diet": "vegetarian",
        "nutritional_info": {
            "calories": 420,
            "protein": 14,
            "carbs": 82,
            "fat": 12
        }
    },
    "High Protein Tofu Bowl": {
        "ingredients": {
            "tofu": 300,
            "broccoli": 150,
            "soy_sauce": 30,
            "garlic": 10
        },
        "diet": "vegan",
        "nutritional_info": {
            "calories": 400,
            "protein": 35,
            "carbs": 25,
            "fat": 22
        }
    },
    "Keto Chicken Supreme": {
        "ingredients": {
            "chicken": 250,
            "cheese": 100,
            "spinach": 100,
            "garlic": 15
        },
        "diet": "keto",
        "nutritional_info": {
            "calories": 650,
            "protein": 75,
            "carbs": 8,
            "fat": 45
        }
    },
    "Mediterranean Fish Delight": {
        "ingredients": {
            "salmon": 200,
            "lettuce": 100,
            "tomatoes": 100,
            "lemon": 30,
            "garlic": 10
        },
        "diet": "mediterranean",
        "nutritional_info": {
            "calories": 450,
            "protein": 48,
            "carbs": 15,
            "fat": 28
        }
    },
    "Bulking Power Plate": {
        "ingredients": {
            "chicken": 300,
            "pasta": 250,
            "cheese": 100,
            "broccoli": 150
        },
        "diet": "bulking",
        "nutritional_info": {
            "calories": 950,
            "protein": 85,
            "carbs": 90,
            "fat": 35
        }
    },
    "Cutting Lean Bowl": {
        "ingredients": {
            "chicken": 200,
            "lettuce": 150,
            "tomatoes": 100,
            "lemon": 30
        },
        "diet": "cutting",
        "nutritional_info": {
            "calories": 300,
            "protein": 45,
            "carbs": 12,
            "fat": 10
        }
    },
    "Low Carb Breakfast": {
        "ingredients": {
            "eggs": 200,
            "cheese": 50,
            "spinach": 100,
            "tomatoes": 50
        },
        "diet": "low-carb",
        "nutritional_info": {
            "calories": 400,
            "protein": 35,
            "carbs": 8,
            "fat": 30
        }
    },
    "Vegan Buddha Bowl": {
        "ingredients": {
            "tofu": 200,
            "broccoli": 150,
            "spinach": 100,
            "soy_sauce": 20
        },
        "diet": "vegan",
        "nutritional_info": {
            "calories": 350,
            "protein": 25,
            "carbs": 30,
            "fat": 18
        }
    },
    "Mediterranean Pasta Bowl": {
        "ingredients": {
            "pasta": 200,
            "tomatoes": 150,
            "garlic": 15,
            "spinach": 100
        },
        "diet": "mediterranean",
        "nutritional_info": {
            "calories": 480,
            "protein": 16,
            "carbs": 85,
            "fat": 12
        }
    },
    "Keto Salmon Plate": {
        "ingredients": {
            "salmon": 250,
            "spinach": 150,
            "cheese": 75,
            "lemon": 30
        },
        "diet": "keto",
        "nutritional_info": {
            "calories": 600,
            "protein": 55,
            "carbs": 6,
            "fat": 42
        }
    },
    "Bulking Protein Pasta": {
        "ingredients": {
            "pasta": 300,
            "chicken": 250,
            "cheese": 150,
            "tomatoes": 100
        },
        "diet": "bulking",
        "nutritional_info": {
            "calories": 1100,
            "protein": 90,
            "carbs": 110,
            "fat": 40
        }
    },
    "Vegetarian Cheese Platter": {
        "ingredients": {
            "cheese": 200,
            "bread": 150,
            "tomatoes": 100,
            "lettuce": 50
        },
        "diet": "vegetarian",
        "nutritional_info": {
            "calories": 650,
            "protein": 35,
            "carbs": 45,
            "fat": 42
        }
    },
    "Low Carb Chicken Salad": {
        "ingredients": {
            "chicken": 200,
            "lettuce": 150,
            "cheese": 50,
            "lemon": 30
        },
        "diet": "low-carb",
        "nutritional_info": {
            "calories": 400,
            "protein": 45,
            "carbs": 8,
            "fat": 25
        }
    },
    "Vegan Tofu Scramble": {
        "ingredients": {
            "tofu": 250,
            "tomatoes": 100,
            "spinach": 100,
            "onions": 50
        },
        "diet": "vegan",
        "nutritional_info": {
            "calories": 300,
            "protein": 25,
            "carbs": 20,
            "fat": 18
        }
    },
    "Mediterranean Breakfast": {
        "ingredients": {
            "eggs": 150,
            "tomatoes": 100,
            "bread": 100,
            "spinach": 50
        },
        "diet": "mediterranean",
        "nutritional_info": {
            "calories": 450,
            "protein": 25,
            "carbs": 45,
            "fat": 25
        }
    },
    "Keto Power Breakfast": {
        "ingredients": {
            "eggs": 200,
            "cheese": 100,
            "spinach": 100,
            "milk": 50
        },
        "diet": "keto",
        "nutritional_info": {
            "calories": 550,
            "protein": 45,
            "carbs": 5,
            "fat": 42
        }
    },
    "Cutting Lean Protein": {
        "ingredients": {
            "chicken": 200,
            "broccoli": 200,
            "lemon": 30,
            "garlic": 10
        },
        "diet": "cutting",
        "nutritional_info": {
            "calories": 350,
            "protein": 50,
            "carbs": 15,
            "fat": 12
        }
    },
    "High Volume Low Cal": {
        "ingredients": {
            "lettuce": 200,
            "chicken": 150,
            "tomatoes": 150,
            "lemon": 30
        },
        "diet": "cutting",
        "nutritional_info": {
            "calories": 280,
            "protein": 40,
            "carbs": 12,
            "fat": 10
        }
    },
    "Bulking Breakfast": {
        "ingredients": {
            "eggs": 200,
            "bread": 200,
            "cheese": 100,
            "milk": 200
        },
        "diet": "bulking",
        "nutritional_info": {
            "calories": 850,
            "protein": 55,
            "carbs": 65,
            "fat": 45
        }
    },
    "Low Carb Power Bowl": {
        "ingredients": {
            "chicken": 250,
            "cheese": 100,
            "lettuce": 150,
            "soy_sauce": 20
        },
        "diet": "low-carb",
        "nutritional_info": {
            "calories": 500,
            "protein": 60,
            "carbs": 10,
            "fat": 30
        }
    }
}
    

def load_available_ingredients(filename: str) -> Dict[str, Tuple[int, str]]:
    """
    Load available ingredients from CSV file.
    
    Args:
        filename: Path to the CSV file
        
    Returns:
        Dictionary of ingredients with their quantities and units
    """
    try:
        ingredients = {}
        with open(filename, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                ingredients[row['Ingredient']] = (int(row['Quantity']), row['Unit'])
        return ingredients
    except FileNotFoundError:
        raise FileNotFoundError(f"❌ Ingredients file '{filename}' not found!")
    except Exception as e:
        raise Exception(f"❌ Error reading ingredients file: {str(e)}")

def load_diet_preferences(filename: str) -> Dict:
    """
    Load dietary preferences from JSON file.
    
    Args:
        filename: Path to the JSON file
        
    Returns:
        Dictionary containing diet preferences
    """
    try:
        with open(filename, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        raise FileNotFoundError(f"❌ Preferences file '{filename}' not found!")
    except json.JSONDecodeError:
        raise Exception("❌ Invalid JSON format in preferences file!")
    except Exception as e:
        raise Exception(f"❌ Error reading preferences file: {str(e)}")

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

def check_recipe_compatibility(
    recipe_name: str,
    recipe_data: Dict,
    available_ingredients: Dict[str, Tuple[int, str]],
    diet_type: str,
    diet_preferences: Dict
) -> Tuple[bool, str, float]:
    """
    Check if recipe is compatible with available ingredients and diet preferences.
    
    Args:
        recipe_name: Name of the recipe
        recipe_data: Recipe data dictionary
        available_ingredients: Dictionary of available ingredients
        diet_type: Selected diet type
        diet_preferences: Dictionary of diet preferences
        
    Returns:
        Tuple of (is_compatible, reason, compatibility_score)
    """
    # Check diet type compatibility
    if recipe_data['diet'].lower() != diet_type.lower():
        return False, f"Recipe not suitable for {diet_type} diet", 0
    
    # Check ingredients availability
    missing_ingredients = []
    insufficient_ingredients = []
    compatibility_score = 0
    
    for ingredient, required_amount in recipe_data['ingredients'].items():
        if ingredient not in available_ingredients:
            missing_ingredients.append(ingredient)
            continue
            
        available_amount, unit = available_ingredients[ingredient]
        available_grams = convert_to_grams(available_amount, unit)
        if available_grams < required_amount:
            insufficient_ingredients.append(ingredient)
        else:
            compatibility_score += 1
    
    if missing_ingredients:
        return False, f"Missing ingredients: {', '.join(missing_ingredients)}", 0
    if insufficient_ingredients:
        return False, f"Insufficient amounts of: {', '.join(insufficient_ingredients)}", 0
    
    # Check nutritional goals
    diet_info = next((d for d in diet_preferences['user_preferences'] 
                     if d['diet'] == diet_type), None)
    if diet_info:
        goals = diet_info['nutritional_goals']
        nutrition = recipe_data['nutritional_info']
        
        if nutrition['calories'] > goals['calories'] * 0.4:  # 40% of daily calories
            return False, "Calories too high for diet goals", 0
            
        # Add nutritional matching to score
        for key in ['protein', 'carbs', 'fat']:
            if key in goals and key in nutrition:
                if nutrition[key] <= goals[key] * 0.4:  # Within 40% of daily goal
                    compatibility_score += 0.5
    
    return True, "Compatible", compatibility_score

def suggest_recipes(
    available_ingredients_file: str,
    preferences_file: str
) -> List[Dict]:
    """
    Suggest recipes based on available ingredients and diet preferences.
    
    Args:
        available_ingredients_file: Path to ingredients CSV file
        preferences_file: Path to preferences JSON file
        
    Returns:
        List of suggested recipes
    """
    try:
        print("\n=== Recipe Suggestion System ===")
        
        # Load data
        available_ingredients = load_available_ingredients(available_ingredients_file)
        diet_preferences = load_diet_preferences(preferences_file)
        
        # Get user diet preference
        print("\n=== Available Diet Types ===")
        diet_types = list(set(recipe['diet'] for recipe in RECIPES_DATABASE.values()))
        for i, diet in enumerate(diet_types, 1):
            print(f"{i}. {diet}")
        
        while True:
            try:
                choice = input("\nSelect your diet type (enter number): ").strip()
                if not choice.isdigit() or int(choice) < 1 or int(choice) > len(diet_types):
                    print("❌ Please enter a valid number from the list above.")
                    continue
                diet_type = diet_types[int(choice) - 1]
                break
            except Exception as e:
                print(f"❌ Invalid input: {str(e)}")
        
        # Find compatible recipes
        compatible_recipes = []
        for recipe_name, recipe_data in RECIPES_DATABASE.items():
            is_compatible, reason, score = check_recipe_compatibility(
                recipe_name, recipe_data, available_ingredients, diet_type, diet_preferences)
            if is_compatible:
                compatible_recipes.append((recipe_name, recipe_data, score))
        
        # Sort by compatibility score and select top 3
        compatible_recipes.sort(key=lambda x: x[2], reverse=True)
        selected_recipes = compatible_recipes[:3]
        
        # Print results
        if selected_recipes:
            print(f"\n✅ Found {len(selected_recipes)} compatible recipes:")
            for i, (name, data, score) in enumerate(selected_recipes, 1):
                print(f"\n{i}. {name}")
                print("   Ingredients needed:")
                for ingredient, amount in data['ingredients'].items():
                    print(f"   - {ingredient}: {amount}g")
                print("   Nutritional Info:")
                for key, value in data['nutritional_info'].items():
                    print(f"   - {key}: {value}")
                print(f"   Compatibility Score: {score:.1f}")
        else:
            print("\n❌ No compatible recipes found for your preferences and ingredients.")
        
        return selected_recipes
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return []

if __name__ == "__main__":
    suggest_recipes("user_available_ingredients.csv", "diet_preferences.json")