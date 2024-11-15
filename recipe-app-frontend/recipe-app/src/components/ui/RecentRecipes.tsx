'use client';

import { Recipe } from "@/types/api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import Link from "next/link";

interface RecentRecipesProps {
    recipes: Recipe[];
}

export function RecentRecipes({ recipes }: RecentRecipesProps) {
    const recentRecipes = recipes.slice(0, 5); // Show only 5 recent recipes

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Recipes</CardTitle>
                <CardDescription>Your recently added recipes</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentRecipes.map((recipe) => (
                        <Link
                            key={recipe.name}
                            href={`/dashboard/recipes/${recipe.name}`}
                            className="block"
                        >
                            <div className="flex items-center space-x-4 rounded-md border p-4 hover:bg-accent transition-colors">
                                <div className="flex-1 space-y-1">
                                    <p className="font-medium leading-none">{recipe.name}</p>
                                    <div className="flex items-center pt-2 text-sm text-muted-foreground">
                                        <Clock className="mr-1 h-4 w-4" />
                                        {recipe.preparationTime + recipe.cookingTime}m
                                        <Users className="ml-3 mr-1 h-4 w-4" />
                                        {recipe.servings}
                                        <div className="ml-3">
                                            <Badge variant="outline">{recipe.diet}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}