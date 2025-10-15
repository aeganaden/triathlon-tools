"use client";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import CarbMix from "@/components/CarbMix/";
import PaceCalculator from "@/components/PaceCalculator/";

const options = [
  { label: "Carbs Calculator", value: "carb" },
  { label: "Pace Calculator", value: "pace" },
];

const Switcher: React.FC = () => {
  const [selected, setSelected] = useState<string>("carb");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            className="flex flex-col gap-2"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="peer"
                />
                <Label
                  htmlFor={option.value}
                  className="flex-1 cursor-pointer rounded-md border-2 border-muted bg-card px-4 py-3 font-medium transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          {selected === "carb" && <CarbMix />}
          {selected === "pace" && <PaceCalculator />}
        </div>
      </div>
    </div>
  );
};

export default Switcher;
