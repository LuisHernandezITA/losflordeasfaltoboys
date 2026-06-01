import React, { useState, useEffect } from "react";
import { Spinner, Container } from "react-bootstrap";
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

    useEffect(() => {
        const getHomeData = async () => {
            try {
                const [homeRes, adRes] = await Promise.all([
                    axios.get("http://localhost:8000/api/home_data"),
                    axios.get("http://localhost:8000/api/gallery_active_ad"),
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

    const { ultimoBlog, productos } = homeData;

    return (
        <Container
            fluid
            className="px-3 px-md-5 py-4"
            style={{ backgroundColor: "#121212", minHeight: "100vh" }}
        >
            {/* ==================================================================== */}
            {/* SECCIÓN 1: ÚLTIMO BLOG + PUBLICIDAD PARÓDICA DINÁMICA                */}
            {/* ==================================================================== */}
            {ultimoBlog && (
                <div className="d-flex flex-column flex-md-row gap-4 mb-5 border-bottom border-secondary pb-5">
                    {/* CONTENEDOR DEL BLOG */}
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

                    {/* ESPACIO DE PUBLICIDAD PARÓDICA DINÁMICA */}
                    {activeAd && (
                        <div
                            className="d-flex flex-column justify-content-between text-center align-items-center position-relative"
                            style={{
                                flex: "0 0 240px",
                                height: "480px",
                                border: "2px solid #ff0055",
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
            {/* SECCIÓN 2: NUEVOS PRODUCTOS                                          */}
            {/* ==================================================================== */}
            <div className="pt-2">
                <div className="d-flex align-items-center mb-4 px-2">
                    <h2
                        className="text-white m-0 text-uppercase fw-bold"
                        style={{ letterSpacing: "1px", fontSize: "1.6rem" }}
                    >
                        ⋆｡‧₊°♱ Nuevos Productos!
                    </h2>
                    <div className="flex-grow-1 ms-3 border-top border-secondary opacity-25"></div>
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
