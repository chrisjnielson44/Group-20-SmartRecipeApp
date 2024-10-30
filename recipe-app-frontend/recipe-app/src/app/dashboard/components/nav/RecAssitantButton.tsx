"use client";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChefHatIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export const RecipeAssitantButton = () => {
  const pathname = usePathname();
  const isAssistantActive = pathname === "/dashboard/recipe-assistant";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            asChild
            variant={isAssistantActive ? "default" : "outline"}
            size="icon"
            className={`
              ${
                isAssistantActive
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "hover:text-primary hover:border-primary"
              }
            `}
          >
            <Link href="/dashboard/recipe-assistant">
              <ChefHatIcon className="h-5 w-5" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Recipe Assistant</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
