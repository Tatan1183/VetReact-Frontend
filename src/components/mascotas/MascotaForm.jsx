import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Image, Spinner } from "react-bootstrap";
import { Github } from "react-bootstrap-icons"; // Icono placeholder

const MascotaForm = ({
  show,
  handleClose,
  onSave,
  mascotaActual,
  isEditing,
  clientes, // Lista de clientes para el select
  loadingClientes,
  apiBaseUrl,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    raza: "",
    fechaNacimiento: "",
    clienteId: "", // ID del cliente seleccionado
    imagen: null, // Nombre de la imagen existente
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validated, setValidated] = useState(false);
  const fileInputRef = useRef(null);

  const especiesDisponibles = [
    "Perro",
    "Gato",
    "Ave",
    "Conejo",
    "Hámster",
    "Otro",
  ]; // Puedes expandir esto

  useEffect(() => {
    if (isEditing && mascotaActual) {
      setFormData({
        nombre: mascotaActual.nombre || "",
        especie: mascotaActual.especie || "",
        raza: mascotaActual.raza || "",
        fechaNacimiento: mascotaActual.fechaNacimiento
          ? mascotaActual.fechaNacimiento.split("T")[0]
          : "", // Formato YYYY-MM-DD
        clienteId: mascotaActual.clienteId || "",
        imagen: mascotaActual.imagen || null,
      });
      if (mascotaActual.imagen) {
        setPreviewUrl(`${apiBaseUrl}/images/${mascotaActual.imagen}`);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData({
        nombre: "",
        especie: "",
        raza: "",
        fechaNacimiento: "",
        clienteId: "",
        imagen: null,
      });
      setPreviewUrl(null);
    }
    setImagenFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setValidated(false);
  }, [show, mascotaActual, isEditing, apiBaseUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, imagen: null }));
    } else {
      setImagenFile(null);
      if (isEditing && mascotaActual?.imagen) {
        setPreviewUrl(`${apiBaseUrl}/images/${mascotaActual.imagen}`);
        setFormData((prev) => ({ ...prev, imagen: mascotaActual.imagen }));
      } else {
        setPreviewUrl(null);
        setFormData((prev) => ({ ...prev, imagen: null }));
      }
    }
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const { imagen, ...mascotaData } = formData;
    const dataToSave = {
      ...mascotaData,
      clienteId: mascotaData.clienteId
        ? parseInt(mascotaData.clienteId, 10)
        : null,
      // fechaNacimiento se envía como string YYYY-MM-DD, el backend debería manejarlo
    };

    onSave(dataToSave, imagenFile);
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="modal-header">
        <Modal.Title className="headerr">
          {isEditing ? "Editar Mascota" : "Registrar Nueva Mascota"}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body className="modal-body">
          <Form.Group className="mb-3" controlId="formNombreMascota">
            <Form.Label className="headerr">Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Requerido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEspecieMascota">
            <Form.Label className="headerr">Especie</Form.Label>
            <Form.Select
              name="especie"
              value={formData.especie}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una especie...</option>
              {especiesDisponibles.map((esp) => (
                <option key={esp} value={esp}>
                  {esp}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Requerido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRazaMascota">
            <Form.Label className="headerr">Raza</Form.Label>
            <Form.Control
              type="text"
              name="raza"
              value={formData.raza}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFechaNacimientoMascota">
            <Form.Label className="headerr">Fecha de Nacimiento</Form.Label>
            <Form.Control
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formClienteMascota">
            <Form.Label className="headerr">Dueño (Cliente)</Form.Label>
            {loadingClientes ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <Form.Select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un dueño...</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido} (ID: {cliente.id})
                  </option>
                ))}
              </Form.Select>
            )}
            <Form.Control.Feedback type="invalid">
              Requerido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImagenMascota">
            <Form.Label className="headerr">Imagen</Form.Label>
            <Form.Control
              type="file"
              name="imagenFile"
              onChange={handleImageChange}
              accept="image/*"
              ref={fileInputRef}
            />
            {previewUrl && (
              <div className="mt-2 text-center">
                <Image
                  src={previewUrl}
                  alt="Previsualización"
                  thumbnail
                  style={{ maxHeight: "150px", maxWidth: "150px" }}
                />
              </div>
            )}
            {!previewUrl && isEditing && mascotaActual?.imagen && (
              <div className="mt-2 text-center">
                <p className="text-muted small">
                  Imagen actual: {mascotaActual.imagen}
                </p>
              </div>
            )}
            {!previewUrl && !mascotaActual?.imagen && (
              <div className="mt-2 text-center">
                <Github size={60} className="text-muted" />
                <p className="text-muted small">Sin imagen seleccionada</p>
              </div>
            )}
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

export default MascotaForm;
