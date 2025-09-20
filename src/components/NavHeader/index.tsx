"use client";
import React from "react";
import { Layout, Menu, Button } from "antd";
import { Funnel_Display } from "next/font/google";

const { Header } = Layout;

const funnel = Funnel_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const NavHeader: React.FC = () => {
  return (
    <Header style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        className={`funnel-display ${funnel.className}`}
        style={{ color: "white", fontWeight: 700, fontSize: 18 }}
      >
        Triathlon Tools
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["home"]}
        style={{ flex: 1 }}
        items={[]}
      />
    </Header>
  );
};

export default NavHeader;
