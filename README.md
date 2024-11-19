# Group-20-SmartRecipeApp

pip install pandas sqlalchemy psycopg2-binary

# Meal Planner Project
This project is a meal planning application that recommends recipes,
creates meal plans, generates shopping lists, and provides nutritional
analysis.


## Setup
1. Clone the repository
2. Install the required packages:
pip install -r requirements.txt
3. Ensure you have 'ingredients.csv' and 'preferences.json' in the
project directory
4. Run the main script:
python myProject.py


## Running Tests
To run the unit tests:
python -m unittest test_myProject.py


## Features
- Recipe recommendation based on available ingredients and dietary
preferences
- Weekly meal plan generation
- Shopping list creation
- Nutritional analysis of meal plans


## File Structure
- `myProject.py`: Main script containing all functions
- `ingredients.csv`: CSV file containing available ingredients
- `preferences.json`: JSON file containing user preferences and
nutritional goals
- `requirements.txt`: List of required Python packages
- `test_myProject.py`: Unit tests for the project
