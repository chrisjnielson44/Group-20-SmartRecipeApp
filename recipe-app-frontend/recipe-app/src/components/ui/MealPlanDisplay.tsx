// components/MealPlanDisplay.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UtensilsCrossed } from "lucide-react";
import { MealPlanResponse, Recipe } from "@/types/api";

interface MealCardProps {
    meal: Recipe;
    mealType: string;
}

const MealCard: React.FC<MealCardProps> = ({ meal, mealType }) => (
    <Card className="h-full">
        <CardHeader className="pb-2">
            <CardTitle className="text-lg capitalize">{mealType}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
            <h3 className="font-medium">{meal.name}</h3>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                    <UtensilsCrossed className="mr-1 h-4 w-4" />
                    {meal.diet}
                </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>Calories: {meal.calories}</div>
                <div>Protein: {meal.protein_g}g</div>
                <div>Carbs: {meal.carbs_g}g</div>
                <div>Fat: {meal.fat_g}g</div>
            </div>
        </CardContent>
    </Card>
);

interface NutritionSummaryProps {
    mealPlan: MealPlanResponse['meal_plan'];
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ mealPlan }) => {
    const calculateDailyTotals = () => {
        const totals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        };

        Object.values(mealPlan).forEach(day => {
            Object.values(day).forEach(meal => {
                if (typeof meal !== 'string' && meal) {
                    totals.calories += meal.calories;
                    totals.protein += meal.protein_g;
                    totals.carbs += meal.carbs_g;
                    totals.fat += meal.fat_g;
                }
            });
        });

        const numDays = Object.keys(mealPlan).length;
        return {
            calories: Math.round(totals.calories / numDays),
            protein: Math.round(totals.protein / numDays),
            carbs: Math.round(totals.carbs / numDays),
            fat: Math.round(totals.fat / numDays)
        };
    };

    const dailyAverages = calculateDailyTotals();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Daily Nutritional Average</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Calories</p>
                        <p className="text-2xl font-bold">{dailyAverages.calories}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="text-2xl font-bold">{dailyAverages.protein}g</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="text-2xl font-bold">{dailyAverages.carbs}g</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Fat</p>
                        <p className="text-2xl font-bold">{dailyAverages.fat}g</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

interface MealPlanDisplayProps {
    mealPlan: MealPlanResponse;
}

export const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ mealPlan }) => {
    const days = Object.keys(mealPlan.meal_plan);

    return (
        <div className="space-y-6">
            <NutritionSummary mealPlan={mealPlan.meal_plan} />

            <Tabs defaultValue={days[0]} className="space-y-4">
                <TabsList>
                    {days.map((day) => (
                        <TabsTrigger key={day} value={day} className="min-w-[100px]">
                            {day}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {days.map((day) => (
                    <TabsContent key={day} value={day}>
                        <div className="grid gap-6 md:grid-cols-3">
                            {Object.entries(mealPlan.meal_plan[day]).map(([mealType, meal]) => (
                                typeof meal === 'string' ? (
                                    <Card key={mealType} className="flex h-full items-center justify-center p-6">
                                        <p className="text-muted-foreground">{meal}</p>
                                    </Card>
                                ) : (
                                    <MealCard key={mealType} meal={meal} mealType={mealType} />
                                )
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};