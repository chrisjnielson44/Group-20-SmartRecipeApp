'use client';

import { useState, useEffect } from 'react';
import { Ingredient } from '@/types/api';
import { IngredientCard } from '@/components/ui/IngredientCard';
import { AnimatedLayout } from '@/components/ui/AnimatedLayout';
import { SearchInput } from '@/components/ui/SearchInput';
import { motion, AnimatePresence } from 'framer-motion';

interface IngredientsContentProps {
    ingredients: Ingredient[];
}

export function IngredientsContent({ ingredients }: IngredientsContentProps) {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setSearchQuery('');
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const filteredIngredients = ingredients.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Ingredients</h2>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground hidden sm:block">
                        {filteredIngredients.length} of {ingredients.length} ingredients
                    </div>
                    <div className="w-[200px] sm:w-[300px]">
                        <SearchInput
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search ingredients..."
                        />
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={searchQuery}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {filteredIngredients.length > 0 ? (
                        <AnimatedLayout>
                            {filteredIngredients.map((ingredient) => (
                                <IngredientCard key={ingredient.name} ingredient={ingredient} />
                            ))}
                        </AnimatedLayout>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12"
                        >
                            <p className="text-lg font-medium text-muted-foreground">
                                No ingredients found matching "{searchQuery}"
                            </p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                Clear search
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
