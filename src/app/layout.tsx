import type { ReactNode } from "react";
import "./globals.css";
import { Noto_Sans_Display } from "next/font/google";
import { cn } from "@/lib/utils";

const noto = Noto_Sans_Display({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Triathlon Tools",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <title>Triathlon Tools</title>
    </head>
    <body
      className={cn(
        "min-h-screen bg-background text-foreground antialiased",
        noto.className
      )}
    >
      {children}
    </body>
  </html>
);

export default RootLayout;
