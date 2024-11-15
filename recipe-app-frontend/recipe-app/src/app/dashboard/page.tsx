// app/dashboard/page.tsx
import { getRecipes, getIngredients } from '@/app/lib/api';
import { DashboardStats } from '@/components/ui/DashboardStats';
import { RecentRecipes } from '@/components/ui/RecentRecipes';
import { NutritionOverview } from '@/components/ui/NutritionOverview';
import { Nav } from "@/app/dashboard/components/nav/Nav";
import { UserNav } from "@/app/dashboard/components/nav/ProfileAvatar";
import { Suspense } from 'react';

function LoadingState() {
  return (
      <div className="space-y-8 p-8 pt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[120px] rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-[400px] rounded-lg bg-muted animate-pulse" />
          <div className="h-[400px] rounded-lg bg-muted animate-pulse lg:col-span-2" />
        </div>
      </div>
  );
}

export default async function DashboardPage() {
  const [recipes, ingredients] = await Promise.all([
    getRecipes(),
    getIngredients(),
  ]);

  const recipesArray = Object.values(recipes);

  return (
      <>
        <div>
          <Nav desktopProfile={<UserNav />} mobileNav={<UserNav />} />
        </div>
        <div className="flex-col md:flex">
          <div className="flex-1 space-y-4 p-8 pt-4">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <Suspense fallback={<LoadingState />}>
              <div className="space-y-8">
                <DashboardStats
                    recipes={recipesArray}
                    ingredients={ingredients}
                    activeMealPlans={1}
                />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <RecentRecipes recipes={recipesArray} />
                  <div className="lg:col-span-2">
                    <NutritionOverview recipes={recipesArray} />
                  </div>
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      </>
  );
}