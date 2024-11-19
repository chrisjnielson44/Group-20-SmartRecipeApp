import unittest
import csv
import os
from ingredients import output_grocery_list

class TestGroceryList(unittest.TestCase):
    def setUp(self):
        # Create a simple test grocery_list.csv file
        with open('grocery_list.csv', 'w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=["ingredient", "missing_amount"])
            writer.writeheader()
            writer.writerow({"ingredient": "chicken", "missing_amount": "500g"})
            writer.writerow({"ingredient": "rice", "missing_amount": "200g"})

    def tearDown(self):
        # Delete test file
        if os.path.exists('grocery_list.csv'):
            os.remove('grocery_list.csv')

    def test_grocery_list(self):
        """Test that grocery list is read correctly"""
        grocery_list = output_grocery_list()
        
        # Check if the items are in the list
        self.assertIn("chicken", grocery_list)
        self.assertIn("rice", grocery_list)
        
        # Check if amounts are correct
        self.assertEqual(grocery_list["chicken"], "500g")
        self.assertEqual(grocery_list["rice"], "200g")

if __name__ == '__main__':
    unittest.main()