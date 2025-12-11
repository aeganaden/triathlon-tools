"use client";
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const PaceCalculator: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState<number>(5);
  const [timeMin, setTimeMin] = useState<number>(25);

  const pace = useMemo(() => {
    if (!distanceKm || distanceKm <= 0) return 0;
    return Math.round((timeMin / distanceKm) * 100) / 100;
  }, [distanceKm, timeMin]);

  const handleNumberChange = (
    setter: (value: number) => void,
    fallback = 0
  ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      setter(Number.isNaN(value) ? fallback : value);
    };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-lg font-semibold text-primary">Pace Calculator</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="distance">
              Distance (km)
            </label>
            <Input
              id="distance"
              type="number"
              min={0.1}
              step={0.1}
              value={distanceKm}
              onChange={handleNumberChange(setDistanceKm, 0.1)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="time">
              Time (minutes)
            </label>
            <Input
              id="time"
              type="number"
              min={1}
              step={1}
              value={timeMin}
              onChange={handleNumberChange(setTimeMin, 1)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-baseline gap-3">
          <span className="text-sm font-medium text-muted-foreground">Pace</span>
          <span className="text-3xl font-semibold">{pace} min/km</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaceCalculator;
