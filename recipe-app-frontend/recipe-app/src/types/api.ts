export interface Ingredient {
    id?: string;
    name: string;
    quantity: string;
    unit: string;
    description?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
}

export interface Recipe {
    id?: string;
    name: string;
    description?: string;
    diet: string;
    ingredients: Record<string, number | string>;
    instructions: string;
    imageUrl?: string;
    preparationTime: number;
    cookingTime: number;
    servings: number;
    difficulty: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    tags?: string[];
}

export interface MealPlan {
    id?: string;
    userId?: string;
    startDate: Date;
    endDate: Date;
    totalCalories?: number;
    totalProtein?: number;
    totalCarbs?: number;
    totalFats?: number;
    meals: MealPlanRecipe[];
}

export interface MealPlanRecipe {
    id?: string;
    recipeId: string;
    recipe: Recipe;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    day: Date;
}

export interface NutritionalValue {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface UserPreference {
    id?: string;
    userId: string;
    dietaryTags: string[];
    excludedIngredients: string[];
    calorieGoal?: number;
    proteinGoal?: number;
    carbsGoal?: number;
    fatsGoal?: number;
}

export interface ShoppingListItem {
    id?: string;
    ingredientId: string;
    ingredient: Ingredient;
    quantity: number;
    purchased: boolean;
}