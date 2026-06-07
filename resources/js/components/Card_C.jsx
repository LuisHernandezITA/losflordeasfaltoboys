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

    const handleButtonClick = (e) => {
        // Forzamos a quitar el foco del navegador para mitigar estados ':focus' retenidos
        if (e && e.currentTarget) {
            e.currentTarget.blur();
        }

        if (!userId) {
            showNotification(
                "Necesitar iniciar sesión para añadir a tu Wishlist.",
            );
            // Ciclo rápido de actualización de estado para forzar la re-renderización visual
            setIsButtonDisabled(true);
            setTimeout(() => {
                setIsButtonDisabled(false);
            }, 50);
            return;
        }

        // CONTROL EXTRA: Si ya está en la wishlist, frena el flujo y avisa
        if (isInWishlist) {
            showNotification("Este producto ya esta en tu Wishlist!");
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
                showNotification("Producto agregado al Wishlist!");
                setIsInWishlist(true); // Cambia el corazón a relleno y bloquea el botón
                setIsButtonDisabled(false);
            })
            .catch((error) => {
                console.error("Error adding product to wishlist:", error);
                showNotification("Error agregando el producto a tu Wishlist!");
                setIsButtonDisabled(false);
            });
    };

    return (
        <Card
            className="my-card"
            style={{
                // Asegúrate de que 'available' es la variable que llega a tu componente
                backgroundColor: !available ? "#2d0e0e" : "#111",
                transition: "background-color 0.4s ease-in-out", // Transición suave
                border: !available ? "1px solid #600" : "1px solid #000",
            }}
        >
            <Link to={`/item/${id}`}>
                <div className="my-card-img-container">
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
                            <div className="sold-out-label">Agotado ༻⋆｡°⊹</div>
                        </div>
                    )}
                    <Card.Img
                        src={imagePrimary}
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
                        // CORRECCIÓN CLAVE: Cambiado de 'class' a 'className' para que React aplique tus estilos brutalistas correctamente
                        class={`custom-button ${isButtonDisabled || !available || isInWishlist ? "clicked" : ""} d-flex align-items-center justify-content-center`}
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
