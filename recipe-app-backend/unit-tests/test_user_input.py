import unittest
import json
import os
from user_input import update_preferences

class UserPreferences:
    def __init__(self, name, dietaryGoal):
        self.name = name
        self.dietaryGoal = dietaryGoal

class TestUpdatePreferences(unittest.TestCase):
    def setUp(self):
        # Get the actual path that the function uses
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.test_file = os.path.join(current_dir, "../user_data.json")
        
        # Create parent directory if it doesn't exist
        os.makedirs(os.path.dirname(self.test_file), exist_ok=True)
        
        # Remove test file if it exists
        if os.path.exists(self.test_file):
            os.remove(self.test_file)

    def tearDown(self):
        # Clean up test file
        if os.path.exists(self.test_file):
            os.remove(self.test_file)

    def test_add_new_preferences(self):
        prefs = UserPreferences(
            name="John Doe",
            dietaryGoal="Weight Loss"
        )
        
        result = update_preferences(prefs)
        
        self.assertEqual(result["message"], "Preferences updated successfully")
        
        # Read and verify the actual file
        with open(self.test_file, 'r') as f:
            data = json.load(f)
            user = data["users"][0]
            self.assertEqual(user["name"], "John Doe")
            self.assertEqual(user["dietaryGoal"], "Weight Loss")

    def test_update_existing_preferences(self):
        # Create initial data
        initial_data = {
            "users": [{
                "name": "Old Name",
                "dietaryGoal": "Maintenance",
                "currentMealPlan": {}
            }]
        }
        
        # Write initial data
        with open(self.test_file, 'w') as f:
            json.dump(initial_data, f)
        
        # Update preferences
        new_prefs = UserPreferences(
            name="New Name",
            dietaryGoal="Muscle Gain"
        )
        
        result = update_preferences(new_prefs)
        
        self.assertEqual(result["message"], "Preferences updated successfully")
        
        # Read and verify the updated file
        with open(self.test_file, 'r') as f:
            data = json.load(f)
            user = data["users"][0]
            self.assertEqual(user["name"], "New Name")
            self.assertEqual(user["dietaryGoal"], "Muscle Gain")

if __name__ == '__main__':
    unittest.main()