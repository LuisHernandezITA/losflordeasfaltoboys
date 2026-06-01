import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, Outlet } from "react-router-dom";
import "/resources/css/app.css";
import Carrousel from "./Carrousel";
import React, { useState, useEffect } from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import ListCardNewest from "./ListCardNewest";
import axios from "axios";

function Menu() {
    const location = useLocation();
    const [showCarousel, setShowCarousel] = useState(true);
    const { userInfo } = useUser();
    const userName = userInfo ? userInfo.name : "";
    const userAdmin = userInfo ? userInfo.admin : "";

    const [scrolled, setScrolled] = useState(false);
    const [events, setEvents] = useState([]);

    // NUEVO: Estado para controlar de forma manual la apertura/cierre del Navbar móvil
    const [navExpanded, setNavExpanded] = useState(false);

    // NUEVO: Efecto que se dispara cada vez que la URL cambia
    useEffect(() => {
        window.scrollTo(0, 0); // 1. Manda la pantalla hasta arriba del todo
        setNavExpanded(false); // 2. Cierra automáticamente el menú colapsable en móviles
    }, [location]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/events_index",
                );
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
        location.pathname === "/store" ||
        location.pathname === "/music" ||
        location.pathname === "/legal-notice" ||
        location.pathname === "/about-us" ||
        location.pathname === "/blog";

    useEffect(() => {
        if (
            location.pathname === "/about-us" ||
            location.pathname === "/legal-notice" ||
            location.pathname === "/crudblogs" ||
            location.pathname === "/crudevents" ||
            location.pathname === "/login" ||
            location.pathname === "/cart" ||
            location.pathname === "/crudproducts" ||
            location.pathname === "/crudcategories" ||
            location.pathname === "/crudbanners" ||
            location.pathname === "/crudsongs" ||
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
                expanded={navExpanded} // Vinculamos el estado de apertura
                onToggle={(expanded) => setNavExpanded(expanded)} // Actualiza el estado al dar click al botón hamburguesa
                className={
                    scrolled ? "navbar-custom scrolled" : "navbar-custom"
                }
            >
                <Container>
                    <Navbar.Brand as={Link} to="">
                        <img
                            alt="Logo"
                            src="/img/logosmc.svg"
                            width="95"
                            height="50"
                            className="d-inline-block align-top logo"
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle
                        aria-controls="responsive-navbar-nav"
                        className="custom-toggler-icon"
                    />

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto align-items-center">
                            {userName ? (
                                userAdmin ? (
                                    <NavDropdown
                                        title="Admin Panel"
                                        id="admin-nav-dropdown"
                                        className="custom-dropdown"
                                    >
                                        <NavDropdown.Item
                                            as={Link}
                                            to="crudblogs"
                                            className="dropdown-item"
                                        >
                                            Blogs Crud
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            as={Link}
                                            to="crudevents"
                                            className="dropdown-item"
                                        >
                                            Events Crud
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            as={Link}
                                            to="crudsongs"
                                            className="dropdown-item"
                                        >
                                            Songs Crud
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            as={Link}
                                            to="crudbanners"
                                            className="dropdown-item"
                                        >
                                            Banners Crud
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            as={Link}
                                            to="crudcategories"
                                            className="dropdown-item"
                                        >
                                            Categories Crud
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            as={Link}
                                            to="crudproducts"
                                            className="dropdown-item"
                                        >
                                            Products Crud
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                ) : (
                                    <Nav.Link>Hi, {userName}</Nav.Link>
                                )
                            ) : null}

                            <Nav.Link as={Link} to="">
                                Home
                            </Nav.Link>

                            <NavDropdown
                                title="Events"
                                id="events-nav-dropdown"
                                className="custom-dropdown"
                            >
                                {events.map((event) => {
                                    const { id, title, date } = event;
                                    return (
                                        <Link
                                            key={id}
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

                            <Nav.Link as={Link} to="blog">
                                Blog
                            </Nav.Link>
                            <Nav.Link as={Link} to="music">
                                Music
                            </Nav.Link>
                            <Nav.Link as={Link} to="store">
                                Store
                            </Nav.Link>

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
