import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add the parent directory to the sys.path to ensure routes can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from routes.meal_plan import router

# Create a TestClient using the FastAPI router
client = TestClient(router)

def test_create_meal_plan():
    response = client.get("/meal-plan")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)
    assert "meal_plan" in response.json()
    
    meal_plan = response.json()["meal_plan"]
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    meals = ["Breakfast", "Lunch", "Dinner"]
    
    # Check if meal_plan.txt was created
    assert os.path.exists('meal_plan.txt')
    
    # Read user's dietary goals
    current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    with open(os.path.join(current_dir, 'user_data.json'), 'r', encoding='utf-8') as f:
        user_data = f.read()
        dietary_goal = eval(user_data)['users'][0]['dietaryGoal']
    
    with open(os.path.join(current_dir, 'diet_preferences.json'), 'r', encoding='utf-8') as f:
        diet_prefs = f.read()
        nutritional_goals = next(
            pref['nutritional_goals'] 
            for pref in eval(diet_prefs)['user_preferences'] 
            if pref['diet'].lower() == dietary_goal.lower()
        )
    
    max_calories = nutritional_goals['calories']
    protein_goal = nutritional_goals['protein']
    
    # Check each day's meals
    for day in days:
        assert day in meal_plan
        daily_calories = 0
        daily_protein = 0
        
        # Check each meal
        for meal in meals:
            assert meal in meal_plan[day]
            if isinstance(meal_plan[day][meal], dict):
                daily_calories += meal_plan[day][meal]['calories']
                daily_protein += meal_plan[day][meal]['protein_g']
        
        # Verify daily calorie limit is not exceeded
        assert daily_calories <= max_calories, f"{day} exceeds calorie limit"
        
        # Verify protein goal is at least 80% met
        assert daily_protein >= (0.8 * protein_goal), f"{day} doesn't meet protein goal"

def test_meal_plan_invalid_user():
    # Temporarily rename user_data.json to simulate missing file
    if os.path.exists('user_data.json'):
        os.rename('user_data.json', 'user_data.json.bak')
    
    response = client.get("/meal-plan")
    assert response.status_code == 500
    
    # Restore the file
    if os.path.exists('user_data.json.bak'):
        os.rename('user_data.json.bak', 'user_data.json')
