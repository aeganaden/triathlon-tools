import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardStatsProps {
  title: string;
  icon: React.ReactNode;
  content: string | number;
  subtitle?: string | React.ReactNode;
  className?: string;
  color?: "green" | "yellow" | "orange" | "red" | "default";
}

const CardStats = React.forwardRef<HTMLDivElement, CardStatsProps>(
  ({ title, icon, content, subtitle, className, color = "default" }, ref) => {
    // Define color variants for card styling
    const colorVariants = {
      green:
        "border-green-300 bg-green-100 dark:border-green-700 dark:bg-green-900/40",
      yellow:
        "border-yellow-300 bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-900/40",
      orange:
        "border-orange-300 bg-orange-100 dark:border-orange-700 dark:bg-orange-900/40",
      red: "border-red-300 bg-red-100 dark:border-red-700 dark:bg-red-900/40",
      default: "",
    };

    // Define icon color variants
    const iconColorVariants = {
      green: "text-green-600 dark:text-green-400",
      yellow: "text-yellow-600 dark:text-yellow-400",
      orange: "text-orange-600 dark:text-orange-400",
      red: "text-red-600 dark:text-red-400",
      default: "text-muted-foreground",
    };

    return (
      <Card ref={ref} className={cn("p-6", colorVariants[color], className)}>
        <div className="space-y-3">
          {/* Title with Icon */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-medium">
              {title}
            </span>
            <div className={cn(iconColorVariants[color])}>{icon}</div>
          </div>

          {/* Main Content */}
          <div className="text-3xl font-bold text-foreground">{content}</div>

          {/* Subtitle */}
          {subtitle && (
            <div className="text-sm text-muted-foreground">{subtitle}</div>
          )}
        </div>
      </Card>
    );
  }
);

CardStats.displayName = "CardStats";

export default CardStats;
