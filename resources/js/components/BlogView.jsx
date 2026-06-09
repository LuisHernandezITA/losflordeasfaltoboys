import React, { useState, useEffect } from "react";
import { Spinner, Container, Navbar, Nav, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { MDBTypography, MDBIcon, MDBBtn } from "mdb-react-ui-kit";
import "/resources/css/app.css";

function BlogView() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- ESTADOS PARA PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchAllBlogs = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/blogs_index",
                );
                if (response.data) {
                    setBlogs(response.data);
                }
            } catch (error) {
                console.error("Error cargando el feed del blog:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllBlogs();
    }, []);

    // --- LÓGICA DE PAGINACIÓN ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = blogs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(blogs.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderImagePath = (path) => {
        if (!path) return "";
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }
        return `http://127.0.0.1:8000${path}`;
    };

    // --- UTILERÍA PARA EXTRAER EL ID DE YOUTUBE ---
    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

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

    if (blogs.length === 0) {
        return (
            <div
                className="text-center py-5 text-white"
                style={{ backgroundColor: "#000000", minHeight: "100vh" }}
            >
                <h3>No hay notas publicadas por el momento</h3>
                <Link to="/" className="text-white text-decoration-underline">
                    Volver al inicio
                </Link>
            </div>
        );
    }

    return (
        <div
            style={{
                backgroundColor: "#000000",
                minHeight: "100vh",
                color: "#ffffff",
                paddingBottom: "50px",
            }}
        >
            {/* NAV BAR */}
            <Navbar
                expand="lg"
                variant="dark"
                style={{
                    backgroundColor: "rgb(18, 18, 18)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
                className="shadow-sm py-3 w-100"
            >
                <Container fluid className="px-5">
                    <div className="d-flex align-items-center">
                        <span
                            className="glitch-text"
                            data-text="BLOG ARCHIVE ✩°｡⋆⸜"
                            style={{
                                fontSize: "1.2rem",
                                letterSpacing: "4px",
                                opacity: "0.8",
                                fontWeight: "300",
                                color: "#fff",
                            }}
                        >
                            BLOG ARCHIVE ✩°｡⋆⸜
                        </span>
                    </div>
                    <Nav className="ms-auto d-none d-md-flex align-items-center">
                        <span
                            className="small text-uppercase"
                            style={{
                                color: "rgba(255,255,255,0.3)",
                                letterSpacing: "2px",
                                fontSize: "0.7rem",
                            }}
                        >
                            Zine Vol. {currentPage.toString().padStart(2, "0")}{" "}
                            — {new Date().getFullYear()}
                        </span>
                    </Nav>
                </Container>
            </Navbar>

            {/* Contenedor del Feed de Blogs */}
            <div className="blog-feed-stream">
                {currentItems.map((post) => {
                    const ytId = getYouTubeId(post.youtube_url);

                    return (
                        <article
                            key={post.id}
                            style={{
                                borderBottom: "2px dashed #222222",
                                paddingBottom: "40px",
                                marginBottom: "40px",
                            }}
                        >
                            {/* 1. BANNER LARGO CON TÍTULO SOBREPUESTO */}
                            <div
                                className="blog-banner-container"
                                style={{
                                    width: "100%",
                                    height: "65vh",
                                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.85)), url(${renderImagePath(post.banner)})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "flex-end",
                                    paddingBottom: "4vh",
                                }}
                            >
                                <div
                                    style={{
                                        paddingLeft: "5%",
                                        paddingRight: "5%",
                                        width: "100%",
                                    }}
                                >
                                    <h1
                                        style={{
                                            backgroundColor: "#ffffff",
                                            color: "#000000",
                                            display: "inline-block",
                                            padding: "10px 25px",
                                            fontFamily:
                                                "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                                            fontSize: "clamp(2rem, 5vw, 4rem)",
                                            textTransform: "uppercase",
                                            lineHeight: "1",
                                            transform: "rotate(-0.5deg)",
                                            boxShadow: "6px 6px 0px #000000",
                                            maxWidth: "90%",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {post.title}
                                    </h1>
                                </div>
                            </div>

                            {/* 2. DATOS DE LA NOTA */}
                            <div style={{ padding: "20px 5% 10px 5%" }}>
                                <Container
                                    fluid
                                    style={{ maxWidth: "950px", padding: 0 }}
                                >
                                    <div
                                        className="d-flex flex-wrap gap-4 align-items-center"
                                        style={{
                                            color: "#666",
                                            fontSize: "0.8rem",
                                            letterSpacing: "2px",
                                        }}
                                    >
                                        <span>
                                            <MDBIcon
                                                fas
                                                icon="user"
                                                className="me-2"
                                            />{" "}
                                            {post.author.toUpperCase()}
                                        </span>
                                        <span>
                                            <MDBIcon
                                                fas
                                                icon="calendar-alt"
                                                className="me-2"
                                            />{" "}
                                            {post.published_at}
                                        </span>
                                        {post.category && (
                                            <span
                                                style={{
                                                    backgroundColor: "crimson",
                                                    color: "#fff",
                                                    padding: "1px 8px",
                                                    fontSize: "0.75rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {post.category.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </Container>
                            </div>

                            {/* 3. CUERPO DE CONTENIDO DINÁMICO & ASIMÉTRICO */}
                            <div style={{ padding: "0 5%", marginTop: "15px" }}>
                                <Container
                                    fluid
                                    style={{ maxWidth: "950px", padding: 0 }}
                                >
                                    {!post.extra_image ? (
                                        /* CASO A: Layout Estándar (Sin imagen extra) */
                                        <div
                                            style={{
                                                fontSize: "1.05rem",
                                                lineHeight: "1.75",
                                                color: "#b3b3b3",
                                            }}
                                        >
                                            {post.content
                                                .split("\n")
                                                .map((p, i) => (
                                                    <p key={i} className="mb-3">
                                                        {p}
                                                    </p>
                                                ))}
                                            {post.content_secondary &&
                                                post.content_secondary
                                                    .split("\n")
                                                    .map((p, i) => (
                                                        <p
                                                            key={i}
                                                            className="mb-3"
                                                        >
                                                            {p}
                                                        </p>
                                                    ))}
                                        </div>
                                    ) : (
                                        /* CASO B: Layout Dinámico (Con imagen extra lateral a la izquierda o derecha) */
                                        <Row
                                            className={`align-items-start ${post.image_position === "right" ? "flex-row-reverse" : ""}`}
                                        >
                                            {/* Columna de la Imagen */}
                                            <Col
                                                xs={12}
                                                md={5}
                                                className="mb-4 mb-md-0"
                                            >
                                                <div
                                                    style={{
                                                        border: "1px solid rgba(255,255,255,0.15)",
                                                        padding: "6px",
                                                        backgroundColor: "#111",
                                                        boxShadow:
                                                            post.image_position ===
                                                            "right"
                                                                ? "-8px 8px 0px #111"
                                                                : "8px 8px 0px #111",
                                                    }}
                                                >
                                                    <img
                                                        src={renderImagePath(
                                                            post.extra_image,
                                                        )}
                                                        alt="Extra content visual"
                                                        className="img-fluid w-100"
                                                        loading="lazy"
                                                        style={{
                                                            filter: "grayscale(20%)",
                                                            display: "block",
                                                        }}
                                                    />
                                                </div>
                                            </Col>

                                            {/* Columna de los Párrafos */}
                                            <Col
                                                xs={12}
                                                md={7}
                                                style={{
                                                    fontSize: "1.05rem",
                                                    lineHeight: "1.75",
                                                    color: "#b3b3b3",
                                                }}
                                            >
                                                <div className="mb-3">
                                                    {post.content
                                                        .split("\n")
                                                        .map((p, i) => (
                                                            <p
                                                                key={i}
                                                                className="mb-3"
                                                            >
                                                                {p}
                                                            </p>
                                                        ))}
                                                </div>
                                                {post.content_secondary && (
                                                    <div>
                                                        {post.content_secondary
                                                            .split("\n")
                                                            .map((p, i) => (
                                                                <p
                                                                    key={i}
                                                                    className="mb-3"
                                                                >
                                                                    {p}
                                                                </p>
                                                            ))}
                                                    </div>
                                                )}
                                            </Col>
                                        </Row>
                                    )}

                                    {/* 4. SECCIÓN DE VIDEO YOUTUBE (Antes del botón interactivo) */}
                                    {ytId && (
                                        <div
                                            className="my-5 mx-auto"
                                            style={{ maxWidth: "800px" }}
                                        >
                                            <div
                                                className="ratio ratio-16x9 shadow-lg"
                                                style={{
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                }}
                                            >
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${ytId}`}
                                                    title="YouTube video player"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        </div>
                                    )}

                                    {/* 5. ENLACE EXTERNO INTERACTIVO */}
                                    {post.external_url && (
                                        <div className="text-center mt-5">
                                            <MDBBtn
                                                href={post.external_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="d-inline-flex align-items-center justify-content-center"
                                                style={{
                                                    boxShadow: "none",
                                                    outline: "none",
                                                    backgroundColor:
                                                        "transparent",
                                                    border: "1px solid crimson",
                                                    color: "#ffffff",
                                                    height: "38px",
                                                    padding: "0 20px",
                                                    fontSize: "0.75rem",
                                                    letterSpacing: "2px",
                                                    textTransform: "uppercase",
                                                    borderRadius: "0px",
                                                    transition: "all 0.2s ease",
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor =
                                                        "rgba(220, 20, 60, 0.1)";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor =
                                                        "transparent";
                                                }}
                                            >
                                                VER PROYECTO
                                                <MDBIcon
                                                    fas
                                                    icon="external-link-alt"
                                                    className="ms-2"
                                                    style={{
                                                        fontSize: "0.7rem",
                                                        color: "crimson",
                                                    }}
                                                />
                                            </MDBBtn>
                                        </div>
                                    )}
                                </Container>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* CONTROLES DE PAGINACIÓN */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center gap-3 mt-4 pb-4">
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => paginate(index + 1)}
                            className={`custom-button ${currentPage === index + 1 ? "clicked" : ""}`}
                            style={{
                                width: "50px",
                                padding: "10px",
                                fontSize: "0.8rem",
                                border:
                                    currentPage === index + 1
                                        ? "1px solid crimson"
                                        : "1px solid #333",
                                background:
                                    currentPage === index + 1
                                        ? "rgba(220, 20, 60, 0.1)"
                                        : "transparent",
                                color: "#ffffff",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* BOTÓN REGRESAR */}
            <div className="d-flex align-items-center justify-content-center pt-2 pb-5">
                <MDBTypography tag="h6" className="mb-0">
                    <Link
                        to="/"
                        className="text-white d-flex align-items-center"
                        style={{ textDecoration: "none", opacity: "0.5" }}
                    >
                        <MDBIcon
                            fas
                            icon="long-arrow-alt-left"
                            className="me-2"
                        />{" "}
                        BACK TO HOME
                    </Link>
                </MDBTypography>
            </div>
        </div>
    );
}

export default BlogView;
