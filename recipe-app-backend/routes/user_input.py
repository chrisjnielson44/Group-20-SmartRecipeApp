from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os

router = APIRouter()

class UserInput(BaseModel):
    name: str
    dietaryGoal: str
    currentMealPlan: dict = {}  # Default to empty dict if not provided

@router.post("/add-user")
def add_user(user: UserInput):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, "../user_data.json")
    
    try:
        if not os.path.exists(file_path):
            # Initialize the JSON file if it doesn't exist
            data = {"users": []}
        else:
            with open(file_path, "r") as f:
                data = json.load(f)
        
        # Create a new user entry
        new_user = {
            "name": user.name,
            "dietaryGoal": user.dietaryGoal,
            "currentMealPlan": user.currentMealPlan
        }
        
        # Append the new user to the users list
        data["users"].append(new_user)
        
        # Write the updated data back to the JSON file
        with open(file_path, "w") as f:
            json.dump(data, f, indent=4)
        
        return {"message": "User added successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))