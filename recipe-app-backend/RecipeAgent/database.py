import sqlite3
import pandas as pd
from typing import Optional
from contextlib import contextmanager
import os

class RecipeDatabase:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RecipeDatabase, cls).__new__(cls)
            cls._instance.initialized = False
        return cls._instance

    def __init__(self):
        if self.initialized:
            return

        self.conn = sqlite3.connect(':memory:', check_same_thread=False)
        self.base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.setup_database()
        self.initialized = True

    def setup_database(self):
        """Create tables and load initial data from CSV files"""
        # Load ingredients data
        ingredients_path = os.path.join(self.base_path, 'available_ingredients.csv')
        user_ingredients_path = os.path.join(self.base_path, 'user_available_ingredients.csv')
        recipes_path = os.path.join(self.base_path, 'recipes.csv')

        # Load main ingredients
        if os.path.exists(ingredients_path):
            ingredients_df = pd.read_csv(ingredients_path)
            ingredients_df['source'] = 'main'
            ingredients_df.to_sql('ingredients', self.conn, if_exists='replace', index=False)

        # Load user ingredients if they exist
        if os.path.exists(user_ingredients_path):
            user_ingredients_df = pd.read_csv(user_ingredients_path)
            user_ingredients_df['source'] = 'user'
            user_ingredients_df.to_sql('ingredients', self.conn, if_exists='append', index=False)

        # Load recipes data
        if os.path.exists(recipes_path):
            recipes_df = pd.read_csv(recipes_path)

            # Create recipes table without the ingredients column
            recipes_base = recipes_df.drop('Ingredients', axis=1)
            recipes_base.to_sql('recipes', self.conn, if_exists='replace', index=True, index_label='id')

            # Create recipe_ingredients junction table
            recipe_ingredients = []

            for idx, row in recipes_df.iterrows():
                if pd.notna(row.get('Ingredients')):
                    ingredients_list = str(row['Ingredients']).split(';')
                    for ingredient_item in ingredients_list:
                        if ':' in ingredient_item:
                            ingredient_name, quantity = ingredient_item.strip().split(':')
                            recipe_ingredients.append({
                                'recipe_id': idx,
                                'ingredient_name': ingredient_name.strip(),
                                'quantity': quantity.strip()
                            })

            if recipe_ingredients:
                recipe_ingredients_df = pd.DataFrame(recipe_ingredients)
                recipe_ingredients_df.to_sql('recipe_ingredients', self.conn, if_exists='replace', index=False)

    def execute_query(self, query: str) -> pd.DataFrame:
        """Execute a SQL query and return results as a DataFrame"""
        try:
            return pd.read_sql_query(query, self.conn)
        except Exception as e:
            raise Exception(f"Error executing query: {str(e)}")

    def get_recipe_with_ingredients(self, recipe_name: str) -> dict:
        """Get a recipe and its ingredients"""
        query = """
        SELECT r.*, GROUP_CONCAT(ri.ingredient_name || ': ' || ri.quantity) as ingredients
        FROM recipes r
        LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        WHERE r.Recipe_Name = ?
        GROUP BY r.id
        """
        df = pd.read_sql_query(query, self.conn, params=[recipe_name])
        return df.to_dict('records')[0] if not df.empty else None

    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        try:
            yield self.conn
        finally:
            pass

# Global instance
db = RecipeDatabase()

def get_db():
    """Getter function for the database instance"""
    return db
