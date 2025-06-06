import React from "react";
import { PencilSquare, Trash } from "react-bootstrap-icons";

const ClienteTable = ({ clientes, onEdit, onDelete }) => {
  if (!clientes || clientes.length === 0) {
    return <p className="text-center mt-3">No hay clientes registrados.</p>;
  }

  return (
    <div className="table-responsive">
      {" "}
      {/* Para mejor visualización en pantallas pequeñas */}
      <table className="table table-hover">
        {" "}
        {/* Bootstrap table classes */}
        <thead className="menu-busqueda-react">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.apellido}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.email}</td>
              <td>{cliente.direccion}</td>
              <td>
                <button
                  className="btn btn-sm btn-action btn-edit me-2"
                  onClick={() => onEdit(cliente)}
                  title="Editar"
                >
                  <PencilSquare />
                </button>
                <button
                  className="btn btn-sm btn-action btn-delete"
                  onClick={() => onDelete(cliente.id)}
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

export default ClienteTable;
