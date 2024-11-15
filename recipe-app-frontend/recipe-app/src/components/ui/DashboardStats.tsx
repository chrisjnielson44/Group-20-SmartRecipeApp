'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Recipe, Ingredient } from "@/types/api";
import { Utensils, Apple, Calendar, ShoppingCart } from "lucide-react";

interface DashboardStatsProps {
    recipes: Recipe[];
    ingredients: Ingredient[];
    activeMealPlans: number;
}

export function DashboardStats({
                                   recipes,
                                   ingredients,
                                   activeMealPlans
                               }: DashboardStatsProps) {
    const stats = [
        {
            title: "Total Recipes",
            value: recipes.length,
            description: "Available recipes",
            icon: Utensils
        },
        {
            title: "Ingredients",
            value: ingredients.length,
            description: "In your pantry",
            icon: Apple
        },
        {
            title: "Meal Plans",
            value: activeMealPlans,
            description: "Active plans",
            icon: Calendar
        },
        {
            title: "Shopping List",
            value: "12", // This should come from your shopping list data
            description: "Items to buy",
            icon: ShoppingCart
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
