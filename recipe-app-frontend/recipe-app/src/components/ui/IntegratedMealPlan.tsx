'use client'

import { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MealPlanResponse } from "@/types/api";
import { Loader2, RefreshCw, Menu as MenuIcon } from "lucide-react";
import { getMealPlan, getUserPreferences, updateUserPreferences } from '@/app/lib/api';
import { MealPlanDisplay } from './MealPlanDisplay';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

type DietType = 'Vegetarian' | 'Vegan' | 'Keto' | 'Mediterranean' | 'Low-carb' | 'Bulking' | 'Cutting';

interface UserPreferences {
    name: string;
    dietaryGoal: DietType;
    nutritionalGoals: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber?: number;
    };
}

interface IntegratedMealPlanProps {
    initialMealPlan: MealPlanResponse;
}

export default function IntegratedMealPlan({ initialMealPlan }: IntegratedMealPlanProps) {
    const [mealPlan, setMealPlan] = useState<MealPlanResponse>(initialMealPlan);
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSavingPreferences, setIsSavingPreferences] = useState(false);

    // Fetch current preferences on component mount
    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const data = await getUserPreferences();
                setPreferences(data as UserPreferences);
            } catch (error) {
                console.error('Error fetching preferences:', error);
            }
        };

        fetchPreferences();
    }, []);

    const handleDietChange = async (diet: DietType) => {
        if (!preferences) return;

        setIsSavingPreferences(true);

        try {
            await updateUserPreferences({
                name: preferences.name,
                dietaryGoal: diet,
                nutritionalGoals: preferences.nutritionalGoals
            });

            setPreferences(prev => prev ? {
                ...prev,
                dietaryGoal: diet
            } : null);

            // After updating preferences, refresh the meal plan
            await handleRefresh();
        } catch (error) {
            console.error('Error saving preferences:', error);
        } finally {
            setIsSavingPreferences(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const newMealPlan = await getMealPlan();
            setMealPlan(newMealPlan);  // This will now trigger an update in MealPlanDisplay
        } catch (error) {
            console.error('Error refreshing meal plan:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const dietTypes: DietType[] = [
        "Vegetarian",
        "Vegan",
        "Keto",
        "Mediterranean",
        "Low-carb",
        "Bulking",
        "Cutting"
    ];

    const isLoading = isRefreshing || isSavingPreferences;

    if (!preferences) return null;

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center space-x-4">
                    <MenuIcon className="h-6 w-6 text-muted-foreground"/>
                    <Select
                        value={preferences.dietaryGoal}
                        onValueChange={(value: DietType) => handleDietChange(value)}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select diet"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Diet Types</SelectLabel>
                                {dietTypes.map((diet) => (
                                    <SelectItem key={diet} value={diet} className="capitalize">
                                        {diet.replace('-', ' ')}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {isSavingPreferences && (
                        <div className="text-sm text-muted-foreground flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin"/>
                            <span>Updating preferences...</span>
                        </div>
                    )}
                </div>
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="w-full lg:w-auto"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}/>
                    {isRefreshing ? 'Refreshing...' : 'Refresh Plan'}
                </Button>
            </div>

            {/* Goals and Summary Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="md:col-span-1">
                    <motion.div
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.3}}
                    >
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                Nutritional Goals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(preferences.nutritionalGoals).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between">
                                    <span className="text-sm font-medium capitalize text-muted-foreground">
                                        {key}
                                    </span>
                                        <span className="font-bold">
                                        {value}{key === 'calories' ? ' kcal' : 'g'}
                                    </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </motion.div>

                </Card>

                <Card className="md:col-span-1 lg:col-span-2">
                    <motion.div
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.3}}
                    >
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                Diet Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg">
                                <p className="text-muted-foreground">
                                    Your meal plan is optimized for a {preferences.dietaryGoal} diet,
                                    with a daily target of {preferences.nutritionalGoals.calories} calories
                                    and {preferences.nutritionalGoals.protein}g of protein.
                                </p>
                            </div>
                        </CardContent>
                    </motion.div>
                </Card>
            </div>

            {/* Meal Plan Display */}
            <div className="rounded-lg border bg-card">
                <div className="p-6">
                    <MealPlanDisplay mealPlan={mealPlan}/>
                </div>
            </div>
        </div>
    );
}