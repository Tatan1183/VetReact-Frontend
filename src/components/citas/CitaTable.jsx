import React from "react";
import { PencilSquare, Trash } from "react-bootstrap-icons";

const CitaTable = ({ citas, onEdit, onDelete }) => {
  if (!citas || citas.length === 0) {
    return <p className="text-center mt-3">No hay citas registradas.</p>;
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleString("es-CO", {
      // Puedes ajustar el locale según necesidad
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="menu-busqueda-react">
          <tr>
            <th>ID</th>
            <th>Mascota</th>
            <th>Veterinario</th>
            <th>Servicio</th>
            <th>Fecha y Hora</th>
            <th>Estado</th>
            <th>Notas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td>{cita.id}</td>
              <td>{cita.mascotaNombre || "N/A"}</td>
              <td>
                {cita.veterinarioNombre
                  ? `${cita.veterinarioNombre} ${
                      cita.veterinarioApellido || ""
                    }`.trim()
                  : "N/A"}
              </td>
              <td>{cita.servicioNombre || "N/A"}</td>
              <td>{formatDateTime(cita.fechaHora)}</td>
              <td>{cita.estado || "N/A"}</td>
              <td>{cita.notas || "N/A"}</td>
              <td>
                <button
                  className="btn btn-sm btn-action btn-edit me-2"
                  onClick={() => onEdit(cita)}
                  title="Editar"
                >
                  <PencilSquare />
                </button>
                <button
                  className="btn btn-sm btn-action btn-delete"
                  onClick={() => onDelete(cita.id)}
                  title="Eliminar"
                >
                  <Trash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CitaTable;
