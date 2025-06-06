import React from "react";
import { Link } from "react-router-dom"; //enlaces si se necesita
import { Envelope, Bell, PersonSquare } from "react-bootstrap-icons";
import logoVetSysPro from "../../assets/logo2.jpg";

const Topbar = () => {
  return (
    <div className="topbar-react">
      {" "}
      {/* Usa la clase de mi CSS */}
      <div className="divcueta">
        <img src={logoVetSysPro} alt="Logo VetSys Pro" className="cuenta2" />
        <div className="ps-2">
          <h5 className="texcolor3">VetSys Pro</h5>
        </div>
      </div>
      <div className="actions-menu">
        {" "}
        {/* Usa la clase de mi CSS */}
        <Link to="#" className="icon-link">
          <Envelope />
        </Link>
        <Link to="#" className="icon-link">
          <Bell />
        </Link>
        <Link to="#" className="icon-link">
          <PersonSquare />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
