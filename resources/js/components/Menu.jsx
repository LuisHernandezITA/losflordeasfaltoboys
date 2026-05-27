import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown"; // Importamos NavDropdown
import { Link, Outlet } from "react-router-dom";
import "/resources/css/app.css";
import Carrousel from "./Carrousel";
import React, { useState, useEffect } from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import ListCardNewest from "./ListCardNewest";
import axios from "axios"; // Asegúrate de tener axios o usa fetch

function Menu() {
    const location = useLocation();
    const [showCarousel, setShowCarousel] = useState(true);
    const { userInfo } = useUser();
    const userName = userInfo ? userInfo.name : "";
    const userAdmin = userInfo ? userInfo.admin : "";

    const [scrolled, setScrolled] = useState(false);
    const [events, setEvents] = useState([]); // Estado para almacenar los eventos públicos

    // Cargar los eventos usando el endpoint exacto de tu api.php
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // CORRECCIÓN: Usamos /api/events_index que es tu ruta pública real
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/events_index",
                );

                // Como tu controlador hace return response()->json($events, 200),
                // response.data ya es directamente el Array.
                setEvents(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error(
                    "Error al obtener los eventos en el navbar:",
                    error,
                );
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
            }, 3000);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    const handleLogout = () => {
        document.cookie =
            "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        showNotification("Sesión cerrada exitosamente");

        setTimeout(() => {
            window.location.href = "/";
        }, 1500);
    };

    const hideListCardNewest =
        location.pathname === "/store" || location.pathname === "/music";

    useEffect(() => {
        if (
            location.pathname === "/crudevents" ||
            location.pathname === "/login" ||
            location.pathname === "/cart" ||
            location.pathname === "/products" ||
            location.pathname === "/categories" ||
            location.pathname === "/banners" ||
            location.pathname === "/songs" ||
            location.pathname.startsWith("/item") ||
            location.pathname.startsWith("/events/")
        ) {
            setShowCarousel(false);
        } else {
            setShowCarousel(true);
        }
    }, [location]);

    const formatMenuDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);

        // Opción 2: Formato texto corto "MAY 2026" (Descomenta si prefieres este)
        const options = { month: "short", year: "numeric" };
        return `(${date.toLocaleDateString("es-MX", options).toUpperCase()})`;
    };

    return (
        <>
            <Navbar
                collapseOnSelect
                expand="lg"
                fixed="top"
                variant="dark"
                className={
                    scrolled ? "navbar-custom scrolled" : "navbar-custom"
                }
            >
                <Container>
                    <Navbar.Brand as={Link} to="">
                        <img
                            alt="Logo"
                            src="/img/logosmc.svg"
                            width="150"
                            height="45"
                            className="d-inline-block align-top logo"
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle
                        aria-controls="responsive-navbar-nav"
                        className="custom-toggler-icon"
                    />

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto align-items-center">
                            {/* LÓGICA DE USUARIO / ADMIN */}
                            {userName ? (
                                userAdmin ? (
                                    <>
                                        <Nav.Link as={Link} to="crudevents">
                                            Events Crud
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="songs">
                                            Songs
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="banners">
                                            Banners
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="categories">
                                            Categories
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="products">
                                            Products
                                        </Nav.Link>
                                    </>
                                ) : (
                                    <Nav.Link>Hi, {userName}</Nav.Link>
                                )
                            ) : null}

                            {/* ENLACES GENERALES */}
                            <Nav.Link as={Link} to="">
                                Home
                            </Nav.Link>

                            {/* DROPDOWN DE EVENTOS (LOOKBOOKS) CON DATOS REALES */}
                            <NavDropdown
                                title="Events"
                                id="events-nav-dropdown"
                                className="custom-dropdown"
                            >
                                {events.map((event) => {
                                    // Asegúrate de extraer correctamente el id y la fecha (asumiendo que se llama 'date')
                                    const { id, title, date } = event;

                                    return (
                                        <Link
                                            key={id} // Esto solucionará el aviso de la key de React si faltaba
                                            to={`/events/${id}`}
                                            className="dropdown-item"
                                        >
                                            {title}{" "}
                                            <span className="menu-date-accent">
                                                {formatMenuDate(date)}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </NavDropdown>

                            <Nav.Link as={Link} to="music">
                                Music
                            </Nav.Link>
                            <Nav.Link as={Link} to="store">
                                Store
                            </Nav.Link>

                            {/* ICONOS */}
                            <div className="d-flex align-items-center gap-3 px-3">
                                <Nav.Link
                                    as={Link}
                                    to="cart"
                                    title="My Wishlist"
                                >
                                    <MDBIcon
                                        fas
                                        icon="heart"
                                        className="icon"
                                    />
                                </Nav.Link>
                                {userName ? (
                                    <Nav.Link
                                        onClick={handleLogout}
                                        title="Logout"
                                    >
                                        <MDBIcon
                                            fas
                                            icon="user-slash"
                                            className="icon"
                                        />
                                    </Nav.Link>
                                ) : (
                                    <Nav.Link
                                        as={Link}
                                        to="login"
                                        title="Login"
                                    >
                                        <MDBIcon
                                            fas
                                            icon="user"
                                            className="icon"
                                        />
                                    </Nav.Link>
                                )}
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* RESTO DEL COMPONENTE (NOTIFICACIONES, OUTLET, ETC.) */}
            {notification && (
                <div
                    className={`notification ${notificationVisible ? "show" : ""}`}
                >
                    {notification}
                    <div className="notification-bar"></div>
                </div>
            )}
            {showCarousel && <Carrousel />}
            {!hideListCardNewest && showCarousel && <ListCardNewest />}
            {!hideListCardNewest && showCarousel && (
                <div className="text-center mb-5">
                    <Link to="/store" className="ver-todo-link">
                        SEE ALL <i className="fas fa-eye"></i>
                    </Link>
                </div>
            )}
            <section>
                <Container fluid className="px-0">
                    <Outlet></Outlet>
                </Container>
            </section>
            <Footer />
        </>
    );
}

export default Menu;
