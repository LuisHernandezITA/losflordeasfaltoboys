import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    const { brandName } = useParams(); // <--- Lee el parámetro de la ruta
    const useNavigateInstance = useNavigate(); // <--- Para cambiar la URL al hacer clic

    const [productData, setProductData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brandsData, setBrandsData] = useState([]);

    // ESTADOS DE FILTRADO Y BÚSQUEDA
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    // --- ESTADOS PARA PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Función auxiliar para transformar marcas a slugs limpios con guiones
    const formatSlug = (text) => {
        if (!text) return "";
        return text.toString().toLowerCase().trim().replace(/\s+/g, "-");
    };

    // OBTENER MARCAS ÚNICAS DISPONIBLES EN LOS PRODUCTOS
    const brands = [
        ...new Set(
            productData.map((product) => product.designer).filter(Boolean),
        ),
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/products_index");
                const productosInvertidos = [...response.data].reverse();
                setProductData(productosInvertidos);
            } catch (error) {
                console.error("Error cargando productos:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get("/api/category_index");
                setCategories(response.data);
            } catch (error) {
                console.error("Error cargando categorías:", error);
            }
        };

        const fetchBrandsData = async () => {
            try {
                // Ajusta esta ruta a tu endpoint real de marcas
                const response = await axios.get("/api/brands_index");
                setBrandsData(response.data);
            } catch (error) {
                console.error("Error cargando marcas:", error);
            }
        };

        fetchData();
        fetchCategories();
        fetchBrandsData();
    }, []);

    // EFECTO PARA INTERPRETAR LA URL CON GUIONES MEDIOS (-)
    useEffect(() => {
        if (brandName) {
            // Reemplaza los guiones por espacios para buscar el nombre real de la marca
            const formattedUrlName = brandName.replace(/-/g, " ");
            const decodedBrand = decodeURIComponent(formattedUrlName);

            const foundBrand = brands.find(
                (b) => b.toLowerCase() === decodedBrand.toLowerCase(),
            );
            setSelectedBrand(foundBrand || decodedBrand);
        } else {
            setSelectedBrand(null);
        }
    }, [brandName, productData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedBrand, searchTerm]);

    // FUNCIÓN DE FILTRADO REACTIVO COMBINADO
    const getFilteredProducts = () => {
        return productData.filter((product) => {
            const matchesCategory =
                selectedCategory === null ||
                product.category_id === selectedCategory;

            const matchesBrand =
                selectedBrand === null || product.designer === selectedBrand;

            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.designer &&
                    product.designer
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));

            return matchesCategory && matchesBrand && matchesSearch;
        });
    };

    const getBrandSuggestions = () => {
        if (searchTerm.length === 0) return [];
        return brands.filter((brand) =>
            brand.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    };

    const brandSuggestions = getBrandSuggestions();

    const filteredProducts = getFilteredProducts();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = filteredProducts.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Auxiliar para obtener el nombre de la categoría seleccionada en el título del Dropdown
    const getSelectedCategoryName = () => {
        if (selectedCategory === null) return "ALL CATEGORIES";
        const currentCat = categories.find((c) => c.id === selectedCategory);
        return currentCat ? currentCat.name.toUpperCase() : "ALL CATEGORIES";
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

    const getBannerUrl = () => {
        const GENERIC_BANNER = "https://i.postimg.cc/kgbRcpB2/VISUALOIDE.gif";

        if (!selectedBrand) return GENERIC_BANNER;

        const brandInfo = brandsData.find(
            (b) => b.name.toLowerCase() === selectedBrand.toLowerCase(),
        );

        return brandInfo?.banner_url || GENERIC_BANNER;
    };

    return (
        <div>
            <br></br>
            <div
                className="brand-banner"
                style={{
                    width: "100%",
                    height: "250px",
                    backgroundImage: `url("${getBannerUrl()}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    // --- TRANSICIÓN ELEGANTE Y FLUIDA ---
                    transition:
                        "background-image 1.1s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.1s ease-in-out",
                    WebkitTransition:
                        "background-image 1.1s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.1s ease-in-out",
                    // ------------------------------------
                }}
            />
            <Navbar
                expand="lg"
                variant="dark"
                className="shadow-sm py-3 w-100 position-relative"
                style={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    backgroundColor: "transparent",
                }}
            >
                {/* Capa de fondo con la imagen */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url("https://i.postimg.cc/k5RgR8vk/Towena-Route.jpg")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 0,
                        filter: "invert(1)",
                    }}
                />

                {/* Capa de desenfoque */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backdropFilter: "blur(15px)",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        zIndex: 1,
                    }}
                />

                {/* Contenido */}
                <Container
                    className="px-4 flex-wrap"
                    style={{ position: "relative", zIndex: 2 }}
                >
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
                                <NavDropdown
                                    title={getSelectedCategoryName()}
                                    id="categories-dropdown"
                                    className="custom-nav-dropdown"
                                    style={{ fontSize: "0.875rem" }}
                                >
                                    <NavDropdown.Item
                                        onClick={() =>
                                            setSelectedCategory(null)
                                        }
                                        className={
                                            selectedCategory === null
                                                ? "active-dropdown-item"
                                                : ""
                                        }
                                    >
                                        ALL CATEGORIES
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
                                        {categories.map((category) => (
                                            <NavDropdown.Item
                                                key={category.id}
                                                onClick={() =>
                                                    setSelectedCategory(
                                                        category.id,
                                                    )
                                                }
                                                className={
                                                    selectedCategory ===
                                                    category.id
                                                        ? "active-dropdown-item"
                                                        : ""
                                                }
                                            >
                                                {category.name.toUpperCase()}
                                            </NavDropdown.Item>
                                        ))}
                                    </div>
                                </NavDropdown>
                            </div>

                            <hr className="d-lg-none my-2 border-secondary" />

                            {/* MARCAS (CON URL SLUG FORMAT) */}
                            <div className="nav-filter-group">
                                <span
                                    className="text-muted small d-block mb-1 tracking-wider"
                                    style={{
                                        fontSize: "0.75rem",
                                        letterSpacing: "1px",
                                        fontFamily: "Space Mono, monospace",
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
                                        onClick={() =>
                                            useNavigateInstance("/store")
                                        }
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
                                                    useNavigateInstance(
                                                        `/store/${encodeURIComponent(formatSlug(brand))}`,
                                                    )
                                                }
                                                className={
                                                    selectedBrand === brand
                                                        ? "active-dropdown-item"
                                                        : ""
                                                }
                                            >
                                                {brand.toUpperCase()}
                                            </NavDropdown.Item>
                                        ))}
                                    </div>
                                </NavDropdown>
                            </div>
                        </Nav>

                        {/* BARRA DE BÚSQUEDA REACTIVA */}
                        <div
                            className="ms-lg-auto pt-3 pt-lg-0 w-100 w-lg-25"
                            style={{ position: "relative" }}
                        >
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
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onBlur={() =>
                                        setTimeout(
                                            () => setShowSuggestions(false),
                                            200,
                                        )
                                    }
                                    style={{
                                        backgroundColor: "#1a1a1a",
                                        border: "1px solid #333",
                                        color: "#fff",
                                    }}
                                />
                            </InputGroup>

                            {/* LISTA DE AUTOCOMPLETADO DE MARCAS */}
                            {showSuggestions && brandSuggestions.length > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        right: 0,
                                        width: "100%",
                                        maxWidth: "300px",
                                        backgroundColor: "#1a1a1a",
                                        border: "1px solid #333",
                                        zIndex: 1000,
                                        marginTop: "5px",
                                    }}
                                >
                                    {brandSuggestions.map((brand, idx) => (
                                        <div
                                            key={idx}
                                            className="p-2 cursor-pointer suggestion-item"
                                            style={{
                                                color: "#fff",
                                                fontSize: "0.8rem",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                setSearchTerm(brand);
                                                useNavigateInstance(
                                                    `/store/${encodeURIComponent(formatSlug(brand))}`,
                                                );
                                                setShowSuggestions(false);
                                            }}
                                        >
                                            {brand.toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <br />

            {/* CONTENEDOR DE PRODUCTOS PAGINADOS */}
            <div
                className="d-flex flex-wrap justify-content-center"
                style={{ gap: "10px" }}
            >
                {currentItems.length > 0 ? (
                    currentItems.map((product) => (
                        <div key={product.id} className="card-wrapper">
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
            <br></br>

            {/* --- CONTROLES DE PAGINACIÓN --- */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-4 pb-5">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => paginate(currentPage - 1)}
                        className="pagination-btn"
                    >
                        «
                    </button>

                    {(() => {
                        const pageNumbers = [];
                        let startPage = Math.max(1, currentPage - 2);
                        let endPage = Math.min(totalPages, startPage + 4);
                        if (endPage - startPage < 4)
                            startPage = Math.max(1, endPage - 4);
                        for (let i = startPage; i <= endPage; i++)
                            pageNumbers.push(i);

                        return pageNumbers.map((number) => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`pagination-btn ${currentPage === number ? "active" : ""}`}
                            >
                                {number}
                            </button>
                        ));
                    })()}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => paginate(currentPage + 1)}
                        className="pagination-btn"
                    >
                        »
                    </button>
                </div>
            )}
        </div>
    );
}

export default ListCard;
