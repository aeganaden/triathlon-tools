"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Connections = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [athleteId, setAthleteId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [savedApiKey, setSavedApiKey] = useState("");
  const [savedAthleteId, setSavedAthleteId] = useState("");

  // Check for saved credentials on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem("intervals_api_key");
    const savedId = localStorage.getItem("intervals_athlete_id");

    if (savedKey && savedId) {
      setIsConnected(true);
      setSavedApiKey(savedKey);
      setSavedAthleteId(savedId);
    }
  }, []);

  const handleConnect = () => {
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("intervals_api_key", apiKey);
    localStorage.setItem("intervals_athlete_id", athleteId);

    // Update connection state
    setIsConnected(true);
    setSavedApiKey(apiKey);
    setSavedAthleteId(athleteId);

    // Close dialog and reset form
    setIsDialogOpen(false);
    setApiKey("");
    setAthleteId("");
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setApiKey("");
    setAthleteId("");
  };

  const handleDisconnect = () => {
    // Remove from localStorage
    localStorage.removeItem("intervals_api_key");
    localStorage.removeItem("intervals_athlete_id");

    // Update connection state
    setIsConnected(false);
    setSavedApiKey("");
    setSavedAthleteId("");
  };
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Connections</h1>

            {/* Content area for connections */}
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>App Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                          I
                        </div>
                        <div>
                          <h3 className="font-medium">intervals.icu</h3>
                          <p className="text-sm text-muted-foreground">
                            Sync your activities and training data
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleConnect}
                        disabled={isConnected}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          isConnected
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        {isConnected ? "Connected" : "Connect"}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connection Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {isConnected ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                            ✓
                          </div>
                          <div>
                            <h3 className="font-medium">intervals.icu</h3>
                            <p className="text-sm text-muted-foreground">
                              Connected • Athlete ID: {savedAthleteId}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              API Key:{" "}
                              {"*".repeat(Math.min(savedApiKey.length, 16))}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-green-600 font-medium mr-2">
                            Active
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDisconnect}
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No active connections yet. Connect your fitness apps
                        above to sync your training data.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Connection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden flex flex-col">
          <DialogHeader className="sticky top-0 z-10 bg-background border-b pb-4">
            <DialogTitle>Connect to intervals.icu</DialogTitle>
            <DialogDescription>
              Enter your API key and Athlete ID to connect your intervals.icu
              account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pt-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="api-key" className="text-right">
                  API Key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter your API key"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="athlete-id" className="text-right">
                  Athlete ID
                </Label>
                <Input
                  id="athlete-id"
                  value={athleteId}
                  onChange={(e) => setAthleteId(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter your Athlete ID"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 z-10 bg-background border-t pt-4">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={handleSave} disabled={!apiKey || !athleteId}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Connections;
