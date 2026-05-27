import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { MDBTypography, MDBIcon } from "mdb-react-ui-kit";
import "/resources/css/app.css";

function EventView() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/events_show",
                    { id: id },
                );

                if (response.data) {
                    setEvent(response.data);
                } else {
                    console.error("Event not found");
                }
            } catch (error) {
                console.error("Error cargando el evento:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEventData();
        }
    }, [id]);

    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center py-5"
                style={{ minHeight: "60vh" }}
            >
                <Spinner animation="border" role="status" variant="light">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-5 text-white">
                <h3>Lookbook no encontrado</h3>
                <Link to="/" className="text-white text-decoration-underline">
                    Volver al inicio
                </Link>
            </div>
        );
    }

    const lookbookImages =
        event.images && Array.isArray(event.images)
            ? event.images.map((img) => img.image_path)
            : [];

    // Función auxiliar para comprobar si el path es URL absoluta o relativa local
    const renderImagePath = (path) => {
        if (!path) return "";
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }
        return `http://127.0.0.1:8000${path}`;
    };

    return (
        <div
            className="event-view-container"
            style={{
                backgroundColor: "#000000",
                minHeight: "100vh",
                color: "#ffffff",
            }}
        >
            {/* 1. SECCIÓN BANNER */}
            <div
                className="event-banner"
                style={{
                    width: "100%",
                    height: "75vh",
                    backgroundImage: `url(${renderImagePath(event.banner_path)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                }}
            />

            {/* 2. CUADRO NEGRO SUPERPUESTO */}
            <div className="event-content-wrapper">
                <div className="text-center mb-5">
                    <h1
                        style={{
                            fontFamily:
                                "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                            fontSize: "3.5rem",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            marginBottom: "5px",
                            color: "#ffffff",
                        }}
                    >
                        {event.title}
                    </h1>

                    {event.date && (
                        <p
                            style={{
                                textTransform: "uppercase",
                                fontSize: "0.9rem",
                                letterSpacing: "3px",
                                color: "#888888",
                            }}
                        >
                            {event.date}
                        </p>
                    )}

                    {event.description && (
                        <p
                            style={{
                                maxWidth: "600px",
                                margin: "20px auto 0 auto",
                                color: "#cccccc",
                                fontSize: "1rem",
                                lineHeight: "1.6",
                            }}
                        >
                            {event.description}
                        </p>
                    )}
                </div>

                {/* 3. GALERÍA VERTICAL */}
                <div
                    className="event-vertical-gallery"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "30px",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    {lookbookImages.map((imgUrl, index) => (
                        <img
                            key={index}
                            src={renderImagePath(imgUrl)}
                            alt={`Lookbook view ${index + 1}`}
                            style={{
                                width: "100%",
                                height: "auto",
                                maxWidth: "800px",
                                display: "block",
                                objectFit: "cover",
                                border: "1px solid #222",
                            }}
                        />
                    ))}
                </div>

                {/* BOTÓN REGRESAR */}
                <div className="d-flex align-items-center justify-content-center pt-5">
                    <MDBTypography tag="h6" className="mb-0">
                        <Link
                            to="/store"
                            className="text-white d-flex align-items-center"
                            style={{
                                textDecoration: "none",
                                letterSpacing: "1px",
                            }}
                        >
                            <MDBIcon fas icon="long-arrow-alt-left me-2" />
                            Back to Store
                        </Link>
                    </MDBTypography>
                </div>
            </div>
        </div>
    );
}

export default EventView;
