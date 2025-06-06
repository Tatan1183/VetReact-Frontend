import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

const CitaForm = ({
  show,
  handleClose,
  onSave,
  citaActual,
  isEditing,
  mascotas,
  veterinarios,
  servicios,
  loadingData, // Objeto con estados de carga para los selects
}) => {
  const [formData, setFormData] = useState({
    mascotaId: "",
    veterinarioId: "",
    servicioId: "",
    fechaHora: "",
    estado: "",
    notas: "",
  });
  const [validated, setValidated] = useState(false);

  const estadosCita = ["Programada", "Confirmada", "Completada", "Cancelada"];

  useEffect(() => {
    if (isEditing && citaActual) {
      setFormData({
        mascotaId: citaActual.mascotaId || "",
        veterinarioId: citaActual.veterinarioId || "",
        servicioId: citaActual.servicioId || "",
        // Formatear fechaHora para input datetime-local (YYYY-MM-DDTHH:mm)
        fechaHora: citaActual.fechaHora
          ? new Date(
              new Date(citaActual.fechaHora).getTime() -
                new Date().getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16)
          : "",
        estado: citaActual.estado || "",
        notas: citaActual.notas || "",
      });
    } else {
      setFormData({
        mascotaId: "",
        veterinarioId: "",
        servicioId: "",
        fechaHora: "",
        estado: "",
        notas: "",
      });
    }
    setValidated(false);
  }, [show, citaActual, isEditing]);

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

    const dataToSave = {
      ...formData,
      mascotaId: parseInt(formData.mascotaId),
      veterinarioId: parseInt(formData.veterinarioId),
      servicioId: parseInt(formData.servicioId),
      // fechaHora ya está en el formato que el backend espera (ISO string con T)
    };
    onSave(dataToSave);
  };

  // Corrección para fechaHora en edición:
  // El input datetime-local espera 'YYYY-MM-DDTHH:MM'
  // La fecha del backend puede venir como ISO string completa (con Z o offset)
  // Necesitamos convertirla al formato local correcto para el input.
  const formatDateTimeForInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // Restar el offset de la zona horaria para mostrar la hora local correcta en el input
    const offsetMilliseconds = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offsetMilliseconds);
    return localDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (isEditing && citaActual) {
      setFormData({
        mascotaId: citaActual.mascotaId || "",
        veterinarioId: citaActual.veterinarioId || "",
        servicioId: citaActual.servicioId || "",
        fechaHora: formatDateTimeForInput(citaActual.fechaHora),
        estado: citaActual.estado || "",
        notas: citaActual.notas || "",
      });
    } else {
      // ... (código para limpiar el formulario) ...
      setFormData({
        mascotaId: "",
        veterinarioId: "",
        servicioId: "",
        fechaHora: "",
        estado: "",
        notas: "",
      });
    }
    setValidated(false);
  }, [show, citaActual, isEditing]);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="modal-header">
        <Modal.Title className="headerr">
          {isEditing ? "Editar Cita" : "Registrar Nueva Cita"}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body className="modal-body">
          <Form.Group className="mb-3" controlId="formMascotaCita">
            <Form.Label className="headerr">Mascota</Form.Label>
            {loadingData.mascotas ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <Form.Select
                name="mascotaId"
                value={formData.mascotaId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una mascota...</option>
                {mascotas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} ({m.especie}) - Dueño: {m.clienteNombre}{" "}
                    {m.clienteApellido}
                  </option>
                ))}
              </Form.Select>
            )}
            <Form.Control.Feedback type="invalid">
              Requerido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formVeterinarioCita">
            <Form.Label className="headerr">Veterinario</Form.Label>
            {loadingData.veterinarios ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <Form.Select
                name="veterinarioId"
                value={formData.veterinarioId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un veterinario...</option>
                {veterinarios.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nombre} {v.apellido} ({v.especialidad || "General"})
                  </option>
                ))}
              </Form.Select>
            )}
            <Form.Control.Feedback type="invalid">
              Requerido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formServicioCita">
            <Form.Label className="headerr">Servicio</Form.Label>
            {loadingData.servicios ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <Form.Select
                name="servicioId"
                value={formData.servicioId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un servicio...</option>
                {servicios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} (${Number(s.precio).toFixed(2)})
                  </option>
                ))}
              </Form.Select>
            )}
            <Form.Control.Feedback type="invalid">
              Requerido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFechaHoraCita">
            <Form.Label className="headerr">Fecha y Hora</Form.Label>
            <Form.Control
              type="datetime-local"
              name="fechaHora"
              value={formData.fechaHora}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Requerido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEstadoCita">
            <Form.Label className="headerr">Estado</Form.Label>
            <Form.Select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un estado...</option>
              {estadosCita.map((est) => (
                <option key={est} value={est}>
                  {est}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Requerido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formNotasCita">
            <Form.Label className="headerr">Notas</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notas"
              value={formData.notas}
              onChange={handleChange}
            />
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

export default CitaForm;
