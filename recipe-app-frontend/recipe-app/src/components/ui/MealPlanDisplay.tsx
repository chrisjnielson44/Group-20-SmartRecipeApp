'use client'

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UtensilsCrossed, Scale } from "lucide-react";
import { MealPlanResponse, Recipe } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface MealPlanDisplayProps {
    mealPlan: MealPlanResponse;
}

export function MealPlanDisplay({ mealPlan }: MealPlanDisplayProps) {
    const days = Object.keys(mealPlan.meal_plan);

    // Cache of original recipes for comparison using directly imported useMemo
    const recipesCache = useMemo(() => {
        const cache: Record<string, Recipe> = {};
        Object.values(mealPlan.meal_plan).forEach(day => {
            Object.values(day).forEach(meal => {
                if (typeof meal !== 'string' && meal) {
                    cache[meal.name] = { ...meal };
                }
            });
        });
        return cache;
    }, [mealPlan]);

    const calculateDailyTotals = () => {
        const totals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            daysWithData: 0
        };

        Object.values(mealPlan.meal_plan).forEach(day => {
            let hasDataForDay = false;
            let dailyTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

            Object.values(day).forEach(meal => {
                if (typeof meal !== 'string' && meal) {
                    hasDataForDay = true;
                    dailyTotals.calories += meal.calories;
                    dailyTotals.protein += meal.protein_g;
                    dailyTotals.carbs += meal.carbs_g;
                    dailyTotals.fat += meal.fat_g;
                }
            });

            if (hasDataForDay) {
                totals.calories += dailyTotals.calories;
                totals.protein += dailyTotals.protein;
                totals.carbs += dailyTotals.carbs;
                totals.fat += dailyTotals.fat;
                totals.daysWithData += 1;
            }
        });

        return {
            calories: Math.round(totals.calories / totals.daysWithData),
            protein: Math.round(totals.protein / totals.daysWithData),
            carbs: Math.round(totals.carbs / totals.daysWithData),
            fat: Math.round(totals.fat / totals.daysWithData)
        };
    };

    const dailyAverages = calculateDailyTotals();

    return (
        <div className="space-y-8">
            {/* Nutrition Summary */}
            <div className="grid gap-4 md:grid-cols-4">
                {Object.entries(dailyAverages).map(([key, value]) => (
                    <Card key={key}>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-sm font-medium text-muted-foreground capitalize">
                                    {key}
                                </p>
                                <p className="text-3xl font-bold mt-2">
                                    {value}{key === 'calories' ? '' : 'g'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Days and Meals */}
            <Tabs defaultValue={days[0]} className="space-y-6">
                <TabsList className="inline-flex h-auto p-1 bg-muted rounded-lg">
                    {days.map((day) => (
                        <TabsTrigger
                            key={day}
                            value={day}
                            className="inline-flex items-center justify-center whitespace-nowrap px-6 py-3"
                        >
                            {day}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {days.map((day) => (
                    <TabsContent
                        key={day}
                        value={day}
                        className="space-y-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-6 md:grid-cols-3"
                        >
                            {Object.entries(mealPlan.meal_plan[day]).map(([mealType, meal]) => (
                                <MealCard
                                    key={mealType}
                                    meal={meal}
                                    mealType={mealType}
                                    originalRecipe={typeof meal !== 'string' ? recipesCache[meal.name] : undefined}
                                />
                            ))}
                        </motion.div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

// MealCard component
interface MealCardProps {
    meal: Recipe | string;
    mealType: string;
    originalRecipe?: Recipe;
}

const MealCard = ({ meal, mealType, originalRecipe }: MealCardProps) => {
    if (typeof meal === 'string') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }} // Adjust duration as needed
            >
                <Card className="h-full">
                    <CardContent className="flex h-full items-center justify-center p-6">
                        <p className="text-muted-foreground">{meal}</p>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }


    const isDoublePortion = originalRecipe && meal.calories === originalRecipe.calories * 2;

    return (
        <motion.div
            initial={{opacity: 0, y: 10}} // Start with opacity 0 and slight vertical offset
            animate={{opacity: 1, y: 0}}  // Fade in and slide to position
            transition={{duration: 0.5, ease: "easeOut"}} // Smooth animation
        >
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg capitalize">{mealType}</CardTitle>
                        {isDoublePortion && (
                            <Badge variant="secondary" className="ml-2">
                                <Scale className="mr-1 h-4 w-4"/>
                                Double Portion
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pb-2 py-5">
                    <h3 className="font-medium">{meal.name}</h3>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <UtensilsCrossed className="mr-1 h-4 w-4"/>
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
        </motion.div>
    );
};