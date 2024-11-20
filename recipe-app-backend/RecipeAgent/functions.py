from typing import List, Dict, Any
# functions.py
from routes.meal_plan import create_meal_plan

# Define the OpenAI function specifications
functions = [
    {
        "name": "get_meal_plan",
        "description": "Retrieve the current weekly meal plan for the user.",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    }
]


# Function implementation
def get_meal_plan() -> Dict[str, Dict[str, Any]]:
    """
    Retrieves the current weekly meal plan for the user by calling the create_meal_plan function.

    Returns:
        Dict[str, Dict[str, Any]]: The meal plan organized by days and meals.
    """
    meal_plan_response = create_meal_plan()
    meal_plan = meal_plan_response.get("meal_plan", {})
    return meal_plan


# Map function names to actual functions
function_map = {
    "get_meal_plan": get_meal_plan
}