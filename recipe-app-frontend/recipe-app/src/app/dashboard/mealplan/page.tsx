import { getMealPlan } from '@/app/lib/api';
import IntegratedMealPlan from '@/components/ui/IntegratedMealPlan';
import { Nav } from "@/app/dashboard/components/nav/Nav";
import { UserNav } from "@/app/dashboard/components/nav/ProfileAvatar";
import { Suspense } from 'react';

function MealPlanLoading() {
    return (
        <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
                <div className="text-lg font-medium">Loading...</div>
                <div className="text-sm text-muted-foreground">
                    Please wait while we fetch your meal plan.
                </div>
            </div>
        </div>
    );
}

export default async function MealPlanPage() {
    const initialMealPlan = await getMealPlan();

    return (
        <>
            <div>
                <Nav desktopProfile={<UserNav />} mobileNav={<UserNav />} />
            </div>
            <div className="flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">Meal Plan</h2>
                    </div>

                    <Suspense fallback={<MealPlanLoading />}>
                        <IntegratedMealPlan initialMealPlan={initialMealPlan} />
                    </Suspense>
                </div>
            </div>
        </>
    );
}