"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IntervalsWellnessData } from "@/services/intervals-icu.service";

interface WellnessModalProps {
  isOpen: boolean;
  onClose: () => void;
  wellnessData: IntervalsWellnessData[];
  readinessScore: {
    score: number;
    color: string;
    status: string;
    breakdown: {
      HRV_today: number;
      HRV_base: number;
      HRV_s: number;
      RHR_today: number;
      RHR_base: number;
      RHR_s: number;
      Sleep_today: number;
      Sleep_target: number;
      Sleep_s: number;
      finalScore: number;
    };
  };
}

const WellnessModal: React.FC<WellnessModalProps> = ({
  isOpen,
  onClose,
  wellnessData,
  readinessScore,
}) => {
  // Use the breakdown data from the service instead of recalculating
  const breakdown = readinessScore.breakdown;

  // Get trend data for the last 30 days
  const getTrendData = () => {
    const recentData = wellnessData.slice(-30);

    const hrvTrend = recentData.map((d, index) => ({
      day: index + 1,
      value: d.hrv || 0,
      date: d.id, // Use id as date since there's no separate date field
    }));

    const rhrTrend = recentData.map((d, index) => ({
      day: index + 1,
      value: d.restingHR || 0,
      date: d.id, // Use id as date since there's no separate date field
    }));

    const sleepTrend = recentData.map((d, index) => ({
      day: index + 1,
      value: (d.sleepSecs || 0) / 3600, // Convert seconds to hours
      date: d.id, // Use id as date since there's no separate date field
    }));

    return { hrvTrend, rhrTrend, sleepTrend };
  };

  const { hrvTrend, rhrTrend, sleepTrend } = getTrendData();

  // Simple trend visualization component
  const TrendLine: React.FC<{
    data: { day: number; value: number }[];
    color: string;
    unit: string;
  }> = ({ data, color, unit }) => {
    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;

    return (
      <div className="mt-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>
            {minValue.toFixed(1)}
            {unit}
          </span>
          <span>
            {maxValue.toFixed(1)}
            {unit}
          </span>
        </div>
        <div className="h-16 bg-muted rounded relative overflow-hidden">
          <svg width="100%" height="100%" className="absolute">
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={data
                .map((d, i) => {
                  const x = (i / (data.length - 1)) * 100;
                  const y = 100 - ((d.value - minValue) / range) * 100;
                  return `${x},${y}`;
                })
                .join(" ")}
            />
          </svg>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                readinessScore.color === "green"
                  ? "bg-green-500"
                  : readinessScore.color === "yellow"
                  ? "bg-yellow-500"
                  : readinessScore.color === "orange"
                  ? "bg-orange-500"
                  : readinessScore.color === "purple"
                  ? "bg-purple-500"
                  : "bg-red-500"
              }`}
            />
            Recovery Score Breakdown - {readinessScore.score}%
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Final Score Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Final Readiness Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {breakdown.HRV_s.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    HRV Score (50%)
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {breakdown.RHR_s.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    RHR Score (25%)
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {breakdown.Sleep_s.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sleep Score (25%)
                  </div>
                </div>
                <div>
                  <div
                    className={`text-3xl font-bold ${
                      readinessScore.color === "green"
                        ? "text-green-600"
                        : readinessScore.color === "yellow"
                        ? "text-yellow-600"
                        : readinessScore.color === "orange"
                        ? "text-orange-600"
                        : readinessScore.color === "purple"
                        ? "text-purple-600"
                        : "text-red-600"
                    }`}
                  >
                    {breakdown.finalScore.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Final Score
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Formula:</div>
                <div className="text-sm text-muted-foreground">
                  Final Score = (HRV × 0.5) + (RHR × 0.25) + (Sleep × 0.25)
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  = ({breakdown.HRV_s.toFixed(1)} × 0.5) + (
                  {breakdown.RHR_s.toFixed(1)} × 0.25) + (
                  {breakdown.Sleep_s.toFixed(1)} × 0.25) ={" "}
                  {breakdown.finalScore.toFixed(1)}%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HRV */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">
                  Heart Rate Variability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Today&apos;s HRV:</span>
                    <span className="font-medium">
                      {breakdown.HRV_today.toFixed(1)} ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>30-day baseline:</span>
                    <span className="font-medium">
                      {breakdown.HRV_base.toFixed(1)} ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Score:</span>
                    <span className="font-bold text-blue-600">
                      {breakdown.HRV_s.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <TrendLine data={hrvTrend} color="#2563eb" unit=" ms" />
              </CardContent>
            </Card>

            {/* RHR */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">
                  Resting Heart Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Today&apos;s RHR:</span>
                    <span className="font-medium">
                      {breakdown.RHR_today.toFixed(0)} bpm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>30-day baseline:</span>
                    <span className="font-medium">
                      {breakdown.RHR_base.toFixed(0)} bpm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Score:</span>
                    <span className="font-bold text-purple-600">
                      {breakdown.RHR_s.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <TrendLine data={rhrTrend} color="#9333ea" unit=" bpm" />
              </CardContent>
            </Card>

            {/* Sleep */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-indigo-600">
                  Sleep Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Last night:</span>
                    <span className="font-medium">
                      {breakdown.Sleep_today.toFixed(1)} hrs
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>30-day target:</span>
                    <span className="font-medium">
                      {breakdown.Sleep_target.toFixed(1)} hrs
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Score:</span>
                    <span className="font-bold text-indigo-600">
                      {breakdown.Sleep_s.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <TrendLine data={sleepTrend} color="#4f46e5" unit=" hrs" />
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`p-4 rounded-lg ${
                    readinessScore.color === "green"
                      ? "bg-green-50 border border-green-200"
                      : readinessScore.color === "yellow"
                      ? "bg-yellow-50 border border-yellow-200"
                      : readinessScore.color === "orange"
                      ? "bg-orange-50 border border-orange-200"
                      : readinessScore.color === "purple"
                      ? "bg-purple-50 border border-purple-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="text-lg font-medium">
                    {readinessScore.status}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Based on your current readiness score of{" "}
                    {readinessScore.score}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interpretation Table */}
          <Card>
            <CardHeader>
              <CardTitle>Readiness Zone Interpretation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Score Range</th>
                      <th className="text-left p-2">Zone</th>
                      <th className="text-left p-2">Recommendation</th>
                      <th className="text-left p-2">Training Intensity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">105%+</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          Supercompensated
                        </span>
                      </td>
                      <td className="p-2">Peak/race ready</td>
                      <td className="p-2">
                        Breakthrough workouts, competitions, PRs
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">95-104%</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          High Readiness
                        </span>
                      </td>
                      <td className="p-2">Train hard</td>
                      <td className="p-2">
                        High intensity workouts, competitions
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">85-94%</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-2">
                          <div className="w-3 h-3 bg-lime-500 rounded-full"></div>
                          Good Readiness
                        </span>
                      </td>
                      <td className="p-2">Moderate intensity</td>
                      <td className="p-2">Tempo, sustained efforts</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">70-84%</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          Moderate Readiness
                        </span>
                      </td>
                      <td className="p-2">Aerobic base</td>
                      <td className="p-2">
                        Easy aerobic training, base building
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">50-69%</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          Low Readiness
                        </span>
                      </td>
                      <td className="p-2">Light recovery</td>
                      <td className="p-2">Easy pace, low stress activities</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">0-49%</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          Very Low Readiness
                        </span>
                      </td>
                      <td className="p-2">Rest day</td>
                      <td className="p-2">
                        Complete rest, sleep, stress management
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WellnessModal;
