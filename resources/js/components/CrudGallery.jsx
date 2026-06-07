import React, { useState, useEffect } from "react";
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBtn,
    MDBInput,
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

function CrudGallery() {
    const { userInfo } = useUser();
    const userAdmin = userInfo ? userInfo.admin : "";

    if (!userAdmin) {
        return <Navigate to="/" />;
    }

    const accessToken = userInfo ? userInfo.token : "";

    // --- ESTADOS DE CONTROL PRINCIPAL ---
    const [activeTab, setActiveTab] = useState("artworks"); // "artworks" o "parody_ad"
    const [search, setSearch] = useState("");
    const [artworks, setArtworks] = useState([]);
    const [filteredArtworks, setFilteredArtworks] = useState([]);

    // --- ESTADOS PARA PUBLICIDAD PARÓDICA ---
    const [adFormData, setAdFormData] = useState({
        title: "",
        ad_image_desktop: "",
        ad_image_mobile: "",
        ad_link_url: "",
    });

    // --- CARGA INICIAL DE DATOS ---
    useEffect(() => {
        getArtworks();
        getActiveAd();
    }, []);

    const getArtworks = () => {
        axios
            .get("/api/gallery_artworks")
            .then((response) => {
                const data = response.data.data || [];
                setArtworks(data);
                setFilteredArtworks(data);
            })
            .catch((error) => {
                console.error("Error fetching artworks:", error);
            });
    };

    const getActiveAd = () => {
        axios
            .get("/api/gallery_active_ad")
            .then((response) => {
                if (response.data.success && response.data.data) {
                    const ad = response.data.data;
                    setAdFormData({
                        title: ad.title || "",
                        ad_image_desktop: ad.ad_image_desktop || "",
                        ad_image_mobile: ad.ad_image_mobile || "",
                        ad_link_url: ad.ad_link_url || "",
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching active ad:", error);
            });
    };

    // --- BÚSQUEDA FILTRADA (SOLO PARA OBRAS) ---
    const handleSearchChange = (e) => {
        const searchText = e.target.value;
        setSearch(searchText);
        const filtered = searchText
            ? artworks.filter(
                  (art) =>
                      art.title
                          .toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                      art.autor
                          .toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                      art.technique
                          .toLowerCase()
                          .includes(searchText.toLowerCase()),
              )
            : artworks;
        setFilteredArtworks(filtered);
    };

    // --- SISTEMA DE NOTIFICACIONES ---
    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    useEffect(() => {
        if (notificationVisible) {
            const progressBar = document.querySelector(".notification-bar");
            if (progressBar)
                progressBar.classList.add("notification-bar-progress");

            setTimeout(() => {
                setNotificationVisible(false);
                getArtworks();
                getActiveAd();
            }, 1500);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    // --- FORMULARIO Y VALIDACIONES (OBRAS DE ARTE) ---
    const [formData, setFormData] = useState({
        title: "",
        autor: "",
        technique: "",
        year: "",
        image_url: "",
    });

    const [errors, setErrors] = useState({
        title: "",
        autor: "",
        technique: "",
        year: "",
        image_url: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const newErrors = { ...errors };
        newErrors[name] = value === "" ? `* ${name} is required` : "";
        setErrors(newErrors);
    };

    const isFormValid =
        formData.title !== "" &&
        formData.autor !== "" &&
        formData.technique !== "" &&
        formData.year !== "" &&
        formData.image_url !== "";

    // --- MANEJO DE PUBLICIDAD PARÓDICA ---
    const handleAdChange = (e) => {
        const { name, value } = e.target;
        setAdFormData({ ...adFormData, [name]: value });
    };

    const isAdFormValid =
        adFormData.ad_image_desktop !== "" && adFormData.ad_image_mobile !== "";

    // --- MANEJO DE MODALES Y BOTONES DE CONTROL ---
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [artworkIdUpdate, setArtworkIdUpdate] = useState(null);
    const [isButtonAddEnabled, setIsButtonAddEnabled] = useState(true);

    const handleButtonAddClick = () => {
        setFormData({
            title: "",
            autor: "",
            technique: "",
            year: new Date().getFullYear().toString(),
            image_url: "",
        });
        setIsButtonAddEnabled(false);
        setEditMode(false);
        setShowAddForm(true);
    };

    const handleButtonClick = () => {
        setIsButtonEnabled(false);
    };

    // --- OPERACIONES DEL CRUD ---

    const handleAddArtwork = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/gallery_store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error adding artwork.");

            showNotification("Artwork added successfully");
            setShowAddForm(false);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(error.message);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        }
    };

    const handleEdit = async (artwork) => {
        try {
            const response = await axios.post(
                "/api/gallery_edit",
                { id: artwork.id },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            );

            if (response.data.success) {
                const art = response.data.data;
                setFormData({
                    title: art.title,
                    autor: art.autor,
                    technique: art.technique,
                    year: art.year,
                    image_url: art.image_url,
                });
                setArtworkIdUpdate(art.id);
                setEditMode(true);
                setShowAddForm(true);
            }
        } catch (error) {
            console.error("Error loading artwork info:", error);
            alert("Error loading artwork info.");
            setIsButtonEnabled(true);
        }
    };

    const handleUpdateArtwork = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `/api/gallery_update/${artworkIdUpdate}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(formData),
                },
            );

            if (!response.ok) throw new Error("Error updating artwork.");

            showNotification("Artwork updated successfully");
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
            const response = await axios.delete(`/api/gallery_destroy/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.data.success) {
                showNotification("Artwork deleted successfully");
                setIsButtonEnabled(true);
            }
        } catch (error) {
            console.error(error);
            setIsButtonEnabled(true);
            alert("Error deleting artwork");
        }
    };

    const handleUpdateParodyAd = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "/api/gallery_update_ad",
                adFormData,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            );

            if (response.data.success) {
                showNotification("Parody Ad space updated");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating parity advertising space.");
        }
    };

    return (
        <>
            <br />
            {/* SELECTOR / PESTAÑAS ADMINISTRATIVAS */}
            <Container className="mt-5">
                <div className="d-flex mb-4" style={{ gap: "10px" }}>
                    <MDBBtn
                        color={activeTab === "artworks" ? "dark" : "light"}
                        style={{ borderRadius: "0px", letterSpacing: "1px" }}
                        onClick={() => setActiveTab("artworks")}
                    >
                        CATÁLOGO DE ARTE
                    </MDBBtn>
                    <MDBBtn
                        color={activeTab === "parody_ad" ? "dark" : "light"}
                        style={{ borderRadius: "0px", letterSpacing: "1px" }}
                        onClick={() => setActiveTab("parody_ad")}
                    >
                        PUBLICIDAD PARÓDICA
                    </MDBBtn>
                </div>
            </Container>

            {activeTab === "artworks" ? (
                <>
                    <div className="d-flex">
                        <Container>
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
                                                    <path d="M16.853 16.854a.5.5 0 0 0 .707 0l3.793-3.793a.5.5 0 0 0 0-.707l-3.793-3.793a.5.5 0 0 0-.707.707L19.293 12H10.5a.5.5 0 0 0 0 1h8.793l-2.646 2.646a.5.5 0 0 0 0 .707z" />
                                                </svg>
                                            </InputGroup.Text>
                                            <FormControl
                                                type="search"
                                                className="me-2"
                                                placeholder="Buscar por Título, Autor o Técnica..."
                                                value={search}
                                                onChange={handleSearchChange}
                                            />
                                        </InputGroup>
                                    </Form>
                                </Col>
                            </Row>
                        </Container>

                        <MDBBtn
                            class={`custom-button ${!isButtonAddEnabled ? "clicked" : ""}`}
                            size="lg"
                            className="mb-4 w-100"
                            style={{ borderRadius: "0px" }}
                            type="button"
                            disabled={!isButtonAddEnabled}
                            onClick={handleButtonAddClick}
                        >
                            ADD NEW ARTWORK
                        </MDBBtn>
                    </div>
                    <br />

                    <MDBTable style={{ verticalAlign: "middle" }}>
                        <MDBTableHead dark>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Título</th>
                                <th scope="col">Autor / Colectivo</th>
                                <th scope="col">Técnica</th>
                                <th scope="col">Año</th>
                                <th scope="col" className="text-center">
                                    Actions
                                </th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {filteredArtworks.map((art) => (
                                <tr key={art.id}>
                                    <th scope="row">{art.id}</th>
                                    <td>
                                        <strong>{art.title}</strong>
                                    </td>
                                    <td>{art.autor}</td>
                                    <td>{art.technique}</td>
                                    <td>{art.year}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <MDBBtn
                                                class={`custom-button ${!isButtonEnabled ? "clicked" : ""}`}
                                                size="md"
                                                style={{ borderRadius: "0px" }}
                                                disabled={!isButtonEnabled}
                                                onClick={() => {
                                                    handleButtonClick();
                                                    handleEdit(art);
                                                }}
                                            >
                                                EDIT
                                            </MDBBtn>
                                            <MDBBtn
                                                class={`custom-button ${!isButtonEnabled ? "clicked" : ""}`}
                                                size="md"
                                                style={{ borderRadius: "0px" }}
                                                disabled={!isButtonEnabled}
                                                onClick={() => {
                                                    handleButtonClick();
                                                    handleDelete(art.id);
                                                }}
                                            >
                                                DELETE
                                            </MDBBtn>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </MDBTableBody>
                    </MDBTable>
                </>
            ) : (
                <Container
                    className="p-4"
                    style={{
                        backgroundColor: "rgb(18, 18, 18)",
                        border: "1px solid #333",
                    }}
                >
                    <h4
                        className="text-white mb-4"
                        style={{ fontFamily: "monospace" }}
                    >
                        // GESTIÓN DE ESPACIO PUBLICITARIO MAESTRO
                    </h4>
                    <form onSubmit={handleUpdateParodyAd}>
                        <Row>
                            <Col md={6}>
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Etiqueta / Título de Campaña (Ej: ANUNCIO PATROCINADO)"
                                    id="ad_title"
                                    type="text"
                                    name="title"
                                    contrast
                                    value={adFormData.title}
                                    onChange={handleAdChange}
                                />
                            </Col>
                            <Col md={6}>
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Enlace Destino (ad_link_url)"
                                    id="ad_link_url"
                                    type="text"
                                    name="ad_link_url"
                                    contrast
                                    value={adFormData.ad_link_url}
                                    onChange={handleAdChange}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Image URL - Desktop Layout (Horizontal)"
                                    id="ad_image_desktop"
                                    type="text"
                                    name="ad_image_desktop"
                                    contrast
                                    value={adFormData.ad_image_desktop}
                                    onChange={handleAdChange}
                                />
                            </Col>
                            <Col md={6}>
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Image URL - Mobile Layout (Square / Vertical)"
                                    id="ad_image_mobile"
                                    type="text"
                                    name="ad_image_mobile"
                                    contrast
                                    value={adFormData.ad_image_mobile}
                                    onChange={handleAdChange}
                                />
                            </Col>
                        </Row>
                        <MDBBtn
                            type="submit"
                            color="success"
                            disabled={!isAdFormValid}
                            style={{ borderRadius: "0px", width: "150px" }}
                        >
                            SAVE BANNERS
                        </MDBBtn>
                    </form>
                </Container>
            )}

            {/* MODAL INDUSTRIAL | AGREGAR Y ACTUALIZAR OBRAS DE ARTE */}
            <Modal
                show={showAddForm}
                onHide={() => {
                    setShowAddForm(false);
                    setIsButtonAddEnabled(true);
                    setIsButtonEnabled(true);
                }}
            >
                <Modal.Header
                    className={
                        editMode
                            ? "bg-primary text-white"
                            : "bg-warning text-dark"
                    }
                    style={{
                        borderRadius: "0px",
                        borderBottom: "1px solid #333",
                    }}
                >
                    <Modal.Title
                        style={{ fontSize: "1rem", fontFamily: "monospace" }}
                    >
                        {editMode
                            ? "// SYSTEM_UPDATE_ARTWORK"
                            : "// SYSTEM_NEW_ARTWORK"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "rgb(20, 20, 20)" }}>
                    <img
                        src="/img/logosmc.svg"
                        alt="Logo"
                        style={{
                            maxWidth: "40%",
                            margin: "auto",
                            display: "block",
                            marginBottom: "20px",
                        }}
                    />
                    <form
                        onSubmit={
                            editMode ? handleUpdateArtwork : handleAddArtwork
                        }
                    >
                        {errors.title && (
                            <p className="text-danger small">{errors.title}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Artwork Title"
                            id="title"
                            type="text"
                            name="title"
                            contrast
                            value={formData.title}
                            onChange={handleChange}
                        />

                        {errors.autor && (
                            <p className="text-danger small">{errors.autor}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Artist / Collective"
                            id="autor"
                            type="text"
                            name="autor"
                            contrast
                            value={formData.autor}
                            onChange={handleChange}
                        />

                        {errors.technique && (
                            <p className="text-danger small">
                                {errors.technique}
                            </p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Technique (e.g., Digital Morphing, Oil, Textile)"
                            id="technique"
                            type="text"
                            name="technique"
                            contrast
                            value={formData.technique}
                            onChange={handleChange}
                        />

                        {errors.year && (
                            <p className="text-danger small">{errors.year}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Year"
                            id="year"
                            type="number"
                            name="year"
                            contrast
                            value={formData.year}
                            onChange={handleChange}
                        />

                        {errors.image_url && (
                            <p className="text-danger small">
                                {errors.image_url}
                            </p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Artwork Image Asset URL"
                            id="image_url"
                            type="text"
                            name="image_url"
                            contrast
                            value={formData.image_url}
                            onChange={handleChange}
                        />

                        <MDBBtn
                            class={`custom-button ${!isButtonEnabled ? "clicked" : ""} mb-4 w-100`}
                            size="lg"
                            type="submit"
                            style={{ borderRadius: "0px" }}
                            disabled={!isFormValid}
                        >
                            {editMode ? "SAVE CHANGES" : "PUSH TO GALLERY"}
                        </MDBBtn>
                    </form>
                </Modal.Body>
            </Modal>

            {/* INTERFAZ DE NOTIFICACIONES */}
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

export default CrudGallery;
