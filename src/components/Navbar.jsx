import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const Navbar = ({ selectedKey, onMenuClick }) => {
  return (
    <Menu
      mode="horizontal"
      selectedKeys={[selectedKey]}
      onClick={onMenuClick}
      style={{ display: "flex", justifyContent: "center", position: "fixed", top: 0, width: "100%", zIndex: 1 }}
    >
      <Menu.Item key="1">
        <Link to="/">Clique exacto</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/page4">Clique aproximado</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/page5">Subset Exacto</Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link to="/page2">Subset aproximado</Link>
      </Menu.Item>
      <Menu.Item key="5">
        <Link to="/page3exacto">Knapsack exacto</Link>
      </Menu.Item>
      <Menu.Item key="6">
        <Link to="/page3">Knapsack aproximado</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
