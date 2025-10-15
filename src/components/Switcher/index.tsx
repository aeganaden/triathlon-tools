"use client";
import React, { useState } from "react";
import { Radio, Row, Col } from "antd";
import CarbMix from "@/components/CarbMix/";
import PaceCalculator from "@/components/PaceCalculator/";

const options = [
  { label: "Carbs Calculator", value: "carb" },
  { label: "Pace Calculator", value: "pace" },
];

const Switcher: React.FC = () => {
  const [selected, setSelected] = useState<string>("carb");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Row justify="center">
        <Col sm={24} md={12} style={{ width: "100%" }}>
          <Radio.Group
            style={{ width: "100%" }}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            block
            options={options}
            optionType="button"
            buttonStyle="solid"
          />
        </Col>
      </Row>

      <Row justify="center">
        {selected === "carb" && (
          <Col xs={24} sm={20} md={16} lg={12}>
            <CarbMix />{" "}
          </Col>
        )}

        {selected === "pace" && (
          <Col xs={24} sm={20} md={16} lg={12}>
            <PaceCalculator />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Switcher;
