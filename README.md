# Group-20-SmartRecipeApp


# Meal Planner Project
This project is a meal planning application that recommends recipes,
creates meal plans, generates shopping lists, and provides nutritional
analysis.

## Setup
1. Clone the repository \
`git clone https://github.com/chrisjnielson44/Group-20-SmartRecipeApp.git`
2. Install the required packages for the backend: \
`pip install -r requirements.txt`
3. Ensure you have 'ingredients.csv' and 'preferences.json' in the
project directory
4. Install the required packages for the frontend: \
`npm install`
5. Start the frontend server:
`npm run dev` for dev env \
`npm run build` for production env \
`npm run start` for production env
6. Start the backend server: \
`python main.py`
7. Open the browser and go to `http://localhost:8080`
8. Enjoy the app!

## Running Tests
To run the unit tests:
pytest unit_tests/(test file name)

## Features
- Recipe recommendation based on available ingredients and dietary
preferences
- Weekly meal plan generation
- Shopping list creation
- Nutritional analysis of meal plans
- AI chatbot for recipe recommendations

## File Structure
- `main.py`: Main script containing all functions
- `ingredients.csv`: CSV file containing available ingredients
- `preferences.json`: JSON file containing user preferences and
nutritional goals
- `requirements.txt`: List of required Python packages
- `unit_tests/`: Unit tests for the project
