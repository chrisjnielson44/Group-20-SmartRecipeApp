# used to generate a csv from user input
#

import csv
from typing import List, Tuple
import re

def validate_ingredient_name(ingredient: str) -> bool:
    """
    Validate ingredient name contains only letters, spaces, and common punctuation.
    
    Args:
        ingredient: The ingredient name to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    # Allow letters, spaces, and basic punctuation
    pattern = r'^[a-zA-Z\s\'-]+$'
    return bool(re.match(pattern, ingredient))

def validate_unit(unit: str, valid_units: set) -> bool:
    """
    Validate that the unit is in our accepted list.
    
    Args:
        unit: The unit to validate
        valid_units: Set of valid units
        
    Returns:
        bool: True if valid, False otherwise
    """
    return unit.lower() in valid_units

def validate_quantity(quantity_str: str) -> tuple[bool, int, str]:
    """
    Validate quantity is a positive integer.
    
    Args:
        quantity_str: The quantity string to validate
        
    Returns:
        Tuple of (is_valid, quantity, error_message)
    """
    try:
        quantity = int(quantity_str)
        if quantity <= 0:
            return False, 0, "Quantity must be a positive number"
        if quantity > 10000:
            return False, 0, "Quantity seems too large (max: 10000)"
        return True, quantity, ""
    except ValueError:
        return False, 0, "Quantity must be a whole number"

def get_user_input() -> List[Tuple[str, int, str]]:
    """
    Get ingredient entries from user input with enhanced validation.
    
    Returns:
        List of tuples containing (ingredient, quantity, unit)
    """
    valid_units = {'tablespoons', 'cups', 'pieces', 'grams', 'ml'}
    
    print("\n=== Available Ingredients Input ===")
    print("\nInstructions:")
    print("1. Enter each ingredient in the format: ingredient name, quantity, unit")
    print("2. Press Enter twice when you're finished")
    print("3. Use whole numbers for quantity")
    print("\nValid units:", ", ".join(valid_units))
    print("Example inputs:")
    print("- tomatoes, 500, grams")
    print("- chicken breast, 2, pieces")
    
    ingredients_data = []
    
    while True:
        try:
            entry = input("\nEnter ingredient (or press Enter to finish): ").strip()
            
            # Check for empty input
            if entry == "":
                if ingredients_data:
                    confirm = input("Are you done entering ingredients? (yes/no): ").strip().lower()
                    if confirm in ['y', 'yes']:
                        break
                    else:
                        continue
                else:
                    print("⚠️ Please enter at least one ingredient.")
                    continue
            
            # Split and clean input
            parts = [part.strip() for part in entry.split(',')]
            
            # Check number of components
            if len(parts) != 3:
                print("❌ Invalid format!")
                print("→ Required format: ingredient, quantity, unit")
                print("→ Example: tomatoes, 500, grams")
                continue
            
            ingredient, quantity_str, unit = parts
            
            # Validate ingredient name
            if not ingredient:
                print("❌ Ingredient name cannot be empty!")
                continue
                
            if not validate_ingredient_name(ingredient):
                print("❌ Invalid ingredient name!")
                print("→ Use only letters, spaces, and hyphens")
                print("→ Example: 'tomatoes' or 'chicken-breast'")
                continue
            
            # Validate quantity
            is_valid, quantity, error_msg = validate_quantity(quantity_str)
            if not is_valid:
                print(f"❌ Invalid quantity: {error_msg}")
                continue
            
            # Validate unit
            if not validate_unit(unit, valid_units):
                print("❌ Invalid unit!")
                print(f"→ Valid units are: {', '.join(valid_units)}")
                continue
            
            # All validations passed, add to our list
            unit = unit.lower()  # Normalize unit
            ingredients_data.append((ingredient.lower(), quantity, unit))
            print(f"✅ Added: {ingredient} ({quantity} {unit})")
            
        except KeyboardInterrupt:
            print("\n\nInput cancelled by user.")
            if ingredients_data:
                confirm = input("Would you like to save the ingredients entered so far? (yes/no): ").strip().lower()
                if confirm in ['y', 'yes']:
                    break
            return []
        except Exception as e:
            print(f"❌ Unexpected error: {str(e)}")
            print("Please try again.")
            continue
    
    return ingredients_data

def write_ingredients_csv(filename: str = "user_available_ingredients.csv"):
    """
    Get ingredients from user input and write to a CSV file.
    
    Args:
        filename: Name of the output CSV file
    """
    try:
        # Get ingredient data from user
        ingredients_data = get_user_input()
        
        if not ingredients_data:
            print("\n❌ No ingredients were saved.")
            return
        
        # Write to CSV file
        with open(filename, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            # Write header
            writer.writerow(["Ingredient", "Quantity", "Unit"])
            # Write data
            writer.writerows(ingredients_data)
            
        print(f"\n✅ Successfully saved {len(ingredients_data)} ingredients to {filename}!")
        
    except PermissionError:
        print(f"\n❌ Error: Unable to write to {filename}. Please check file permissions.")
    except Exception as e:
        print(f"\n❌ Error saving file: {str(e)}")

if __name__ == "__main__":
    write_ingredients_csv()


