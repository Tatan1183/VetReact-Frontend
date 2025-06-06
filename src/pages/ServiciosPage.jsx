import React, { useState, useEffect, useCallback } from "react";
import vetSysApi from "../api/vetSysApi";
import ServicioTable from "../components/servicios/ServicioTable";
import ServicioForm from "../components/servicios/ServicioForm";
import { PlusCircle } from "react-bootstrap-icons";
import Swal from "sweetalert2";

const ServiciosPage = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [servicioActual, setServicioActual] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchServicios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vetSysApi.get("/servicios");
      setServicios(response.data);
    } catch (err) {
      setError(err.message || "Error al cargar los servicios");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo cargar los servicios.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  const handleOpenAddModal = () => {
    setServicioActual(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (servicio) => {
    setServicioActual(servicio);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setServicioActual(null);
  };

  const handleSaveServicio = async (servicioData) => {
    setLoading(true);
    try {
      if (isEditing && servicioActual) {
        await vetSysApi.put(`/servicios/${servicioActual.id}`, servicioData);
        Swal.fire(
          "¡Actualizado!",
          "El servicio ha sido actualizado.",
          "success"
        );
      } else {
        await vetSysApi.post("/servicios", servicioData);
        Swal.fire(
          "¡Guardado!",
          "El nuevo servicio ha sido registrado.",
          "success"
        );
      }
      fetchServicios();
      handleCloseModal();
    } catch (err) {
      console.error(
        "Error al guardar servicio:",
        err.response ? err.response.data : err.message
      );
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text:
          err.response?.data?.message ||
          err.message ||
          "No se pudo guardar el servicio.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteServicio = async (servicioId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, ¡bórralo!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await vetSysApi.delete(`/servicios/${servicioId}`);
          Swal.fire("¡Eliminado!", "El servicio ha sido eliminado.", "success");
          fetchServicios();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: err.message || "No se pudo eliminar el servicio.",
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  if (loading && servicios.length === 0) return <p>Cargando servicios...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div>
      <div className="content-controls-react">
        <h3>Gestión de Servicios</h3>
        <button className="btn btn-add" onClick={handleOpenAddModal}>
          <PlusCircle size={20} style={{ marginRight: "8px" }} />
          Agregar Servicio
        </button>
      </div>

      <ServicioTable
        servicios={servicios}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteServicio}
      />

      {showModal && (
        <ServicioForm
          show={showModal}
          handleClose={handleCloseModal}
          onSave={handleSaveServicio}
          servicioActual={servicioActual}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default ServiciosPage;
