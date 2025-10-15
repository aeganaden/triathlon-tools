"use client";
import React from "react";
import NavHeader from "@/components/NavHeader";
import Switcher from "@/components/Switcher";

const Home = () => (
  <div className="min-h-screen bg-background">
    <NavHeader />
    <main className="container mx-auto px-6 py-8">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <Switcher />
        </div>
      </div>
    </main>
  </div>
);

export default Home;
