'use client';

import { Recipe } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <motion.div
            whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
        >
            <Card className="hover:shadow-md transition-shadow h-full">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{recipe.name}</CardTitle>
                        <Badge variant={recipe.difficulty === 'easy' ? 'secondary' : 'outline'}>
                            {recipe.difficulty}
                        </Badge>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {recipe.tags?.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {recipe.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {recipe.description}
                        </p>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{recipe.preparationTime + recipe.cookingTime}m</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{recipe.servings}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{recipe.calories}</span>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                                <p className="font-medium text-muted-foreground">Protein</p>
                                <p>{recipe.protein_g}g</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">Carbs</p>
                                <p>{recipe.carbs_g}g</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">Fat</p>
                                <p>{recipe.fat_g}g</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
