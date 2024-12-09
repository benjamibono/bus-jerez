// src/components/Header/Header.js
import React from "react";
import "./Header.css";

const Header = () => (
  <header className="header">
    <div className="menu">
      <button>Menu</button>
    </div>
    <div className="logo">Autobuses Jerez</div>
    <div className="actions">
      <button>Iniciar Sesión</button>
      <button>Español</button>
    </div>
  </header>
);

export default Header;
