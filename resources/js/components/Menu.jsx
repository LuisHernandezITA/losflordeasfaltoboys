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
    const userAdmin = userInfo ? userInfo.admin : "";

    // CORTE DE LONGITUD CONTROLADO
    const formatUserName = (user) => {
        if (!user || !user.name) return "";
        const name = user.name.trim();
        const maxLength = 12;
        return name.length > maxLength
            ? `${name.substring(0, maxLength)}...`
            : name;
    };

    const [scrolled, setScrolled] = useState(false);
    const [events, setEvents] = useState([]);
    const [navExpanded, setNavExpanded] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setNavExpanded(false);
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
        location.pathname === "/gallery" ||
        location.pathname === "/legal-notice" ||
        location.pathname === "/about-us" ||
        location.pathname === "/blog";

    useEffect(() => {
        const noCarouselPaths = [
            "/gallery",
            "/about-us",
            "/legal-notice",
            "/crudgallery",
            "/crudblogs",
            "/crudevents",
            "/login",
            "/cart",
            "/crudproducts",
            "/crudcategories",
            "/crudbanners",
            "/crudsongs",
        ];

        const shouldHide =
            noCarouselPaths.includes(location.pathname) ||
            location.pathname.startsWith("/item") ||
            location.pathname.startsWith("/events/");

        setShowCarousel(!shouldHide);
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
                expanded={navExpanded}
                onToggle={(expanded) => setNavExpanded(expanded)}
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
                            {/* TEXTO DE IDENTIDAD TEXTUAL BRUTALISTA CORREGIDO */}
                            {userInfo && (
                                <span className="nav-user-status text-uppercase">
                                    <span className="blink-dot">●</span> ONLINE
                                    // {formatUserName(userInfo)}
                                </span>
                            )}

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
                            <Nav.Link as={Link} to="gallery">
                                Gallery
                            </Nav.Link>
                            <Nav.Link as={Link} to="store">
                                Store
                            </Nav.Link>

                            {/* CRUD ACCESOS RÁPIDOS CON COERCIÓN BOOLEANA ESTRICTA (EVITA EL EL RENDERIZADO DE '0') */}
                            {userInfo && !!userAdmin && (
                                <NavDropdown
                                    title="Admin"
                                    id="admin-crud-dropdown"
                                    className="custom-dropdown"
                                >
                                    <NavDropdown.Item
                                        as={Link}
                                        to="crudgallery"
                                    >
                                        Gallery Crud
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="crudblogs">
                                        Blogs Crud
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="crudevents">
                                        Events Crud
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="crudsongs">
                                        Songs Crud
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="crudbanners"
                                    >
                                        Banners Crud
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="crudcategories"
                                    >
                                        Categories Crud
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="crudproducts"
                                    >
                                        Products Crud
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}

                            {/* ICONOS DE ACCIÓN */}
                            <div className="d-flex align-items-center gap-3 px-3 execution-icons">
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

                                {!userInfo ? (
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
                                ) : (
                                    <Nav.Link
                                        onClick={handleLogout}
                                        title="Logout"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <MDBIcon
                                            fas
                                            icon="sign-out-alt"
                                            className="icon text-muted"
                                        />
                                    </Nav.Link>
                                )}
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* NOTIFICACIONES Y CONTENEDORES */}
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
                    <Outlet />
                </Container>
            </section>
            <Footer />
        </>
    );
}

export default Menu;
