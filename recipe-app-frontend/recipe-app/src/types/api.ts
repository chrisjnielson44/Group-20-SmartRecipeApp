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
    isDoublePortion?: boolean;
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

export interface DailyMeals {
    Breakfast: Recipe | string;
    Lunch: Recipe | string;
    Dinner: Recipe | string;
}

export interface MealPlanResponse {
    meal_plan: {
        Monday: DailyMeals;
        Tuesday: DailyMeals;
        Wednesday: DailyMeals;
        Thursday: DailyMeals;
        Friday: DailyMeals;
        Saturday: DailyMeals;
        Sunday: DailyMeals;
    };
}