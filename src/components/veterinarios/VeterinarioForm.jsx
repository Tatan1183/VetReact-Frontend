import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap"; // Image para previsualizar
import { PersonBoundingBox } from "react-bootstrap-icons";

const VeterinarioForm = ({
  show,
  handleClose,
  onSave,
  veterinarioActual,
  isEditing,
  apiBaseUrl,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    especialidad: "",
    email: "",
    imagen: null, // Nombre de la imagen existente (string)
  });
  const [imagenFile, setImagenFile] = useState(null); // Para el archivo seleccionado (File object)
  const [previewUrl, setPreviewUrl] = useState(null); // Para previsualizar la imagen
  const [validated, setValidated] = useState(false);
  const fileInputRef = useRef(null); // Para resetear el input file

  useEffect(() => {
    if (isEditing && veterinarioActual) {
      setFormData({
        nombre: veterinarioActual.nombre || "",
        apellido: veterinarioActual.apellido || "",
        especialidad: veterinarioActual.especialidad || "",
        email: veterinarioActual.email || "",
        imagen: veterinarioActual.imagen || null, // Guardar el nombre de la imagen existente
      });
      if (veterinarioActual.imagen) {
        setPreviewUrl(`${apiBaseUrl}/images/${veterinarioActual.imagen}`);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        especialidad: "",
        email: "",
        imagen: null,
      });
      setPreviewUrl(null);
    }
    setImagenFile(null); // Siempre resetear el archivo seleccionado al abrir
    if (fileInputRef.current) {
      // Resetea el valor del input file
      fileInputRef.current.value = "";
    }
    setValidated(false);
  }, [show, veterinarioActual, isEditing, apiBaseUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Crear URL para previsualización
      setFormData((prev) => ({ ...prev, imagen: null })); // Indicar que hay una nueva imagen, la existente ya no aplica si se guarda
    } else {
      // Si el usuario deselecciona el archivo, podríamos volver a la imagen original si es edición
      setImagenFile(null);
      if (isEditing && veterinarioActual && veterinarioActual.imagen) {
        setPreviewUrl(`${apiBaseUrl}/images/${veterinarioActual.imagen}`);
        setFormData((prev) => ({ ...prev, imagen: veterinarioActual.imagen }));
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

    // Crear un objeto solo con los datos del veterinario, sin el campo 'imagen' si se va a subir una nueva.
    // El nombre de la imagen se manejará en VeterinariosPage después de la subida.
    const { imagen, ...veterinarioData } = formData;

    onSave(veterinarioData, imagenFile); // Pasamos el objeto de datos y el archivo de imagen (si existe)
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="modal-header">
        <Modal.Title className="headerr">
          {isEditing ? "Editar Veterinario" : "Registrar Nuevo Veterinario"}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body className="modal-body">
          <Form.Group className="mb-3" controlId="formNombreVet">
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

          <Form.Group className="mb-3" controlId="formApellidoVet">
            <Form.Label className="headerr">Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Requerido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEspecialidadVet">
            <Form.Label className="headerr">Especialidad</Form.Label>
            <Form.Control
              type="text"
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Requerido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmailVet">
            <Form.Label className="headerr">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Email inválido o requerido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImagenVet">
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
            {!previewUrl &&
              isEditing &&
              veterinarioActual?.imagen && ( // Si no hay preview nueva, pero hay imagen actual (nombre)
                <div className="mt-2 text-center">
                  <p className="text-muted small">
                    Imagen actual: {veterinarioActual.imagen}
                  </p>
                </div>
              )}
            {!previewUrl && !veterinarioActual?.imagen && (
              <div className="mt-2 text-center">
                <PersonBoundingBox size={60} className="text-muted" />
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

export default VeterinarioForm;
