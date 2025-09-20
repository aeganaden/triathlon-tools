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
  const [saltMgPerPouch, setSaltMgPerPouch] = useState<number>(0);

  const results = useMemo(() => {
    const scale = carbs / BASE_CARBS;

    const malt = BASE_MALT * scale;
    const f60 = BASE_F60 * scale;
    const lemon = BASE_LEMON * scale;
    const waterBase = BASE_WATER * scale;

    // Approximate solids volume by treating grams ~= ml
    const solidsVolume = malt + f60; // ml approximation

    const saltMg = saltMgPerPouch * scale;

    // Convert salt (mg) to ml approximation (assume 1 g ~= 1 ml)
    const saltMl = saltMg / 1000;

    // Total ml yield ~= solidsVolume + lemon + waterBase + saltMl
    const totalMl = solidsVolume + lemon + waterBase + saltMl;

    return {
      malt: round(malt),
      f60: round(f60),
      lemon: round(lemon),
      water: round(waterBase),
      saltMg: Math.round(saltMg * 100) / 100,
      totalMl: round(totalMl),
      scale: round(scale),
    };
  }, [carbs, saltMgPerPouch]);

  return (
    <div>
      <Title level={5}>Carb Mix Measurement</Title>

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
          <Text>Optional: Salt per pouch (mg)</Text>
          <InputNumber
            min={0}
            step={10}
            value={saltMgPerPouch}
            onChange={(v) => setSaltMgPerPouch(typeof v === "number" ? v : 0)}
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
              <Text strong>Salt (table)</Text>
            </div>
            <div className={styles.filler} />
            <div className={styles.value}>
              <Text>{results.saltMg ?? 0} mg</Text>
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
