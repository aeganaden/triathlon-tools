import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get readiness color utilities
 */
export const readinessColorUtils = {
  // Get color for CardStats component
  getCardColor: (
    color: string
  ): "green" | "yellow" | "orange" | "red" | "purple" | "default" => {
    switch (color) {
      case "green":
      case "yellow":
      case "orange":
      case "red":
      case "purple":
        return color as "green" | "yellow" | "orange" | "red" | "purple";
      default:
        return "default";
    }
  },

  // Get CSS classes for modal indicators
  getIndicatorClass: (color: string): string => {
    switch (color) {
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      case "orange":
        return "bg-orange-500";
      case "purple":
        return "bg-purple-500";
      case "red":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  },

  // Get CSS classes for text colors
  getTextClass: (color: string): string => {
    switch (color) {
      case "green":
        return "text-green-600";
      case "yellow":
        return "text-yellow-600";
      case "orange":
        return "text-orange-600";
      case "purple":
        return "text-purple-600";
      case "red":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  },

  // Get CSS classes for background colors
  getBackgroundClass: (color: string): string => {
    switch (color) {
      case "green":
        return "bg-green-50 border border-green-200";
      case "yellow":
        return "bg-yellow-50 border border-yellow-200";
      case "orange":
        return "bg-orange-50 border border-orange-200";
      case "purple":
        return "bg-purple-50 border border-purple-200";
      case "red":
        return "bg-red-50 border border-red-200";
      default:
        return "bg-gray-50 border border-gray-200";
    }
  },
};

/**
 * Get form color utilities
 */
export const formColorUtils = {
  // Get color for CardStats component
  getCardColor: (
    color: string
  ): "green" | "yellow" | "orange" | "red" | "blue" | "gray" | "default" => {
    switch (color) {
      case "green":
      case "yellow":
      case "orange":
      case "red":
      case "blue":
      case "gray":
        return color as "green" | "yellow" | "orange" | "red" | "blue" | "gray";
      default:
        return "default";
    }
  },

  // Get CSS classes for modal indicators
  getIndicatorClass: (color: string): string => {
    switch (color) {
      case "yellow":
        return "bg-yellow-500";
      case "blue":
        return "bg-blue-500";
      case "gray":
        return "bg-gray-500";
      case "green":
        return "bg-green-500";
      case "red":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  },

  // Get CSS classes for text colors
  getTextClass: (color: string): string => {
    switch (color) {
      case "yellow":
        return "text-yellow-600";
      case "blue":
        return "text-blue-600";
      case "gray":
        return "text-gray-600";
      case "green":
        return "text-green-600";
      case "red":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  },

  // Get CSS classes for background colors
  getBackgroundClass: (color: string): string => {
    switch (color) {
      case "yellow":
        return "bg-yellow-50 border border-yellow-200";
      case "blue":
        return "bg-blue-50 border border-blue-200";
      case "gray":
        return "bg-gray-50 border border-gray-200";
      case "green":
        return "bg-green-50 border border-green-200";
      case "red":
        return "bg-red-50 border border-red-200";
      default:
        return "bg-gray-50 border border-gray-200";
    }
  },

  // Get area chart color based on form value
  getAreaChartColor: (formValue: number): { stroke: string; fill: string } => {
    if (formValue > 5) {
      // Transition / Fresh zone
      return { stroke: "#eab308", fill: "#eab308" }; // Yellow
    } else if (formValue >= 0) {
      // Fresh zone
      return { stroke: "#3b82f6", fill: "#3b82f6" }; // Blue
    } else if (formValue >= -10) {
      // Grey zone
      return { stroke: "#6b7280", fill: "#6b7280" }; // Gray
    } else if (formValue >= -30) {
      // Optimal zone
      return { stroke: "#22c55e", fill: "#22c55e" }; // Green
    } else {
      // High Risk zone
      return { stroke: "#ef4444", fill: "#ef4444" }; // Red
    }
  },

  // Get zone color for a specific form value (used for data points)
  getZoneColor: (formValue: number): string => {
    if (formValue > 5) return "yellow";
    if (formValue >= 0) return "blue";
    if (formValue >= -10) return "gray";
    if (formValue >= -30) return "green";
    return "red";
  },
};
