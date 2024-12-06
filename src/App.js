import React, { useState } from "react";
import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2"
import Page3 from "./pages/Page3";
import Page4 from "./pages/Page4";
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
            <Route path="/" element={<Page1 />} />
            <Route path="/page2" element={<Page2 />} />
            <Route path="/page3" element={<Page3 />} />
            <Route path="/page4" element={<Page4 />} /> 
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
