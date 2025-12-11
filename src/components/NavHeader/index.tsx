"use client";
import React from "react";
import { Funnel_Display } from "next/font/google";
import { cn } from "@/lib/utils";

const funnel = Funnel_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const NavHeader: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-4 px-4 py-6">
        <div
          className={cn("text-lg font-bold uppercase tracking-[0.2em]", funnel.className)}
        >
          Triathlon Tools
        </div>
      </div>
    </header>
  );
};

export default NavHeader;
