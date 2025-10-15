"use client";
import React from "react";
import { Layout } from "antd";
import { Funnel_Display } from "next/font/google";

const { Header } = Layout;

const funnel = Funnel_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const NavHeader: React.FC = () => {
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <div
        className={`funnel-display ${funnel.className}`}
        style={{ fontWeight: 700, fontSize: 18, color: "#ebebeb" }}
      >
        Triathlon Tools
      </div>
    </Header>
  );
};

export default NavHeader;
