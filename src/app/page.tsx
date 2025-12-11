"use client";
import React from "react";
import NavHeader from "@/components/NavHeader";
import Switcher from "@/components/Switcher";

const Home = () => (
  <div className="min-h-screen bg-muted/20">
    <NavHeader />
    <main className="px-4 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <Switcher />
      </div>
    </main>
  </div>
);

export default Home;
