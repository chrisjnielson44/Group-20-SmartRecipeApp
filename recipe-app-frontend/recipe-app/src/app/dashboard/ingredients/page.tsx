import { getIngredients } from '@/app/lib/api';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Suspense } from 'react';
import { Nav } from "@/app/dashboard/components/nav/Nav";
import { UserNav } from "@/app/dashboard/components/nav/ProfileAvatar";
import { IngredientsContent } from '@/components/ui/IngredientsContent';
import type {Metadata} from "next";
export const metadata: Metadata = {
    title: "Ingredients",
    description: "Ingredients for the recipe app.",
};

export default async function IngredientsPage() {
    const ingredients = await getIngredients();

    return (
        <>
            <div>
                <Nav desktopProfile={<UserNav />} mobileNav={<UserNav />} />
            </div>
            <div className="flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-4">
                    <ErrorBoundary fallback={<div>Error loading ingredients</div>}>
                        <Suspense>
                            <IngredientsContent ingredients={ingredients} />
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </div>
        </>
    );
}


