import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";

function CardMusic(props) {
    const { id, nombre, artista, etiqueta, urlmusic, image } = props;
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleListenClick = () => {
        setIsButtonDisabled(true);
        if (urlmusic) window.open(urlmusic, "_blank");
        setTimeout(() => setIsButtonDisabled(false), 2000);
    };

    return (
        <Card
            className="w-100"
            style={{
                maxWidth: "900px",
                // Altura automática en móvil para que quepa todo, fija en escritorio
                minHeight: "auto",
                borderRadius: "0px",
                margin: "0 auto",
                position: "relative",
                overflow: "hidden",
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* CAPA DE DESENFOQUE */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backdropFilter: "blur(15px)",
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                }}
            />

            {/* CONTENIDO PRINCIPAL: Flex-column en móvil, Flex-row en md+ */}
            <div
                className="row g-0 align-items-start p-3 p-md-4 position-relative"
                style={{ zIndex: 1 }}
            >
                {/* IMAGEN: Cambia a col-12 en móvil para ir arriba */}
                <div className="col-12 col-md-4 mb-3 mb-md-0">
                    <img
                        src={image}
                        alt={nombre}
                        className="w-100"
                        style={{
                            objectFit: "cover",
                            aspectRatio: "1/1",
                        }}
                    />
                </div>

                {/* INFO */}
                <div className="col-12 col-md-8 ps-md-4 text-white">
                    <div
                        style={{
                            fontSize: "0.65rem",
                            color: "#ff3e3e",
                            letterSpacing: "2px",
                            marginBottom: "5px",
                        }}
                    >
                        {etiqueta || "SYSTEM_DATA"}
                    </div>
                    <h2
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: "800",
                            textTransform: "uppercase",
                            marginBottom: "5px",
                        }}
                    >
                        {nombre}
                    </h2>
                    <p
                        style={{
                            color: "rgba(255,255,255,0.7)",
                            marginBottom: "15px",
                            fontSize: "0.9rem",
                        }}
                    >
                        {artista}
                    </p>

                    <MDBBtn
                        onClick={handleListenClick}
                        disabled={isButtonDisabled}
                        style={{
                            backgroundColor: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            borderRadius: "0px",
                            padding: "8px 16px",
                            fontSize: "0.7rem",
                        }}
                    >
                        <MDBIcon
                            fas
                            icon={isButtonDisabled ? "check" : "play"}
                            className="me-2"
                        />
                        {isButtonDisabled ? "STREAMING" : "ESCUCHA YA!"}
                    </MDBBtn>
                </div>
            </div>
        </Card>
    );
}

export default CardMusic;
