'use client';

import { MealPlan } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

interface MealPlanDisplayProps {
    mealPlan: MealPlan;
}

export function MealPlanDisplay({ mealPlan }: MealPlanDisplayProps) {
    const groupedMeals = mealPlan.meals.reduce((acc, meal) => {
        const dayKey = format(new Date(meal.day), 'yyyy-MM-dd');
        if (!acc[dayKey]) {
            acc[dayKey] = [];
        }
        acc[dayKey].push(meal);
        return acc;
    }, {} as Record<string, typeof mealPlan.meals>);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Meal Plan Overview</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {format(new Date(mealPlan.startDate), 'PPP')} - {format(new Date(mealPlan.endDate), 'PPP')}
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium">Total Calories</p>
                            <p className="text-2xl font-bold">{mealPlan.totalCalories?.toFixed(0) || 0}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Total Protein</p>
                            <p className="text-2xl font-bold">{mealPlan.totalProtein?.toFixed(0) || 0}g</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Total Carbs</p>
                            <p className="text-2xl font-bold">{mealPlan.totalCarbs?.toFixed(0) || 0}g</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Total Fats</p>
                            <p className="text-2xl font-bold">{mealPlan.totalFats?.toFixed(0) || 0}g</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue={Object.keys(groupedMeals)[0]} className="space-y-4">
                <TabsList>
                    {Object.keys(groupedMeals).map((day) => (
                        <TabsTrigger key={day} value={day}>
                            {format(new Date(day), 'EEE, MMM d')}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Object.entries(groupedMeals).map(([day, meals]) => (
                    <TabsContent key={day} value={day} className="space-y-4">
                        {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                            const meal = meals.find((m) => m.mealType === mealType);
                            return (
                                <Card key={mealType}>
                                    <CardHeader>
                                        <CardTitle className="capitalize">{mealType}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {meal ? (
                                            <div className="space-y-2">
                                                <h3 className="font-medium">{meal.recipe.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {meal.recipe.calories} calories | {meal.recipe.protein_g}g protein
                                                </p>
                                                <p className="text-sm">{meal.recipe.description}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No meal planned</p>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
