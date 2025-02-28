import React, { useState } from "react";
import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";
import Page3Exacto from "./pages/Page3Exacto";
import Page4 from "./pages/Page4";

import Page5 from "./pages/Page5";
const { Content } = Layout;

const App = () => {
  const [selectedKey, setSelectedKey] = useState("1");

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Navbar */}
        <Navbar selectedKey={selectedKey} onMenuClick={handleMenuClick} />

        {/* Contenido */}
        <Content style={{ marginTop: 64, padding: "20px", textAlign: "center" }}>
          <Routes>
            {/*Bronkebosch*/}
            <Route path="/" element={<Page1 />} />
            {/*Subset aproximado*/}
            <Route path="/page2" element={<Page2 />} />
            {/*knapsack aproximado*/}
            <Route path="/page3" element={<Page3 />} />
            {/*Subset exacto*/}
            <Route path="/page5" element={<Page5 />} />
            {/*Knapsack exacto*/}
            <Route path="/page3exacto" element={<Page3Exacto />} />
            {/*Clique aproximado*/}
            <Route path="/page4" element={<Page4 />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
