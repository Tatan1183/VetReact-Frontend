import React, { useState, useEffect, useCallback } from "react";
import vetSysApi from "../api/vetSysApi";
import VeterinarioTable from "../components/veterinarios/VeterinarioTable";
import VeterinarioForm from "../components/veterinarios/VeterinarioForm";
import { PlusCircle } from "react-bootstrap-icons";
import Swal from "sweetalert2";

const VeterinariosPage = () => {
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [veterinarioActual, setVeterinarioActual] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchVeterinarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vetSysApi.get("/veterinarios");
      setVeterinarios(response.data);
    } catch (err) {
      setError(err.message || "Error al cargar los veterinarios");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo cargar los veterinarios.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVeterinarios();
  }, [fetchVeterinarios]);

  const handleOpenAddModal = () => {
    setVeterinarioActual(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (veterinario) => {
    setVeterinarioActual(veterinario);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setVeterinarioActual(null);
  };

  // Guardar (Crear o Actualizar) Veterinario
  const handleSaveVeterinario = async (veterinarioData, imagenFile) => {
    setLoading(true); // Podrías tener un loading específico para el guardado
    let datosFinalesVeterinario = { ...veterinarioData };

    try {
      // 1. Si hay un archivo de imagen, subirlo primero
      if (imagenFile) {
        const formData = new FormData();
        formData.append("file", imagenFile);
        // No necesitas 'Content-Type': 'multipart/form-data' aquí, Axios lo maneja con FormData
        const uploadResponse = await vetSysApi.post(
          "/veterinarios/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        datosFinalesVeterinario.imagen = uploadResponse.data; // El backend devuelve el nombre del archivo
      } else if (
        isEditing &&
        veterinarioActual &&
        !veterinarioData.imagen &&
        veterinarioActual.imagen
      ) {
        // Si estamos editando, no se seleccionó nueva imagen Y no se borró la existente en el form,
        // Y el veterinario actual tiene una imagen, conservarla.
        // Esto es por si el form envía `imagen: undefined` o `null` y queremos mantener la vieja.
        datosFinalesVeterinario.imagen = veterinarioActual.imagen;
      }

      if (isEditing && veterinarioActual) {
        // Actualizar veterinario
        await vetSysApi.put(
          `/veterinarios/${veterinarioActual.id}`,
          datosFinalesVeterinario
        );
        Swal.fire(
          "¡Actualizado!",
          "El veterinario ha sido actualizado.",
          "success"
        );
      } else {
        // Crear nuevo veterinario
        await vetSysApi.post("/veterinarios", datosFinalesVeterinario);
        Swal.fire(
          "¡Guardado!",
          "El nuevo veterinario ha sido registrado.",
          "success"
        );
      }
      fetchVeterinarios();
      handleCloseModal();
    } catch (err) {
      console.error(
        "Error al guardar veterinario:",
        err.response ? err.response.data : err.message
      );
      let errorMessage = "No se pudo guardar el veterinario.";
      if (err.response) {
        // Si el error es por el upload o por el guardado, intentar ser más específico
        if (
          typeof err.response.data === "string" &&
          err.response.data.startsWith("Error al subir la imagen")
        ) {
          errorMessage = err.response.data;
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
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
      setLoading(false);
    }
  };

  const handleDeleteVeterinario = async (veterinarioId) => {
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
          await vetSysApi.delete(`/veterinarios/${veterinarioId}`);
          Swal.fire(
            "¡Eliminado!",
            "El veterinario ha sido eliminado.",
            "success"
          );
          fetchVeterinarios();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: err.message || "No se pudo eliminar el veterinario.",
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  if (loading && veterinarios.length === 0)
    return <p>Cargando veterinarios...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div>
      <div className="content-controls-react">
        <h3>Gestión de Veterinarios</h3>
        <button className="btn btn-add" onClick={handleOpenAddModal}>
          <PlusCircle size={20} style={{ marginRight: "8px" }} />
          Agregar Veterinario
        </button>
      </div>

      <VeterinarioTable
        veterinarios={veterinarios}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteVeterinario}
        apiBaseUrl={import.meta.env.VITE_API_BASE_URL.replace("/api", "")} // Para construir URL de imagen
      />

      {showModal && (
        <VeterinarioForm
          show={showModal}
          handleClose={handleCloseModal}
          onSave={handleSaveVeterinario}
          veterinarioActual={veterinarioActual}
          isEditing={isEditing}
          apiBaseUrl={import.meta.env.VITE_API_BASE_URL.replace("/api", "")}
        />
      )}
    </div>
  );
};

export default VeterinariosPage;
