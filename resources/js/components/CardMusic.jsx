import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import "/resources/css/app.css";

function CardMusic(props) {
    const { id, nombre, artista, etiqueta, urlmusic, image } = props;

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleListenClick = () => {
        setIsButtonDisabled(true);

        if (urlmusic) {
            window.open(urlmusic, "_blank");
        }

        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 2000);
    };

    return (
        <Card
            className="my-card-music-list w-100"
            style={{
                maxWidth: "1100px",
                backgroundColor: "rgb(14, 14, 14)",
                overflow: "hidden",
                borderRadius: "0px",
                border: "1px solid #333",
                boxShadow: "none",
                margin: "0 auto",
            }}
        >
            <div className="row g-0">
                {/* IMAGEN */}
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
                                filter: "grayscale(20%) brightness(90%)",
                            }}
                        />
                    </div>
                </div>

                {/* INFO */}
                <div className="col-12 col-md-7">
                    <Card.Body
                        className="p-4 p-lg-5 d-flex flex-column h-100"
                        style={{ backgroundColor: "rgb(18, 18, 18)" }}
                    >
                        <div>
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
                                            color: "#ff3e3e",
                                            border: "1px solid #ff3e3e",
                                            padding: "2px 8px",
                                            letterSpacing: "1px",
                                        }}
                                    >
                                        {etiqueta}
                                    </span>
                                )}
                            </div>

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

                        {/* BOTÓN CORREGIDO */}
                        <div
                            className="mt-auto pt-4"
                            style={{ borderTop: "1px solid #333" }}
                        >
                            <MDBBtn
                                // CORRECCIÓN: className en lugar de class
                                className={`custom-button ${isButtonDisabled ? "clicked" : ""} d-inline-flex align-items-center justify-content-center`}
                                onClick={handleListenClick}
                                disabled={isButtonDisabled}
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
