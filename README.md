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
-Routes directory
    - contains all modules with essential algorthims 
    - agent.py contains database management chatbot
    - ingredients.py contains algorithms used to create grocery list
    - meal_plan.py contains algorithm to create meal plan for the week
    - nutrition.py contains algorithms to measure nutrition of meal plans
    - recipes.py contains algorithms to manage recipe creation
    - user_input.py contains algoritms creating and updating user preferences from their input
- Scripts Directory
    - generate_ingredients.py writes ingredient data to csv file
    - load_diet_preferences.py loads preferences of user from JSON file
    - upload_ingredients.py takes data from csv file and inputs it into SQL database

Fire Tree:
```bash
.
├── Project Report_meal.docx
├── README.md
├── recipe-app-backend
│   ├── README.md
│   ├── RecipeAgent
│   │   ├── __init__.py
│   │   ├── agent.py
│   │   ├── database.py
│   │   ├── functions.py
│   │   └── prompts.py
│   ├── auth.py
│   ├── config.py
│   ├── db.py
│   ├── diet_preferences.json
│   ├── generate_preferences.py
│   ├── grocery_list.csv
│   ├── grocery_list.txt
│   ├── main.py
│   ├── meal_plan.txt
│   ├── pipe_a_text_into_csv.py
│   ├── recipes.csv
│   ├── requirements.txt
│   ├── routes
│   │   ├── __init__.py
│   │   ├── agent.py
│   │   ├── ingredients.py
│   │   ├── meal_plan.py
│   │   ├── nutrition.py
│   │   ├── recipes.py
│   │   └── user_input.py
│   ├── scripts
│   │   ├── generate_ingredients.py
│   │   ├── load_diet_preferences.py
│   │   └── upload_ingredients.py
│   ├── test_ingredients.txt
│   ├── unit-tests
│   │   ├── __init__.py
│   │   ├── ingredient_test.py
│   │   ├── recipes_test.py
│   │   ├── test_get_groceries.py
│   │   ├── test_meal_plan.py
│   │   └── test_user_input.py
│   ├── user_available_ingredients.csv
│   ├── user_data.json
│   └── user_input_to_csv.py
└── recipe-app-frontend
    ├── README.md
    └── recipe-app
        ├── @types
        │   └── next-auth.d.ts
        ├── README.md
        ├── components.json
        ├── next-env.d.ts
        ├── next.config.mjs
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.mjs
        ├── prisma
        │   └── schema.prisma
        ├── public
        │   └── carrot.png
        ├── src
        │   ├── app
        │   │   ├── SignIn.tsx
        │   │   ├── api
        │   │   │   ├── OpenAI
        │   │   │   │   └── route.ts
        │   │   │   ├── auth
        │   │   │   │   ├── [...nextauth]
        │   │   │   │   │   └── route.ts
        │   │   │   │   ├── check-password
        │   │   │   │   │   └── route.ts
        │   │   │   │   ├── delete-user
        │   │   │   │   │   └── route.ts
        │   │   │   │   └── route.ts
        │   │   │   ├── chat
        │   │   │   │   └── route.ts
        │   │   │   ├── conversation
        │   │   │   │   ├── [id]
        │   │   │   │   │   └── route.ts
        │   │   │   │   └── route.ts
        │   │   │   ├── ingredients
        │   │   │   │   └── route.ts
        │   │   │   ├── message
        │   │   │   │   └── route.ts
        │   │   │   └── preferences
        │   │   │       └── route.ts
        │   │   ├── dashboard
        │   │   │   ├── components
        │   │   │   │   ├── AnalyticsCard.tsx
        │   │   │   │   ├── DataTableExample.tsx
        │   │   │   │   ├── nav
        │   │   │   │   │   ├── ChatAgent.tsx
        │   │   │   │   │   ├── Nav.tsx
        │   │   │   │   │   ├── ProfileAvatar.tsx
        │   │   │   │   │   ├── RecAssitantButton.tsx
        │   │   │   │   │   ├── command-menu.tsx
        │   │   │   │   │   ├── mobilenav.tsx
        │   │   │   │   │   └── signout.tsx
        │   │   │   │   └── selectors
        │   │   │   │       ├── SelectEngine.tsx
        │   │   │   │       ├── SelectMetric.tsx
        │   │   │   │       └── SelectProduct.tsx
        │   │   │   ├── ingredients
        │   │   │   │   └── page.tsx
        │   │   │   ├── mealplan
        │   │   │   │   └── page.tsx
        │   │   │   ├── page.tsx
        │   │   │   ├── recipe-assistant
        │   │   │   │   ├── RecAssistPage.tsx
        │   │   │   │   ├── components
        │   │   │   │   │   ├── AnimatedTitle.tsx
        │   │   │   │   │   ├── DeleteConversationDialog.tsx
        │   │   │   │   │   ├── EmptyState.tsx
        │   │   │   │   │   ├── Header.tsx
        │   │   │   │   │   ├── MainContent.tsx
        │   │   │   │   │   ├── ReciepeAgent.tsx
        │   │   │   │   │   ├── SideBar.tsx
        │   │   │   │   │   ├── charts
        │   │   │   │   │   │   └── Charts.tsx
        │   │   │   │   │   ├── hooks.ts
        │   │   │   │   │   └── types.ts
        │   │   │   │   └── page.tsx
        │   │   │   ├── recipes
        │   │   │   │   └── page.tsx
        │   │   │   └── settings
        │   │   │       ├── account
        │   │   │       │   ├── account-form.tsx
        │   │   │       │   ├── deleteUser.tsx
        │   │   │       │   ├── page.tsx
        │   │   │       │   └── updateAccount.tsx
        │   │   │       ├── components
        │   │   │       │   ├── DietPrefencesDropdown.tsx
        │   │   │       │   └── sidebar-nav.tsx
        │   │   │       ├── layout.tsx
        │   │   │       ├── page.tsx
        │   │   │       └── profile
        │   │   │           ├── page.tsx
        │   │   │           └── profile-form.tsx
        │   │   ├── favicon.ico
        │   │   ├── fonts
        │   │   │   ├── GeistMonoVF.woff
        │   │   │   └── GeistVF.woff
        │   │   ├── globals.css
        │   │   ├── layout.tsx
        │   │   ├── lib
        │   │   │   ├── api.ts
        │   │   │   ├── authOptions.ts
        │   │   │   ├── data.ts
        │   │   │   └── prisma.ts
        │   │   ├── page.tsx
        │   │   ├── sign-up
        │   │   │   ├── SignUp.tsx
        │   │   │   └── page.tsx
        │   │   └── types
        │   │       ├── chat.ts
        │   │       └── validation.ts
        │   ├── components
        │   │   ├── theme-provider.tsx
        │   │   └── ui
        │   │       ├── AnimatedCard.tsx
        │   │       ├── AnimatedLayout.tsx
        │   │       ├── DashboardStats.tsx
        │   │       ├── ErrorBoundary.tsx
        │   │       ├── IngredientCard.tsx
        │   │       ├── IngredientsContent.tsx
        │   │       ├── IntegratedMealPlan.tsx
        │   │       ├── MealPlanDisplay.tsx
        │   │       ├── NutritionOverview.tsx
        │   │       ├── RecentRecipes.tsx
        │   │       ├── RecipeCard.tsx
        │   │       ├── SearchInput.tsx
        │   │       ├── alert-dialog.tsx
        │   │       ├── avatar.tsx
        │   │       ├── badge.tsx
        │   │       ├── button.tsx
        │   │       ├── card.tsx
        │   │       ├── chart.tsx
        │   │       ├── checkbox.tsx
        │   │       ├── command.tsx
        │   │       ├── dialog.tsx
        │   │       ├── dropdown-menu.tsx
        │   │       ├── form.tsx
        │   │       ├── input.tsx
        │   │       ├── label.tsx
        │   │       ├── popover.tsx
        │   │       ├── scroll-area.tsx
        │   │       ├── select.tsx
        │   │       ├── separator.tsx
        │   │       ├── sheet.tsx
        │   │       ├── skeleton.tsx
        │   │       ├── table.tsx
        │   │       ├── tabs.tsx
        │   │       ├── textarea.tsx
        │   │       ├── theme-toggle.tsx
        │   │       ├── toast.tsx
        │   │       ├── toaster.tsx
        │   │       └── tooltip.tsx
        │   ├── hooks
        │   │   └── use-toast.ts
        │   ├── lib
        │   │   └── utils.ts
        │   ├── middleware.ts
        │   ├── types
        │   │   └── api.ts
        │   └── utils
        │       └── openai.ts
        ├── tailwind.config.ts
        └── tsconfig.json

```