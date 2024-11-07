import csv
from typing import List, Tuple
import re
import sys

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

def get_piped_input() -> List[Tuple[str, int, str]]:
    """
    Get ingredient entries from piped input with validation and status messages.
    
    Returns:
        List of tuples containing (ingredient, quantity, unit)
    """
    valid_units = {'tablespoons', 'cups', 'pieces', 'grams', 'ml'}
    ingredients_data = []
    total_lines = 0
    successful_adds = 0
    failed_adds = 0
    
    print("\n=== Processing Piped Input ===\n")
    
    for line in sys.stdin:
        total_lines += 1
        line = line.strip()
        if not line:  # Skip empty lines
            continue
            
        # Split and clean input
        parts = [part.strip() for part in line.split(',')]
        
        # Validate input
        if len(parts) != 3:
            failed_adds += 1
            print(f"❌ Line {total_lines}: Invalid format in '{line}'")
            print("  → Required format: ingredient, quantity, unit")
            continue
        
        ingredient, quantity_str, unit = parts
        
        # Validate ingredient name
        if not ingredient or not validate_ingredient_name(ingredient):
            failed_adds += 1
            print(f"❌ Line {total_lines}: Invalid ingredient name '{ingredient}'")
            print("  → Use only letters, spaces, and hyphens")
            continue
        
        # Validate quantity
        is_valid, quantity, error_msg = validate_quantity(quantity_str)
        if not is_valid:
            failed_adds += 1
            print(f"❌ Line {total_lines}: Invalid quantity in '{line}'")
            print(f"  → {error_msg}")
            continue
        
        # Validate unit
        if not validate_unit(unit, valid_units):
            failed_adds += 1
            print(f"❌ Line {total_lines}: Invalid unit '{unit}'")
            print(f"  → Valid units are: {', '.join(valid_units)}")
            continue
        
        # All validations passed, add to our list
        unit = unit.lower()  # Normalize unit
        ingredients_data.append((ingredient.lower(), quantity, unit))
        successful_adds += 1
        print(f"✅ Line {total_lines}: Successfully added {ingredient} ({quantity} {unit})")
        print(f"  → Progress: {successful_adds} ingredients processed successfully\n")
    
    # Print final summary
    print("\n=== Input Processing Summary ===")
    print(f"Total lines processed: {total_lines}")
    print(f"Successful additions: {successful_adds}")
    print(f"Failed additions: {failed_adds}")
    print("=" * 30)
    
    return ingredients_data

def get_interactive_input() -> List[Tuple[str, int, str]]:
    """
    Get ingredient entries from interactive user input with validation.
    
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
            
            # Rest of the validation logic...
            # [Previous validation code remains the same]
            
        except KeyboardInterrupt:
            print("\n\nInput cancelled by user.")
            if ingredients_data:
                confirm = input("Would you like to save the ingredients entered so far? (yes/no): ").strip().lower()
                if confirm in ['y', 'yes']:
                    break
            return []
            
    return ingredients_data

def write_ingredients_csv(filename: str = "user_available_ingredients.csv"):
    """
    Get ingredients from input and write to a CSV file.
    
    Args:
        filename: Name of the output CSV file
    """
    try:
        # Check if input is piped or interactive
        is_piped = not sys.stdin.isatty()
        
        # Get ingredient data from appropriate input method
        ingredients_data = get_piped_input() if is_piped else get_interactive_input()
        
        if not ingredients_data:
            print("\n❌ No ingredients were saved.")
            return
        
        # Write to CSV file
        with open(filename, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["Ingredient", "Quantity", "Unit"])
            writer.writerows(ingredients_data)
            
        print(f"\n✅ Successfully saved {len(ingredients_data)} ingredients to {filename}!")
        
    except PermissionError:
        print(f"\n❌ Error: Unable to write to {filename}. Please check file permissions.")
    except Exception as e:
        print(f"\n❌ Error saving file: {str(e)}")

if __name__ == "__main__":
    write_ingredients_csv()