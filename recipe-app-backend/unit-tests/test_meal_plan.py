import unittest
import os

class TestMealPlanFileWriting(unittest.TestCase):
    def test_file_writing(self):
        """Test that meal_plan.txt is created and contains the expected format"""
        # Sample minimal data
        days_of_week = ["Monday"]  # Testing with just one day for simplicity
        meal_types = ["Breakfast"]  # Testing with just one meal for simplicity
        meal_plan = {
            "Monday": {
                "Breakfast": "Test Recipe"
            }
        }

        # Write to file
        with open('meal_plan.txt', 'w', encoding='utf-8') as file:
            for day in days_of_week:
                file.write(f"{day}:\n")
                for meal in meal_types:
                    file.write(f"  {meal}: {meal_plan[day][meal]}\n")

        # Check that file exists
        self.assertTrue(os.path.exists('meal_plan.txt'))

        # Read file and check format
        with open('meal_plan.txt', 'r', encoding='utf-8') as file:
            content = file.read()
            expected_content = "Monday:\n  Breakfast: Test Recipe\n"
            self.assertEqual(content, expected_content)

    def tearDown(self):
        # Clean up the test file
        if os.path.exists('meal_plan.txt'):
            os.remove('meal_plan.txt')

import unittest

class TestMealPlanRequirements(unittest.TestCase):
    def setUp(self):
        # Test data
        self.days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        self.meal_types = ["Breakfast", "Lunch", "Dinner"]
        self.max_calories = 2000
        self.protein_goal = 150
        
        # Sample meal plan output
        self.meal_plan = {
            "Monday": {
                "Breakfast": {"name": "Recipe1", "calories": 500, "protein_g": 30},
                "Lunch": {"name": "Recipe2", "calories": 600, "protein_g": 40},
                "Dinner": {"name": "Recipe3", "calories": 700, "protein_g": 50}
            },
            "Tuesday": {
                "Breakfast": {"name": "Recipe4", "calories": 400, "protein_g": 35},
                "Lunch": {"name": "Recipe5", "calories": 600, "protein_g": 45},
                "Dinner": {"name": "Recipe6", "calories": 800, "protein_g": 55}
            },
            "Wednesday": {
                "Breakfast": {"name": "Recipe7", "calories": 450, "protein_g": 30},
                "Lunch": {"name": "Recipe8", "calories": 550, "protein_g": 40},
                "Dinner": {"name": "Recipe9", "calories": 750, "protein_g": 50}
            },
            "Thursday": {
                "Breakfast": {"name": "Recipe10", "calories": 400, "protein_g": 35},
                "Lunch": {"name": "Recipe11", "calories": 600, "protein_g": 45},
                "Dinner": {"name": "Recipe12", "calories": 700, "protein_g": 55}
            },
            "Friday": {
                "Breakfast": {"name": "Recipe13", "calories": 450, "protein_g": 30},
                "Lunch": {"name": "Recipe14", "calories": 550, "protein_g": 40},
                "Dinner": {"name": "Recipe15", "calories": 750, "protein_g": 50}
            },
            "Saturday": {
                "Breakfast": {"name": "Recipe16", "calories": 400, "protein_g": 35},
                "Lunch": {"name": "Recipe17", "calories": 600, "protein_g": 45},
                "Dinner": {"name": "Recipe18", "calories": 800, "protein_g": 55}
            },
            "Sunday": {
                "Breakfast": {"name": "Recipe19", "calories": 450, "protein_g": 30},
                "Lunch": {"name": "Recipe20", "calories": 550, "protein_g": 40},
                "Dinner": {"name": "Recipe21", "calories": 750, "protein_g": 50}
            }
        }

    def test_daily_calorie_limit(self):
        """Test that each day's total calories are within the limit"""
        for day in self.days_of_week:
            daily_calories = sum(meal["calories"] for meal in self.meal_plan[day].values())
            self.assertLessEqual(daily_calories, self.max_calories,
                               f"{day} exceeds max calories: {daily_calories} > {self.max_calories}")

    def test_daily_protein_goal(self):
        """Test that each day meets at least 80% of protein goal"""
        min_protein = 0.8 * self.protein_goal
        for day in self.days_of_week:
            daily_protein = sum(meal["protein_g"] for meal in self.meal_plan[day].values())
            self.assertGreaterEqual(daily_protein, min_protein,
                                  f"{day} doesn't meet protein goal: {daily_protein} < {min_protein}")

    def test_complete_week_coverage(self):
        """Test that all days and meals are present"""
        # Check all days are present
        self.assertEqual(set(self.meal_plan.keys()), set(self.days_of_week),
                        "Not all days of the week are covered")
        
        # Check all meals are present for each day
        for day in self.days_of_week:
            self.assertEqual(set(self.meal_plan[day].keys()), set(self.meal_types),
                           f"Not all meals are present for {day}")

    def test_no_duplicate_recipes_per_day(self):
        """Test that no day has duplicate recipes"""
        for day in self.days_of_week:
            daily_recipes = [meal["name"] for meal in self.meal_plan[day].values()]
            unique_recipes = set(daily_recipes)
            self.assertEqual(len(daily_recipes), len(unique_recipes),
                           f"Duplicate recipes found for {day}")

if __name__ == '__main__':
    unittest.main()





if __name__ == '__main__':
    unittest.main()