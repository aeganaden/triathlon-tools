import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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

const CarbMix: React.FC = () => {
  const [carbs, setCarbs] = useState<number>(30);
  // Sodium entered as a total for the whole mix (mg). We compute table salt (NaCl)
  // required to provide that sodium amount and show the salt amount in results.
  const [sodiumMg, setSodiumMg] = useState<number>(0);

  const results = useMemo(() => {
    const scale = carbs / BASE_CARBS;

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
    const saltTotalMg = SODIUM_FRACTION > 0 ? sodiumMg / SODIUM_FRACTION : 0;

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
      sodiumMg: Math.round(sodiumMg * 100) / 100,
      totalMl: round(totalMl),
      scale: round(scale),
    };
  }, [carbs, sodiumMg]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-center">Carb Mix Measurement</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="carbs">Enter desired carbs (g):</Label>
              <Input
                id="carbs"
                type="number"
                min="5"
                step="5"
                value={carbs}
                onChange={(e) => setCarbs(parseInt(e.target.value) || 0)}
                placeholder="Enter carbs in grams"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sodium">
                Optional: Desired sodium for whole mix (mg)
              </Label>
              <Input
                id="sodium"
                type="number"
                min="0"
                step="10"
                value={sodiumMg}
                onChange={(e) => setSodiumMg(parseInt(e.target.value) || 0)}
                placeholder="Enter sodium in mg"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Base pouch = 30 g carbs. Results scale from that pouch.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className={styles.tocLine}>
                <div className={styles.label}>
                  <span className="font-semibold">Maltodextrin</span>
                </div>
                <div className={styles.filler} />
                <div className={styles.value}>
                  <span>{results.malt} g</span>
                </div>
              </div>

              <div className={styles.tocLine}>
                <div className={styles.label}>
                  <span className="font-semibold">F60 fructose</span>
                </div>
                <div className={styles.filler} />
                <div className={styles.value}>
                  <span>{results.f60} g</span>
                </div>
              </div>

              <div className={styles.tocLine}>
                <div className={styles.label}>
                  <span className="font-semibold">Lemon juice</span>
                </div>
                <div className={styles.filler} />
                <div className={styles.value}>
                  <span>{results.lemon} ml</span>
                </div>
              </div>

              <div className={styles.tocLine}>
                <div className={styles.label}>
                  <span className="font-semibold">Water</span>
                </div>
                <div className={styles.filler} />
                <div className={styles.value}>
                  <span>{results.water} ml</span>
                </div>
              </div>

              <div className={styles.tocLine}>
                <div className={styles.label}>
                  <span className="font-semibold">Sodium (requested)</span>
                </div>
                <div className={styles.filler} />
                <div className={styles.value}>
                  <span>{results.sodiumMg ?? 0} mg</span>
                </div>
              </div>

              <div className={styles.tocLine}>
                <div className={styles.label}>
                  <span className="font-semibold">Salt (table) required</span>
                </div>
                <div className={styles.filler} />
                <div className={styles.value}>
                  <span>{results.saltG ?? 0} g</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <span>Total Measurement (approx): </span>
            <span className="font-semibold">{results.totalMl}</span>
            <span className="text-lg ml-1">ml</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <span>Scale factor: </span>
            <span className="font-semibold">{results.scale}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbMix;
