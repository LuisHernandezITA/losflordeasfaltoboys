import React, { useState } from "react";
import { Card, Badge } from "react-bootstrap";
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
            className="my-card-music-list w-100 shadow border-0"
            style={{
                maxWidth: "1100px",
                backgroundColor: "rgb(25, 25, 25)",
                overflow: "hidden",
                borderRadius: "15px",
                border: "1px solid #333 !important",
            }}
        >
            <div className="row g-0">
                {/* IMAGEN / CARÁTULA */}
                <div className="col-12 col-md-5">
                    <div style={{ aspectRatio: "1/1", overflow: "hidden" }}>
                        <img
                            src={image}
                            alt={nombre}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                </div>

                {/* INFO DE LA CANCIÓN */}
                <div className="col-12 col-md-7">
                    <Card.Body className="p-4 p-lg-5 d-flex flex-column h-100">
                        <div>
                            <Card.Subtitle
                                className="mb-4 text-white-50"
                                style={{
                                    fontSize: "1rem",
                                    fontWeight: "300",
                                }}
                            >
                                {artista}
                            </Card.Subtitle>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <Card.Title className="music-title text-white">
                                    {nombre}
                                </Card.Title>
                                {etiqueta && (
                                    <Badge
                                        bg="secondary"
                                        className="px-3 py-2 text-uppercase"
                                    >
                                        {etiqueta}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto d-flex justify-content-between align-items-center border-top border-secondary pt-4">
                            <MDBBtn
                                // Mantengo tu atributo class intacto tal como lo usas
                                class={`custom-button ${isButtonDisabled ? "clicked" : ""} d-flex align-items-center justify-content-center`}
                                onClick={handleListenClick}
                                disabled={isButtonDisabled}
                                style={{
                                    boxShadow: "none", // Evita destellos extraños de Bootstrap
                                    outline: "none", // Elimina el borde de enfoque activo
                                    height: "45px", // Forzamos una altura fija para que NUNCA cambie de tamaño al mutar el texto
                                    padding: "0 15px",
                                    transition: "all 0.2s ease",
                                    minWidth: "200px", // Mantiene el ancho mínimo original de tu tarjeta de música

                                    // TRUCO CONTROL ESTRICTO PARA EVITAR EL AZUL DE MDB CON DISABLED:
                                    backgroundColor: isButtonDisabled
                                        ? "rgb(45, 45, 45) !important"
                                        : undefined,
                                    borderColor: isButtonDisabled
                                        ? "#333 !important"
                                        : undefined,
                                    color: isButtonDisabled
                                        ? "#aaa !important"
                                        : undefined,
                                }}
                            >
                                <MDBIcon
                                    fas
                                    icon={isButtonDisabled ? "check" : "play"}
                                    className="me-2"
                                />
                                {/* Contenedor interno para evitar saltos bruscos en el texto */}
                                <span
                                    style={{
                                        fontWeight: "600",
                                        letterSpacing: "0.5px",
                                    }}
                                >
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
