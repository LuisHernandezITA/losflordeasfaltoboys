import React from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import "/resources/css/app.css";

function AboutUs() {
    const expedienteEquipo = {
        nivel1: {
            handle: "@losflordeasfalto",
            puesto: "DIRECTOR CREATIVO",
            status: "PRIMARY TARGET",
            alias: "NÚCLEO",
            bio: "El Asfalto.",
            foto: "https://i.postimg.cc/XNC7nVBD/losflordeasfalto.jpg",
        },
        nivel2: [
            {
                handle: "@_call2002",
                puesto: "FOTÓGRAFO",
                status: "EXTERNAL NEXUS",
                alias: "LENTE",
                bio: "Camarografo Oficial del Proyecto",
                foto: "https://i.postimg.cc/Wpkbs2qY/call2002.jpg",
            },
            {
                handle: "@fntsm_13_",
                puesto: "CREATIVO",
                status: "EXTERNAL NEXUS",
                alias: "ESPECTRO",
                bio: "Creativo Colaborador.",
                foto: "https://i.postimg.cc/HWysTp82/fntsm-13.jpg",
            },
        ],
        nivel3: [
            {
                handle: "@ooddiio",
                puesto: "CREATIVO",
                status: "UNDER MONITORING",
                alias: "TRAZO / VECTOR",
                bio: "Creativo Colaborador.",
                foto: "https://i.postimg.cc/gcZkGYLN/ooddiio.jpg",
            },
        ],
    };

    return (
        <Container
            fluid
            className="px-3 px-md-5 py-5"
            style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}
        >
            {/* ENCABEZADO DE EXPEDIENTE CLASIFICADO */}
            <div className="mb-5 border-bottom border-danger pb-4 position-relative">
                <span
                    className="position-absolute top-0 end-0 text-danger px-2 py-1 border border-danger fw-bold small rounded-0 d-none d-sm-block"
                    style={{ letterSpacing: "2px", fontSize: "0.75rem" }}
                >
                    [ CLASSIFIED / TOP SECRET ]
                </span>
                <h1
                    className="text-white display-4 fw-black text-uppercase m-0"
                    style={{
                        fontFamily: "'Impact', 'Arial Black', sans-serif",
                        letterSpacing: "3px",
                    }}
                >
                    EXPEDIENTES FLR_ASF
                </h1>
                <p
                    className="text-muted text-uppercase small tracking-widest mt-2"
                    style={{ fontFamily: "monospace" }}
                >
                    ORGANIGRAM_MAP // FILE_NO_2026.TXT
                </p>
            </div>

            {/* ==================================================================== */}
            {/* NIVEL 1: ALTO MANDO */}
            {/* ==================================================================== */}
            <div className="text-center mb-5">
                <div
                    className="text-uppercase text-danger small mb-3 tracking-widest fw-bold"
                    style={{ fontFamily: "monospace" }}
                >
                    // NIVEL_01: DIRECCIÓN CREATIVO PRINCIPAL
                </div>

                <Row className="justify-content-center">
                    <Col xs={12} sm={8} md={5} lg={4}>
                        <div
                            className="p-3 bg-black border border-danger text-start rounded-0"
                            style={{ boxShadow: "8px 8px 0px #800020" }}
                        >
                            <div
                                className="position-relative bg-dark mb-3"
                                style={{
                                    height: "300px",
                                    border: "2px solid #333",
                                }}
                            >
                                <img
                                    src={expedienteEquipo.nivel1.foto}
                                    alt={expedienteEquipo.nivel1.handle}
                                    className="w-100 h-100 object-fit-cover"
                                    style={{
                                        filter: "grayscale(100%) contrast(125%) brightness(90%)",
                                    }}
                                />
                                <Badge
                                    bg="danger"
                                    className="position-absolute bottom-0 start-0 m-2 rounded-0 text-uppercase fw-black"
                                    style={{
                                        fontSize: "0.75rem",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    {expedienteEquipo.nivel1.status}
                                </Badge>
                            </div>

                            <h3
                                className="text-white h4 fw-black text-uppercase m-0"
                                style={{
                                    fontFamily: "'Impact', sans-serif",
                                    letterSpacing: "1px",
                                }}
                            >
                                {expedienteEquipo.nivel1.handle}
                            </h3>
                            <div
                                className="text-warning small fw-bold text-uppercase mb-2"
                                style={{
                                    fontFamily: "monospace",
                                    letterSpacing: "1px",
                                }}
                            >
                                {expedienteEquipo.nivel1.puesto}
                            </div>

                            <div
                                className="text-muted small border-top border-secondary pt-2 mt-2"
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: "0.8rem",
                                }}
                            >
                                <span className="text-danger fw-bold">
                                    ID_CODE:
                                </span>{" "}
                                {expedienteEquipo.nivel1.alias}
                                <br />
                                <p className="mt-1 text-white-50 m-0">
                                    {expedienteEquipo.nivel1.bio}
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* HILO ROJO CONECTOR */}
            <div className="d-none d-md-flex justify-content-center my-4 opacity-50">
                <div
                    style={{
                        width: "2px",
                        height: "40px",
                        backgroundColor: "#ff0000",
                    }}
                ></div>
            </div>

            {/* ==================================================================== */}
            {/* NIVEL 2: OPERATIVOS / TÁCTICOS */}
            {/* ==================================================================== */}
            <div className="text-center mb-5">
                <div
                    className="text-uppercase text-muted small mb-4 tracking-widest"
                    style={{ fontFamily: "monospace" }}
                >
                    // NIVEL_02: NÚCLEO OPERATIVO Y GRÁFICO
                </div>

                <Row className="justify-content-center gap-4 gap-md-0">
                    {expedienteEquipo.nivel2.map((member, index) => (
                        <Col
                            key={index}
                            xs={12}
                            sm={8}
                            md={5}
                            lg={4}
                            className="text-start md-mx-2 mb-4"
                        >
                            <div
                                className="p-3 bg-black border border-secondary rounded-0"
                                style={{ boxShadow: "6px 6px 0px #222" }}
                            >
                                <div
                                    className="position-relative bg-dark mb-3"
                                    style={{
                                        height: "250px",
                                        border: "1px solid #222",
                                    }}
                                >
                                    <img
                                        src={member.foto}
                                        alt={member.member}
                                        className="w-100 h-100 object-fit-cover"
                                        style={{
                                            filter: "grayscale(100%) contrast(115%)",
                                        }}
                                    />
                                    <Badge
                                        bg="warning"
                                        className="text-dark position-absolute bottom-0 start-0 m-2 rounded-0 text-uppercase fw-bold"
                                        style={{ fontSize: "0.7rem" }}
                                    >
                                        {member.status}
                                    </Badge>
                                </div>

                                <h4 className="text-white h5 fw-bold text-uppercase m-0">
                                    {member.handle}
                                </h4>
                                <div
                                    className="text-white-50 small fw-bold text-uppercase mb-2"
                                    style={{
                                        fontSize: "0.75rem",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    {member.puesto}
                                </div>

                                <div
                                    className="text-muted small border-top border-secondary pt-2 mt-2"
                                    style={{
                                        fontFamily: "monospace",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    <span className="text-warning fw-bold">
                                        ID_CODE:
                                    </span>{" "}
                                    {member.alias}
                                    <br />
                                    <p className="mt-1 text-white-50 m-0">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* OTRO CONECTOR */}
            <div className="d-none d-md-flex justify-content-center my-4 opacity-25">
                <div
                    style={{
                        width: "2px",
                        height: "40px",
                        backgroundColor: "#ffffff",
                    }}
                ></div>
            </div>

            {/* ==================================================================== */}
            {/* NIVEL 3: ENLACES / DESARROLLO */}
            {/* ==================================================================== */}
            <div className="text-center">
                <div
                    className="text-uppercase text-muted small mb-4 tracking-widest"
                    style={{ fontFamily: "monospace" }}
                >
                    // NIVEL_03: DIFUSIÓN Y ENLACE PERIFÉRICO
                </div>

                <Row className="justify-content-center gap-4 gap-md-0">
                    {expedienteEquipo.nivel3.map((member, index) => (
                        <Col
                            key={index}
                            xs={12}
                            sm={8}
                            md={5}
                            lg={4}
                            className="text-start mb-4"
                        >
                            <div
                                className="p-3 bg-black border border-secondary rounded-0"
                                style={{
                                    boxShadow: "6px 6px 0px #151515",
                                    opacity: "0.9",
                                }}
                            >
                                <div
                                    className="position-relative bg-dark mb-3"
                                    style={{
                                        height: "220px",
                                        border: "1px solid #1a1a1a",
                                    }}
                                >
                                    <img
                                        src={member.foto}
                                        alt={member.handle}
                                        className="w-100 h-100 object-fit-cover"
                                        style={{
                                            filter: "grayscale(100%) brightness(80%) contrast(110%)",
                                        }}
                                    />
                                    <Badge
                                        bg="secondary"
                                        className="position-absolute bottom-0 start-0 m-2 rounded-0 text-uppercase fw-bold"
                                        style={{
                                            fontSize: "0.65rem",
                                            color: "#000",
                                        }}
                                    >
                                        {member.status}
                                    </Badge>
                                </div>

                                <h4 className="text-white-50 h6 fw-bold text-uppercase m-0">
                                    {member.handle}
                                </h4>
                                <div
                                    className="text-muted small text-uppercase mb-2"
                                    style={{
                                        fontSize: "0.7rem",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    {member.puesto}
                                </div>

                                <div
                                    className="text-muted small border-top border-secondary pt-2 mt-2"
                                    style={{
                                        fontFamily: "monospace",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    <span className="text-secondary fw-bold">
                                        ID_CODE:
                                    </span>{" "}
                                    {member.alias}
                                    <br />
                                    <p className="mt-1 text-white-50 m-0">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        </Container>
    );
}

export default AboutUs;
