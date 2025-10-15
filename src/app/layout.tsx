import React from "react";
import "./globals.css";
import { Noto_Sans_Display } from "next/font/google";

const noto = Noto_Sans_Display({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Triathlon Tools",
};

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en" className={noto.className}>
    <head>
      <title>Triathlon Tools</title>
    </head>
    <body>{children}</body>
  </html>
);

export default RootLayout;
