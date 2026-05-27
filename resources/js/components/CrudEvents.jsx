import React, { useState, useEffect } from "react";
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBtn,
    MDBInput,
    MDBIcon, // <-- Importación corregida aquí
} from "mdb-react-ui-kit";
import {
    Form,
    FormControl,
    InputGroup,
    Container,
    Row,
    Col,
    Modal,
} from "react-bootstrap";
import "/resources/css/app.css";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext"; // <-- Sintaxis de importación corregida aquí

function CrudEvents() {
    const { userInfo } = useUser();
    const userAdmin = userInfo ? userInfo.admin : "";

    if (!userAdmin) {
        return <Navigate to="/" />;
    }

    const accessToken = userInfo ? userInfo.token : "";

    // --- ESTADOS GENERALES ---
    const [search, setSearch] = useState("");
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);

    // --- CARGAR EVENTOS ---
    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = () => {
        axios
            .get("/api/events_index")
            .then((response) => {
                setEvents(response.data);
                setFilteredEvents(response.data);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
            });
    };

    // --- BÚSQUEDA REACTIVA ---
    const handleSearchChange = (e) => {
        const searchText = e.target.value;
        setSearch(searchText);
        const filtered = searchText
            ? events.filter(
                  (evt) =>
                      evt.title
                          .toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                      evt.location
                          .toLowerCase()
                          .includes(searchText.toLowerCase()),
              )
            : events;
        setFilteredEvents(filtered);
    };

    // --- NOTIFICACIONES ---
    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    useEffect(() => {
        if (notificationVisible) {
            const progressBar = document.querySelector(".notification-bar");
            if (progressBar)
                progressBar.classList.add("notification-bar-progress");

            setTimeout(() => {
                setNotificationVisible(false);
                getEvents();
            }, 1500);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    // --- ESTADOS DE FORMULARIOS ---
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        description: "",
        location: "",
        banner_path: "",
    });

    const [errors, setErrors] = useState({
        title: "",
        location: "",
        banner_path: "",
    });

    // Estado para añadir una nueva foto dinámica a la subtabla de la galería
    const [newImageUrl, setNewImageUrl] = useState("");
    const [eventImages, setEventImages] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const newErrors = { ...errors };
        if (name === "title" || name === "location" || name === "banner_path") {
            newErrors[name] =
                value === "" ? `* ${name.replace("_", " ")} is required` : "";
        }
        setErrors(newErrors);
    };

    const isFormValid =
        formData.title !== "" &&
        formData.location !== "" &&
        formData.banner_path !== "" &&
        errors.title === "" &&
        errors.location === "" &&
        errors.banner_path === "";

    // --- CONTROL DE MODALES Y BOTONES ---
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [isButtonAddEnabled, setIsButtonAddEnabled] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [eventIdUpdate, setEventIdUpdate] = useState(null);

    const handleButtonAddClick = () => {
        setFormData({
            title: "",
            date: "",
            description: "",
            location: "",
            banner_path: "",
        });
        setEventImages([]);
        setNewImageUrl("");
        setIsButtonAddEnabled(false);
        setEditMode(false);
        setShowAddForm(true);
    };

    const handleButtonClick = () => {
        setIsButtonEnabled(false);
    };

    // --- ACCIONES CRUD ACCESIBLES POR LAS RUTAS backend ---

    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            // Nota: Mapeamos los campos principales junto con el set inicial de imágenes
            const response = await fetch("/api/events_store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    ...formData,
                    gallery_images: eventImages, // Pasa las imágenes añadidas dinámicamente en el modal
                }),
            });

            if (!response.ok) throw new Error("Error adding event.");

            showNotification("Event added successfully");
            setShowAddForm(false);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(error.message);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        }
    };

    const handleEdit = async (event) => {
        try {
            // Petición POST idéntica al flujo reactivo que usa tu products_show
            const response = await axios.post("/api/events_edit", {
                id: event.id,
            });
            const eventData = response.data;

            setFormData({
                title: eventData.title,
                date: eventData.date || "",
                description: eventData.description || "",
                location: eventData.location,
                banner_path: eventData.banner_path,
            });

            setEventImages(eventData.images || []);
            setEventIdUpdate(eventData.id);
            setEditMode(true);
            setShowAddForm(true);
        } catch (error) {
            console.error("Error cargando evento:", error);
            setIsButtonEnabled(true);
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `/api/events_update/${eventIdUpdate}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        ...formData,
                        gallery_images: eventImages, // Sincroniza la tabla cruzada en cascada
                    }),
                },
            );

            if (!response.ok) throw new Error("Error updating event.");

            showNotification("Event Updated successfully");
            setShowAddForm(false);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(error.message);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/api/events_destroy/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.status === 200) {
                showNotification("Event deleted successfully");
                setIsButtonEnabled(true);
            }
        } catch (error) {
            console.error(error);
            setIsButtonEnabled(true);
            alert("Error deleting event");
        }
    };

    // --- MANEJADORES DE LA SUBTABLA DINÁMICA DE IMÁGENES ---
    const handleAddImageToGallery = () => {
        if (newImageUrl.trim() === "") return;

        // Añadir elemento temporal con id único para manejar el mapeo de react
        const newImgObj = {
            id: Date.now(), // ID Temporal si es nuevo, Laravel creará el definitivo en base de datos al guardar
            image_path: newImageUrl,
        };

        setEventImages([...eventImages, newImgObj]);
        setNewImageUrl(""); // Limpiar input
    };

    const handleRemoveImageFromGallery = (imgId) => {
        setEventImages(eventImages.filter((img) => img.id !== imgId));
    };

    return (
        <>
            <br />
            <div className="d-flex align-items-center justify-content-between px-5">
                <Container className="mt-5">
                    <Row>
                        <Col sm={4}>
                            <Form className="d-flex">
                                <InputGroup>
                                    <InputGroup.Text className="bg-white">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                        >
                                            <path d="M9.5 3a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM1 9.5a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0z" />
                                        </svg>
                                    </InputGroup.Text>
                                    <FormControl
                                        type="search"
                                        className="me-2"
                                        placeholder="Search Events"
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                </InputGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>

                <MDBBtn
                    className={`mb-4 w-25 custom-button ${!isButtonAddEnabled ? "clicked" : ""}`}
                    size="lg"
                    disabled={!isButtonAddEnabled}
                    onClick={handleButtonAddClick}
                >
                    ADD NEW EVENT
                </MDBBtn>
            </div>
            <br />

            <MDBTable>
                <MDBTableHead dark>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Date</th>
                        <th scope="col">Location</th>
                        <th scope="col">Gallery Photos</th>
                        <th scope="col" className="text-center">
                            Actions
                        </th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {filteredEvents.map((evt) => (
                        <tr key={evt.id}>
                            <th scope="row">{evt.id}</th>
                            <td className="fw-bold">{evt.title}</td>
                            <td>{evt.date || "No date set"}</td>
                            <td>{evt.location}</td>
                            <td>
                                <MDBIcon fas icon="images" className="me-2" />
                                {evt.images ? evt.images.length : 0} photos
                            </td>
                            <td>
                                <MDBBtn
                                    className="mb-2 btn-sm w-100 btn-info"
                                    disabled={!isButtonEnabled}
                                    onClick={() => {
                                        handleButtonClick();
                                        handleEdit(evt);
                                    }}
                                >
                                    EDIT
                                </MDBBtn>
                                <MDBBtn
                                    className="btn-sm w-100 btn-danger"
                                    disabled={!isButtonEnabled}
                                    onClick={() => {
                                        handleButtonClick();
                                        handleDelete(evt.id);
                                    }}
                                >
                                    DELETE
                                </MDBBtn>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            {/* MODAL PRINCIPAL | ADD & UPDATE */}
            <Modal
                show={showAddForm}
                size="lg" // Cambiado a 'lg' para dar espacio a la subtabla de fotos fijas
                onHide={() => {
                    setShowAddForm(false);
                    setIsButtonAddEnabled(true);
                    setIsButtonEnabled(true);
                }}
            >
                <Modal.Header
                    className={
                        editMode ? "bg-primary text-white" : "bg-warning"
                    }
                    closeButton
                >
                    <Modal.Title>
                        {editMode ? "Update Event Lookbook" : "Add New Event"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form
                        onSubmit={editMode ? handleUpdateEvent : handleAddEvent}
                    >
                        {errors.title && (
                            <p className="text-danger small">{errors.title}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Event Title (LOOKBOOK)"
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />

                        <MDBInput
                            wrapperClass="mb-4"
                            label="Date"
                            id="date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                        />

                        {errors.location && (
                            <p className="text-danger small">
                                {errors.location}
                            </p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Location"
                            id="location"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />

                        <Form.Group className="mb-4">
                            <Form.Label className="small text-muted">
                                Description
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Write collection overview..."
                            />
                        </Form.Group>

                        {errors.banner_path && (
                            <p className="text-danger small">
                                {errors.banner_path}
                            </p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Banner Principal (URL de portada)"
                            id="banner_path"
                            type="text"
                            name="banner_path"
                            value={formData.banner_path}
                            onChange={handleChange}
                        />

                        {/* ------------------------------------------------------------- */}
                        {/* SUBTABLA INTERNA: GESTIÓN DE GALERÍA DE IMÁGENES DINÁMICAS     */}
                        {/* ------------------------------------------------------------- */}
                        <div className="p-3 my-4 border border-dark rounded bg-light">
                            <h5 className="fw-bold text-uppercase tracking-wider mb-3 text-dark">
                                <MDBIcon
                                    fas
                                    icon="photo-video"
                                    className="me-2"
                                />
                                Galería Dinámica del Evento
                            </h5>

                            {/* Input rápido para meter imágenes mediante URLs directas */}
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder="Pegar URL de foto de Unsplash / Postimages..."
                                    value={newImageUrl}
                                    onChange={(e) =>
                                        setNewImageUrl(e.target.value)
                                    }
                                />
                                <MDBBtn
                                    type="button"
                                    className="btn-dark"
                                    onClick={handleAddImageToGallery}
                                >
                                    Añadir Foto
                                </MDBBtn>
                            </InputGroup>

                            <div
                                style={{
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                }}
                            >
                                <MDBTable
                                    small
                                    align="middle"
                                    className="mb-0 bg-white"
                                >
                                    <MDBTableHead light>
                                        <tr>
                                            <th>Previsualización</th>
                                            <th>Enlace/Ruta del archivo</th>
                                            <th className="text-center">
                                                Acción
                                            </th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {eventImages.length > 0 ? (
                                            eventImages.map((img) => (
                                                <tr key={img.id}>
                                                    <td>
                                                        <img
                                                            src={img.image_path}
                                                            alt="Miniatura"
                                                            style={{
                                                                width: "45px",
                                                                height: "45px",
                                                                objectFit:
                                                                    "cover",
                                                            }}
                                                            className="rounded border border-secondary"
                                                        />
                                                    </td>
                                                    <td
                                                        className="small text-truncate"
                                                        style={{
                                                            maxWidth: "250px",
                                                        }}
                                                    >
                                                        {img.image_path}
                                                    </td>
                                                    <td className="text-center">
                                                        <MDBBtn
                                                            type="button"
                                                            className="btn-sm btn-danger px-2"
                                                            onClick={() =>
                                                                handleRemoveImageFromGallery(
                                                                    img.id,
                                                                )
                                                            }
                                                        >
                                                            <MDBIcon
                                                                fas
                                                                icon="trash"
                                                            />
                                                        </MDBBtn>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="3"
                                                    className="text-center text-muted small py-3"
                                                >
                                                    Sin fotos en la galería.
                                                    Añade URLs arriba.
                                                </td>
                                            </tr>
                                        )}
                                    </MDBTableBody>
                                </MDBTable>
                            </div>
                        </div>
                        {/* ------------------------------------------------------------- */}

                        <MDBBtn
                            className="w-100"
                            size="lg"
                            type="submit"
                            disabled={!isFormValid}
                        >
                            {editMode ? "UPDATE LOOKBOOK" : "SAVE EVENT"}
                        </MDBBtn>
                    </form>
                </Modal.Body>
            </Modal>

            {/* NOTIFICACIONES GENERALES */}
            {notification && (
                <div
                    className={`notification ${notificationVisible ? "show" : ""}`}
                >
                    {notification}
                    <div className="notification-bar"></div>
                </div>
            )}
        </>
    );
}

export default CrudEvents;
