"use client";
import React from "react";
import { Row, Col } from "antd";
import NavHeader from "@/components/NavHeader";
import CarbMix from "@/components/CarbMix";

const Home = () => (
  <div className="App">
    <NavHeader />
    <main style={{ padding: 24 }}>
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={12} lg={6}>
            <CarbMix></CarbMix>
          </Col>
        </Row>
      </div>
    </main>
  </div>
);

export default Home;
