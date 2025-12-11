"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CarbMix from "@/components/CarbMix/";
import PaceCalculator from "@/components/PaceCalculator/";
const Switcher: React.FC = () => {
  return (
    <Tabs defaultValue="carb" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="carb">Carbs Calculator</TabsTrigger>
        <TabsTrigger value="pace">Pace Calculator</TabsTrigger>
      </TabsList>

      <TabsContent value="carb" className="w-full">
        <CarbMix />
      </TabsContent>

      <TabsContent value="pace" className="w-full">
        <PaceCalculator />
      </TabsContent>
    </Tabs>
  );
};

export default Switcher;
