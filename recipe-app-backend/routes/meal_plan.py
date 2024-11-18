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



def get_daily_nutritional_targets(diet_preferences: Dict) -> Dict:
    """Get daily nutritional targets based on diet preferences."""
    diet_type = diet_preferences.get('diet_type', '')
    diet_info = next((d for d in diet_preferences['user_preferences'] 
                     if d['diet'] == diet_type), None)
    
    if not diet_info or 'nutritional_goals' not in diet_info:
        return {}
    
    return diet_info['nutritional_goals']

def distribute_daily_nutrition(daily_targets: Dict, meals_per_day: int = 3) -> List[Dict]:
    """Distribute daily nutritional targets across meals."""
    meal_distributions = {
        'breakfast': 0.3,
        'lunch': 0.4,
        'dinner': 0.3
    }
    
    meal_targets = []
    for meal_type, distribution in meal_distributions.items():
        meal_target = {
            'meal_type': meal_type,
            'targets': {
                nutrient: value * distribution
                for nutrient, value in daily_targets.items()
            }
        }
        meal_targets.append(meal_target)
    
    return meal_targets

def select_best_recipe(
    compatible_recipes: List[str],
    compatibility_scores: List[float],
    used_recipes: set,
    recipes_data: Dict
) -> str:
    """Select the best recipe based on compatibility score and variety."""
    available_recipes = [
        (recipe, score) 
        for recipe, score in zip(compatible_recipes, compatibility_scores)
        if recipe not in used_recipes
    ]
    
    if not available_recipes:
        # If all compatible recipes have been used, allow reuse
        available_recipes = list(zip(compatible_recipes, compatibility_scores))
    
    # Sort by compatibility score and select randomly from top 3
    available_recipes.sort(key=lambda x: x[1], reverse=True)
    top_recipes = available_recipes[:3]
    selected_recipe = random.choice(top_recipes)[0]
    
    return selected_recipe

def create_weekly_meal_plan(
    db: Session,
    recipes: Dict[str, Dict],
    available_ingredients: Dict[str, Tuple[int, str]],
    diet_preferences: Dict
) -> Dict[str, Dict]:
    """Generate a weekly meal plan."""
    diet_type = diet_preferences.get('diet_type', '')
    if not diet_type:
        raise HTTPException(status_code=400, detail="Diet type not specified")
    
    # Get daily nutritional targets
    daily_targets = get_daily_nutritional_targets(diet_preferences)
    meal_targets = distribute_daily_nutrition(daily_targets)
    
    # Initialize weekly plan
    days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    weekly_plan = {day: {'breakfast': None, 'lunch': None, 'dinner': None} for day in days}
    used_recipes = set()
    
    # Generate meal plan for each day
    for day in days:
        for meal_target in meal_targets:
            meal_type = meal_target['meal_type']
            
            # Find compatible recipes for this meal
            has_compatible, compatible_recipes, scores = find_compatible_recipes(
                recipes=recipes,
                available_ingredients=available_ingredients,
                diet_type=diet_type,
                diet_preferences=diet_preferences,
                min_recipes=3
            )
            
            if not has_compatible:
                raise HTTPException(
                    status_code=400,
                    detail=f"Not enough compatible recipes for {meal_type} on {day}"
                )
            
            # Select best recipe for this meal
            selected_recipe = select_best_recipe(
                compatible_recipes,
                scores,
                used_recipes,
                recipes
            )
            
            weekly_plan[day][meal_type] = {
                'recipe_name': selected_recipe,
                'recipe_data': recipes[selected_recipe]
            }
            used_recipes.add(selected_recipe)
            
            # Update available ingredients
            for ingredient, amount in recipes[selected_recipe]['ingredients'].items():
                if ingredient in available_ingredients:
                    current_amount, unit = available_ingredients[ingredient]
                    available_ingredients[ingredient] = (current_amount - amount, unit)
    
    return weekly_plan

@router.post("/meal-plan")
def create_meal_plan(
    recipes: Dict[str, Dict],
    available_ingredients: Dict[str, Tuple[int, str]],
    diet_preferences: Dict,
    db: Session = Depends(get_db)
):
    """
    Create a weekly meal plan based on available recipes, ingredients, and dietary preferences.
    
    Returns:
        Dict containing meal plan for each day of the week
    """
    try:
        meal_plan = create_weekly_meal_plan(
            db,
            recipes,
            available_ingredients,
            diet_preferences
        )
        
        return {
            "status": "success",
            "message": "Meal plan created successfully",
            "meal_plan": meal_plan
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating meal plan: {str(e)}"
        )






