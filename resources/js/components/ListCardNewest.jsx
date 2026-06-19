import React, { useState, useEffect } from "react";
import { Spinner, Container, Row, Col } from "react-bootstrap";
import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import axios from "axios";
import Card_C from "./Card_C";
import "/resources/css/app.css";
import { Link } from "react-router-dom";

function ListCardNewest() {
    const [homeData, setHomeData] = useState({
        ultimoBlog: null,
        productos: [],
    });
    const [activeAd, setActiveAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const { ultimoBlog, productos } = homeData;

    const [asciiIndex, setAsciiIndex] = useState(0);
    const asciiList = [
        "≽(•-˕--• ≼マ▄︻デ╦═━ ⋅⋆⭒˚｡⋆",
        "≽(•-˕--• ≼マ▄︻デ┳═── ✶☆─⋆⭒˚｡⋆",
        "≽(•-˕--• ≼マ▄︻デ╤═─ ˚｡✶☆⋅⋆ ──⋆⭒˚｡⋆",
        "≽(•-˕--• ≼マ▄︻デ╦═×━ ⋅ ─˚｡✶☆⋅ ──⋆⋆⭒˚｡⋆",
        "≽(•-˕--• ≼マ▄︻デ╦═━          ",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setAsciiIndex((prevIndex) => (prevIndex + 1) % asciiList.length);
        }, 100); // Cambia cada 3 segundos
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const getHomeData = async () => {
            try {
                const [homeRes, adRes] = await Promise.all([
                    axios.get("/api/home_data"),
                    axios.get("/api/gallery_active_ad"),
                ]);

                setHomeData({
                    ultimoBlog: homeRes.data.ultimoBlog,
                    productos: homeRes.data.productos || [],
                });

                setActiveAd(adRes.data.data);
            } catch (error) {
                console.error(
                    "Error cargando los datos de la home principal:",
                    error,
                );
            } finally {
                setLoading(false);
            }
        };
        getHomeData();
    }, []);

    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "60vh" }}
            >
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Container
            fluid
            className="px-3 px-md-5 py-2"
            style={{ backgroundColor: "#121212", minHeight: "100vh" }}
        >
            {/* ==================================================================== */}
            {/* SECCIÓN 2: NUEVOS PRODUCTOS                                          */}
            {/* ==================================================================== */}
            <div className="pt-2 border-bottom border-secondary pb-4 mb-4">
                <div className="container-fluid mb-3 px-2">
                    <div className="row align-items-center">
                        {/* Contenedor del título con fondo rojo carmesí */}
                        <div
                            className="col-12 col-md-auto px-4 py-2"
                            style={{
                                display: "inline-block",
                                width: "fit-content",
                            }}
                        >
                            <h2
                                className="glitch-text text-white m-0 text-uppercase fw-bold"
                                //className="text-white m-0 text-uppercase fw-bold"
                                style={{
                                    letterSpacing: "1px",
                                    fontSize: "1.4rem",
                                }}
                            >
                                Nuevos Productos! ♱°₊｡⋆˚｡✶☆⋅─⋆⋆⭒˚
                            </h2>
                        </div>

                        {/* Columna de relleno */}
                        <div className="col-12 col-md mt-2 mt-md-0">
                            {/* Línea en escritorio */}
                            <div className="d-none d-md-block border-top border-secondary opacity-25 w-100"></div>
                        </div>
                    </div>
                </div>

                <div className="custom-horizontal-carousel-container position-relative">
                    <div className="custom-horizontal-carousel d-flex flex-nowrap px-2 pb-3">
                        {Array.isArray(productos) &&
                            productos.map((product) => (
                                <div
                                    key={product.id}
                                    className="carousel-card-item"
                                >
                                    <Card_C
                                        id={product.id}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price}
                                        image_primary={product.image_primary}
                                        available={product.available}
                                        showDescription={true}
                                    />
                                </div>
                            ))}
                    </div>
                </div>

                <div className="text-center mt-4">
                    <Link to="/store" className="ver-todo-link">
                        IR A LA TIENDA <i className="fas fa-eye ms-1"></i>
                    </Link>
                </div>
            </div>

            {/* ==================================================================== */}
            {/* SECCIÓN 1: ÚLTIMO BLOG + PUBLICIDAD PARÓDICA DINÁMICA                */}
            {/* ==================================================================== */}
            {ultimoBlog && (
                <div className="d-flex flex-column flex-md-row gap-4 mb-3 border-bottom border-secondary pb-4">
                    {/* CONTENEDOR DEL BLOG */}
                    <div
                        className="position-relative rounded-0 shadow flex-grow-1"
                        style={{
                            height: "480px",
                            overflow: "hidden", // Esto es vital
                            border: "2px solid #222",
                        }}
                    >
                        {/* Capa de la imagen real */}
                        <img
                            src={ultimoBlog.banner}
                            alt={ultimoBlog.title}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover", // Mantiene la relación de aspecto
                                objectPosition: "center", // Mantiene el centro de la imagen siempre en foco
                                zIndex: 0,
                            }}
                        />

                        {/* Degradado (overlay) para que el texto sea legible */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background:
                                    "linear-gradient(to right, rgba(18, 18, 18, 1) 40%, rgba(18, 18, 18, 0.4) 75%, rgba(18, 18, 18, 0) 100%)",
                                zIndex: 1,
                            }}
                        />
                        <div
                            className="d-flex flex-column justify-content-center h-100 p-4 p-md-5 position-relative"
                            style={{ maxWidth: "650px", zIndex: 2 }}
                        >
                            <div>
                                <span
                                    className="px-3 py-2 text-uppercase mb-3 d-inline-flex align-items-center justify-content-center"
                                    style={{
                                        background: "transparent",
                                        backgroundColor: "transparent",
                                        color: "#ffffff",
                                        fontSize: "0.9rem",
                                        letterSpacing: "1.5px",
                                        fontWeight: "950",
                                        borderRadius: "0px",
                                        border: "2px solid #ffffff",
                                        boxShadow:
                                            "4px 4px 0px rgba(255, 255, 255, 0.2)",
                                        fontFamily:
                                            "'Impact', 'Arial Black', sans-serif",
                                        lineHeight: "1",
                                    }}
                                >
                                    <MDBIcon
                                        fas
                                        icon="bullhorn"
                                        className="me-2"
                                        style={{ fontSize: "1rem" }}
                                    />
                                    ¡Último Blog!
                                </span>
                            </div>

                            <h1
                                className="text-white fw-bold mb-3 display-5 text-uppercase"
                                style={{ letterSpacing: "0.5px" }}
                            >
                                {ultimoBlog.title}
                            </h1>

                            <p
                                className="text-white-50 mb-4"
                                style={{
                                    fontWeight: "300",
                                    fontSize: "1.1rem",
                                    display: "-webkit-box",
                                    WebkitLineClamp: "4",
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {ultimoBlog.content}
                            </p>

                            <div>
                                <Link to="/blog">
                                    <MDBBtn
                                        size="lg"
                                        className="d-inline-flex align-items-center justify-content-center"
                                        // 2. Agrega los manejadores de eventos
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        style={{
                                            backgroundColor: isHovered
                                                ? "transparent"
                                                : "#8b0000",
                                            color: "#ffffff",
                                            border: "2px solid #8b0000",
                                            boxShadow: "none",
                                            outline: "none",
                                            height: "45px",
                                            padding: "0 25px",
                                            transition: "all 0.2s ease",
                                            fontWeight: "700",
                                            borderRadius: "0px",
                                            letterSpacing: "1px",
                                            // 3. Aplica la opacidad dinámica aquí:
                                            opacity: isHovered ? 0.8 : 1,
                                            cursor: "pointer",
                                        }}
                                    >
                                        <MDBIcon
                                            fas
                                            icon="book-open"
                                            className="me-2"
                                        />
                                        LEER BLOGS
                                    </MDBBtn>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ESPACIO DE PUBLICIDAD PARÓDICA DINÁMICA */}
                    {activeAd && (
                        <div
                            className="d-flex flex-column justify-content-between text-center align-items-center position-relative"
                            style={{
                                flex: "0 0 240px",
                                height: "480px",
                                //border: "2px solid #ff0055",
                                backgroundColor: "#000",
                                overflow: "hidden",
                            }}
                        >
                            <span
                                style={{
                                    color: "#ff0055",
                                    fontSize: "10px",
                                    letterSpacing: "2px",
                                    fontWeight: "bold",
                                    paddingTop: "5px",
                                    position: "absolute",
                                    top: 0,
                                    zIndex: 3,
                                    backgroundColor: "rgba(0,0,0,0.7)",
                                    width: "100%",
                                }}
                            >
                                [ {activeAd.title || "SPONSORED AD"} ]
                            </span>

                            <a
                                href={activeAd.ad_link_url || "#!"}
                                target="_blank"
                                rel="noreferrer"
                                className="w-100 h-100"
                            >
                                <picture>
                                    <source
                                        media="(max-width: 767px)"
                                        srcSet={activeAd.ad_image_mobile}
                                    />
                                    <img
                                        src={activeAd.ad_image_desktop}
                                        alt="Parody Advertisement"
                                        className="w-100 h-100 object-fit-cover"
                                        style={{
                                            transition: "transform 0.3s ease",
                                            cursor: "pointer",
                                        }}
                                    />
                                </picture>
                            </a>
                        </div>
                    )}
                </div>
            )}

            {/* ==================================================================== */}
            {/* SECCIÓN 3: MANIFIESTO INFORMATIVO (¿QUÉ ES OUTSIDER?)               */}
            {/* ==================================================================== */}
            <div className="pt-2 pb-4 mb-3">
                <div
                    className="p-4 p-md-5 position-relative"
                    style={{
                        backgroundColor: "#161616",
                        border: "2px solid #252525",
                        overflow: "hidden",
                    }}
                >
                    <Row className="align-items-center">
                        {/* Texto del Manifiesto / Información */}
                        <Col
                            lg={7}
                            className="text-start pe-lg-5 order-2 order-lg-1"
                        >
                            <span
                                className="text-muted d-block mb-2 small fw-bold tracking-wider"
                                style={{
                                    fontFamily: "monospace",
                                    letterSpacing: "2px",
                                }}
                            >
                                @losflordeasfalto
                            </span>

                            <h2
                                className="text-white fw-black text-uppercase mb-4 display-5"
                                style={{
                                    fontFamily:
                                        "'Impact', 'Arial Black', sans-serif",
                                    letterSpacing: "1px",
                                }}
                            >
                                OUTSIDER
                            </h2>

                            <p
                                className="text-white-50 mb-4"
                                style={{
                                    fontSize: "1.1rem",
                                    fontWeight: "300",
                                    lineHeight: "1.6",
                                    textAlign: "justify",
                                }}
                            >
                                Outsider es un colectivo de independientes
                                enfocado en la documentación y realizacion de
                                eventos alternativos, el desarrollo técnico y la
                                experimentación visual de lo que nos gusta
                                hacer. No seguimos corrientes ni jerarquías
                                tradicionales, el arte es de todos.
                            </p>

                            <p
                                className="text-white-50 mb-5"
                                style={{
                                    fontSize: "1.1rem",
                                    fontWeight: "300",
                                    lineHeight: "1.6",
                                    textAlign: "justify",
                                }}
                            >
                                Funcionamos como un entorno coral donde el
                                diseño, el arte y la creacion de experiencias
                                convergen para crear momentos autónomos fuera de
                                las normas de este puto pais.
                            </p>

                            <div>
                                <Link to="/about-us">
                                    <MDBBtn
                                        size="lg"
                                        outline
                                        color="white"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        style={{
                                            borderRadius: "0px",
                                            fontWeight: "700",
                                            letterSpacing: "1px",
                                            padding: "12px 35px",
                                            border: "2px solid #fff",
                                            // La magia ocurre aquí:
                                            backgroundColor: isHovered
                                                ? "#ffffff"
                                                : "transparent",
                                            color: isHovered
                                                ? "#000000"
                                                : "#ffffff", // Texto negro al hacer hover
                                            transform: isHovered
                                                ? "translate(-4px, -4px)"
                                                : "translate(0px, 0px)",
                                            boxShadow: isHovered
                                                ? "4px 4px 0px #8b0000"
                                                : "0px 0px 0px transparent",
                                            transition:
                                                "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        SABER MÁS
                                    </MDBBtn>
                                </Link>
                            </div>
                        </Col>

                        {/* Gráfica Destacada / Logotipo Identitario */}
                        <Col
                            lg={5}
                            className="text-center mb-4 mb-lg-0 order-1 order-lg-2"
                        >
                            <div className="p-3 d-inline-block">
                                <img
                                    src="/img/perfil.jpg"
                                    alt="Outsider Iconography"
                                    className="img-fluid"
                                    style={{
                                        maxHeight: "380px",
                                        objectFit: "contain",
                                        filter: "drop-shadow(0px 0px 15px rgba(255,255,255,0.05))",
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            {/* ASCII en móvil */}
            {/* Columna de relleno */}
            <div
                className="col-12 col-md mt-2 mt-md-0"
                style={{
                    fontSize: "0.8rem",
                    color: "#e0e0e0",
                    transition: "opacity 0.5s ease-in-out", // Efecto suave al cambiar
                }}
            >
                {asciiList[asciiIndex]}
            </div>
        </Container>
    );
}

export default ListCardNewest;
