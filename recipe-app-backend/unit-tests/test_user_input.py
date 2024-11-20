import sys
import os
import pytest
import json
from fastapi.testclient import TestClient

# Add the parent directory to the sys.path to ensure routes can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from routes.user_input import router

# Create a TestClient using the FastAPI router
client = TestClient(router)

def test_get_preferences():
    response = client.get("/preferences")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)
    assert "name" in response.json()
    assert "dietaryGoal" in response.json()
    assert "nutritionalGoals" in response.json()

def test_update_preferences():
    test_preferences = {
        "name": "Test User",
        "dietaryGoal": "vegetarian",
        "nutritionalGoals": {
            "calories": 2000,
            "protein": 50,
            "carbs": 250,
            "fat": 70
        }
    }
    
    response = client.post("/preferences", json=test_preferences)
    assert response.status_code == 200
    assert response.json() == {"message": "Preferences updated successfully"}
    
    # Verify the update by getting preferences
    get_response = client.get("/preferences")
    assert get_response.status_code == 200
    assert get_response.json()["name"] == test_preferences["name"]
    assert get_response.json()["dietaryGoal"] == test_preferences["dietaryGoal"]

