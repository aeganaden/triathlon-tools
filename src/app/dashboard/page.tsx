"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

import CardStats from "@/components/CardStats";
import WellnessModal from "@/components/WellnessModal";
import { BatteryCharging } from "lucide-react";
import {
  IntervalsIcuService,
  IntervalsWellnessData,
} from "@/services/intervals-icu.service";

const Dashboard = () => {
  const [readinessData, setReadinessData] = useState<{
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
  } | null>(null);
  const [wellnessData, setWellnessData] = useState<IntervalsWellnessData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchReadinessData = async () => {
      // Check if user is connected first
      if (!IntervalsIcuService.isConnected()) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        // Fetch wellness data and calculate readiness
        const wellnessData = await IntervalsIcuService.getWellnessData();
        const readiness = IntervalsIcuService.calculateReadiness(wellnessData);
        setWellnessData(wellnessData);
        setReadinessData(readiness);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch wellness data"
        );
        console.error("Error fetching readiness data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReadinessData();
  }, []);

  // Helper function to get readiness score display
  const getReadinessContent = () => {
    if (isLoading) return "Loading...";
    if (error) return "N/A";
    if (!readinessData) return "No data";
    return `${readinessData.score}%`;
  };

  // Helper function to get readiness subtitle
  const getReadinessSubtitle = () => {
    if (isLoading) return "Calculating readiness...";
    if (error) return error;
    if (!readinessData) return "Connect to intervals.icu";
    return readinessData.status;
  };

  // Helper function to get readiness color
  const getReadinessColor = ():
    | "green"
    | "yellow"
    | "orange"
    | "red"
    | "default" => {
    if (!readinessData) return "default";
    return readinessData.color as "green" | "yellow" | "orange" | "red";
  };

  // Handle clicking on the recovery card
  const handleRecoveryCardClick = () => {
    if (readinessData && wellnessData.length > 0) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-0">Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here is our data overview.
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div onClick={handleRecoveryCardClick} className="cursor-pointer">
              <CardStats
                title="Recovery Score"
                icon={<BatteryCharging size={20} />}
                content={getReadinessContent()}
                subtitle={getReadinessSubtitle()}
                color={getReadinessColor()}
              />
            </div>
          </div>
        </div>

        {/* Wellness Modal */}
        {readinessData && (
          <WellnessModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            wellnessData={wellnessData}
            readinessScore={readinessData}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
