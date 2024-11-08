import json

# Define the data structure
preferences_data = {
    "user_preferences": [
        {
            "diet": "vegetarian",
            "nutritional_goals": {
                "calories": 2000,
                "protein": 50,
                "carbs": 250,
                "fat": 65
            }
        },
        {
            "diet": "vegan",
            "nutritional_goals": {
                "calories": 1800,
                "protein": 60,
                "carbs": 220,
                "fat": 60,
                "fiber": 30
            }
        },
        {
            "diet": "keto",
            "nutritional_goals": {
                "calories": 1800,
                "protein": 120,
                "carbs": 25,
                "fat": 140
            }
            
        },
        {
            "diet": "mediterranean",
            "nutritional_goals": {
                "calories": 2200,
                "protein": 70,
                "carbs": 275,
                "fat": 73
                }
        },
        {
            "diet": "low-carb",
            "nutritional_goals": {
                "calories": 1900,
                "protein": 95,
                "carbs": 100,
                "fat": 110
            }
        },
        {
                "diet": "bulking",
                "nutritional_goals": {
                    "calories": 3000,
                    "protein": 180,
                    "carbs": 350,
                    "fat": 85
                }
        },
        {
            "diet": "cutting",
            "nutritional_goals": {
                "calories": 1600,
                "protein": 160,
                "carbs": 140,
                "fat": 55
            }
        }

 
    ]
}

# Write to JSON file
def write_preferences_to_json(data, filename="diet_preferences.json"):
    try:
        with open(filename, 'w') as json_file:
            json.dump(data, json_file, indent=4)
        print(f"Successfully wrote data to {filename}")
    except Exception as e:
        print(f"Error writing to JSON file: {e}")


write_preferences_to_json(user_preferences)