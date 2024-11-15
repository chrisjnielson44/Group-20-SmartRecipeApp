import json
from typing import Dict

def load_diet_preferences(filename: str) -> Dict:
    """
    Load dietary preferences from JSON file.
    
    Args:
        filename: Path to the JSON file
        
    Returns:
        Dictionary containing diet preferences
    """
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        raise FileNotFoundError(f"❌ Preferences file '{filename}' not found!")
    except json.JSONDecodeError:
        raise Exception("❌ Invalid JSON format in preferences file!")
    except Exception as e:
        raise Exception(f"❌ Error reading preferences file: {str(e)}")
    