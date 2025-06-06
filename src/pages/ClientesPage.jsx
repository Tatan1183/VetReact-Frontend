import React, { useState, useEffect, useCallback } from "react";
import vetSysApi from "../api/vetSysApi"; // Nuestra instancia de Axios
import ClienteTable from "../components/clientes/ClienteTable";
import ClienteForm from "../components/clientes/ClienteForm";
import { PlusCircle } from "react-bootstrap-icons"; // Icono para el botón
import Swal from "sweetalert2"; // Para notificaciones

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clienteActual, setClienteActual] = useState(null); // Para edición
  const [isEditing, setIsEditing] = useState(false);

  // Función para cargar clientes
  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vetSysApi.get("/clientes");
      setClientes(response.data);
    } catch (err) {
      setError(err.message || "Error al cargar los clientes");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo cargar los clientes.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  // Manejadores del Modal
  const handleOpenAddModal = () => {
    setClienteActual(null); // Nuevo cliente
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (cliente) => {
    setClienteActual(cliente);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setClienteActual(null); // Limpiar
  };

  // Guardar (Crear o Actualizar) Cliente
  const handleSaveCliente = async (clienteData) => {
    setLoading(true); // Podría tener un loading específico para el guardado
    try {
      if (isEditing && clienteActual) {
        // Actualizar cliente
        await vetSysApi.put(`/clientes/${clienteActual.id}`, clienteData);
        Swal.fire(
          "¡Actualizado!",
          "El cliente ha sido actualizado.",
          "success"
        );
      } else {
        // Crear nuevo cliente
        await vetSysApi.post("/clientes", clienteData);
        Swal.fire(
          "¡Guardado!",
          "El nuevo cliente ha sido registrado.",
          "success"
        );
      }
      fetchClientes(); // Recargar la lista de clientes
      handleCloseModal();
    } catch (err) {
      console.error(
        "Error al guardar cliente:",
        err.response ? err.response.data : err.message
      );
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text:
          err.response?.data?.message ||
          err.message ||
          "No se pudo guardar el cliente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar Cliente
  const handleDeleteCliente = async (clienteId) => {
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
          await vetSysApi.delete(`/clientes/${clienteId}`);
          Swal.fire("¡Eliminado!", "El cliente ha sido eliminado.", "success");
          fetchClientes(); // Recargar la lista
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: err.message || "No se pudo eliminar el cliente.",
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  if (loading && clientes.length === 0) return <p>Cargando clientes...</p>; // Mostrar solo si no hay datos previos
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div>
      <div className="content-controls-react">
        <h3>Gestión de Clientes</h3>
        <button className="btn btn-add" onClick={handleOpenAddModal}>
          <PlusCircle size={20} style={{ marginRight: "8px" }} />
          Agregar Cliente
        </button>
      </div>

      <ClienteTable
        clientes={clientes}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteCliente}
      />

      {showModal && (
        <ClienteForm
          show={showModal}
          handleClose={handleCloseModal}
          onSave={handleSaveCliente}
          clienteActual={clienteActual}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default ClientesPage;
