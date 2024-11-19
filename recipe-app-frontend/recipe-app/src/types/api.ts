// types/api.ts
export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
}

export interface Recipe {
    name: string;
    diet: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    ingredients: Record<string, number>;
}

export interface NutritionalValue {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export interface GroceryList {
    items: Array<{
        ingredientId: string;
        name: string;
        quantity: number;
        unit: string;
    }>;
}

export interface MealPlanResponse {
    meal_plan: {
        [key: string]: { // days of the week
            [key: string]: Recipe | string; // meal types (Breakfast, Lunch, Dinner)
        };
    };
}