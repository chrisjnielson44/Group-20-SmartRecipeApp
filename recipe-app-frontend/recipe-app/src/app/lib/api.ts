// lib/api.ts
import { Ingredient, Recipe, MealPlanResponse, NutritionalValue, GroceryList } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

type FetchOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    next?: {
        revalidate: number;
    };
};

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

export async function getIngredients(): Promise<Ingredient[]> {
    return fetchApi<Ingredient[]>('/ingredients', {
        next: { revalidate: 3600 },
    });
}

export async function getRecipes(): Promise<Record<string, Recipe>> {
    return fetchApi<Record<string, Recipe>>('/recipes', {
        next: { revalidate: 3600 },
    });
}

export async function getRecipeByName(name: string): Promise<Recipe> {
    return fetchApi<Recipe>(`/recipes/${name}`, {
        next: { revalidate: 3600 },
    });
}

export async function getMealPlan(): Promise<MealPlanResponse> {
    return fetchApi<MealPlanResponse>('/meal-plan', {
        next: { revalidate: 0 }, // Disable cache for meal plans
    });
}

export async function getNutritionalValues(meals: string[]): Promise<NutritionalValue> {
    return fetchApi<NutritionalValue>('/calculate-nutrition', {
        method: 'POST',
        body: JSON.stringify({ meals }),
    });
}

export async function getGroceryList(recipes: string[]): Promise<GroceryList> {
    return fetchApi<GroceryList>('/ingredients/grocery-list', {
        method: 'POST',
        body: JSON.stringify({ recipes }),
    });
}