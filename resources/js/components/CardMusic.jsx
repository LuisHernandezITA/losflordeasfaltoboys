import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import "/resources/css/app.css";

function CardMusic(props) {
    const { id, nombre, artista, etiqueta, urlmusic, image } = props;

    // Estado para el bloqueo y la animación
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleListenClick = () => {
        // 1. Bloqueamos el botón inmediatamente
        setIsButtonDisabled(true);

        // 2. Abrimos el enlace en una pestaña nueva
        if (urlmusic) {
            window.open(urlmusic, "_blank");
        }

        // 3. Después de 2 segundos, lo desbloqueamos
        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 2000);
    };

    return (
        <Card
            className="my-card-music-list w-100"
            style={{
                maxWidth: "1100px",
                backgroundColor: "rgb(14, 14, 14)", // Fondo exacto de tu galería underground
                overflow: "hidden",
                borderRadius: "0px", // Bordes completamente rectos y agresivos (estilo brutalista)
                border: "1px solid #333", // Unificación con los contenedores superiores
                boxShadow: "none",
                margin: "0 auto",
            }}
        >
            <div className="row g-0">
                {/* IMAGEN / CARÁTULA */}
                <div
                    className="col-12 col-md-5"
                    style={{ borderRight: "1px solid #333" }}
                >
                    <div
                        style={{
                            aspectRatio: "1/1",
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <img
                            src={image}
                            alt={nombre}
                            className="w-100 h-100"
                            style={{
                                objectFit: "cover",
                                filter: "grayscale(20%) brightness(90%)", // Le da un toque crudo y cinematográfico
                            }}
                        />
                    </div>
                </div>

                {/* INFO DE LA CANCIÓN */}
                <div className="col-12 col-md-7">
                    <Card.Body
                        className="p-4 p-lg-5 d-flex flex-column h-100"
                        style={{ backgroundColor: "rgb(18, 18, 18)" }}
                    >
                        <div>
                            {/* Formato de comentario de código / metadato técnico */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <Card.Subtitle
                                    className="text-white-50"
                                    style={{
                                        fontSize: "0.85rem",
                                        fontFamily:
                                            "'Roboto', 'Courier New', monospace",
                                        letterSpacing: "1px",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    // CRED: @
                                    {artista
                                        ?.toLowerCase()
                                        .replace(/\s+/g, " ")}
                                </Card.Subtitle>

                                {etiqueta && (
                                    <span
                                        style={{
                                            fontFamily:
                                                "'Roboto', 'Courier New', monospace",
                                            fontSize: "0.75rem",
                                            color: "#ff3e3e", // Rojo de alerta/sistema underground
                                            border: "1px solid #ff3e3e",
                                            padding: "2px 8px",
                                            letterSpacing: "1px",
                                        }}
                                    >
                                        {etiqueta}
                                    </span>
                                )}
                            </div>

                            {/* Título de la pista principal en mayúsculas robustas */}
                            <Card.Title
                                className="music-title text-white mb-3"
                                style={{
                                    fontFamily: "'Roboto', sans-serif",
                                    fontWeight: "800",
                                    letterSpacing: "1.5px",
                                    textTransform: "uppercase",
                                    fontSize: "1.8rem",
                                }}
                            >
                                {nombre}
                            </Card.Title>
                        </div>

                        {/* SECCIÓN DEL BOTÓN */}
                        <div
                            className="mt-auto pt-4"
                            style={{ borderTop: "1px solid #333" }}
                        >
                            <MDBBtn
                                class={`custom-button ${isButtonDisabled ? "clicked" : ""} d-inline-flex align-items-center justify-content-center`}
                                onClick={handleListenClick}
                                disabled={isButtonDisabled}
                                style={{
                                    boxShadow: "none",
                                    outline: "none",
                                    height: "45px",
                                    padding: "0 24px",
                                    transition: "all 0.15s ease-in-out",
                                    minWidth: "180px",
                                    borderRadius: "0px", // Recto
                                    fontFamily: "'Roboto', sans-serif",
                                    fontSize: "0.85rem",
                                    letterSpacing: "2px",

                                    // Estilo invertido brutalista: botón blanco con texto negro, o borde sólido
                                    backgroundColor: isButtonDisabled
                                        ? "rgb(30, 30, 30)"
                                        : "#fff",
                                    borderColor: isButtonDisabled
                                        ? "#333"
                                        : "#fff",
                                    color: isButtonDisabled ? "#666" : "#000",
                                    border: "1px solid",
                                    fontWeight: "700",
                                }}
                            >
                                <MDBIcon
                                    fas
                                    icon={isButtonDisabled ? "check" : "play"}
                                    className="me-2"
                                    style={{ fontSize: "0.8rem" }}
                                />
                                <span style={{ fontWeight: "800" }}>
                                    {isButtonDisabled ? "OPENED" : "LISTEN NOW"}
                                </span>
                            </MDBBtn>
                        </div>
                    </Card.Body>
                </div>
            </div>
        </Card>
    );
}

export default CardMusic;
