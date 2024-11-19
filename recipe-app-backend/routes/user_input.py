from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import os

router = APIRouter()


class UserPreferences(BaseModel):
    name: str
    dietaryGoal: str
    nutritionalGoals: dict


# Route to get current user preferences
@router.get("/preferences")
def get_preferences():
    """Get the current user preferences."""
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        user_data_path = os.path.join(current_dir, "../user_data.json")
        diet_preferences_path = os.path.join(current_dir, "../diet_preferences.json")

        # Read current user data
        with open(user_data_path, "r") as f:
            user_data = json.load(f)

        # Read diet preferences for reference
        with open(diet_preferences_path, "r") as f:
            diet_preferences = json.load(f)

        if not user_data.get("users"):
            # Initialize with default preferences if no user exists
            return {
                "name": "",
                "dietaryGoal": "vegetarian",
                "nutritionalGoals": diet_preferences["user_preferences"][0]["nutritional_goals"]
            }

        # Return first user's preferences (single user system)
        user = user_data["users"][0]

        # Get the nutritional goals for the user's dietary goal
        user_pref = next(
            (pref for pref in diet_preferences["user_preferences"]
             if pref["diet"].lower() == user["dietaryGoal"].lower()),
            diet_preferences["user_preferences"][0]  # Default to first diet if not found
        )

        return {
            "name": user["name"],
            "dietaryGoal": user["dietaryGoal"],
            "nutritionalGoals": user_pref["nutritional_goals"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Route to update user preferences
@router.post("/preferences")
def update_preferences(preferences: UserPreferences):
    """Update the user preferences."""
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "../user_data.json")

        # Initialize or load existing data
        if not os.path.exists(file_path):
            data = {"users": []}
        else:
            with open(file_path, "r") as f:
                data = json.load(f)

        # Create/update user preferences
        new_user = {
            "name": preferences.name,
            "dietaryGoal": preferences.dietaryGoal,
            "currentMealPlan": {}  # Initialize empty meal plan
        }

        if not data["users"]:
            data["users"].append(new_user)
        else:
            # Update existing user (first user in single user system)
            data["users"][0] = new_user

        # Write updated data back to file
        with open(file_path, "w") as f:
            json.dump(data, f, indent=4)

        return {"message": "Preferences updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))