"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  Search,
  Utensils,
  Clipboard,
  Apple,
  BarChart2,
  Clock,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <motion.div
    className="bg-card text-card-foreground rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 dark:ring-1 ring-primary"
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center space-x-4">
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
  </motion.div>
);

interface EmptyStateProps {
  onNewConversation: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onNewConversation }) => (
  <motion.div
    className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-center space-y-6 max-w-3xl mx-auto">
      <motion.h2
        className="text-3xl font-bold text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Welcome to Your Smart Recipe Assistant
      </motion.h2>
      <motion.p
        className="text-lg text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Your personal cooking companion: Get recipe recommendations, meal
        planning help, and nutritional guidance all in one place.
      </motion.p>
    </div>
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <FeatureCard
        icon={<Search className="h-8 w-8 text-primary" />}
        title="Recipe Discovery"
        description="Find recipes based on your available ingredients and preferences."
      />
      <FeatureCard
        icon={<Utensils className="h-8 w-8 text-primary" />}
        title="Cooking Guidance"
        description="Get step-by-step cooking instructions and helpful tips."
      />
      <FeatureCard
        icon={<Clipboard className="h-8 w-8 text-primary" />}
        title="Meal Planning"
        description="Create balanced weekly meal plans tailored to your needs."
      />
      <FeatureCard
        icon={<Apple className="h-8 w-8 text-primary" />}
        title="Nutritional Analysis"
        description="Track nutritional content and maintain a balanced diet."
      />
      <FeatureCard
        icon={<BarChart2 className="h-8 w-8 text-primary" />}
        title="Portion Calculator"
        description="Easily adjust serving sizes and ingredient quantities."
      />
      <FeatureCard
        icon={<Clock className="h-8 w-8 text-primary" />}
        title="Time Management"
        description="Get cooking time estimates and meal prep schedules."
      />
    </motion.div>
    <div className="mt-12">
      <Button
        onClick={onNewConversation}
        className="bg-primary text-white hover:bg-muted transition-all duration-150 ease-in-out"
        size="lg"
      >
        <PlusIcon className="mr-2 h-5 w-5" />
        Start Recipe Chat
      </Button>
    </div>
  </motion.div>
);

export default EmptyState;
