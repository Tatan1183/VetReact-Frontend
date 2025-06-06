import React, { useState, useEffect, useCallback } from "react";
import vetSysApi from "../api/vetSysApi";
import MascotaTable from "../components/mascotas/MascotaTable";
import MascotaForm from "../components/mascotas/MascotaForm";
import { PlusCircle } from "react-bootstrap-icons";
import Swal from "sweetalert2";

const MascotasPage = () => {
  const [mascotas, setMascotas] = useState([]);
  const [clientes, setClientes] = useState([]); // Para el select de dueños
  const [loading, setLoading] = useState(true);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mascotaActual, setMascotaActual] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

  const fetchMascotas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vetSysApi.get("/mascotas");
      setMascotas(response.data);
    } catch (err) {
      setError(err.message || "Error al cargar las mascotas");
      Swal.fire({
        icon: "error",
        title: "Error Mascotas",
        text: err.message || "No se pudo cargar las mascotas.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClientes = useCallback(async () => {
    setLoadingClientes(true);
    try {
      const response = await vetSysApi.get("/clientes");
      setClientes(response.data);
    } catch (err) {
      console.error("Error al cargar clientes para el formulario:", err);
      // Podrías mostrar un error aquí también si es crítico para el form
    } finally {
      setLoadingClientes(false);
    }
  }, []);

  useEffect(() => {
    fetchMascotas();
    fetchClientes(); // Cargar clientes al montar
  }, [fetchMascotas, fetchClientes]);

  const handleOpenAddModal = () => {
    setMascotaActual(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (mascota) => {
    setMascotaActual(mascota);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMascotaActual(null);
  };

  const handleSaveMascota = async (mascotaData, imagenFile) => {
    // setLoading(true); // Consider un loading específico si es largo
    let datosFinalesMascota = { ...mascotaData };

    try {
      if (imagenFile) {
        const formData = new FormData();
        formData.append("file", imagenFile);
        const uploadResponse = await vetSysApi.post(
          "/mascotas/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        datosFinalesMascota.imagen = uploadResponse.data;
      } else if (
        isEditing &&
        mascotaActual &&
        !mascotaData.imagen &&
        mascotaActual.imagen
      ) {
        datosFinalesMascota.imagen = mascotaActual.imagen;
      }

      if (isEditing && mascotaActual) {
        await vetSysApi.put(
          `/mascotas/${mascotaActual.id}`,
          datosFinalesMascota
        );
        Swal.fire(
          "¡Actualizada!",
          "La mascota ha sido actualizada.",
          "success"
        );
      } else {
        await vetSysApi.post("/mascotas", datosFinalesMascota);
        Swal.fire(
          "¡Guardada!",
          "La nueva mascota ha sido registrada.",
          "success"
        );
      }
      fetchMascotas();
      handleCloseModal();
    } catch (err) {
      console.error(
        "Error al guardar mascota:",
        err.response ? err.response.data : err.message
      );
      let errorMessage = "No se pudo guardar la mascota.";
      // Similar al manejo de errores de VeterinariosPage
      if (err.response) {
        if (
          typeof err.response.data === "string" &&
          err.response.data.startsWith("Error al subir la imagen")
        ) {
          errorMessage = err.response.data;
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.error && err.response.data?.message) {
          // Spring Boot a veces devuelve esto
          errorMessage = `${err.response.data.error}: ${err.response.data.message}`;
        } else if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        }
      } else {
        errorMessage = err.message;
      }
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: errorMessage,
      });
    } finally {
      // setLoading(false);
    }
  };

  const handleDeleteMascota = async (mascotaId) => {
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
        // setLoading(true);
        try {
          await vetSysApi.delete(`/mascotas/${mascotaId}`);
          Swal.fire("¡Eliminada!", "La mascota ha sido eliminada.", "success");
          fetchMascotas();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: err.message || "No se pudo eliminar la mascota.",
          });
        } finally {
          // setLoading(false);
        }
      }
    });
  };

  if (loading && mascotas.length === 0) return <p>Cargando mascotas...</p>;
  if (error) return <p className="text-danger">Error Mascotas: {error}</p>;

  return (
    <div>
      <div className="content-controls-react">
        <h3>Gestión de Mascotas</h3>
        <button className="btn btn-add" onClick={handleOpenAddModal}>
          <PlusCircle size={20} style={{ marginRight: "8px" }} />
          Agregar Mascota
        </button>
      </div>

      <MascotaTable
        mascotas={mascotas}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteMascota}
        apiBaseUrl={apiBaseUrl}
      />

      {showModal && (
        <MascotaForm
          show={showModal}
          handleClose={handleCloseModal}
          onSave={handleSaveMascota}
          mascotaActual={mascotaActual}
          isEditing={isEditing}
          clientes={clientes} // Pasar la lista de clientes al formulario
          loadingClientes={loadingClientes}
          apiBaseUrl={apiBaseUrl}
        />
      )}
    </div>
  );
};

export default MascotasPage;
