import React from "react";
import { NavLink } from "react-router-dom";
import {
  CalendarCheck,
  People,
  Github,
  Clipboard2Pulse,
  PersonBadge,
} from "react-bootstrap-icons"; // Importa los iconos

const Sidebar = () => {
  // Función para activar/desactivar la clase 'active' en NavLink
  const navLinkClass = ({ isActive }) => {
    return isActive ? "nav-link texcolor3 active" : "nav-link texcolor3";
  };

  return (
    <div className="sidebar-wrapper-react">
      {" "}
      {/* Usa la clase de tu CSS */}
      <div className="sidebar-react">
        {" "}
        {/* Contenedor interno con padding, etc. */}
        <div className="sidebar-header">
          <h3 className="texcolor3">Clínica Veterinaria</h3>
        </div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/citas" className={navLinkClass}>
              <CalendarCheck className="nav-icon" /> Citas
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/clientes" className={navLinkClass}>
              <People className="nav-icon" /> Clientes
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/mascotas" className={navLinkClass}>
              <Github className="nav-icon" /> Mascotas{" "}
              {/* Mantengo Github por si era intencional, sino cámbiarlo */}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/servicios" className={navLinkClass}>
              <Clipboard2Pulse className="nav-icon" /> Servicios
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/veterinarios" className={navLinkClass}>
              <PersonBadge className="nav-icon" /> Veterinarios
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
