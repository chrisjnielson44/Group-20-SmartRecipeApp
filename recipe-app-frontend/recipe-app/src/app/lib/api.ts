import { Ingredient, Recipe, MealPlan, NutritionalValue } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function getIngredients(): Promise<Ingredient[]> {
    try {
        const response = await fetch(`${API_URL}/ingredients`, {
            headers: {
                'Content-Type': 'application/json',
            },
            // Add caching options
            next: {
                revalidate: 3600, // Cache for 1 hour
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
    }
}

export async function getRecipes(): Promise<Record<string, Recipe>> {
    try {
        const response = await fetch(`${API_URL}/recipes`, {
            headers: {
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 3600,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
}

export async function getRecipeByName(name: string): Promise<Recipe> {
    try {
        const response = await fetch(`${API_URL}/recipes/${name}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 3600,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching recipe:', error);
        throw error;
    }
}

export async function getMealPlan(): Promise<MealPlan> {
    try {
        const response = await fetch(`${API_URL}/meal-plan`, {
            headers: {
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 3600,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        throw error;
    }
}

export async function getNutritionalValues(meals: string[]): Promise<NutritionalValue> {
    try {
        const response = await fetch(`${API_URL}/calculate-nutrition`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ meals }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error calculating nutrition:', error);
        throw error;
    }
}

export async function getGroceryList(recipes: string[]): Promise<GroceryList> {
    try {
        const response = await fetch(`${API_URL}/ingredients/grocery-list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipes }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching grocery list:', error);
        throw error;
    }
}