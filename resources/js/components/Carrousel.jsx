import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { MDBBtn } from "mdb-react-ui-kit";
import axios from "axios";
import "/resources/css/app.css";

function Carrousel() {
    const [banners, setBanners] = useState([]);
    const [clickedId, setClickedId] = useState(null);

    useEffect(() => {
        axios
            .get("/api/banners_index")
            .then((response) => {
                setBanners(response.data);
            })
            .catch((error) => {
                console.error("Error fetching banners:", error);
            });
    }, []);

    const handleButtonClick = (id, url) => {
        setClickedId(id);
        setTimeout(() => {
            // Asegúrate de que url no sea null o undefined
            if (url) {
                window.location.assign(url); // window.location.assign es a veces más robusto que href
            }
        }, 150);
    };

    if (banners.length === 0) return null;

    // Estilos personalizados para este botón específico
    const circularWhiteButtonStyle = {
        borderRadius: "100px", // Bordes circulares
        transition: "all 2s ease", // Para que el hover sea suave
        inset: 0,
        backdropFilter: "blur(30px)",
        backgroundColor: "rgba(0, 0, 0, 1)", // Ajusta la opacidad aquí
        zIndex: 0,
    };

    return (
        <Carousel
            fade
            indicators={false}
            touch={true} // Fuerza el soporte táctil
            interval={3000} // Opcional: mantén tus intervalos
            wrap={true}
            controls={false}
        >
            {banners.map((banner) => (
                <Carousel.Item key={banner.id} interval={banner.interval}>
                    <img
                        className="d-block custom-carousel-img"
                        src={banner.image_url}
                        alt={banner.alt_text}
                    />
                    <Carousel.Caption className="custom-carousel-caption">
                        {banner.link_url && (
                            <MDBBtn
                                tag="a" // Esto convierte el componente MDBBtn en una etiqueta <a>
                                href={banner.link_url} // URL directa
                                className={`custom-button mb-4 ${clickedId === banner.id ? "clicked" : ""}`}
                                style={circularWhiteButtonStyle}
                                size="lg"
                                onClick={() => setClickedId(banner.id)} // Solo para tu efecto visual
                            >
                                {banner.alt_text}
                            </MDBBtn>
                        )}
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default Carrousel;
