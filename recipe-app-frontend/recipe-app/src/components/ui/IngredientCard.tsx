import { Ingredient } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCard } from './AnimatedCard';

interface IngredientCardProps {
    ingredient: Ingredient;
}

export function IngredientCard({ ingredient }: IngredientCardProps) {
    return (
        <AnimatedCard>

        <Card>
            <CardHeader>
                <CardTitle>{ingredient.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-md text-muted-foreground">
                    {ingredient.quantity} {ingredient.unit}
                </p>
            </CardContent>
        </Card>
        </AnimatedCard>
    );
}