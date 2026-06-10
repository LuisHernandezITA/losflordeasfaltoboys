import React, { useState, useEffect } from "react";
import { Spinner, Navbar, Nav, Container } from "react-bootstrap";
import axios from "axios";
import CardMusic from "./CardMusic";
import "/resources/css/app.css";

function MusicBlog() {
    const [musicData, setMusicData] = useState([]);
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- ESTADOS PARA PAGINACIÓN ORIGINALES ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [musicRes, galleryRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/music_index"),
                    axios.get("http://localhost:8000/api/gallery_artworks"),
                ]);

                // Invertimos la data original para que los últimos registros de música salgan primero
                setMusicData(musicRes.data.reverse());
                setArtworks(galleryRes.data.data || []);
            } catch (error) {
                console.error(
                    "Error fetching multimedia dashboard data:",
                    error,
                );
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // --- LÓGICA DE PAGINACIÓN ORIGINAL ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = musicData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(musicData.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <Spinner animation="border" role="status" variant="light">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    // --- LÓGICA DE TEMPORADA / METADATA DINÁMICA ---
    const currentYearShort = new Date().getFullYear().toString().slice(-2);
    const currentMonth = new Date().getMonth() + 1;

    let seasonNumber = "01";
    if (currentMonth > 3 && currentMonth <= 6) seasonNumber = "02";
    if (currentMonth > 6 && currentMonth <= 9) seasonNumber = "03";
    if (currentMonth > 9) seasonNumber = "04";

    const dynamicSeason = `${seasonNumber}/${currentYearShort}`;

    // Duplicamos el array para que el efecto marquee infinito funcione sin cortes
    const infiniteArtworks = [...artworks, ...artworks];

    return (
        <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
            {/* ==================================================================== */}
            {/* 1. DIGITAL ART SHOWCASE (BANNER GIGANTE / MARQUEE LENTO)             */}
            {/* ==================================================================== */}
            {artworks.length > 0 && (
                <div
                    className="art-gallery-hero-container"
                    style={{ borderBottom: "none", paddingTop: "40px" }}
                >
                    {/* ENCABEZADO BRUTALISTA UNDERGROUND CON DATOS DINÁMICOS */}
                    <Container fluid className="px-md-5 mb-4">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end border-bottom border-secondary pb-3 opacity-75">
                            <div>
                                <span
                                    style={{
                                        fontSize: "0.75rem",
                                        fontFamily: "monospace",
                                        color: "crimson",
                                        letterSpacing: "3px",
                                        display: "block",
                                        marginBottom: "4px",
                                    }}
                                >
                                    // SYSTEM_DATA_STREAM
                                </span>
                                <h1
                                    className="text-white m-0 text-uppercase fw-black"
                                    style={{
                                        letterSpacing: "3px",
                                        fontSize: "2.2rem",
                                        fontFamily:
                                            "'Courier New', Courier, monospace",
                                        lineHeight: "1",
                                    }}
                                >
                                    UNDERGROUND_ART_ARCHIVE
                                </h1>
                            </div>

                            {/* METADATOS DE TEMPORADA AUTOMATIZADOS */}
                            <div
                                className="mt-3 mt-md-0 text-md-end"
                                style={{ fontFamily: "monospace" }}
                            >
                                <div
                                    style={{
                                        color: "#fff",
                                        fontSize: "0.85rem",
                                        letterSpacing: "2px",
                                    }}
                                >
                                    SEASON:{" "}
                                    <span className="bg-white text-black px-1 fw-bold">
                                        {dynamicSeason}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        color: "#666",
                                        fontSize: "0.7rem",
                                        letterSpacing: "1px",
                                        marginTop: "2px",
                                    }}
                                >
                                    STATUS: ACTIVE_COLLECTION // VOL_
                                    {currentPage.toString().padStart(2, "0")}
                                </div>
                            </div>
                        </div>
                    </Container>

                    {/* CONTENEDOR DE LA GALERÍA (MARQUEE) */}
                    {/* Cambiamos el fondo a un gris muy claro (blanco grisáceo #f4f4f4) */}
                    <div
                        className="art-marquee-container"
                        style={{
                            backgroundColor: "#f4f4f4",
                            padding: "40px 0",
                        }}
                    >
                        {infiniteArtworks.map((art, idx) => (
                            <div
                                key={`${art.id}-${idx}`}
                                className="card-art-exhibit"
                            >
                                {/* El div que actúa como contenedor de la obra tiene la clase para el hover */}
                                <div className="art-frame-wrapper">
                                    <div
                                        className="art-frame"
                                        style={{
                                            height: "400px",
                                            width: "100%",
                                            overflow: "hidden", // Esto corta lo que se salga del marco
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <img
                                            src={art.image_url}
                                            alt={art.title}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover", // <--- ESTO ELIMINA LOS BORDES BLANCOS
                                                objectPosition: "center", // Centra la imagen si es muy alta
                                                display: "block",
                                            }}
                                        />
                                    </div>

                                    {/* --- CADA TARJETA --- */}
                                    <div className="card-art-exhibit">
                                        {/* 2. El wrapper solo contiene el texto */}
                                        <div className="art-frame-wrapper">
                                            <div className="text-white fw-bold text-uppercase border-bottom border-secondary pb-1 mb-2">
                                                {art.title}
                                            </div>
                                            {/* Contenedor de CRED con truncado */}
                                            <div
                                                className="text-secondary"
                                                style={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                <span
                                                    style={{ color: "#ff0055" }}
                                                >
                                                    CRED:
                                                </span>{" "}
                                                {art.autor}
                                            </div>

                                            {/* Contenedor de TECH con truncado y puntos suspensivos */}
                                            <div
                                                className="text-muted"
                                                style={{
                                                    whiteSpace: "nowrap", // 1. Evita que el texto salte de línea
                                                    overflow: "hidden", // 2. Oculta lo que sobresale
                                                    textOverflow: "ellipsis", // 3. Pone los "..." cuando se corta
                                                    width: "90%", // 4. Importante: limita el ancho al contenedor
                                                }}
                                            >
                                                <span style={{ color: "#555" }}>
                                                    TECH:
                                                </span>{" "}
                                                {art.technique}
                                            </div>

                                            <div className="mt-2">
                                                <span
                                                    className="px-2 py-1 bg-secondary text-black fw-bold"
                                                    style={{
                                                        fontSize: "0.7rem",
                                                    }}
                                                >
                                                    {art.year}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ==================================================================== */}
            {/* 2. TRANSICIÓN CON DEGRADADO Y NAVBAR COMPACTO SIN FONDO             */}
            {/* ==================================================================== */}
            <div
                style={{
                    background:
                        "linear-gradient(to bottom, #000000 0%, #0a0a0a 50%, #121212 100%)",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                }}
            >
                <Navbar
                    expand="lg"
                    variant="dark"
                    style={{
                        backgroundColor: "transparent",
                        borderBottom: "none",
                    }}
                    className="py-2 w-100"
                >
                    {/* CORREGIDO: Se cambió a fluid y se asignó px-5 para empujar los textos a las orillas */}
                    <Container fluid className="px-5">
                        <div className="d-flex align-items-center">
                            <span
                                className="glitch-text"
                                style={{
                                    fontSize: "1.2rem",
                                    letterSpacing: "4px",
                                    opacity: "0.8",
                                    fontWeight: "300",
                                }}
                            >
                                DIGITAL ART & MUSIC VAULT ♱༺༒︎⊰
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
                                Release Vol.{" "}
                                {currentPage.toString().padStart(2, "0")} —{" "}
                                {new Date().getFullYear()}
                            </span>
                        </Nav>
                    </Container>
                </Navbar>
            </div>

            {/* ==================================================================== */}
            {/* 3. SECCIÓN INFERIOR: AUDIO ARCHIVE TRACKS CORRECTOS                 */}
            {/* ==================================================================== */}
            <div className="container-fluid px-md-5 mt-4">
                {/* Lista de música con tus componentes estables */}
                <div className="d-flex flex-column gap-5 align-items-center pb-5">
                    {currentItems.map((track) => (
                        <CardMusic
                            key={track.id}
                            id={track.id}
                            nombre={track.nombre}
                            artista={track.artista}
                            etiqueta={track.etiqueta}
                            urlmusic={track.urlmusic}
                            image={track.image}
                        />
                    ))}
                </div>

                {/* --- CONTROLES DE PAGINACIÓN ORIGINALES --- */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center gap-3 mt-4 pb-5">
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
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MusicBlog;
