import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ServicioForm = ({
  show,
  handleClose,
  onSave,
  servicioActual,
  isEditing,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
  });
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (isEditing && servicioActual) {
      setFormData({
        nombre: servicioActual.nombre || "",
        descripcion: servicioActual.descripcion || "",
        precio: servicioActual.precio || "",
      });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
      });
    }
    setValidated(false);
  }, [show, servicioActual, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    // Asegurarse de que el precio se envíe como número
    const dataToSave = {
      ...formData,
      precio: parseFloat(formData.precio) || 0, // Convertir a número, default 0 si no es válido
    };
    onSave(dataToSave);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header">
        <Modal.Title className="headerr">
          {isEditing ? "Editar Servicio" : "Registrar Nuevo Servicio"}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body className="modal-body">
          <Form.Group className="mb-3" controlId="formNombreServicio">
            <Form.Label className="headerr">Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Nombre del servicio"
            />
            <Form.Control.Feedback type="invalid">
              Por favor, ingrese el nombre del servicio.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescripcionServicio">
            <Form.Label className="headerr">Descripción</Form.Label>
            <Form.Control
              as="textarea" // Usar textarea para descripciones más largas
              rows={3}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              placeholder="Descripción detallada del servicio"
            />
            <Form.Control.Feedback type="invalid">
              Por favor, ingrese la descripción.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrecioServicio">
            <Form.Label className="headerr">Precio</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              step="0.01" // Permite decimales
              min="0" // Precio no puede ser negativo
              placeholder="0.00"
            />
            <Form.Control.Feedback type="invalid">
              Por favor, ingrese un precio válido (ej: 50.00).
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button variant="secondary headerr" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="" type="submit" className="color5 headerr">
            {isEditing ? "Actualizar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ServicioForm;
