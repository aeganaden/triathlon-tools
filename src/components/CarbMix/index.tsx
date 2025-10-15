import React, { useMemo, useState } from "react";
import { Card, Typography, InputNumber, Space, Divider } from "antd";
import styles from "./CarbMix.module.css";

const { Title, Text } = Typography;

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
    <div>
      <Title level={5} style={{ textAlign: "center" }}>
        Carb Mix Measurement
      </Title>

      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>Enter desired carbs (g):</Text>
          <InputNumber
            min={5}
            step={5}
            value={carbs}
            onChange={(v) => setCarbs(typeof v === "number" ? v : 0)}
            addonAfter="g carbs"
          />
          <Text>Optional: Desired sodium for whole mix (mg)</Text>
          <InputNumber
            min={0}
            step={10}
            value={sodiumMg}
            onChange={(v) => setSodiumMg(typeof v === "number" ? v : 0)}
            addonAfter="mg"
          />
          <Text type="secondary">
            Base pouch = 30 g carbs. Results scale from that pouch.
          </Text>
        </Space>
      </Card>

      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div className={styles.tocLine}>
            <div className={styles.label}>
              <Text strong>Maltodextrin</Text>
            </div>
            <div className={styles.filler} />
            <div className={styles.value}>
              <Text>{results.malt} g</Text>
            </div>
          </div>

          <div className={styles.tocLine}>
            <div className={styles.label}>
              <Text strong>F60 fructose</Text>
            </div>
            <div className={styles.filler} />
            <div className={styles.value}>
              <Text>{results.f60} g</Text>
            </div>
          </div>

          <div className={styles.tocLine}>
            <div className={styles.label}>
              <Text strong>Lemon juice</Text>
            </div>
            <div className={styles.filler} />
            <div className={styles.value}>
              <Text>{results.lemon} ml</Text>
            </div>
          </div>

          <div className={styles.tocLine}>
            <div className={styles.label}>
              <Text strong>Water</Text>
            </div>
            <div className={styles.filler} />
            <div className={styles.value}>
              <Text>{results.water} ml</Text>
            </div>
          </div>

          <div className={styles.tocLine}>
            <div className={styles.label}>
              <Text strong>Sodium (requested)</Text>
            </div>
            <div className={styles.filler} />
            <div className={styles.value}>
              <Text>{results.sodiumMg ?? 0} mg</Text>
            </div>
          </div>

          <div className={styles.tocLine}>
            <div className={styles.label}>
              <Text strong>Salt (table) required</Text>
            </div>
            <div className={styles.filler} />
            <div className={styles.value}>
              <Text>{results.saltG ?? 0} g</Text>
            </div>
          </div>
        </div>
      </Card>

      <Divider />

      <Card title="Total Measurement (approx)">
        <Text strong>{results.totalMl}</Text> <Text>ml</Text>
      </Card>

      <Divider />

      <Card>
        <Text type="secondary">Scale factor:</Text>{" "}
        <Text strong>{results.scale}</Text>
      </Card>
    </div>
  );
};

export default CarbMix;
