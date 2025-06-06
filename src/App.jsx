import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Footer from "./components/layout/Footer";

import CitasPage from "./pages/CitasPage";
import ClientesPage from "./pages/ClientesPage";
import MascotasPage from "./pages/MascotasPage";
import ServiciosPage from "./pages/ServiciosPage";
import VeterinariosPage from "./pages/VeterinariosPage";

function App() {
  return (
    <Router>
      <div className="d-flex" style={{ height: "100vh" }}>
        {" "}
        {/* Contenedor Flex principal */}
        <Sidebar />
        <div className="main-content-wrapper-react d-flex flex-column">
          {" "}
          {/* Contenedor para el contenido y topbar/footer */}
          <Topbar />
          <main className="table-area-react flex-grow-1 p-3">
            {" "}
            {/* Área principal que crece */}
            <Routes>
              <Route path="/" element={<Navigate replace to="/citas" />} />
              <Route path="/citas" element={<CitasPage />} />
              <Route path="/clientes" element={<ClientesPage />} />
              <Route path="/mascotas" element={<MascotasPage />} />
              <Route path="/servicios" element={<ServiciosPage />} />
              <Route path="/veterinarios" element={<VeterinariosPage />} />
              {/*  se Puede añadir una ruta para 404 Not Found si se desea */}
              {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
