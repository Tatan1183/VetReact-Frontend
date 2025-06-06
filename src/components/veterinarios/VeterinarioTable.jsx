import React from "react";
import { PencilSquare, Trash, PersonBoundingBox } from "react-bootstrap-icons"; // Icono para placeholder

const VeterinarioTable = ({ veterinarios, onEdit, onDelete, apiBaseUrl }) => {
  if (!veterinarios || veterinarios.length === 0) {
    return <p className="text-center mt-3">No hay veterinarios registrados.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="menu-busqueda-react">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Especialidad</th>
            <th>Email</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {veterinarios.map((veterinario) => (
            <tr key={veterinario.id}>
              <td>{veterinario.id}</td>
              <td>{veterinario.nombre}</td>
              <td>{veterinario.apellido}</td>
              <td>{veterinario.especialidad}</td>
              <td>{veterinario.email}</td>
              <td>
                {veterinario.imagen ? (
                  <img
                    src={`${apiBaseUrl}/images/${veterinario.imagen}`} // Asume que las imágenes se sirven desde /images/ en la raíz del backend
                    alt={`${veterinario.nombre} ${veterinario.apellido}`}
                    className="img-thumbnail-react" // Tu clase CSS para la miniatura
                    onError={(e) => {
                      e.target.style.display =
                        "none"; /* Opcional: ocultar si hay error */
                    }}
                  />
                ) : (
                  <PersonBoundingBox size={40} title="Sin imagen" /> // Placeholder
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-action btn-edit me-2"
                  onClick={() => onEdit(veterinario)}
                  title="Editar"
                >
                  <PencilSquare />
                </button>
                <button
                  className="btn btn-sm btn-action btn-delete"
                  onClick={() => onDelete(veterinario.id)}
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

export default VeterinarioTable;
