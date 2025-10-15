"use client";
import React from "react";
import { Row, Col } from "antd";
import NavHeader from "@/components/NavHeader";
import Switcher from "@/components/Switcher";

const Home = () => (
  <div className="App">
    <NavHeader />
    <main style={{ padding: 24 }}>
      <div className="container">
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12}>
            <Switcher />
          </Col>
        </Row>
      </div>
    </main>
  </div>
);

export default Home;
