import React, { useState, useEffect } from "react";
import {
    Spinner,
    Navbar,
    Nav,
    Container,
    Form,
    InputGroup,
    NavDropdown,
} from "react-bootstrap";
import axios from "axios";
import Card_C from "./Card_C";
import "/resources/css/app.css";
import { MDBIcon } from "mdb-react-ui-kit";

function ListCard() {
    const [productData, setProductData] = useState([]);
    const [categories, setCategories] = useState([]);

    // ESTADOS DE FILTRADO Y BÚSQUEDA
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // --- NUEVOS ESTADOS PARA PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Modifica este número según cuántos productos quieras ver por página

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/products_index",
                );
                setProductData(response.data);
            } catch (error) {
                console.error("Error cargando productos:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/category_index",
                );
                setCategories(response.data);
            } catch (error) {
                console.error("Error cargando categorías:", error);
            }
        };

        fetchData();
        fetchCategories();
    }, []);

    // --- EFECTO: Si cambia cualquier filtro, reiniciamos a la primera página ---
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedBrand, searchTerm]);

    // OBTENER MARCAS ÚNICAS DISPONIBLES EN LOS PRODUCTOS
    const brands = [
        ...new Set(
            productData.map((product) => product.designer).filter(Boolean),
        ),
    ];

    // FUNCIÓN DE FILTRADO REACTIVO COMBINADO
    const getFilteredProducts = () => {
        return productData.filter((product) => {
            // 1. Filtro por Categoría
            const matchesCategory =
                selectedCategory === null ||
                product.category_id === selectedCategory;

            // 2. Filtro por Marca / Diseñador
            const matchesBrand =
                selectedBrand === null || product.designer === selectedBrand;

            // 3. Barra de búsqueda
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.designer &&
                    product.designer
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));

            return matchesCategory && matchesBrand && matchesSearch;
        });
    };

    // --- LÓGICA DE PAGINACIÓN APLICADA SOBRE LA DATA FILTRADA ---
    const filteredProducts = getFilteredProducts();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Estos son los productos recortados que efectivamente se van a renderizar
    const currentItems = filteredProducts.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (productData.length === 0 || categories.length === 0) {
        return (
            <div className="d-flex flex-wrap justify-content-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div>
            <br />
            <Navbar
                expand="lg"
                variant="dark"
                style={{
                    backgroundColor: "rgb(18, 18, 18)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
                className="shadow-sm py-3 w-100"
            >
                <Container className="px-4 flex-wrap">
                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                        className="border-0 custom-toggler d-flex align-items-center ps-0"
                    >
                        <span
                            className="glitch-text"
                            style={{
                                fontSize: "1.2rem",
                                letterSpacing: "4px",
                                opacity: "0.8",
                                fontWeight: "300",
                            }}
                        >
                            STORE ♱༺༒︎⊰‿̩͙
                        </span>
                    </Navbar.Toggle>

                    <Navbar.Collapse
                        id="basic-navbar-nav"
                        className="w-100 mt-3 mt-lg-0"
                    >
                        <Nav className="me-auto d-flex flex-column flex-lg-row gap-2 gap-lg-4 w-100 hierarchical-nav">
                            {/* BLOQUE: CATEGORÍAS */}
                            <div className="nav-filter-group">
                                <span
                                    className="text-muted small d-block mb-1 tracking-wider"
                                    style={{
                                        fontSize: "0.75rem",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    CATEGORIES
                                </span>
                                <div className="d-flex flex-wrap gap-2">
                                    <Nav.Link
                                        onClick={() =>
                                            setSelectedCategory(null)
                                        }
                                        className={`text-uppercase small p-0 me-2 ${selectedCategory === null ? "text-white fw-bold" : "text-muted"}`}
                                    >
                                        All
                                    </Nav.Link>
                                    {categories.map((category) => (
                                        <Nav.Link
                                            key={category.id}
                                            className={`text-uppercase small p-0 me-2 ${selectedCategory === category.id ? "text-white fw-bold" : "text-muted"}`}
                                            onClick={() =>
                                                setSelectedCategory(category.id)
                                            }
                                        >
                                            {category.name}
                                        </Nav.Link>
                                    ))}
                                </div>
                            </div>

                            {/* DIVISOR INTERNO EN MÓVILES */}
                            <hr className="d-lg-none my-2 border-secondary" />

                            {/* BLOQUE: MARCAS */}
                            <div className="nav-filter-group">
                                <span
                                    className="text-muted small d-block mb-1 tracking-wider"
                                    style={{
                                        fontSize: "0.75rem",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    BRANDS
                                </span>

                                <NavDropdown
                                    title={
                                        selectedBrand === null
                                            ? "ALL BRANDS"
                                            : selectedBrand.toUpperCase()
                                    }
                                    id="brands-dropdown"
                                    className="custom-nav-dropdown"
                                    style={{ fontSize: "0.875rem" }}
                                >
                                    <NavDropdown.Item
                                        onClick={() => setSelectedBrand(null)}
                                        className={
                                            selectedBrand === null
                                                ? "active-dropdown-item"
                                                : ""
                                        }
                                    >
                                        ALL BRANDS
                                    </NavDropdown.Item>

                                    <NavDropdown.Divider
                                        style={{
                                            backgroundColor:
                                                "rgba(255,255,255,0.1)",
                                        }}
                                    />

                                    <div
                                        style={{
                                            maxHeight: "250px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        {brands.map((brand, idx) => (
                                            <NavDropdown.Item
                                                key={idx}
                                                onClick={() =>
                                                    setSelectedBrand(brand)
                                                }
                                                className={
                                                    selectedBrand === brand
                                                        ? "active-dropdown-item"
                                                        : ""
                                                }
                                            >
                                                {brand}
                                            </NavDropdown.Item>
                                        ))}
                                    </div>
                                </NavDropdown>
                            </div>
                        </Nav>

                        {/* BARRA DE BÚSQUEDA REACTIVA */}
                        <div className="ms-lg-auto pt-3 pt-lg-0 w-100 w-lg-25">
                            <InputGroup
                                size="sm"
                                style={{ maxWidth: "300px" }}
                                className="ms-auto"
                            >
                                <InputGroup.Text
                                    style={{
                                        backgroundColor: "#222",
                                        border: "1px solid #333",
                                        color: "#666",
                                    }}
                                >
                                    <MDBIcon fas icon="search" />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search item or brand..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    style={{
                                        backgroundColor: "#1a1a1a",
                                        border: "1px solid #333",
                                        color: "#fff",
                                        boxShadow: "none",
                                    }}
                                    className="search-input-placeholder"
                                />
                            </InputGroup>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <br />

            {/* CONTENEDOR DE PRODUCTOS PAGINADOS */}
            <div
                className="d-flex flex-wrap justify-content-center"
                style={{ gap: "20px" }}
            >
                {currentItems.length > 0 ? (
                    currentItems.map((product) => (
                        <div
                            key={product.id}
                            className="card-wrapper"
                            style={{ margin: "10px" }}
                        >
                            <Card_C
                                id={product.id}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                image_primary={product.image_primary}
                                available={product.available}
                            />
                        </div>
                    ))
                ) : (
                    <div
                        className="text-center w-100 py-5"
                        style={{ color: "#555" }}
                    >
                        <MDBIcon
                            fas
                            icon="exclamation-circle"
                            size="2x"
                            className="mb-2"
                        />
                        <p className="small text-uppercase tracking-wider">
                            No products match your filters
                        </p>
                    </div>
                )}
            </div>

            {/* --- CONTROLES DE PAGINACIÓN DE LA TIENDA (Idénticos a tu Blog de Música) --- */}
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
            <br />
        </div>
    );
}

export default ListCard;
