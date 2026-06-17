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
                    axios.get("/api/music_index"),
                    axios.get("/api/gallery_artworks"),
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

                    {/* CONTENEDOR DE LA GALERÍA */}
                    <div
                        className="art-marquee-container"
                        style={{
                            backgroundColor: "#f4f4f4",
                            padding: "50px 0", // Reducido de 40px a 20px
                        }}
                    >
                        {infiniteArtworks.map((art, idx) => (
                            <div
                                key={`${art.id}-${idx}`}
                                className="card-art-exhibit"
                            >
                                {/* El enlace envuelve TODO el contenido */}
                                <a
                                    href={`https://www.instagram.com/${(art.autor || "").replace("@", "")}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-decoration-none"
                                    style={{
                                        display: "block",
                                        color: "inherit",
                                    }}
                                >
                                    <div className="art-frame-wrapper">
                                        {/* 1. IMAGEN */}
                                        <div
                                            className="art-frame"
                                            style={{
                                                height: "250px",
                                                width: "100%",
                                                overflow: "hidden",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                border: "1px solid #000000",
                                            }}
                                        >
                                            <img
                                                src={art.image_url}
                                                alt={art.title}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    display: "block",
                                                }}
                                            />
                                        </div>

                                        {/* 2. TEXTO / FICHA TÉCNICA */}
                                        <div className="mt-3">
                                            <div
                                                className="fw-bold text-uppercase border-bottom border-secondary pb-1 mb-2"
                                                style={{
                                                    fontSize: "0.9rem",
                                                    color: "#d6d5d5",
                                                }}
                                            >
                                                {art.title}
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: "0.75rem",
                                                    lineHeight: "1.4",
                                                }}
                                            >
                                                <div className="text-dark">
                                                    <strong>{art.autor}</strong>
                                                </div>
                                                <div className="text-secondary">
                                                    {art.technique}
                                                </div>
                                                <div className="text-muted mt-1">
                                                    {art.year}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
