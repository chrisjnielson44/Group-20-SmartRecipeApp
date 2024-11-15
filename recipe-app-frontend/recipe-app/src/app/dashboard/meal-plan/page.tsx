import { getMealPlan } from '@/app/lib/api';
import { MealPlanDisplay } from '@/components/ui/MealPlanDisplay';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Suspense } from 'react';
import { Nav } from "@/app/dashboard/components/nav/Nav";
import { UserNav } from "@/app/dashboard/components/nav/ProfileAvatar";

export default async function MealPlanPage() {
    const mealPlan = await getMealPlan();

    return (
        <>
            <div>
                <Nav desktopProfile={<UserNav />} mobileNav={<UserNav />} />
            </div>
            <div className="flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-4">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Meal Plan</h2>
                    </div>
                    <ErrorBoundary fallback={<div>Error loading meal plan</div>}>
                        <Suspense fallback={<div>Loading meal plan...</div>}>
                            <MealPlanDisplay mealPlan={mealPlan} />
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </div>
        </>
    );
}