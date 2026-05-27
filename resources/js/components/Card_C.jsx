import React, { useState, useEffect } from "react";
import { Button, Card, Badge } from "react-bootstrap";
import "/resources/css/app.css";
import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";
import axios from "axios";

function Card_C(props) {
    const id = props.id;
    const firstName = props.name;
    const price = props.price;
    const description = props.description;
    const imagePrimary = props.image_primary;
    const available = props.available;

    const { userInfo } = useUser(); // USERINFO
    const userId = userInfo ? userInfo.id : "";
    const accessToken = userInfo ? userInfo.token : "";

    // ESTADO PARA SABER SI ESTÁ EN LA WISHLIST
    const [isInWishlist, setIsInWishlist] = useState(false);

    // COMPROBAR SI ESTÁ EN LA WISHLIST AL CARGAR EL COMPONENTE
    useEffect(() => {
        if (userId && id) {
            fetch("http://127.0.0.1:8000/api/getProductsInCart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ user_id: userId }),
            })
                .then((response) => response.json())
                .then((data) => {
                    const found = data.some((product) => product.id === id);
                    setIsInWishlist(found);
                })
                .catch((error) =>
                    console.error("Error checking product in wishlist:", error),
                );
        }
    }, [userId, id, accessToken]);

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

    // ADD TO WISHLIST
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleButtonClick = () => {
        if (!userId) {
            showNotification(
                "You need to sign in to add products to the wishlist.",
            );
            return;
        }

        // CONTROL EXTRA: Si ya está en la wishlist, frena el flujo y avisa
        if (isInWishlist) {
            showNotification("This product is already in your wishlist!");
            return;
        }

        const productData = {
            user_id: userId,
            product_id: id,
            quantity: 1,
        };

        setIsButtonDisabled(true);

        // ADD PRODUCT TO CART/WISHLIST
        axios
            .post(`/api/addcart`, productData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                console.log("Respuesta del servidor:", response.data);
                showNotification("Product added to Wishlist!");
                setIsInWishlist(true); // Cambia el corazón a relleno y bloquea el botón
                setIsButtonDisabled(false);
            })
            .catch((error) => {
                console.error("Error adding product to wishlist:", error);
                showNotification("Error adding product to wishlist!");
                setIsButtonDisabled(false);
            });
    };

    return (
        <Card
            className="my-card"
            style={{
                backgroundColor: "#111",
            }}
        >
            <Link to={`/item/${id}`}>
                <div className="my-card-img-container">
                    {!available && (
                        <div className="sold-out-badge">SOLD OUT</div>
                    )}
                    <Card.Img
                        src={imagePrimary} // <-- Ahora usa la imagen principal de la BD
                        alt={firstName}
                        className={`my-card-img ${!available ? "sold-out" : ""}`}
                    />
                </div>
            </Link>

            <Card.Body className="p-3" style={{ color: "#eee" }}>
                <Card.Title>{firstName}</Card.Title>

                <Card.Subtitle
                    className="mb-2 text-white-50 small"
                    style={{ fontWeight: "300" }}
                >
                    {description}
                </Card.Subtitle>

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span>${price}</span>

                    <MDBBtn
                        // Mantenemos tus clases originales y agregamos control estricto de padding y altura
                        class={`custom-button ${isButtonDisabled || !available || isInWishlist ? "clicked" : ""} d-flex align-items-center justify-content-center`}
                        onClick={handleButtonClick}
                        disabled={
                            isButtonDisabled || !available || isInWishlist
                        }
                        style={{
                            boxShadow: "none", // Evita destellos extraños de Bootstrap
                            outline: "none", // Elimina el borde de enfoque activo
                            height: "45px", // Forzamos una altura fija para que NUNCA cambie de tamaño al mutar el texto
                            padding: "0 15px",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <MDBIcon
                            fas={isInWishlist}
                            far={!isInWishlist}
                            icon="heart"
                            className={isInWishlist ? "me-2" : "me-1"} // Suaviza la transición del espacio del icono
                        />
                        {/* Contenedor interno para evitar saltos bruscos en el texto */}
                        <span
                            style={{
                                fontWeight: "600",
                                letterSpacing: "0.5px",
                            }}
                        >
                            {isInWishlist
                                ? "ADDED"
                                : isButtonDisabled
                                  ? ""
                                  : "ADD"}
                        </span>
                    </MDBBtn>
                </div>
            </Card.Body>

            {notification && (
                <div
                    className={`notification ${notificationVisible ? "show" : ""}`}
                >
                    {notification}
                    <div className="notification-bar"></div>
                </div>
            )}
        </Card>
    );
}

export default Card_C;
