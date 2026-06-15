import React, { useState, useEffect } from "react";
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBtn,
    MDBInput,
    MDBIcon,
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
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { useNotification } from "./NotificationContext";

function CrudEvents() {
    const { userInfo } = useUser();
    const userAdmin = userInfo ? userInfo.admin : "";
    const accessToken = userInfo ? userInfo.token : "";

    if (!userAdmin) {
        return <Navigate to="/" />;
    }

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
        if (!searchText) {
            setFilteredEvents(events);
            return;
        }
        const filtered = events.filter(
            (evt) =>
                (evt.title &&
                    evt.title
                        .toLowerCase()
                        .includes(searchText.toLowerCase())) ||
                (evt.location &&
                    evt.location
                        .toLowerCase()
                        .includes(searchText.toLowerCase())),
        );
        setFilteredEvents(filtered);
    };

    // NOTIFICATIONS
    const { showNotification } = useNotification();

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

    const [newImageUrl, setNewImageUrl] = useState("");
    const [eventImages, setEventImages] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (["title", "location", "banner_path"].includes(name)) {
            setErrors({
                ...errors,
                [name]:
                    value.trim() === ""
                        ? `* ${name.replace("_", " ")} is required`
                        : "",
            });
        }
    };

    const isFormValid =
        formData.title.trim() !== "" &&
        formData.location.trim() !== "" &&
        formData.banner_path.trim() !== "" &&
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

    const handleCloseModal = () => {
        setShowAddForm(false);
        setIsButtonAddEnabled(true);
        setIsButtonEnabled(true);
    };

    // --- ACCIONES CRUD ---
    const handleAddEvent = async (e) => {
        e.preventDefault();
        setIsButtonEnabled(false);
        try {
            const response = await fetch("/api/events_store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    ...formData,
                    gallery_images: eventImages,
                }),
            });

            if (!response.ok) throw new Error("Error adding event.");

            showNotification("Event added successfully");
            setShowAddForm(false);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(error.message);
        } finally {
            setIsButtonEnabled(true);
        }
    };

    const handleEdit = async (event) => {
        try {
            const response = await axios.post("/api/events_edit", {
                id: event.id,
            });
            const eventData = response.data;

            setFormData({
                title: eventData.title || "",
                date: eventData.date ? eventData.date.substring(0, 10) : "",
                description: eventData.description || "",
                location: eventData.location || "",
                banner_path: eventData.banner_path || "",
            });

            setEventImages(eventData.images || []);
            setEventIdUpdate(eventData.id);
            setEditMode(true);
            setShowAddForm(true);
        } catch (error) {
            console.error("Error cargando evento:", error);
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        setIsButtonEnabled(false);
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
                        gallery_images: eventImages,
                    }),
                },
            );

            if (!response.ok) throw new Error("Error updating event.");

            showNotification("Event Updated successfully");
            setShowAddForm(false);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(error.message);
        } finally {
            setIsButtonEnabled(true);
        }
    };

    const handleDelete = async (id) => {
        setIsButtonEnabled(false);
        try {
            const response = await axios.delete(`/api/events_destroy/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (response.status === 200) {
                showNotification("Event deleted successfully");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting event");
        } finally {
            setIsButtonEnabled(true);
        }
    };

    // --- MANEJADORES DE LA SUBTABLA GALERÍA ---

    const handleRemoveImageFromGallery = (imgId) => {
        setEventImages(eventImages.filter((img) => img.id !== imgId));
    };

    // En tu componente:
    const [newImageLink, setNewImageLink] = useState("");
    const [editingId, setEditingId] = useState(null); // ID de la imagen que se está editando
    const [editUrl, setEditUrl] = useState(""); // Valor temporal de edición

    // Modifica tu función para agregar fotos
    const handleAddImageToGallery = () => {
        if (!newImageUrl.trim()) return;
        const newImgObj = {
            id: Date.now(),
            image_path: newImageUrl,
            target_url: newImageLink || "/", // Si está vacío, por defecto "/"
        };
        setEventImages([...eventImages, newImgObj]);
        setNewImageUrl("");
        setNewImageLink("");
    };

    const startEdit = (img) => {
        setEditingId(img.id);
        setEditUrl(img.target_url); // Cargamos el link actual en el input
    };

    const saveEdit = (id) => {
        setEventImages(
            eventImages.map((img) =>
                img.id === id ? { ...img, target_url: editUrl } : img,
            ),
        );
        setEditingId(null);
    };

    // --- ESTILOS DE ADAPTACIÓN BASE VISUAL ---
    const brutalistButtonStyles = {
        backgroundColor: "#ffffff",
        color: "#000000",
        borderRadius: "0px",
        border: "none",
        fontWeight: "normal",
        fontSize: "0.85rem",
        padding: "10px 24px",
        boxShadow: "none",
    };

    const tableActionBtnStyles = {
        backgroundColor: "#ffffff",
        color: "#000000",
        borderRadius: "0px",
        border: "none",
        fontWeight: "normal",
        fontSize: "0.8rem",
        padding: "6px 18px",
        boxShadow: "none",
        minWidth: "85px",
    };

    return (
        <>
            <br />
            <div className="d-flex align-items-center justify-content-between JSON-header-container">
                <Container className="mt-4 px-0">
                    <Row className="align-items-center">
                        <Col md={6}>
                            <Form onSubmit={(e) => e.preventDefault()}>
                                <InputGroup
                                    style={{
                                        borderRadius: "0px",
                                        maxWidth: "400px",
                                    }}
                                >
                                    <InputGroup.Text
                                        className="bg-white border-0"
                                        style={{ borderRadius: "0px" }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                        >
                                            <path d="M9.5 3a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM1 9.5a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0z" />
                                            <path d="M16.853 16.854a.5.5 0 0 0 .707 0l3.793-3.793a.5.5 0 0 0 0-.707l-3.793-3.793a.5.5 0 0 0-.707.707L19.293 12H10.5a.5.5 0 0 0 0 1h8.793l-2.646 2.646a.5.5 0 0 0 0 .707z" />
                                        </svg>
                                    </InputGroup.Text>
                                    <FormControl
                                        type="search"
                                        style={{
                                            borderRadius: "0px",
                                            border: "none",
                                        }}
                                        placeholder="Buscar eventos por título o locación..."
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                </InputGroup>
                            </Form>
                        </Col>
                        <Col md={6} className="d-flex justify-content-end">
                            <MDBBtn
                                style={brutalistButtonStyles}
                                type="button"
                                disabled={!isButtonAddEnabled}
                                onClick={handleButtonAddClick}
                            >
                                ADD NEW EVENT
                            </MDBBtn>
                        </Col>
                    </Row>
                </Container>
            </div>
            <br />

            <div className="px-4">
                <MDBTable
                    responsive
                    align="middle"
                    className="text-white border-0"
                    style={{ backgroundColor: "#121212" }}
                >
                    <MDBTableHead>
                        <tr style={{ borderBottom: "1px solid #222" }}>
                            <th
                                scope="col"
                                style={{
                                    fontWeight: "normal",
                                    color: "#ffffff",
                                    fontSize: "0.85rem",
                                }}
                            >
                                #
                            </th>
                            <th
                                scope="col"
                                style={{
                                    fontWeight: "normal",
                                    color: "#ffffff",
                                    fontSize: "0.85rem",
                                }}
                            >
                                Title
                            </th>
                            <th
                                scope="col"
                                style={{
                                    fontWeight: "normal",
                                    color: "#ffffff",
                                    fontSize: "0.85rem",
                                }}
                            >
                                Date
                            </th>
                            <th
                                scope="col"
                                style={{
                                    fontWeight: "normal",
                                    color: "#ffffff",
                                    fontSize: "0.85rem",
                                }}
                            >
                                Location
                            </th>
                            <th
                                scope="col"
                                style={{
                                    fontWeight: "normal",
                                    color: "#ffffff",
                                    fontSize: "0.85rem",
                                }}
                            >
                                Gallery Photos
                            </th>
                            <th
                                scope="col"
                                className="text-end"
                                style={{
                                    fontWeight: "normal",
                                    color: "#ffffff",
                                    fontSize: "0.85rem",
                                    width: "240px",
                                    paddingRight: "24px",
                                }}
                            >
                                Actions
                            </th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {filteredEvents.map((evt) => (
                            <tr
                                key={evt.id}
                                style={{ borderBottom: "1px solid #222" }}
                            >
                                <td
                                    style={{
                                        color: "#ffffff",
                                        fontWeight: "normal",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {evt.id}
                                </td>
                                <td
                                    style={{
                                        color: "#ffffff",
                                        fontWeight: "normal",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {evt.title}
                                </td>
                                <td
                                    style={{
                                        color: "#ffffff",
                                        fontWeight: "normal",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {evt.date || "No date set"}
                                </td>
                                <td
                                    style={{
                                        color: "#ffffff",
                                        fontWeight: "normal",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {evt.location}
                                </td>
                                <td
                                    style={{
                                        color: "#ffffff",
                                        fontWeight: "normal",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    <MDBIcon
                                        fas
                                        icon="images"
                                        className="me-2"
                                        style={{ color: "#666" }}
                                    />
                                    {evt.images ? evt.images.length : 0} photos
                                </td>
                                <td
                                    className="text-end"
                                    style={{ paddingRight: "24px" }}
                                >
                                    <MDBBtn
                                        style={{
                                            ...tableActionBtnStyles,
                                            marginRight: "10px",
                                        }}
                                        disabled={!isButtonEnabled}
                                        onClick={() => handleEdit(evt)}
                                    >
                                        EDIT
                                    </MDBBtn>
                                    <MDBBtn
                                        style={tableActionBtnStyles}
                                        disabled={!isButtonEnabled}
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    "Are you sure you want to delete this event?",
                                                )
                                            ) {
                                                handleDelete(evt.id);
                                            }
                                        }}
                                    >
                                        DELETE
                                    </MDBBtn>
                                </td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </div>

            {/* MODAL PRINCIPAL TOTALMENTE AJUSTADO */}
            <Modal
                show={showAddForm}
                onHide={handleCloseModal}
                size="lg"
                centered
            >
                <Modal.Header
                    className="bg-dark text-white border-secondary"
                    closeButton
                    style={{ borderRadius: "0px" }}
                >
                    <Modal.Title
                        style={{ fontSize: "1.1rem", fontWeight: "normal" }}
                    >
                        {editMode ? "Update Event Lookbook" : "Add New Event"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="bg-dark text-white"
                    style={{ borderRadius: "0px" }}
                >
                    <img
                        src="/img/logosmc.svg"
                        alt="Logo"
                        style={{
                            maxWidth: "35%",
                            margin: "auto",
                            display: "block",
                            marginBottom: "30px",
                        }}
                    />
                    <form
                        onSubmit={editMode ? handleUpdateEvent : handleAddEvent}
                    >
                        <h5
                            className="text-muted small border-bottom border-secondary pb-2 mb-3"
                            style={{ letterSpacing: "1px" }}
                        >
                            1. EVENT MAIN DETAILS
                        </h5>

                        {errors.title && (
                            <p className="text-danger small">{errors.title}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Event Title (LOOKBOOK)"
                            id="title"
                            type="text"
                            name="title"
                            contrast
                            value={formData.title}
                            onChange={handleChange}
                        />

                        <Row>
                            <Col md={6}>
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Date"
                                    id="date"
                                    type="date"
                                    name="date"
                                    contrast
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={6}>
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
                                    contrast
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>

                        <div className="mb-4">
                            <label
                                htmlFor="description"
                                className="form-label text-muted small mb-1"
                            >
                                Description Overview
                            </label>
                            <textarea
                                className="form-control bg-dark text-white border-secondary"
                                id="description"
                                rows="3"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Write collection overview..."
                                style={{ borderRadius: "0px" }}
                            ></textarea>
                        </div>

                        {errors.banner_path && (
                            <p className="text-danger small">
                                {errors.banner_path}
                            </p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Main Banner URL (Cover Path)"
                            id="banner_path"
                            type="text"
                            name="banner_path"
                            contrast
                            value={formData.banner_path}
                            onChange={handleChange}
                        />

                        {/* SUBTABLA INTERNA REESTILIZADA SIN NEGRITAS O BORDES REDONDEADOS */}
                        <div
                            className="p-4 my-4 border border-secondary"
                            style={{ backgroundColor: "#151515" }}
                        >
                            <h5
                                className="text-muted small border-bottom border-secondary pb-2 mb-3"
                                style={{ letterSpacing: "1px" }}
                            >
                                <MDBIcon
                                    fas
                                    icon="photo-video"
                                    className="me-2"
                                />
                                2. DYNAMIC GALLERY LOOKS
                            </h5>

                            <InputGroup
                                className="mb-3"
                                style={{ borderRadius: "0px" }}
                            >
                                <FormControl
                                    className="bg-dark text-white border-secondary mb-2"
                                    placeholder="Paste photo source URL..."
                                    value={newImageUrl}
                                    onChange={(e) =>
                                        setNewImageUrl(e.target.value)
                                    }
                                    style={{ borderRadius: "0px" }}
                                />
                                <FormControl
                                    className="bg-dark text-white border-secondary mb-2"
                                    placeholder="Add redirection URL (optional)..."
                                    value={newImageLink}
                                    onChange={(e) =>
                                        setNewImageLink(e.target.value)
                                    }
                                    style={{ borderRadius: "0px" }}
                                />
                                <MDBBtn
                                    type="button"
                                    onClick={handleAddImageToGallery}
                                    style={{ ...brutalistButtonStyles }}
                                >
                                    ADD PHOTO
                                </MDBBtn>
                            </InputGroup>

                            <div
                                style={{
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                }}
                            >
                                <MDBTable
                                    responsive
                                    align="middle"
                                    className="text-white m-0 border-0"
                                >
                                    <MDBTableHead>
                                        <tr
                                            style={{
                                                borderBottom: "1px solid #333",
                                            }}
                                        >
                                            <th
                                                scope="col"
                                                style={{
                                                    fontWeight: "normal",
                                                    fontSize: "0.8rem",
                                                    color: "#aaa",
                                                }}
                                            >
                                                Preview
                                            </th>
                                            <th
                                                scope="col"
                                                style={{
                                                    fontWeight: "normal",
                                                    fontSize: "0.8rem",
                                                    color: "#aaa",
                                                }}
                                            >
                                                Image Asset Path
                                            </th>
                                            <th
                                                scope="col"
                                                className="text-end"
                                                style={{
                                                    fontWeight: "normal",
                                                    fontSize: "0.8rem",
                                                    color: "#aaa",
                                                    paddingRight: "15px",
                                                }}
                                            >
                                                Action
                                            </th>
                                        </tr>
                                    </MDBTableHead>

                                    <MDBTableBody
                                        style={{ backgroundColor: "#1c1c1c" }}
                                    >
                                        {eventImages.map((img) => (
                                            <tr key={img.id}>
                                                <td>
                                                    <img
                                                        src={img.image_path}
                                                        alt="preview"
                                                        style={{
                                                            width: "45px",
                                                            height: "45px",
                                                            objectFit: "cover",
                                                        }}
                                                        className="border border-secondary"
                                                    />
                                                </td>
                                                <td>
                                                    {editingId === img.id ? (
                                                        // MODO EDICIÓN
                                                        <input
                                                            className="bg-dark text-white border-secondary w-100"
                                                            value={editUrl}
                                                            onChange={(e) =>
                                                                setEditUrl(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        // MODO VISTA
                                                        <div className="small">
                                                            <div>
                                                                {img.image_path}
                                                            </div>
                                                            <div
                                                                className="text-muted"
                                                                style={{
                                                                    fontSize:
                                                                        "0.75rem",
                                                                }}
                                                            >
                                                                URL:{" "}
                                                                {img.target_url}
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-end">
                                                    {editingId === img.id ? (
                                                        <MDBBtn
                                                            size="sm"
                                                            color="success"
                                                            onClick={() =>
                                                                saveEdit(img.id)
                                                            }
                                                        >
                                                            <MDBIcon
                                                                fas
                                                                icon="check"
                                                            />
                                                        </MDBBtn>
                                                    ) : (
                                                        <MDBBtn
                                                            size="sm"
                                                            color="warning"
                                                            className="me-2"
                                                            onClick={() =>
                                                                startEdit(img)
                                                            }
                                                        >
                                                            <MDBIcon
                                                                fas
                                                                icon="edit"
                                                            />
                                                        </MDBBtn>
                                                    )}
                                                    <MDBBtn
                                                        size="sm"
                                                        color="danger"
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
                                        ))}
                                    </MDBTableBody>
                                </MDBTable>
                            </div>
                        </div>

                        <MDBBtn
                            style={{ ...brutalistButtonStyles, width: "100%" }}
                            className="mt-3"
                            type="submit"
                            disabled={!isFormValid || !isButtonEnabled}
                        >
                            {editMode ? "UPDATE LOOKBOOK" : "SAVE EVENT"}
                        </MDBBtn>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default CrudEvents;
