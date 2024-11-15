// components/ui/NutritionOverview.tsx
"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Recipe } from "@/types/api"

interface NutritionOverviewProps {
    recipes: Recipe[];
}

const chartConfig = {
    protein: {
        label: "Protein",
        color: "hsl(var(--chart-1))",
    },
    carbs: {
        label: "Carbs",
        color: "hsl(var(--chart-2))",
    },
    fat: {
        label: "Fat",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid gap-2">
                    <div className="font-medium">{payload[0]?.payload?.fullName}</div>
                    <div className="grid grid-cols-2 gap-2">
                        {payload.map((entry: any) => (
                            <div key={entry.dataKey} className="flex items-center gap-2">
                                <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="font-medium">
                  {entry.name}: {entry.value}g
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export function NutritionOverview({ recipes }: NutritionOverviewProps) {
    // Transform recipe data into chart format
    const chartData = recipes.slice(0, 6).map(recipe => ({
        name: recipe.name.length > 10 ? `${recipe.name.slice(0, 10)}...` : recipe.name,
        protein: Math.round(recipe.protein_g),
        carbs: Math.round(recipe.carbs_g),
        fat: Math.round(recipe.fat_g)
    }));

    // Calculate average nutrition values for comparison
    const averages = recipes.reduce((acc, recipe) => {
        acc.protein += recipe.protein_g;
        acc.carbs += recipe.carbs_g;
        acc.fat += recipe.fat_g;
        return acc;
    }, { protein: 0, carbs: 0, fat: 0 });

    const numRecipes = recipes.length;
    const avgProtein = Math.round(averages.protein / numRecipes);
    const avgCarbs = Math.round(averages.carbs / numRecipes);
    const avgFat = Math.round(averages.fat / numRecipes);

    // Calculate trends (comparing latest to average)
    const latestRecipe = recipes[0];
    const proteinTrend = latestRecipe
        ? ((latestRecipe.protein_g - avgProtein) / avgProtein * 100).toFixed(1)
        : 0;
    const carbsTrend = latestRecipe
        ? ((latestRecipe.carbs_g - avgCarbs) / avgCarbs * 100).toFixed(1)
        : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Nutrition Overview</CardTitle>
                <CardDescription>Latest recipes nutritional breakdown</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig }  className="min-h-[200px] h-[500px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                            dataKey="protein"
                            type="monotone"
                            stroke="var(--color-protein)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="carbs"
                            type="monotone"
                            stroke="var(--color-carbs)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="fat"
                            type="monotone"
                            stroke="var(--color-fat)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full flex-col gap-4">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            {Number(proteinTrend) > 0 ? (
                                <>
                                    Protein trending up by {Math.abs(Number(proteinTrend))}% from average
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                </>
                            ) : (
                                <>
                                    Protein trending down by {Math.abs(Number(proteinTrend))}% from average
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2 font-medium leading-none">
                            {Number(carbsTrend) > 0 ? (
                                <>
                                    Carbs trending up by {Math.abs(Number(carbsTrend))}% from average
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                </>
                            ) : (
                                <>
                                    Carbs trending down by {Math.abs(Number(carbsTrend))}% from average
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Showing nutritional data for the last {chartData.length} recipes
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}