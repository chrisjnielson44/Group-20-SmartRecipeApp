'use client';

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedLayoutProps {
    children: ReactNode;
}

export function AnimatedLayout({ children }: AnimatedLayoutProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                ease: "easeOut"
            }}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
            {children}
        </motion.div>
    );
}