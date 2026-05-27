import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MDBTypography, MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import smallImage from "/public/favicon.ico";
import { useUser } from "./UserContext";
import "/resources/css/app.css";
import { Link } from "react-router-dom";

function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    const { userInfo } = useUser();
    const userId = userInfo ? userInfo.id : "";

    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    // ESTADO PARA MANEJAR LA GALERÍA INTERACTIVA
    const [activeImage, setActiveImage] = useState("");

    // ESTADOS PARA EL EFECTO LUPA
    const [zoomStyle, setZoomStyle] = useState({
        backgroundImage: `url("")`,
        backgroundPosition: "0% 0%",
        backgroundSize: "cover",
    });

    // NOTIFICATIONS
    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    useEffect(() => {
        if (notificationVisible) {
            const progressBar = document.querySelector(".notification-bar");
            if (progressBar)
                progressBar.classList.add("notification-bar-progress");

            setTimeout(() => {
                setNotificationVisible(false);
            }, 1500);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    // PETICIÓN DE DATOS EN EL CARGUE
    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await axios.post(
                    `http://127.0.0.1:8000/api/products_show`,
                    { id },
                );

                // VALIDACIÓN CORREGIDA
                if (productResponse.data && productResponse.data.id) {
                    const fetchedProduct = productResponse.data;
                    setProduct(fetchedProduct);
                    setActiveImage(fetchedProduct.image_primary);
                } else {
                    console.error("Product not found");
                }
            } catch (error) {
                console.error("Error cargando el producto:", error);
            }

            try {
                const colorsResponse = await axios.post(
                    "http://127.0.0.1:8000/api/getProductColors",
                    { id },
                );
                if (
                    Array.isArray(colorsResponse.data) &&
                    colorsResponse.data.length > 0
                ) {
                    setColors(colorsResponse.data);
                } else {
                    setColors([]);
                }
            } catch (error) {
                console.error("Error en colores:", error);
                setColors([]);
            }

            try {
                const sizesResponse = await axios.post(
                    "http://127.0.0.1:8000/api/getProductSizes",
                    { id },
                );
                if (sizesResponse.data.length > 0) {
                    setSizes(sizesResponse.data);
                } else {
                    setSizes(null);
                }
            } catch (error) {
                console.error(error);
                setSizes(null);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    // Actualiza el fondo del zoom cuando cambia la imagen activa de la galería
    useEffect(() => {
        if (activeImage) {
            setZoomStyle((prev) => ({
                ...prev,
                backgroundImage: `url(${activeImage})`,
                backgroundSize: "100%", // Vista normal al inicio
            }));
        }
    }, [activeImage]);

    // --- MANEJADORES DEL EVENTO LUPA ---
    const handleMouseMove = (e) => {
        const { left, top, width, height } =
            e.currentTarget.getBoundingClientRect();
        // Calcular la posición porcentual del mouse dentro de la imagen
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomStyle({
            backgroundImage: `url(${activeImage})`,
            backgroundPosition: `${x}% ${y}%`,
            backgroundSize: "220%", // Nivel del Zoom (2.2x)
        });
    };

    const handleMouseLeave = () => {
        // Al salir el mouse restablecemos el contenedor al tamaño original
        setZoomStyle({
            backgroundImage: `url(${activeImage})`,
            backgroundPosition: "center",
            backgroundSize: "100%",
        });
    };

    if (!product) {
        return (
            <div className="d-flex flex-wrap justify-content-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="app" style={{ position: "relative" }}>
            <div className="details">
                {/* SECCIÓN DE LA IMAGEN GRANDE CON EFECTO LUPA */}
                <div className="big-img">
                    {!product.available && (
                        <div className="sold-out-badge" style={{ zIndex: 3 }}>
                            SOLD OUT
                        </div>
                    )}

                    {/* Div interactivo totalmente cuadrado por CSS técnico */}
                    <div
                        className="zoom-image-container"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            backgroundImage: zoomStyle.backgroundImage,
                            backgroundPosition: zoomStyle.backgroundPosition,
                            backgroundSize: zoomStyle.backgroundSize,
                            cursor: "zoom-in",
                            transition: "background-size 0.1s ease-out",
                        }}
                        aria-label={product.name}
                    />
                </div>

                {/* CAJA DE DETALLES E INFORMACIÓN */}
                <div className="box">
                    <div className="row">
                        <h2
                            className="product-title-detail"
                            style={{
                                color: "#ffffff",
                                backgroundColor: "#000000",
                                display: "inline-block",
                                padding: "10px 22px",
                                fontWeight: "900",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                marginBottom: "15px",
                                clipPath:
                                    "polygon(0% 0%, 98% 2%, 100% 95%, 1% 100%)",
                                fontFamily:
                                    "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                                boxShadow: "6px 6px 0px #e0e0e0",
                            }}
                        >
                            {product.name}
                        </h2>
                        {/* DISEÑADOR Y MARCA */}
                        <div
                            className="designer-brand-detail"
                            style={{
                                fontSize: "0.9rem",
                                color: "#444",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                marginBottom: "15px",
                            }}
                        >
                            By {product.designer}
                        </div>

                        {/* CONTENEDOR DE PRECIO Y ENVÍO EN NEGRO SÓLIDO */}
                        <div
                            className="d-flex justify-content-between align-items-center mb-3"
                            style={{ color: "#000000" }}
                        >
                            <span
                                style={{
                                    fontSize: "1.4rem",
                                    fontWeight: "800",
                                    color: "#000000",
                                }}
                            >
                                $ {product.price} MXN
                            </span>
                            <div
                                className="shipping-type-badge"
                                style={{
                                    fontSize: "0.85rem",
                                    fontWeight: "700",
                                    color: "#000000",
                                }}
                            >
                                {Number(product.shipping_type) === 0 && (
                                    <span>
                                        <MDBIcon
                                            fas
                                            icon="map-marker-alt me-1"
                                        />{" "}
                                        Envío Local
                                    </span>
                                )}
                                {Number(product.shipping_type) === 1 && (
                                    <span>
                                        <MDBIcon fas icon="truck me-1" /> Envío
                                        Nacional
                                    </span>
                                )}
                                {Number(product.shipping_type) === 2 && (
                                    <span>
                                        <MDBIcon fas icon="globe me-1" /> Envío
                                        Internacional
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <p>{product.description}</p>

                    {/* SELECTOR DE COLORES */}
                    {colors && colors.length > 0 && (
                        <div>
                            <h2 style={{ color: "black" }}>Colors</h2>
                            <div className="color-buttons">
                                {colors.map((colorId, index) => (
                                    <button
                                        key={index}
                                        className={`color-button-detail ${selectedColor === colorId ? "selected" : ""}`}
                                        style={{
                                            width: 30,
                                            height: 30,
                                            backgroundColor: colorId,
                                            border: "1px solid black",
                                        }}
                                        onClick={() =>
                                            setSelectedColor(colorId)
                                        }
                                    ></button>
                                ))}
                            </div>
                            <br />
                        </div>
                    )}

                    {/* SELECTOR DE TALLAS */}
                    {sizes && sizes.length > 0 && (
                        <div>
                            <h2 style={{ color: "black" }}>Sizes</h2>
                            <div
                                className="size-buttons-detail"
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                {sizes.map((sizeId, index) => (
                                    <button
                                        key={index}
                                        className={`size-button-detail ${selectedSize === sizeId ? "selected" : ""}`}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            margin:
                                                index === 0
                                                    ? "0 5px 0 0"
                                                    : "0 5px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                        onClick={() => setSelectedSize(sizeId)}
                                    >
                                        {sizeId}
                                    </button>
                                ))}
                            </div>
                            <br />
                        </div>
                    )}

                    {/* BOTÓN AL INSTAGRAM */}
                    <MDBBtn
                        tag="a"
                        href={product.seller_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class={`custom-button ${!product.available ? "clicked" : ""}`}
                        style={{
                            boxShadow: "none",
                            outline: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        disabled={!product.available}
                    >
                        <MDBIcon
                            fab
                            icon="instagram"
                            className="me-2"
                            size="lg"
                        />
                        {!product.available
                            ? "OUT OF STOCK"
                            : "Contact Designer"}
                    </MDBBtn>
                </div>
            </div>

            {/* SECCIÓN DE THUMBNAILS COMPLETA */}
            <div className="thumb">
                {[
                    product.image_primary,
                    product.image_detail_1,
                    product.image_detail_2,
                ].map((imgUrl, index) => (
                    <img
                        key={index}
                        src={imgUrl}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => setActiveImage(imgUrl)}
                        className={
                            activeImage === imgUrl ? "active-thumbnail" : ""
                        }
                        style={{
                            border:
                                activeImage === imgUrl
                                    ? "2px solid #000"
                                    : "1px solid #ccc",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            opacity: activeImage === imgUrl ? 1 : 0.7,
                        }}
                    />
                ))}
            </div>

            {/* SMALL IMAGE */}
            <img
                src={smallImage}
                alt="Small Image"
                className="d-none d-md-block"
                style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    width: "40px",
                    height: "auto",
                }}
            />

            <div className="d-flex align-items-center py-4">
                <MDBTypography tag="h6" className="mb-0 ms-5">
                    <Link
                        to="/store"
                        className="text-body d-flex align-items-center"
                        style={{ textDecoration: "none" }}
                    >
                        <MDBIcon fas icon="long-arrow-alt-left me-2" />
                        Back to shop
                    </Link>
                </MDBTypography>
            </div>

            {notification && (
                <div
                    className={`notification ${notificationVisible ? "show" : ""}`}
                >
                    {notification}
                    <div className="notification-bar"></div>
                </div>
            )}
        </div>
    );
}

export default Product;
