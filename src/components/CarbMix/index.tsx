"use client";
import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import styles from "./CarbMix.module.css";

/**
 * CarbMix tool
 *
 * Notes/assumption: to adjust water so the final total equals container size we approximate
 * solids volume by treating grams ~ ml (density ~1g/ml). If you prefer a different density,
 * I can update the calculation.
 */
// Base pouch (approx 30 g carbs)
const BASE_CARBS = 30; // g carbs per pouch
const BASE_MALT = 13.4; // g per pouch
const BASE_F60 = 16.6; // g per pouch
const BASE_LEMON = 5.7; // ml per pouch
const BASE_WATER = 28.7; // ml per pouch (adjusted)
function round(v: number) {
  return Math.round(v * 100) / 100;
}

const maurtenGuide = [
  { gels: 1, malt: "10g", f60: "15g", gulaman: "1.4g", water: "24g", vanilla: "2 drops", weight: "50.4g", carbs: "25g" },
  { gels: 3, malt: "30g", f60: "45g", gulaman: "4.2g", water: "72g", vanilla: "6 drops", weight: "151.2g", carbs: "75g" },
  { gels: 5, malt: "50g", f60: "75g", gulaman: "7g", water: "120g", vanilla: "10 drops", weight: "252g", carbs: "125g" },
  { gels: 10, malt: "100g", f60: "150g", gulaman: "14g", water: "240g", vanilla: "20 drops", weight: "504g", carbs: "250g" },
  { gels: 15, malt: "150g", f60: "225g", gulaman: "21g", water: "360g", vanilla: "30 drops", weight: "756g", carbs: "375g" },
  { gels: 20, malt: "200g", f60: "300g", gulaman: "28g", water: "480g", vanilla: "40 drops", weight: "1008g", carbs: "500g" },
];

const CarbMix: React.FC = () => {
  const [carbsInput, setCarbsInput] = useState<string>("30");
  // Sodium entered as a total for the whole mix (mg). We compute table salt (NaCl)
  // required to provide that sodium amount and show the salt amount in results.
  const [sodiumInput, setSodiumInput] = useState<string>("0");

  const results = useMemo(() => {
    const parsedCarbs = Number.parseFloat(carbsInput || "0") || 0;
    const parsedSodium = Number.parseFloat(sodiumInput || "0") || 0;
    const scale = parsedCarbs / BASE_CARBS;

    const malt = BASE_MALT * scale;
    const f60 = BASE_F60 * scale;
    const lemon = BASE_LEMON * scale;
    const waterBase = BASE_WATER * scale;

    // Approximate solids volume by treating grams ~= ml
    const solidsVolume = malt + f60; // ml approximation

    // Convert sodium (mg) to table salt (NaCl) amount.
    // Na atomic mass = 22.98976928, Cl = 35.453 -> Na fraction of NaCl by mass:
    const SODIUM_FRACTION = 22.98976928 / (22.98976928 + 35.453);
    // table salt mass in mg needed to supply the desired sodium
    const saltTotalMg = SODIUM_FRACTION > 0 ? parsedSodium / SODIUM_FRACTION : 0;

    // Convert salt (mg) to grams and ml approximation (assume 1 g ~= 1 ml)
    const saltG = saltTotalMg / 1000;
    const saltMl = saltG; // 1 g ~= 1 ml approximation

    // Total ml yield ~= solidsVolume + lemon + waterBase + saltMl
    const totalMl = solidsVolume + lemon + waterBase + saltMl;

    return {
      malt: round(malt),
      f60: round(f60),
      lemon: round(lemon),
      water: round(waterBase),
      // saltMg is the computed table salt (NaCl) in mg
      saltMg: Math.round(saltTotalMg * 100) / 100,
      // saltG is the computed table salt in grams (for UI display)
      saltG: Math.round(saltG * 100) / 100,
      // sodiumMg is the requested sodium input (mg)
      sodiumMg: Math.round(parsedSodium * 100) / 100,
      totalMl: round(totalMl),
      scale: round(scale),
    };
  }, [carbsInput, sodiumInput]);

  const breakdown = [
    { label: "Maltodextrin", value: `${results.malt} g` },
    { label: "F60 fructose", value: `${results.f60} g` },
    { label: "Lemon juice", value: `${results.lemon} ml` },
    { label: "Water", value: `${results.water} ml` },
    { label: "Sodium (requested)", value: `${results.sodiumMg ?? 0} mg` },
    { label: "Salt (table) required", value: `${results.saltG ?? 0} g` },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Fuel planning
        </p>
        <h2 className="text-2xl font-semibold text-primary">Carb Mix Measurement</h2>
      </div>

      <Tabs defaultValue="calculator" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Carb mix calculator</TabsTrigger>
          <TabsTrigger value="maurten">Maurten scaling guide</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Targets</CardTitle>
                <CardDescription>Base pouch = 30 g carbs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="desired-carbs">
                    Enter desired carbs (g)
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="desired-carbs"
                      type="number"
                      value={carbsInput}
                      onChange={(event) => setCarbsInput(event.target.value)}
                    />
                    <span className="text-sm text-muted-foreground">g carbs</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground" htmlFor="desired-sodium">
                    Optional: Desired sodium for whole mix (mg)
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="desired-sodium"
                      type="number"
                      min={0}
                      step={10}
                      value={sodiumInput}
                      onChange={(event) => setSodiumInput(event.target.value)}
                    />
                    <span className="text-sm text-muted-foreground">mg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Mix breakdown</CardTitle>
                <CardDescription>Quantities scale with your carb target.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {breakdown.map((item) => (
                  <div key={item.label} className={styles.tocLine}>
                    <div className={cn(styles.label, "text-sm font-semibold text-foreground")}>
                      {item.label}
                    </div>
                    <div className={styles.filler} />
                    <div className={cn(styles.value, "text-sm font-medium text-primary")}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Separator />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Measurement (approx)</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold text-primary">
              {results.totalMl} ml
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <span className="text-sm text-muted-foreground">Scale factor</span>
              <span className="text-xl font-semibold ">{results.scale}</span>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maurten">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scaling Guide</CardTitle>
              <CardDescription>Quick reference inspired by Maurten-style mixes</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="border-b border-border px-3 py-2 text-left font-semibold">Gels</th>
                    <th className="border-b border-border px-3 py-2 text-left font-semibold">Maltodextrin</th>
                    <th className="border-b border-border px-3 py-2 text-left font-semibold">F60</th>
                    <th className="border-b border-border px-3 py-2 text-left font-semibold">Gulaman</th>
                    <th className="border-b border-border px-3 py-2 text-left font-semibold">Water</th>
                    <th className="border-b border-border px-3 py-2 text-left font-semibold">Vanilla</th>
                    <th className="border-b border-border px-3 py-2 text-left font-semibold">Total Weight</th>
                    <th className="border-b border-border px-3 py-2 text-left font-semibold">Total Carbs</th>
                  </tr>
                </thead>
                <tbody>
                  {maurtenGuide.map((row) => (
                    <tr key={row.gels} className="odd:bg-muted/30">
                      <td className="border-b border-border px-3 py-2 font-medium">{row.gels}</td>
                      <td className="border-b border-border px-3 py-2">{row.malt}</td>
                      <td className="border-b border-border px-3 py-2">{row.f60}</td>
                      <td className="border-b border-border px-3 py-2">{row.gulaman}</td>
                      <td className="border-b border-border px-3 py-2">{row.water}</td>
                      <td className="border-b border-border px-3 py-2">{row.vanilla}</td>
                      <td className="border-b border-border px-3 py-2">{row.weight}</td>
                      <td className="border-b border-border px-3 py-2 font-semibold">{row.carbs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarbMix;
