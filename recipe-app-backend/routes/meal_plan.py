from fastapi import APIRouter, Depends
from db import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/meal-plan")
def create_meal_plan(db: Session = Depends(get_db)):
    # Implement meal planning algorithm here
    return {"message": "Meal plan created successfully"}

from typing import List, Dict, Tuple

def find_compatible_recipes(
    recipes: Dict[str, Dict],
    available_ingredients: Dict[str, Tuple[int, str]],
    diet_type: str,
    diet_preferences: Dict,
    min_recipes: int = 3
) -> Tuple[bool, List[str], List[float]]:
    """
    Check if there are at least min_recipes number of compatible recipes from the provided list.
    
    Args:
        recipes: Dictionary of recipes where key is recipe name and value is recipe data
        available_ingredients: Dictionary of available ingredients
        diet_type: Selected diet type
        diet_preferences: Dictionary of diet preferences
        min_recipes: Minimum number of compatible recipes required (default: 3)
        
    Returns:
        Tuple of (has_enough_recipes, compatible_recipe_names, compatibility_scores)
    """
    compatible_recipes = []
    compatibility_scores = []
    
    # Check each recipe for compatibility
    for recipe_name, recipe_data in recipes.items():
        is_compatible, reason, score = check_recipe_compatibility(
            recipe_name,
            recipe_data,
            available_ingredients,
            diet_type,
            diet_preferences
        )
        
        if is_compatible:
            compatible_recipes.append(recipe_name)
            compatibility_scores.append(score)
            
            # Early return if we've found enough recipes
            if len(compatible_recipes) >= min_recipes:
                return True, compatible_recipes, compatibility_scores
    
    # If we haven't found enough recipes
    return False, compatible_recipes, compatibility_scores