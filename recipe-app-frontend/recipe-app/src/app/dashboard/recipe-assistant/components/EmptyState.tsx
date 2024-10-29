"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  HelpCircle,
  Book,
  FileText,
  AlertTriangle,
  BarChart,
  Shield,
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
        Welcome to Your Compliance Assistant
      </motion.h2>
      <motion.p
        className="text-lg text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Simplifying compliance, maximizing efficiency: Your intelligent partner
        in regulatory navigation.
      </motion.p>
    </div>
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <FeatureCard
        icon={<HelpCircle className="h-8 w-8 text-primary" />}
        title="Ask Questions"
        description="Get instant answers to your compliance queries."
      />
      <FeatureCard
        icon={<Book className="h-8 w-8 text-primary" />}
        title="Policy Guidance"
        description="Receive up-to-date information on regulatory policies."
      />
      <FeatureCard
        icon={<FileText className="h-8 w-8 text-primary" />}
        title="Generate Reports"
        description="Create compliance reports with ease."
      />
      <FeatureCard
        icon={<AlertTriangle className="h-8 w-8 text-primary" />}
        title="Risk Assessment"
        description="Identify and mitigate potential compliance risks."
      />
      <FeatureCard
        icon={<BarChart className="h-8 w-8 text-primary" />}
        title="Data Analytics"
        description="Gain insights from compliance data visualization."
      />
      <FeatureCard
        icon={<Shield className="h-8 w-8 text-primary" />}
        title="Compliance Monitoring"
        description="Continuously track and ensure regulatory adherence."
      />
    </motion.div>
    <div className="mt-12">
      <Button
        onClick={onNewConversation}
        className="bg-primary text-white hover:bg-muted transition-all duration-150 ease-in-out"
        size="lg"
      >
        <PlusIcon className="mr-2 h-5 w-5" />
        Start a New Conversation
      </Button>
    </div>
  </motion.div>
);

export default EmptyState;
