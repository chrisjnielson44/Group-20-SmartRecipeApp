import { getRecipes } from '@/app/lib/api';
import { RecipeCard } from '@/components/ui/RecipeCard';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Suspense } from 'react';
import { Nav } from "@/app/dashboard/components/nav/Nav";
import { UserNav } from "@/app/dashboard/components/nav/ProfileAvatar";
import { AnimatedLayout } from '@/components/ui/AnimatedLayout';

export default async function RecipesPage() {
    const recipes = await getRecipes();

    return (
        <>
            <div>
                <Nav desktopProfile={<UserNav />} mobileNav={<UserNav />} />
            </div>
            <div className="flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-4">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Recipes</h2>
                    </div>
                    <ErrorBoundary fallback={<div>Error loading recipes</div>}>
                        <Suspense>
                            <AnimatedLayout>
                                {Object.values(recipes).map((recipe) => (
                                    <RecipeCard key={recipe.name} recipe={recipe} />
                                ))}
                            </AnimatedLayout>
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </div>
        </>
    );
}