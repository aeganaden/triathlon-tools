"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PaceCalculator: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState<number>(5);
  const [timeMin, setTimeMin] = useState<number>(25);

  const pace = useMemo(() => {
    if (!distanceKm || distanceKm <= 0) return 0;
    return Math.round((timeMin / distanceKm) * 100) / 100;
  }, [distanceKm, timeMin]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-center">Pace Calculator</h2>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="distance">Distance (km)</Label>
            <Input
              id="distance"
              type="number"
              min="0.1"
              step="0.1"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
              placeholder="Enter distance in km"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time (minutes)</Label>
            <Input
              id="time"
              type="number"
              min="1"
              step="1"
              value={timeMin}
              onChange={(e) => setTimeMin(parseInt(e.target.value) || 0)}
              placeholder="Enter time in minutes"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <span className="font-semibold">Pace: </span>
            <span className="text-lg">{pace} min/km</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaceCalculator;
