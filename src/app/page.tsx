"use client";
import NavHeader from "@/components/NavHeader";
import CarbMix from "@/components/CarbMix";

const Home = () => (
  <div className="min-h-screen bg-muted/20">
    <NavHeader />
    <main className="px-4 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <CarbMix />
      </div>
    </main>
  </div>
);

export default Home;
