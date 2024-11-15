'use client';

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
    children: ReactNode;
}

const item = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
};

export function AnimatedCard({ children }: AnimatedCardProps) {
    return (
        <motion.div variants={item}>
            {children}
        </motion.div>
    );
}