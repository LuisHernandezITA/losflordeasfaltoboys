import React, { useState, useEffect } from "react";
import { Button, Card, Badge } from "react-bootstrap";
import "/resources/css/app.css";
import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";
import axios from "axios";
import { useNotification } from "./NotificationContext";

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
            fetch("/api/getProductsInCart", {
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
    const { showNotification } = useNotification();

    // ADD TO WISHLIST
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleButtonClick = (e) => {
        // Forzamos a quitar el foco del navegador para mitigar estados ':focus' retenidos
        if (e && e.currentTarget) {
            e.currentTarget.blur();
        }

        if (!userId) {
            showNotification(
                "Necesitas iniciar sesión para añadir a tu Wishlist.",
            );
            return;
        }

        // CONTROL EXTRA: Si ya está en la wishlist, frena el flujo y avisa
        if (isInWishlist) {
            showNotification("Este producto ya está en tu Wishlist!");
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
                showNotification("Producto agregado al Wishlist!"); // GLOBAL
                setIsInWishlist(true); // Cambia el corazón a relleno y bloquea el botón
                setIsButtonDisabled(false);
            })
            .catch((error) => {
                showNotification("Error agregando el producto a tu Wishlist!");
                setIsButtonDisabled(false);
            });
    };

    return (
        <Card
            className="my-card"
            style={{
                // 1. Aplicamos la imagen como fondo de la tarjeta
                backgroundImage: `url(${imagePrimary})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                overflow: "hidden", // Importante para que el blur no se salga de la tarjeta
                borderRadius: "0px",
                border: "1px solid #262525",
                transition: "all 0.4s ease-in-out",
            }}
        >
            {/* 2. CAPA DE DESENFOQUE (El blur) */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backdropFilter: "blur(30px)",
                    backgroundColor: "rgba(0, 0, 0, 0.8)", // Ajusta la opacidad aquí
                    zIndex: 0,
                }}
            />

            {/* 3. CONTENIDO (Z-index 1 para que quede sobre el blur) */}
            <div style={{ position: "relative", zIndex: 1 }}>
                <Link to={`/item/${id}`}>
                    <div
                        className="my-card-img-container"
                        style={{ position: "relative" }}
                    >
                        {!available && (
                            <div className="sold-out-badge">
                                ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⢍⡭⠍⡠⠍⠙⠈⠛⡜⠈⠀⣀⣠⡄⠀⠀⠀⠐⠡⠀⠀⠀⠀⠀⠀⠀
                                ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣫⣥⣶⣿⣶⣶⣶⣶⣦⣤⣄⡀⠁⠴⣾⡿⣛⠁⠀⠀⠀⠀⠐⠀⠀⠀⠀⠀⠀⠀
                                ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠾⣿⣿⣿⣿⣿⡿⢿⡛⠃⠁⠈⠃⠐⠄⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢛⢡⢂⠢⠈⠀⠀⠀⢊⠙⠁⣘⣛⣵⣶⣶⠶⠂⠀⠀⠀⠀⢠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⡰⢨⠇⠊⠀⠰⡈⣰⡄⠄⠀⠀⠻⣿⣿⡟⠀⠀⠠⠔⠀⠂⣀⠀⠀⠀⠀⠀⠐⠲⠄⠀⠀⠀⠀⠀⠀
                                ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢁⠢⠑⢀⠊⡐⠷⠁⠀⠡⠈⠄⠈⠀⠀⢹⠟⠀⠀⠀⢀⣀⠀⠀⣳⡄⠀⠀⢠⣄⠀⢤⢀⠀⠀⣦⠀⠀⠀
                                ⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠄⠀⠂⠠⠀⠐⠀⠀⠈⠁⠀⠀⠀⠀⠀⠀⠀⣀⣴⣾⡿⠁⠀⠀⢹⣿⠄⠀⢸⣿⣷⣬⠀⠀⠀⠀⠀⠀⠀
                                ⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⢀⣴⠇⠀⠀⠀⠀⠀⠀⠀⢰⡚⣿⣿⣿⠃⢠⣗⠀⣼⣿⠀⠀⠀⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀
                                ⢿⣾⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⡀⠀⠀⠀⠤⠼⣉⡺⠀⠀⠀⠀⣷⠀⠀⠘⢁⣿⣿⡏⢰⣿⣿⢠⣿⣿⠀⠀⢃⠙⠁⠀⠀⠀⠀⠀⡀⠀⠀
                                ⣧⣿⣿⣽⣿⡞⣿⣿⣿⣿⣿⣿⣿⣿⣛⣙⣻⣟⣿⣿⣿⣿⣿⡟⠀⠀⢻⡄⠀⢠⡀⢀⣌⣯⣄⣠⡀⠔⠋⠄⠀⠀⠀⣿⣿⣧⣿⣿⣿⡯⣿⣿⡆⠀⣿⣄⠀⠀⠀⣠⡄⠀⠀⠀⠀
                                ⠿⡿⣿⣿⣬⡳⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⢿⣿⣿⣿⠓⠀⠀⠈⠃⠀⡀⢿⣿⣿⢫⡞⣿⣤⣀⣢⠀⠀⠀⠃⣿⣿⣿⡿⣳⣿⣿⣷⣿⣿⡰⢿⣿⠀⠀⠀⢻⠀⠀⠀⠀⠀
                                ⠧⣭⣜⣖⠟⢽⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⡇⠀⠀⠀⠀⠀⢰⣬⣿⣿⣿⣴⣾⣿⡿⠃⠀⠀⢰⢠⣿⣟⣫⣽⣿⡟⢿⣿⣿⡿⣇⠘⢻⡆⠀⠀⠀⠁⠀⠀⠀⠀
                                ⠀⡇⢎⣼⢻⡊⣹⠘⠓⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣼⠇⠀⠀⠀⠀⠀⠀⣙⢿⣿⣶⣾⡿⠟⠁⠀⠀⠀⣬⡟⣿⣿⣿⣿⣯⠵⢘⣿⡿⡫⠘⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⡀⣏⠖⡬⢼⡣⡻⣗⠆⣓⢰⢽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⡟⠂⠀⠀⠀⠀⠀⢠⢸⣄⠌⢉⠀⠀⠀⠀⠀⠀⠀⣿⢹⣿⢿⢿⡿⠻⣏⡁⢖⣰⠂⠑⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠄⢩⡞⡜⣧⢇⡏⠋⡁⣴⡘⣶⣿⣿⣿⣿⣿⣿⣿⡿⢿⣹⠁⠀⠀⠀⣀⡀⠀⣿⡄⠻⣷⡏⡀⠀⠀⠀⠀⠀⠀⢡⣿⣧⣄⡑⢫⣥⢂⣿⠖⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⡘⣰⣻⡝⣮⢳⠀⢀⣁⠉⢂⣿⣿⣿⣿⣿⣿⡿⣿⣾⣿⣿⣿⣧⠤⢯⣭⣥⠀⣚⣛⠜⣿⣧⠿⠦⠀⠀⠆⠀⠀⢈⠿⣁⣐⡶⠏⠛⡀⠐⠂⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⣱⣷⡻⣼⣳⣏⢠⢏⢸⡷⢸⣿⣿⣿⣿⣿⡿⣼⣿⣿⣿⣿⣿⣿⣿⣾⣮⡛⢰⣿⣿⣶⣮⣵⣞⣻⣷⣮⡃⠀⠻⣟⡿⣦⠀⢀⣠⠌⢑⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠈⠉⠛⠢⣹⡞⢸⡚⣬⠓⣼⣿⣿⣿⣿⣿⢷⣿⣿⣿⡿⣿⣿⣿⣿⣿⡿⡗⣰⡕⢝⢿⣿⣿⣿⣿⣿⣿⣿⣄⡈⢶⣾⣿⡇⠁⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⣄⠀⣀⣺⡻⠇⣿⡿⣜⢳⣿⣿⣿⣿⣿⡿⣼⣿⣿⣿⠁⣿⣿⣿⡻⣶⢟⢅⣿⣿⡌⡧⠻⣾⣝⢟⢟⡛⡽⣿⢮⡠⠀⣻⡇⠀⠀⠀⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⣸⣿⠞⢺⠿⢿⣮⡝⣭⣿⣿⣿⣿⣿⣻⡁⠽⣿⣿⣿⣅⠈⣪⣿⣷⣶⣶⣿⣿⣿⡿⣼⣶⣿⣧⣷⣿⣷⣨⡛⣛⡿⣨⡻⠅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠿⣾⣭⣀⣀⠂⠋⣚⣻⣿⣿⣿⣿⣿⣿⡧⣜⢯⣿⣿⡿⣴⣿⢿⣛⡻⣿⣿⣿⣟⣵⣿⣿⣿⣿⣿⣿⣿⣷⣽⣿⣿⣿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠃⠘⠾⢃⠙⢮⡝⣢⣸⣿⣿⣿⣿⣿⣿⡇⣿⣯⣿⣿⢱⣿⡧⣟⣪⣽⣿⣿⣿⣿⣿⣿⣿⢺⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⡌⢰⢣⠀⠄⡐⠠⢀⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⡇⡽⣿⢷⣥⣿⣿⣿⣿⣿⣿⣿⣿⡝⣾⣿⣇⣍⡻⢿⣿⣿⣿⣿⣿⣿⡿⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠰⣀⢣⠃⣈⢆⠡⠐⣸⣿⣿⣿⣿⣿⣿⢧⣿⣿⣿⣷⡘⣾⣽⣳⣯⣿⣟⣿⣽⣿⡿⠏⣰⣿⡟⣿⣎⠻⣷⣿⣿⣿⣿⣿⣻⣽⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⢱⡀⢸⠷⣈⡎⢱⠹⢿⣿⣿⣿⣿⣿⣿⢰⣿⣿⣿⣿⡁⠸⣿⣿⣿⣿⣿⣿⡿⠏⠁⢰⣿⣿⣿⣿⣿⣇⢈⠹⣿⣿⣿⣷⢿⡷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⢣⢞⣨⢖⣧⡚⣕⠂⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⡿⠄⠀⠀⠉⠉⡉⢍⡔⢂⢅⣾⣿⡿⣫⣾⢸⢫⡿⣧⡣⡀⠉⠉⠉⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⣏⡶⣸⢿⣶⣽⠋⣛⣿⣿⣿⣿⣿⣿⣏⢾⡿⣟⣯⠳⠀⠀⠀⠀⠳⢤⡥⣶⣫⣿⣿⡿⣩⣿⣿⢸⡷⣷⡹⡳⣡⠄⢀⣥⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⣈⢷⣿⣿⣿⣿⡑⣾⣿⣿⣿⣿⣿⡿⢉⣾⡽⡽⢊⡇⡀⠀⠀⠀⠀⢢⣝⣶⢫⣿⡼⣵⣿⣿⣟⠘⣩⣷⡇⢰⠏⠀⣾⢋⢲⡀⠀⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⡈⠝⢿⡸⠃⠘⢿⣿⣿⣿⣿⣿⡿⣽⣸⣿⣏⣴⣿⠃⣿⡀⠀⠀⠀⠀⡹⣞⣿⣿⣯⣿⣿⣿⣿⢸⣿⡟⠔⣼⡆⠡⡻⠄⣼⡗⡄⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⡱⣍⢂⠳⣌⡡⠊⢿⣿⣿⣿⣿⢳⣿⣸⣿⣿⣿⡏⠀⠹⣇⠀⠀⠀⡴⠾⣯⣿⣿⣷⣻⣿⣿⣻⢸⣿⣾⡁⣿⣇⣄⠹⣿⣿⢡⣿⣆⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⡽⣩⣏⣳⣍⣮⣽⣯⣥⣽⣿⡟⣿⣿⣿⣿⣿⣿⠃⠷⡘⣭⡅⣁⣴⣿⣿⣮⡻⣿⣷⢟⣻⢿⡳⢸⡿⣏⠰⢹⢎⣶⣧⡈⢋⣾⣿⣿⡆⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡷⣿⣿⣿⣿⣿⡏⠸⣿⣿⢬⣾⣿⣿⣿⣿⣿⣿⣶⣶⣿⣿⣿⣄⣴⣿⣿⡿⣯⢸⣿⡿⣷⣬⣻⣿⣿⣿⠀⢀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⣶⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⠟⣼⣦⡭⣱⣿⣿⣿⣿⣿⣿⡏⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠻⣜⣊⣿⢧⣿⡿⡇⢿⣿⣿⡄⠂⡈⠀⠀⢀⠀⠂⡀⠀⠀⠀⠀⠀⠀⠀
                                ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣼⣿⣿⣿⠏⣼⣿⠟⣄⡿⣫⡶⣶⣬⢻⣿⣽⣿⣿⣿⣿⢿⡿⡿⣟⢿⣘⠷⣣⣿⡎⣿⣿⢗⡃⡄⣝⢿⣷⠀⠐⠀⠀⡀⠀⠐⢀⠠⠁⠀⠀⢀⠀⠀
                                ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣿⣿⣿⠏⣾⣿⠏⣼⢸⢹⣷⣻⣽⢿⣷⡽⠹⣿⣿⣿⣿⣯⣷⣻⡝⣮⡝⣞⣳⠻⣰⣿⢯⡳⢅⠳⡘⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀
                                ⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣘⣿⣿⡏⣾⣿⢏⣾⢿⣼⣻⢾⣽⣯⣿⢿⣜⢣⣿⣿⣿⣿⣟⣳⡝⣾⢱⢺⡵⣋⣵⡿⢯⡳⡝⣎⢷⢀⠹⣿⡟⣆⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⣿⠿⣻⣿⣿⣿⣿⣿⣿⢳⣿⢹⡟⣼⣿⢏⡼⣣⣯⣶⣯⣿⣾⣿⡿⣟⣬⢳⡞⣿⣟⡷⣯⣷⡽⣮⢏⡷⣙⣾⢷⣻⢏⡷⡹⣞⡽⢢⠀⠑⡇⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⣠⣾⡿⣿⣿⣿⣿⣿⡇⣿⣿⠸⢱⣿⡏⢶⣻⣽⣿⣿⣿⡿⠗⣊⣉⠙⣚⡷⣽⣞⣿⣽⣱⢯⣻⢵⣫⡞⡿⣍⠧⡹⣾⣷⣿⣿⣼⣡⣷⠀⠀⣻⣿⡄⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀
                                ⡿⠟⣰⣿⣿⣿⣿⣿⣧⣿⣿⡼⢹⡿⢸⣿⡟⢟⣩⣵⣾⣿⣿⣿⣶⣅⠢⢍⡢⠙⣿⣷⣿⣳⢯⣞⠷⡙⢀⣪⣾⣿⣿⣿⣿⣿⡾⣽⢯⡇⢀⣿⣿⡿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⣴⣿⠿⣫⣵⣿⡿⣼⣿⣿⣇⢸⠇⣟⣡⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣜⣽⡢⡈⠹⣷⡏⢹⡞⠁⡴⣯⣷⣿⣿⣿⣿⣿⣿⣿⣽⣻⡜⠀⠸⣿⠇⣿⡀⠀⠀⠀⠀⡆⠀⠀⠀⠀
                                ⢊⡾⣵⠿⠟⣿⣿⢳⡙⣿⣿⢈⣾⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣼⣿⣢⠀⠛⠀⠋⢀⡾⣝⣷⣿⣿⣿⣿⣿⣿⣿⡿⡾⣵⢫⠀⠀⢼⡇⠌⡯⠀⠀⠀⠀⠃⠀⠀⠀⠀
                                ⠈⣀⢼⣾⣿⣿⡇⠿⡁⢸⡏⣮⡽⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠐⡄⢁⡾⣝⣯⣿⣿⣿⣿⣿⣿⣿⡿⣽⣻⣭⢳⠀⠀⠀⠃⢸⠇⠄⣀⣀⠀⠀⠀⠀⠀⠀
                                ⢈⣴⣾⣿⣿⢻⣿⢸⠇⠈⠥⠹⢷⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠇⣿⡹⣞⣽⣿⣿⣿⣿⣿⣿⣿⣻⣽⣳⢽⡂⠐⣂⡡⢂⠞⠀⠈⠀⠂⠀⠀⠀⠀⠀⠀
                                ⠀⣿⣿⠟⠛⠩⡭⣉⢡⠀⣃⠬⣌⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢘⡲⡝⣼⣿⣿⣿⣿⣿⣿⣿⣳⣟⡾⣝⠶⠀⠀⠀⠀⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⢀⠟⠁⠀⠀⣠⣾⣿⣷⣕⢦⣍⣧⡜⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡯⠐⣧⢾⣿⣿⣿⣿⣿⣿⣿⣳⡟⡾⣝⢮⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⡘⡉⠛⠽⠶⠂⠨⠍⠆⠆⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⣯⢿⣻⣿⣿⣿⣿⣟⡷⣯⢽⡻⣜⠃⠀⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠂⠁⠀⠀⡚⢛⢿⣿⡿⣿⣿⡎⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠄⣯⣟⡿⣿⣿⢿⣻⣽⡻⣝⢾⡱⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⡀⠀⠀⠀
                                ⠀⠈⠀⠀⠠⢤⡁⠰⠀⠄⠀⠈⠁⠈⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢈⠲⣝⡾⣽⣟⣯⡿⣽⡞⣽⡹⢎⠅⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                ⠀⠀⠀⠀⠀⠀⠈⠀⠂⠀⡁⠈⠀⠡⠁⢂⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠠⣙⢮⣽⣳⢯⡿⣝⣳⢯⣳⡙⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                <div className="sold-out-label">Agotado</div>
                            </div>
                        )}
                        <Card.Img
                            src={imagePrimary}
                            alt={firstName}
                            loading="lazy"
                            className={`my-card-img ${!available ? "sold-out" : ""}`}
                            style={{
                                width: "100%",
                                aspectRatio: "1/1",
                                objectFit: "cover",
                            }}
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
                            // CORRECCIÓN CLAVE: Cambiado de 'class' a 'className' para que React aplique tus estilos brutalistas correctamente
                            className={`custom-button ${isButtonDisabled || !available || isInWishlist ? "clicked" : ""} d-flex align-items-center justify-content-center`}
                            onClick={handleButtonClick}
                            disabled={
                                isButtonDisabled || !available || isInWishlist
                            }
                            style={{
                                boxShadow: "none",
                                outline: "none",
                                height: "45px",
                                padding: "0 15px",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <MDBIcon
                                fas={isInWishlist}
                                far={!isInWishlist}
                                icon="heart"
                                className={isInWishlist ? "me-2" : "me-1"}
                            />
                            <span
                                style={{
                                    fontWeight: "600",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                {isInWishlist
                                    ? "ADDED"
                                    : isButtonDisabled && userId
                                      ? ""
                                      : "ADD"}
                            </span>
                        </MDBBtn>
                    </div>
                </Card.Body>
            </div>
        </Card>
    );
}

export default Card_C;
