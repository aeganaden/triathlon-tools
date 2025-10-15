"use client";
import React from "react";
import { Funnel_Display } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Cog } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const funnel = Funnel_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const mainItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
];

const bottomItems = [
  {
    title: "Connections",
    href: "/connections",
    icon: Cog,
  },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className={`${funnel.className} text-xl font-bold`}>
          Triathlon Tools
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col justify-between p-4">
        {/* Main navigation items */}
        <div className="space-y-2">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* Bottom section with separator and tools */}
        <div className="space-y-4">
          <Separator />
          <div className="space-y-2">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
