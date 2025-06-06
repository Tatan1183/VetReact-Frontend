import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap"; // Componentes de React Bootstrap

const ClienteForm = ({
  show,
  handleClose,
  onSave,
  clienteActual,
  isEditing,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion: "",
  });
  const [validated, setValidated] = useState(false); // Para la validación de Bootstrap

  useEffect(() => {
    if (isEditing && clienteActual) {
      setFormData({
        nombre: clienteActual.nombre || "",
        apellido: clienteActual.apellido || "",
        telefono: clienteActual.telefono || "",
        email: clienteActual.email || "",
        direccion: clienteActual.direccion || "",
      });
    } else {
      // Limpiar formulario para nuevo cliente
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        direccion: "",
      });
    }
    setValidated(false); // Resetear validación al abrir/cambiar modo
  }, [show, clienteActual, isEditing]); // Dependencias importantes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault(); // Prevenir el envío default del form HTML
    event.stopPropagation();

    if (form.checkValidity() === false) {
      setValidated(true); // Mostrar mensajes de validación
      return;
    }

    onSave(formData); // Llama a la función onSave pasada desde ClientesPage
    // handleClose(); // No cerrar aquí, ClientesPage lo hará tras el éxito del guardado
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header">
        {" "}
        {/* Clases de tu CSS */}
        <Modal.Title className="headerr">
          {isEditing ? "Editar Cliente" : "Registrar Nuevo Cliente"}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body className="modal-body">
          {" "}
          {/* Clases de tu CSS */}
          <Form.Group className="mb-3" controlId="formNombreCliente">
            <Form.Label className="headerr">Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Nombre del cliente"
            />
            <Form.Control.Feedback type="invalid">
              Por favor, ingrese el nombre.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formApellidoCliente">
            <Form.Label className="headerr">Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              placeholder="Apellido del cliente"
            />
            <Form.Control.Feedback type="invalid">
              Por favor, ingrese el apellido.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefonoCliente">
            <Form.Label className="headerr">Teléfono</Form.Label>
            <Form.Control
              type="tel" // Mejor tipo para teléfono
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              placeholder="Ej: 3101234567"
            />
            <Form.Control.Feedback type="invalid">
              Por favor, ingrese el teléfono.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmailCliente">
            <Form.Label className="headerr">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ejemplo@correo.com"
            />
            <Form.Control.Feedback type="invalid">
              Por favor, ingrese un email válido.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDireccionCliente">
            <Form.Label className="headerr">Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              placeholder="Calle 123 # 45-67"
            />
            <Form.Control.Feedback type="invalid">
              Por favor, ingrese la dirección.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          {" "}
          {/* Clases DE MI CSS */}
          <Button variant="secondary headerr" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="" type="submit" className="color5 headerr">
            {" "}
            {/* Clase color5 para el botón de guardar */}
            {isEditing ? "Actualizar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ClienteForm;
