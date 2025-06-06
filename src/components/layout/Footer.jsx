import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Whatsapp,
  Linkedin,
} from "react-bootstrap-icons";

const Footer = () => {
  return (
    <footer className="footer-react">
      {" "}
      {/* Usa la clase de tu CSS */}
      <p>App De Aplicaciones Empresariales. Desarrollado por Estudiantes UTS</p>
      <div className="social-icons">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          title="Facebook"
        >
          <Facebook />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          title="Instagram"
        >
          <Instagram />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          title="Twitter X"
        >
          <Twitter />
        </a>
        <a
          href="https://wa.me/TUNUMERODEWHATSAPP"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          title="WhatsApp"
        >
          <Whatsapp />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          title="LinkedIn"
        >
          <Linkedin />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
