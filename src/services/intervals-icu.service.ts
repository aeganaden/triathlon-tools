// intervals.icu API service
export interface IntervalsActivity {
  id: string;
  name: string;
  type: string;
  start_date_local: string;
  moving_time: number;
  distance: number;
  average_speed?: number;
  average_heartrate?: number;
  average_power?: number;
  total_elevation_gain?: number;
  calories?: number;
}

export interface IntervalsWellnessData {
  id: string; // Date in YYYY-MM-DD format
  ctl?: number; // Chronic Training Load (Fitness)
  atl?: number; // Acute Training Load (Fatigue)
  rampRate?: number;
  ctlLoad?: number;
  atlLoad?: number;
  sportInfo?: Array<{
    type: string;
    eftp: number;
    wPrime: number;
    pMax: number;
  }>;
  updated?: string;
  weight?: number | null;
  restingHR?: number; // Resting Heart Rate
  hrv?: number; // Heart Rate Variability
  hrvSDNN?: number | null;
  menstrualPhase?: string | null;
  menstrualPhasePredicted?: string | null;
  kcalConsumed?: number | null;
  sleepSecs?: number; // Sleep duration in seconds
  sleepScore?: number;
  sleepQuality?: number; // Sleep quality score
  avgSleepingHR?: number | null;
  soreness?: number | null;
  fatigue?: number | null;
  stress?: number | null;
  mood?: number | null;
  motivation?: number | null;
  injury?: string | null;
  spO2?: number | null;
  systolic?: number | null;
  diastolic?: number | null;
  hydration?: number | null;
  hydrationVolume?: number | null;
  readiness?: number | null;
  baevskySI?: number | null;
  bloodGlucose?: number | null;
  lactate?: number | null;
  bodyFat?: number | null;
  abdomen?: number | null;
  vo2max?: number | null;
  comments?: string | null;
  steps?: number;
  respiration?: number | null;
  locked?: boolean | null;
  tempWeight?: boolean;
  tempRestingHR?: boolean;
}

export interface IntervalsCredentials {
  apiKey: string;
  athleteId: string;
}

export class IntervalsIcuService {
  // Get credentials from localStorage
  static getCredentials(): IntervalsCredentials | null {
    if (typeof window === "undefined") {
      return null; // Server-side rendering
    }

    const apiKey = localStorage.getItem("intervals_api_key");
    const athleteId = localStorage.getItem("intervals_athlete_id");

    if (!apiKey || !athleteId) {
      return null;
    }

    return { apiKey, athleteId };
  }

  // Check if user is connected
  static isConnected(): boolean {
    return this.getCredentials() !== null;
  }

  // Private utility function for making authenticated requests to intervals.icu API
  private static async makeAuthenticatedRequest<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    const credentials = this.getCredentials();
    if (!credentials) {
      throw new Error("No intervals.icu credentials found");
    }

    try {
      // intervals.icu API uses Basic Auth with "API_KEY" as username and the actual key as password
      const auth = btoa(`API_KEY:${credentials.apiKey}`);

      // Build URL with parameters
      const url = new URL(
        `https://intervals.icu/api/v1/athlete/${credentials.athleteId}/${endpoint}`
      );
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      console.log("Calling intervals.icu API:", url.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
          "User-Agent": "TriathlonTools/1.0",
        },
        mode: "cors",
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);

        if (response.status === 401) {
          throw new Error(
            "Invalid API key or athlete ID. Please check your credentials."
          );
        }
        if (response.status === 403) {
          throw new Error(
            `Access forbidden. API Key: ${
              credentials.apiKey ? "present" : "missing"
            }, Athlete ID: ${
              credentials.athleteId ? "present" : "missing"
            }. Error: ${errorText}`
          );
        }
        if (response.status === 422) {
          throw new Error(`Invalid request parameters: ${errorText}`);
        }
        throw new Error(
          `Failed to fetch data: ${response.status} - ${errorText}`
        );
      }

      const data: T = await response.json();
      console.log(
        "Fetched data entries:",
        Array.isArray(data) ? data.length : "single object"
      );

      return data;
    } catch (error) {
      console.error("Error fetching data from intervals.icu:", error);
      throw error;
    }
  }

  // Fetch recent activities using intervals.icu API directly
  static async getRecentActivities(
    limit: number = 5
  ): Promise<IntervalsActivity[]> {
    try {
      // Calculate oldest date (30 days ago) in ISO-8601 format as required by intervals.icu API
      const oldestDate = new Date();
      oldestDate.setDate(oldestDate.getDate() - 30);
      const oldest = oldestDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      // Use the utility function to make the request
      const activities = await this.makeAuthenticatedRequest<
        IntervalsActivity[]
      >("activities", {
        oldest: oldest,
        limit: limit.toString(),
      });

      return activities;
    } catch (error) {
      console.error("Error fetching activities from intervals.icu:", error);
      throw error;
    }
  }

  // Get single most recent activity
  static async getMostRecentActivity(): Promise<IntervalsActivity | null> {
    try {
      const activities = await this.getRecentActivities(1);
      return activities.length > 0 ? activities[0] : null;
    } catch (error) {
      console.error("Error fetching most recent activity:", error);
      throw error;
    }
  }

  // Fetch wellness data from intervals.icu API
  static async getWellnessData(
    startDate?: string,
    endDate?: string
  ): Promise<IntervalsWellnessData[]> {
    try {
      // Calculate date range (default to last 30 days if not provided)
      const endDateFormatted =
        endDate || new Date().toISOString().split("T")[0];
      const startDateCalculated =
        startDate ||
        (() => {
          const date = new Date();
          date.setDate(date.getDate() - 30);
          return date.toISOString().split("T")[0];
        })();

      // Use the utility function to make the request
      const wellnessData = await this.makeAuthenticatedRequest<
        IntervalsWellnessData[]
      >("wellness", {
        oldest: startDateCalculated,
        newest: endDateFormatted,
      });

      return wellnessData;
    } catch (error) {
      console.error("Error fetching wellness data from intervals.icu:", error);
      throw error;
    }
  }

  // Get most recent wellness data entry
  static async getMostRecentWellnessData(): Promise<IntervalsWellnessData | null> {
    try {
      const wellnessData = await this.getWellnessData();
      // Wellness data is usually sorted by date, get the most recent one
      return wellnessData.length > 0
        ? wellnessData[wellnessData.length - 1]
        : null;
    } catch (error) {
      console.error("Error fetching most recent wellness data:", error);
      throw error;
    }
  }

  // Test API credentials with athlete info endpoint
  static async testCredentials(): Promise<boolean> {
    try {
      // Use the utility function to test with athlete endpoint (simpler than activities)
      await this.makeAuthenticatedRequest("", {}); // Empty endpoint for athlete info
      return true;
    } catch (error) {
      console.error("Credentials test failed:", error);
      return false;
    }
  }

  // Format duration from seconds to readable string
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // Format distance to readable string
  static formatDistance(meters: number): string {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  }

  // Format date to readable string
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Get activity type emoji
  static getActivityEmoji(type: string): string {
    switch (type.toLowerCase()) {
      case "run":
      case "running":
        return "🏃";
      case "ride":
      case "cycling":
      case "bike":
        return "🚴";
      case "swim":
      case "swimming":
        return "🏊";
      case "walk":
      case "walking":
        return "🚶";
      case "workout":
      case "strength":
        return "💪";
      default:
        return "🏃";
    }
  }

  // Get activity type color
  static getActivityColor(type: string): string {
    switch (type.toLowerCase()) {
      case "run":
      case "running":
        return "#ef4444"; // red
      case "ride":
      case "cycling":
      case "bike":
        return "#3b82f6"; // blue
      case "swim":
      case "swimming":
        return "#06b6d4"; // cyan
      case "walk":
      case "walking":
        return "#10b981"; // green
      case "workout":
      case "strength":
        return "#8b5cf6"; // purple
      default:
        return "#6b7280"; // gray
    }
  }

  // Format wellness score (1-10 scale typically)
  static formatWellnessScore(score: number | undefined): string {
    if (score === undefined || score === null) return "N/A";
    return `${score}/10`;
  }

  // Format weight
  static formatWeight(weight: number | undefined): string {
    if (weight === undefined || weight === null) return "N/A";
    return `${weight.toFixed(1)} kg`;
  }

  // Format HRV (Heart Rate Variability)
  static formatHRV(hrv: number | undefined): string {
    if (hrv === undefined || hrv === null) return "N/A";
    return `${hrv.toFixed(1)} ms`;
  }

  // Format sleep time from minutes to hours and minutes
  static formatSleepTime(minutes: number | undefined): string {
    if (minutes === undefined || minutes === null) return "N/A";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  // Format training load values (CTL, ATL, TSB)
  static formatTrainingLoad(load: number | undefined): string {
    if (load === undefined || load === null) return "N/A";
    return load.toFixed(1);
  }

  // Get TSB (Training Stress Balance) status color
  static getTSBColor(tsb: number | undefined): string {
    if (tsb === undefined || tsb === null) return "#6b7280"; // gray
    if (tsb < -30) return "#ef4444"; // red - very fatigued
    if (tsb < -10) return "#f97316"; // orange - fatigued
    if (tsb < 10) return "#eab308"; // yellow - neutral
    if (tsb < 25) return "#22c55e"; // green - fresh
    return "#3b82f6"; // blue - very fresh
  }

  // Get TSB status text
  static getTSBStatus(tsb: number | undefined): string {
    if (tsb === undefined || tsb === null) return "Unknown";
    if (tsb < -30) return "Very Fatigued";
    if (tsb < -10) return "Fatigued";
    if (tsb < 10) return "Neutral";
    if (tsb < 25) return "Fresh";
    return "Very Fresh";
  }

  // Get wellness feeling emoji
  static getWellnessEmoji(feeling: number | undefined): string {
    if (feeling === undefined || feeling === null) return "😐";
    if (feeling <= 2) return "😫";
    if (feeling <= 4) return "😕";
    if (feeling <= 6) return "😐";
    if (feeling <= 8) return "🙂";
    return "😁";
  }

  /**
   * Calculate WHOOP-style readiness score from wellness data
   * @param wellnessData Array of daily wellness objects with hrv, resting_hr, and sleep_time
   * @returns Object with score, color, status, and detailed breakdown
   */
  static calculateReadiness(wellnessData: IntervalsWellnessData[]): {
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
  } {
    if (!wellnessData || wellnessData.length === 0) {
      return {
        score: 0,
        color: "red",
        status: "Very low readiness (rest or full recovery)",
        breakdown: {
          HRV_today: 0,
          HRV_base: 0,
          HRV_s: 0,
          RHR_today: 0,
          RHR_base: 0,
          RHR_s: 0,
          Sleep_today: 0,
          Sleep_target: 0,
          Sleep_s: 0,
          finalScore: 0,
        },
      };
    }

    // Use the most recent entry as the current day
    const today = wellnessData[wellnessData.length - 1];

    // Get today's values for HRV and RHR, but use last night's sleep
    const HRV_today = today.hrv || 0;
    const RHR_today = today.restingHR || 0;
    const Sleep_today = today.sleepSecs || 0; // Use last night's sleep data

    // Compute 30-day baselines from the last 30 entries (or all available)
    const recentData = wellnessData.slice(-30);

    // HRV baseline: average of last 30 non-zero hrv values
    const hrvValues = recentData
      .map((d) => d.hrv)
      .filter((v): v is number => v !== undefined && v !== null && v > 0);
    const HRV_base =
      hrvValues.length >= 3 // Need at least 3 data points for reliable baseline
        ? hrvValues.reduce((sum, val) => sum + val, 0) / hrvValues.length
        : 0; // No reliable baseline available

    // RHR baseline: average of last 30 non-zero restingHR values
    const rhrValues = recentData
      .map((d) => d.restingHR)
      .filter((v): v is number => v !== undefined && v !== null && v > 0);
    const RHR_base =
      rhrValues.length >= 3 // Need at least 3 data points for reliable baseline
        ? rhrValues.reduce((sum, val) => sum + val, 0) / rhrValues.length
        : 0; // No reliable baseline available

    // Sleep target: average of last 30 sleep values converted to hours
    const sleepValues = recentData
      .map((d) => {
        const sleepSecs = d.sleepSecs || 0;
        return sleepSecs / 3600; // Convert seconds to hours
      })
      .filter((v) => v > 0);
    const Sleep_target =
      sleepValues.length >= 3 // Need at least 3 data points for reliable baseline
        ? sleepValues.reduce((sum, val) => sum + val, 0) / sleepValues.length
        : 0; // No reliable baseline available

    // Normalize today's metrics with proper handling of missing/zero values
    // Allow scores to go above 100 but cap at reasonable limits to avoid extreme outliers
    const HRV_s =
      HRV_today > 0 && HRV_base > 0
        ? Math.min(150, Math.max(0, 100 * (HRV_today / HRV_base)))
        : 0; // If no HRV data, score is 0

    const RHR_s =
      RHR_today > 0 && RHR_base > 0
        ? Math.min(150, Math.max(0, 100 * (RHR_base / RHR_today)))
        : 0; // If no RHR data, score is 0

    const Sleep_s =
      Sleep_today > 0 && Sleep_target > 0
        ? Math.min(150, Math.max(0, 100 * (Sleep_today / 3600 / Sleep_target)))
        : 0; // If no sleep data, score is 0

    // Compute final readiness score with weighting based on available data
    const hasHRV = HRV_s > 0;
    const hasRHR = RHR_s > 0;
    const hasSleep = Sleep_s > 0;

    // Calculate weighted readiness based on available metrics
    // Apply diminishing returns for scores above 100 to make readiness more realistic
    let readiness = 0;
    let totalWeight = 0;

    if (hasHRV) {
      // Apply diminishing returns: scores above 100 contribute less
      const hrvContribution = HRV_s > 100 ? 100 + (HRV_s - 100) * 0.5 : HRV_s;
      readiness += 0.5 * hrvContribution;
      totalWeight += 0.5;
    }
    if (hasRHR) {
      // Apply diminishing returns: scores above 100 contribute less
      const rhrContribution = RHR_s > 100 ? 100 + (RHR_s - 100) * 0.5 : RHR_s;
      readiness += 0.25 * rhrContribution;
      totalWeight += 0.25;
    }
    if (hasSleep) {
      // Apply diminishing returns: scores above 100 contribute less
      const sleepContribution =
        Sleep_s > 100 ? 100 + (Sleep_s - 100) * 0.5 : Sleep_s;
      readiness += 0.25 * sleepContribution;
      totalWeight += 0.25;
    }

    // Normalize by actual weight (avoid division by zero)
    if (totalWeight > 0) {
      readiness = readiness / totalWeight;
      // Don't cap the final readiness - let it reflect true state
      // Values above 100 indicate supercompensation/peak readiness
    } else {
      readiness = 0; // No data available
    }

    // Determine color and status based on readiness zones
    let color: string;
    let status: string;

    if (totalWeight === 0) {
      color = "gray";
      status = "Insufficient data for readiness calculation";
    } else if (readiness >= 105) {
      color = "purple";
      status = "Supercompensated (peak/race ready)";
    } else if (readiness >= 95) {
      color = "green";
      status = "High readiness (train hard)";
    } else if (readiness >= 85) {
      color = "lightgreen";
      status = "Good readiness (moderate intensity)";
    } else if (readiness >= 70) {
      color = "yellow";
      status = "Moderate readiness (aerobic base)";
    } else if (readiness >= 50) {
      color = "orange";
      status = "Low readiness (light recovery)";
    } else {
      color = "red";
      status = "Very low readiness (rest day)";
    }

    // Debug logging to help troubleshoot
    console.log("Readiness Calculation Debug:", {
      HRV_today,
      HRV_base,
      HRV_s,
      RHR_today,
      RHR_base,
      RHR_s,
      Sleep_today: Sleep_today / 3600, // Convert to hours
      Sleep_target,
      Sleep_s,
      hasHRV,
      hasRHR,
      hasSleep,
      totalWeight,
      finalReadiness: readiness,
      dataPoints: wellnessData.length,
    });

    return {
      score: Math.round(readiness * 10) / 10, // Round to 1 decimal place
      color,
      status,
      breakdown: {
        HRV_today,
        HRV_base,
        HRV_s,
        RHR_today,
        RHR_base,
        RHR_s,
        Sleep_today: Sleep_today / 3600, // Convert back to hours for display
        Sleep_target,
        Sleep_s,
        finalScore: readiness,
      },
    };
  }

  /**
   * Calculate Form (CTL - ATL) from wellness data
   * @param wellnessData Array of daily wellness objects with ctl and atl values
   * @returns Object with form value, color, zone, and detailed interpretation
   */
  static calculateForm(wellnessData: IntervalsWellnessData[]): {
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
  } {
    if (!wellnessData || wellnessData.length === 0) {
      return {
        form: 0,
        color: "gray",
        zone: "No Data",
        meaning: "Insufficient data to calculate form",
        trend: [],
      };
    }

    // Get the most recent entry with CTL and ATL data
    const today = wellnessData[wellnessData.length - 1];
    const currentCTL = today.ctl || 0;
    const currentATL = today.atl || 0;
    const currentForm = currentCTL - currentATL;

    // Generate trend data for the last 30 days
    const trendData = wellnessData
      .slice(-30)
      .filter((d) => d.ctl !== undefined && d.atl !== undefined)
      .map((d) => ({
        date: d.id,
        form: (d.ctl || 0) - (d.atl || 0),
        ctl: d.ctl || 0,
        atl: d.atl || 0,
      }));

    // Determine zone and color based on form value
    let color: string;
    let zone: string;
    let meaning: string;

    if (currentForm > 5) {
      color = "yellow";
      zone = "Transition / Fresh";
      meaning =
        "Low load or taper period. Very fresh, but may lose fitness if sustained. Ideal before races.";
    } else if (currentForm >= 0) {
      color = "blue";
      zone = "Fresh";
      meaning = "Well-recovered. Ideal for high-intensity or key workouts.";
    } else if (currentForm >= -10) {
      color = "gray";
      zone = "Grey Zone";
      meaning =
        "Maintenance level. Balanced fatigue and fitness. Progress may stagnate.";
    } else if (currentForm >= -30) {
      color = "green";
      zone = "Optimal";
      meaning =
        "Productive training load. Good stress–recovery balance for long-term gains.";
    } else {
      color = "red";
      zone = "High Risk";
      meaning =
        "Excessive fatigue. Recovery or deload required. Risk of overreaching.";
    }

    // Debug logging
    console.log("Form Calculation Debug:", {
      currentCTL,
      currentATL,
      currentForm,
      zone,
      dataPoints: wellnessData.length,
    });

    return {
      form: Math.round(currentForm * 10) / 10, // Round to 1 decimal place
      color,
      zone,
      meaning,
      trend: trendData,
    };
  }

  /**
   * Get most recent form data
   */
  static async getMostRecentForm(): Promise<ReturnType<
    typeof IntervalsIcuService.calculateForm
  > | null> {
    try {
      const wellnessData = await this.getWellnessData();
      return wellnessData.length > 0 ? this.calculateForm(wellnessData) : null;
    } catch (error) {
      console.error("Error fetching most recent form data:", error);
      throw error;
    }
  }
}
