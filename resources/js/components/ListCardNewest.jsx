import React, { useState, useEffect } from "react";
import { Spinner, Container, Badge } from "react-bootstrap";
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getHomeData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/home_data",
                );
                setHomeData({
                    ultimoBlog: response.data.ultimoBlog,
                    productos: response.data.productos || [],
                });
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

    const { ultimoBlog, productos } = homeData;

    return (
        <Container
            fluid
            className="px-3 px-md-5 py-4"
            style={{ backgroundColor: "#121212", minHeight: "100vh" }}
        >
            {/* SECCIÓN 1: ÚLTIMO BLOG (ALTURA AUMENTADA A 480PX) */}
            {/* SECCIÓN 1: ÚLTIMO BLOG + PUBLICIDAD PARÓDICA */}
            {ultimoBlog && (
                <div className="d-flex flex-column flex-md-row gap-4 mb-5">
                    {/* CONTENEDOR DEL BLOG (Ocupa el espacio principal) */}
                    <div
                        className="position-relative rounded-0 shadow flex-grow-1"
                        style={{
                            height: "480px",
                            overflow: "hidden",
                            border: "2px solid #222",
                            backgroundImage: `linear-gradient(to right, rgba(18, 18, 18, 1) 40%, rgba(18, 18, 18, 0.4) 75%, rgba(18, 18, 18, 0) 100%), url(${ultimoBlog.banner})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center right",
                        }}
                    >
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
                                        className="custom-button d-inline-flex align-items-center justify-content-center"
                                        style={{
                                            boxShadow: "none",
                                            outline: "none",
                                            height: "45px",
                                            padding: "0 25px",
                                            transition: "all 0.2s ease",
                                            fontWeight: "600",
                                            borderRadius: "0px",
                                        }}
                                    >
                                        <MDBIcon
                                            fas
                                            icon="book-open"
                                            className="me-2"
                                        />{" "}
                                        LEER BLOGS
                                    </MDBBtn>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ESPACIO DE PUBLICIDAD PARÓDICA */}
                    <div
                        className="d-flex flex-column justify-content-between text-center align-items-center position-relative"
                        style={{
                            flex: "0 0 240px", // Ancho fijo ideal para un banner vertical en web (Skyscraper)
                            height: "480px",
                            border: "2px solid #ff0055", // Borde agresivo y chillón típico de anuncios
                            backgroundColor: "#000",
                            overflow: "hidden",
                        }}
                    >
                        {/* Pequeña etiqueta de aviso (opcional para simular más realismo web) */}
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
                            }}
                        >
                            [ SPONSORED AD ]
                        </span>

                        {/* Imagen del anuncio falso */}
                        <img
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=240&auto=format&fit=crop" // Placeholder temporal, cámbialo por tu arte
                            alt="Parody Advertisement"
                            className="w-100 h-100 object-fit-cover"
                            style={{
                                transition: "transform 0.3s ease",
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                alert(
                                    "¡Felicidades, eres el visitante número 1,000,000! ʘ‿ʘ",
                                )
                            }
                        />
                    </div>
                </div>
            )}

            {/* SECCIÓN 2: NUEVOS PRODUCTOS */}
            <div className="mt-5">
                <div className="d-flex align-items-center mb-4 px-2">
                    <h2
                        className="text-white m-0 text-uppercase fw-bold"
                        style={{ letterSpacing: "1px", fontSize: "1.6rem" }}
                    >
                        ⋆｡‧₊°♱ Nuevos Productos!
                    </h2>
                    <div className="flex-grow-1 ms-3 border-top border-secondary opacity-25"></div>
                </div>

                {/* CONTENEDOR CARRUSEL UNIFICADO WEB/MÓVIL */}
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
                                    />
                                </div>
                            ))}
                    </div>
                </div>

                <div className="text-center mt-4 mb-5">
                    <Link to="/store" className="ver-todo-link">
                        IR A LA TIENDA <i className="fas fa-eye ms-1"></i>
                    </Link>
                </div>
            </div>
        </Container>
    );
}

export default ListCardNewest;
