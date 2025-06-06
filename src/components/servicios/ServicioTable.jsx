import React from "react";
import { PencilSquare, Trash } from "react-bootstrap-icons";

const ServicioTable = ({ servicios, onEdit, onDelete }) => {
  if (!servicios || servicios.length === 0) {
    return <p className="text-center mt-3">No hay servicios registrados.</p>;
  }

  const formatPrice = (price) => {
    // Asegurarse que el precio es un número y formatearlo a 2 decimales
    const numPrice = Number(price);
    return isNaN(numPrice) ? "N/A" : numPrice.toFixed(2);
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="menu-busqueda-react">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio ($)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((servicio) => (
            <tr key={servicio.id}>
              <td>{servicio.id}</td>
              <td>{servicio.nombre}</td>
              <td>{servicio.descripcion}</td>
              <td>{formatPrice(servicio.precio)}</td>
              <td>
                <button
                  className="btn btn-sm btn-action btn-edit me-2"
                  onClick={() => onEdit(servicio)}
                  title="Editar"
                >
                  <PencilSquare />
                </button>
                <button
                  className="btn btn-sm btn-action btn-delete"
                  onClick={() => onDelete(servicio.id)}
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

export default ServicioTable;
