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
        <Link to="/">Opción 1</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/page2">Opción 2</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/page3">Opción 3</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
