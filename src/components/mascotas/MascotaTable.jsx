import React from "react";
import { PencilSquare, Trash, Github } from "react-bootstrap-icons"; // Github como placeholder de mascota

const MascotaTable = ({ mascotas, onEdit, onDelete, apiBaseUrl }) => {
  if (!mascotas || mascotas.length === 0) {
    return <p className="text-center mt-3">No hay mascotas registradas.</p>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    // Ajustar por la zona horaria para evitar que se muestre el día anterior
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString();
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="menu-busqueda-react">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Especie</th>
            <th>Raza</th>
            <th>F. Nacimiento</th>
            <th>Dueño</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mascotas.map((mascota) => (
            <tr key={mascota.id}>
              <td>{mascota.id}</td>
              <td>{mascota.nombre}</td>
              <td>{mascota.especie}</td>
              <td>{mascota.raza || "N/A"}</td>
              <td>{formatDate(mascota.fechaNacimiento)}</td>
              <td>
                {mascota.clienteNombre
                  ? `${mascota.clienteNombre} ${
                      mascota.clienteApellido || ""
                    }`.trim()
                  : "N/A"}
              </td>
              <td>
                {mascota.imagen ? (
                  <img
                    src={`${apiBaseUrl}/images/${mascota.imagen}`}
                    alt={mascota.nombre}
                    className="img-thumbnail-react"
                    onError={(e) => {
                      e.target.style.display = "none"; /* Ocultar si error */
                    }}
                  />
                ) : (
                  <Github size={40} title="Sin imagen" /> // Placeholder
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-action btn-edit me-2"
                  onClick={() => onEdit(mascota)}
                  title="Editar"
                >
                  <PencilSquare />
                </button>
                <button
                  className="btn btn-sm btn-action btn-delete"
                  onClick={() => onDelete(mascota.id)}
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

export default MascotaTable;
