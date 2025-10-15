"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

import CardStats from "@/components/CardStats";
import WellnessModal from "@/components/WellnessModal";
import FormModal from "@/components/FormModal";
import { BatteryCharging, TrendingUp } from "lucide-react";
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
  const [formData, setFormData] = useState<{
    form: number;
    color: string;
    zone: string;
    meaning: string;
    trend: Array<{
      date: string;
      form: number;
      ctl: number;
      atl: number;
    }>;
  } | null>(null);
  const [wellnessData, setWellnessData] = useState<IntervalsWellnessData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      // Check if user is connected first
      if (!IntervalsIcuService.isConnected()) {
        return;
      }

      setIsLoading(true);
      setIsFormLoading(true);
      setError("");
      setFormError("");

      try {
        // Fetch wellness data and calculate readiness
        const wellnessData = await IntervalsIcuService.getWellnessData();
        const readiness = IntervalsIcuService.calculateReadiness(wellnessData);
        const form = IntervalsIcuService.calculateForm(wellnessData);

        setWellnessData(wellnessData);
        setReadinessData(readiness);
        setFormData(form);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch wellness data";
        setError(errorMessage);
        setFormError(errorMessage);
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
        setIsFormLoading(false);
      }
    };

    fetchData();
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
    | "purple"
    | "default" => {
    if (!readinessData) return "default";
    return readinessData.color as
      | "green"
      | "yellow"
      | "orange"
      | "red"
      | "purple";
  };

  // Helper function to get form content display
  const getFormContent = () => {
    if (isFormLoading) return "Loading...";
    if (formError) return "N/A";
    if (!formData) return "No data";
    return formData.form.toFixed(1);
  };

  // Helper function to get form subtitle
  const getFormSubtitle = () => {
    if (isFormLoading) return "Calculating form...";
    if (formError) return formError;
    if (!formData) return "Connect to intervals.icu";
    return formData.zone;
  };

  // Helper function to get form color
  const getFormColor = ():
    | "green"
    | "yellow"
    | "orange"
    | "red"
    | "lightgreen"
    | "blue"
    | "gray"
    | "default" => {
    if (!formData) return "default";
    return formData.color as
      | "green"
      | "yellow"
      | "orange"
      | "red"
      | "lightgreen"
      | "blue"
      | "gray";
  };

  // Handle clicking on the recovery card
  const handleRecoveryCardClick = () => {
    if (readinessData && wellnessData.length > 0) {
      setIsModalOpen(true);
    }
  };

  // Handle clicking on the form card
  const handleFormCardClick = () => {
    if (formData && wellnessData.length > 0) {
      setIsFormModalOpen(true);
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
            <div onClick={handleFormCardClick} className="cursor-pointer">
              <CardStats
                title="Form (CTL - ATL)"
                icon={<TrendingUp size={20} />}
                content={getFormContent()}
                subtitle={getFormSubtitle()}
                color={getFormColor()}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        {readinessData && (
          <WellnessModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            wellnessData={wellnessData}
            readinessScore={readinessData}
          />
        )}
        {formData && (
          <FormModal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            formData={formData}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
