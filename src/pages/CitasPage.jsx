import React, { useState, useEffect, useCallback } from "react";
import vetSysApi from "../api/vetSysApi";
import CitaTable from "../components/citas/CitaTable";
import CitaForm from "../components/citas/CitaForm";
import { PlusCircle } from "react-bootstrap-icons";
import Swal from "sweetalert2";

const CitasPage = () => {
  const [citas, setCitas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [servicios, setServicios] = useState([]);

  const [loading, setLoading] = useState({
    citas: true,
    mascotas: true,
    veterinarios: true,
    servicios: true,
  });
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [citaActual, setCitaActual] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = useCallback(async (endpoint, setData, loadingKey) => {
    setLoading((prev) => ({ ...prev, [loadingKey]: true }));
    try {
      const response = await vetSysApi.get(endpoint);
      setData(response.data);
      if (loadingKey === "citas") setError(null); // Limpiar error principal solo al cargar citas
    } catch (err) {
      const errorMessage = `Error al cargar ${loadingKey}: ${
        err.message || "Desconocido"
      }`;
      console.error(errorMessage, err);
      if (loadingKey === "citas") setError(errorMessage); // Mostrar error si falla la carga principal
      Swal.fire({
        icon: "error",
        title: `Error ${loadingKey}`,
        text: err.message || `No se pudo cargar ${loadingKey}.`,
      });
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  }, []);

  useEffect(() => {
    fetchData("/citas", setCitas, "citas");
    fetchData("/mascotas", setMascotas, "mascotas");
    fetchData("/veterinarios", setVeterinarios, "veterinarios");
    fetchData("/servicios", setServicios, "servicios");
  }, [fetchData]);

  const handleOpenAddModal = () => {
    setCitaActual(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (cita) => {
    setCitaActual(cita);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCitaActual(null);
  };

  const handleSaveCita = async (citaData) => {
    // setLoading(prev => ({ ...prev, citas: true })); // Podría indicar carga
    try {
      if (isEditing && citaActual) {
        await vetSysApi.put(`/citas/${citaActual.id}`, citaData);
        Swal.fire("¡Actualizada!", "La cita ha sido actualizada.", "success");
      } else {
        await vetSysApi.post("/citas", citaData);
        Swal.fire("¡Guardada!", "La nueva cita ha sido registrada.", "success");
      }
      fetchData("/citas", setCitas, "citas"); // Recargar solo las citas
      handleCloseModal();
    } catch (err) {
      console.error(
        "Error al guardar cita:",
        err.response ? err.response.data : err.message
      );
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text:
          err.response?.data?.message ||
          err.message ||
          "No se pudo guardar la cita.",
      });
    } finally {
      // setLoading(prev => ({ ...prev, citas: false }));
    }
  };

  const handleDeleteCita = async (citaId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, ¡bórrala!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // setLoading(prev => ({ ...prev, citas: true }));
        try {
          await vetSysApi.delete(`/citas/${citaId}`);
          Swal.fire("¡Eliminada!", "La cita ha sido eliminada.", "success");
          fetchData("/citas", setCitas, "citas");
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: err.message || "No se pudo eliminar la cita.",
          });
        } finally {
          // setLoading(prev => ({ ...prev, citas: false }));
        }
      }
    });
  };

  if (loading.citas && citas.length === 0) return <p>Cargando citas...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <div className="content-controls-react">
        <h3>Gestión de Citas</h3>
        <button className="btn btn-add" onClick={handleOpenAddModal}>
          <PlusCircle size={20} style={{ marginRight: "8px" }} />
          Agregar Cita
        </button>
      </div>

      <CitaTable
        citas={citas}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteCita}
      />

      {showModal && (
        <CitaForm
          show={showModal}
          handleClose={handleCloseModal}
          onSave={handleSaveCita}
          citaActual={citaActual}
          isEditing={isEditing}
          mascotas={mascotas}
          veterinarios={veterinarios}
          servicios={servicios}
          loadingData={{
            // Pasar estados de carga para los selects
            mascotas: loading.mascotas,
            veterinarios: loading.veterinarios,
            servicios: loading.servicios,
          }}
        />
      )}
    </div>
  );
};

export default CitasPage;
