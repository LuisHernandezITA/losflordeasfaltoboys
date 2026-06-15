import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { MDBTypography, MDBIcon } from "mdb-react-ui-kit";
import "/resources/css/app.css";

// Componente para procesar texto y convertir @usuarios en links de Instagram
const DescriptionPart = ({ text, isCredits }) => {
    const renderTextWithLinks = (text) => {
        // Regex para detectar @usuario
        const mentionRegex = /@([a-zA-Z0-9_.]+)/g;
        const parts = text.split(mentionRegex);

        return parts.map((part, i) => {
            // Si el índice es impar, es una mención encontrada por el regex
            if (i % 2 !== 0) {
                return (
                    <a
                        key={i}
                        href={`https://instagram.com/${part}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "#ff0000",
                            textDecoration: "underline",
                            transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#ff4444")}
                        onMouseLeave={(e) => (e.target.style.color = "#ff0000")}
                    >
                        @{part}
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <p
            style={{
                color: isCredits ? "#aaaaaa" : "#cccccc",
                fontSize: isCredits ? "0.8rem" : "1rem",
                fontWeight: isCredits ? "500" : "300",
                letterSpacing: isCredits ? "0.15em" : "normal",
                textTransform: isCredits ? "uppercase" : "none",
                lineHeight: isCredits ? "1.8" : "1.6",
                textAlign: "center",
                marginTop: isCredits ? "15px" : "0",
                fontFamily: "inherit",
                borderTop: isCredits ? "1px solid #333" : "none",
                paddingTop: isCredits ? "10px" : "0",
                width: isCredits ? "80%" : "100%",
                marginInline: "auto",
            }}
        >
            {renderTextWithLinks(text)}
        </p>
    );
};

function EventView() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await axios.post("/api/events_show", {
                    id: id,
                });
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

        if (id) fetchEventData();
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
        event.images && Array.isArray(event.images) ? event.images : [];

    const renderImagePath = (path) => {
        if (!path) return "";
        return path.startsWith("http") ? path : `/${path}`;
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

            <div className="event-content-wrapper">
                <div className="text-center mb-5">
                    <h1
                        style={{
                            fontFamily: "Impact, sans-serif",
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
                        <div
                            style={{
                                maxWidth: "600px",
                                margin: "20px auto 0 auto",
                            }}
                        >
                            {event.description
                                .split("||")
                                .map((part, index) => (
                                    <DescriptionPart
                                        key={index}
                                        text={part}
                                        isCredits={index > 0}
                                    />
                                ))}
                        </div>
                    )}
                </div>

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
                    {lookbookImages.map((img, index) => (
                        <a
                            key={index}
                            // Si la URL es "/", no hace nada, si tiene contenido, redirige
                            href={
                                img.target_url && img.target_url !== "/"
                                    ? img.target_url
                                    : "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: "100%",
                                maxWidth: "800px",
                                display: "block",
                                cursor:
                                    img.target_url && img.target_url !== "/"
                                        ? "pointer"
                                        : "default",
                            }}
                        >
                            <img
                                src={renderImagePath(img.image_path)}
                                alt={`Lookbook view ${index + 1}`}
                                loading="lazy"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    display: "block",
                                    objectFit: "cover",
                                    border: "1px solid #222",
                                    backgroundColor: "#111",
                                    minHeight: "200px",
                                }}
                            />
                        </a>
                    ))}
                </div>

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
