import csv
import random

# List of common ingredients
ingredients = [
    "Chicken", "Beef", "Pork", "Salmon", "Tofu",
    "Rice", "Pasta", "Quinoa", "Bread", "Potatoes",
    "Tomatoes", "Onions", "Garlic", "Bell Peppers", "Carrots",
    "Broccoli", "Spinach", "Lettuce", "Cucumber", "Zucchini",
    "Olive Oil", "Butter", "Cheese", "Eggs", "Milk",
    "Yogurt", "Lemon", "Lime", "Soy Sauce", "Vinegar"
]

# Units of measurement
units = ["grams", "pieces", "ml", "cups", "tablespoons"]

# Generate random ingredient data
def generate_ingredient_data(num_ingredients):
    data = []
    for _ in range(num_ingredients):
        ingredient = random.choice(ingredients)
        quantity = random.randint(1, 1000)
        unit = random.choice(units)
        data.append([ingredient, quantity, unit])
    return data

# Write data to CSV file
def write_to_csv(data, filename):
    with open(filename, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Ingredient", "Quantity", "Unit"])
        writer.writerows(data)

# Main execution
if __name__ == "__main__":
    num_ingredients = 50  # can change this to generate more or fewer ingredients
    ingredient_data = generate_ingredient_data(num_ingredients)
    write_to_csv(ingredient_data, "/output/available_ingredients.csv")
    print(f"CSV file '/output/available_ingredients.csv' has been generated with {num_ingredients} ingredients.")
