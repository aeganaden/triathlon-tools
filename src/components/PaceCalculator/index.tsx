"use client";
import React, { useState, useMemo } from "react";
import { Card, InputNumber, Typography, Space } from "antd";

const { Title, Text } = Typography;

const PaceCalculator: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState<number>(5);
  const [timeMin, setTimeMin] = useState<number>(25);

  const pace = useMemo(() => {
    if (!distanceKm || distanceKm <= 0) return 0;
    return Math.round((timeMin / distanceKm) * 100) / 100;
  }, [distanceKm, timeMin]);

  return (
    <div>
      <Title level={5} style={{ textAlign: "center" }}>
        Pace Calculator
      </Title>

      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical">
          <Text>Distance (km)</Text>
          <InputNumber
            min={0.1}
            step={0.1}
            value={distanceKm}
            onChange={(v) => setDistanceKm(typeof v === "number" ? v : 0)}
          />
          <Text>Time (minutes)</Text>
          <InputNumber
            min={1}
            step={1}
            value={timeMin}
            onChange={(v) => setTimeMin(typeof v === "number" ? v : 0)}
          />
        </Space>
      </Card>

      <Card>
        <Text strong>Pace:</Text> <Text>{pace} min/km</Text>
      </Card>
    </div>
  );
};

export default PaceCalculator;
