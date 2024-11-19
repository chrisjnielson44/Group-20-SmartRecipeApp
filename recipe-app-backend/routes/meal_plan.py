from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os
from typing import Dict, Any, List, Optional, Set
import csv
import random
from .recipes import get_recipes, get_recipe_by_name
from .ingredients import get_grocery_list

router = APIRouter()

class MealPlanResponse(BaseModel):
    meal_plan: Dict[str, Dict[str, Any]]

@router.get("/meal-plan", response_model=MealPlanResponse)
def create_meal_plan():
    """
    Generates a weekly meal plan (3 meals per day) based on the user's dietary goals.

    Returns:
        MealPlanResponse: A dictionary mapping each day to its breakfast, lunch, and dinner recipes.
    """
    # Define days of the week and meal types
    days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    meal_types = ["Breakfast", "Lunch", "Dinner"]

    # Define maximum number of attempts to generate a valid meal plan per day
    MAX_ATTEMPTS_PER_DAY = 5

    # Determine the paths to JSON files and CSV
    current_dir = os.path.dirname(os.path.abspath(__file__))
    user_data_path = os.path.join(current_dir, "../user_data.json")
    diet_preferences_path = os.path.join(current_dir, "../diet_preferences.json")
    recipes_csv_path = os.path.join(current_dir, "../recipes.csv")  # Ensure this path is correct

    try:
        # Load user data
        with open(user_data_path, "r") as f:
            user_data = json.load(f)

        # Assuming a single user for simplicity. Modify as needed for multiple users.
        if not user_data.get("users"):
            raise HTTPException(status_code=404, detail="No users found in user_data.json")

        user = user_data["users"][0]  # Modify to select specific user if multiple exist

        dietary_goal = user.get("dietaryGoal")
        if not dietary_goal:
            raise HTTPException(status_code=400, detail="User does not have a dietary goal set")

        # Load dietary preferences
        with open(diet_preferences_path, "r", encoding="utf-8") as f:
            diet_preferences = json.load(f)

        user_pref = next(
            (pref for pref in diet_preferences.get("user_preferences", []) 
             if pref["diet"].lower() == dietary_goal.lower()), 
            None
        )

        if not user_pref:
            raise HTTPException(status_code=400, detail=f"No nutritional goals found for diet '{dietary_goal}'")

        nutritional_goals = user_pref.get("nutritional_goals", {})
        max_calories = nutritional_goals.get("calories")
        protein_goal = nutritional_goals.get("protein")

        if not max_calories or not protein_goal:
            raise HTTPException(status_code=400, detail="Incomplete nutritional goals for the user's diet")

        # Load recipes from recipes.csv
        recipes = get_recipes()
        
        print(recipes)

        # Filter recipes that match the user's dietary goal
        matching_recipes = [recipe for recipe in recipes.values() if recipe["diet"].lower() == dietary_goal.lower()]

        if not matching_recipes:
            raise HTTPException(status_code=404, detail=f"No recipes found for diet '{dietary_goal}'")

        # Shuffle recipes to ensure diversity
        random.shuffle(matching_recipes)

        # Initialize meal plan
        meal_plan = {day: {} for day in days_of_week}

        # Set to track globally used recipes for ensuring diversity across days
        globally_used_recipes: Set[str] = set()

        for day in days_of_week:
            daily_calories = 0
            daily_protein = 0
            used_recipes_today: Set[str] = set()

            for meal in meal_types:
                # Attempt to find a suitable recipe
                suitable_recipe = None
                for recipe in matching_recipes:
                    recipe_name = recipe["name"]
                    if (recipe_name not in used_recipes_today) and (recipe_name not in globally_used_recipes):
                        if daily_calories + recipe["calories"] <= max_calories:
                            suitable_recipe = recipe
                            break

                # If no suitable recipe found without duplication, allow reuse across days
                if not suitable_recipe:
                    for recipe in matching_recipes:
                        recipe_name = recipe["name"]
                        if recipe_name not in used_recipes_today:
                            if daily_calories + recipe["calories"] <= max_calories:
                                suitable_recipe = recipe
                                break

                # If still no suitable recipe, try doubling a recipe
                if not suitable_recipe:
                    for recipe in matching_recipes:
                        if (recipe["name"] not in used_recipes_today) and (recipe["name"] not in globally_used_recipes):
                            doubled_calories = recipe["calories"] * 2
                            if daily_calories + doubled_calories <= max_calories:
                                suitable_recipe = recipe.copy()
                                suitable_recipe["calories"] *= 2
                                suitable_recipe["protein_g"] *= 2
                                suitable_recipe["carbs_g"] *= 2
                                suitable_recipe["fat_g"] *= 2
                                suitable_recipe["ingredients"] *= 2
                                break

                if suitable_recipe:
                    meal_plan[day][meal] = suitable_recipe
                    daily_calories += suitable_recipe["calories"]
                    daily_protein += suitable_recipe["protein_g"]
                    used_recipes_today.add(suitable_recipe["name"].replace(" (Double Portion)", ""))
                    globally_used_recipes.add(suitable_recipe["name"].replace(" (Double Portion)", ""))
                else:
                    meal_plan[day][meal] = "No suitable recipe found"

            # Check if protein goal is met (80% of protein_goal)
            if daily_protein < (0.8 * protein_goal):
                # Attempt to adjust by finding high-protein recipes to double
                for meal in meal_types:
                    recipe = meal_plan[day][meal]
                    if isinstance(recipe, dict):
                        additional_protein = recipe["protein_g"]
                        additional_calories = recipe["calories"]
                        if daily_calories + additional_calories <= max_calories:
                            # Double the portion
                            doubled_recipe = recipe.copy()
                            doubled_recipe["calories"] *= 2
                            doubled_recipe["protein_g"] *= 2
                            doubled_recipe["carbs_g"] *= 2
                            doubled_recipe["fat_g"] *= 2                         
                            # Update meal plan
                            meal_plan[day][meal] = doubled_recipe
                            daily_calories += recipe["calories"]
                            daily_protein += additional_protein
                            
                            if daily_protein >= (0.8 * protein_goal):
                                break

                # Final check
                if daily_protein < (0.8 * protein_goal):
                    raise HTTPException(
                        status_code=400,
                        detail=f"Unable to meet protein goals for {day}. Consider adding more high-protein recipes or increasing calorie limit."
                    )
        
        #write meal plan to a txt file 
        with open('meal_plan.txt', 'w', encoding='utf-8') as file:
            for day in days_of_week:
                file.write(f"{day}:\n")
                for meal in meal_types:
                    file.write(f"  {meal}: {meal_plan[day][meal]}\n")
        
        #aggregate all recipes into one list of recipe names, but if a recipe is a double portion, add it twice
        all_recipes = []
        for day in days_of_week:
            for meal in meal_types:
                recipe = meal_plan[day][meal]
                if isinstance(recipe, dict):
                    if(meal_plan[day][meal]["calories"] != get_recipe_by_name(meal_plan[day][meal]["name"])["calories"]):
                        all_recipes.append(recipe["name"])
                        all_recipes.append(recipe["name"])
                    else:
                        all_recipes.append(recipe["name"])
        
        #call generate grocery list function 
        get_grocery_list(all_recipes)
        
        return {"meal_plan": meal_plan}  # Wrap the meal_plan in an object
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

create_meal_plan()

