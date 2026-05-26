import React, { useState, useEffect } from "react";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBTypography,
    MDBIcon,
} from "mdb-react-ui-kit";
import { useUser } from "./UserContext";
import { Link } from "react-router-dom";
import axios from "axios";

function Cart() {
    const { userInfo } = useUser();
    const userId = userInfo ? userInfo.id : "";
    const accessToken = userInfo ? userInfo.token : "";

    // VERIFIES AUTH USER
    const isLoggedIn = userInfo && userInfo.id;

    const [wishlistProducts, setWishlistProducts] = useState([]);

    useEffect(() => {
        // EXECUTES IF USER IS AUTH
        if (isLoggedIn) {
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
                    setWishlistProducts(data);
                })
                .catch((error) =>
                    console.error("Error fetching wishlist data:", error),
                );
        }
    }, [isLoggedIn, userId, accessToken]);

    const handleRemoveFromWishlist = (productId) => {
        // Borrado visual optimista
        const updated = wishlistProducts.filter((p) => p.id !== productId);
        setWishlistProducts(updated);

        // Borrado en BD (reutiliza tu endpoint actual)
        axios
            .post("http://127.0.0.1:8000/api/removeProductFromCart", {
                user_id: userId,
                product_id: productId,
            })
            .then((response) => {
                console.log("Removido de wishlist:", response.data.message);
            })
            .catch((error) => {
                console.error("Error al eliminar de wishlist:", error);
            });
    };

    return (
        <section className="h-100">
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol size="12">
                        <MDBCard
                            className="card-registration"
                            style={{
                                borderRadius: "16px",
                                padding: "40px",
                                border: "none",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                            }}
                        >
                            <MDBCardBody className="p-0">
                                <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
                                    <h2
                                        style={{
                                            color: "#111",
                                            fontSize: "2.4em",
                                            fontWeight: "800",
                                            letterSpacing: "-0.5px",
                                        }}
                                    >
                                        My Wishlist
                                    </h2>
                                    <MDBTypography
                                        tag="h6"
                                        className="text-muted mb-0"
                                    >
                                        {wishlistProducts.length}{" "}
                                        {wishlistProducts.length === 1
                                            ? "item"
                                            : "items"}{" "}
                                        guardados
                                    </MDBTypography>
                                </div>

                                {!isLoggedIn && (
                                    <div className="text-center py-5">
                                        <MDBIcon
                                            far
                                            icon="heart"
                                            size="3x"
                                            className="text-muted mb-3"
                                        />
                                        <p
                                            style={{
                                                fontSize: "1.1em",
                                                color: "#555",
                                            }}
                                        >
                                            Necesitas iniciar sesión para
                                            gestionar tu lista de deseos.
                                        </p>
                                        <Link
                                            to="/login"
                                            className="btn btn-dark btn-rounded px-4"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                    </div>
                                )}

                                {/* RENDER PRODUCTS IN WISHLIST (DISEÑO EN CUADRÍCULA INTERACTIVA) */}
                                <MDBRow>
                                    {isLoggedIn &&
                                        wishlistProducts.map((product) => (
                                            <MDBCol
                                                md="6"
                                                lg="4"
                                                xl="4"
                                                key={product.id}
                                                className="mb-4"
                                            >
                                                <div
                                                    className="p-3 h-100 d-flex flex-column justify-content-between"
                                                    style={{
                                                        borderRadius: "12px",
                                                        border: "1px solid #eee",
                                                        backgroundColor: "#fff",
                                                        transition:
                                                            "transform 0.2s",
                                                        position: "relative",
                                                    }}
                                                    onMouseEnter={(e) =>
                                                        (e.currentTarget.style.transform =
                                                            "translateY(-4px)")
                                                    }
                                                    onMouseLeave={(e) =>
                                                        (e.currentTarget.style.transform =
                                                            "translateY(0)")
                                                    }
                                                >
                                                    {/* BOTÓN ELIMINAR DE LA WISHLIST (TOP RIGHT) */}
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveFromWishlist(
                                                                product.id,
                                                            )
                                                        }
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: "15px",
                                                            right: "15px",
                                                            background:
                                                                "rgba(255,255,255,0.9)",
                                                            border: "none",
                                                            borderRadius: "50%",
                                                            width: "32px",
                                                            height: "32px",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            boxShadow:
                                                                "0 2px 6px rgba(0,0,0,0.1)",
                                                            zIndex: "2",
                                                            color: "#666",
                                                        }}
                                                    >
                                                        <MDBIcon
                                                            fas
                                                            icon="times"
                                                        />
                                                    </button>

                                                    <div>
                                                        {/* IMAGEN INTERACTIVA QUE REDIRECCIONA AL DETAIL */}
                                                        <Link
                                                            to={`/item/${product.id}`}
                                                            style={{
                                                                display:
                                                                    "block",
                                                                overflow:
                                                                    "hidden",
                                                                borderRadius:
                                                                    "8px",
                                                            }}
                                                        >
                                                            <img
                                                                src={
                                                                    product.images
                                                                        ? Array.isArray(
                                                                              product.images,
                                                                          )
                                                                            ? product
                                                                                  .images[0]
                                                                            : product.images
                                                                        : "https://via.placeholder.com/300"
                                                                }
                                                                className="img-fluid w-100"
                                                                style={{
                                                                    height: "240px",
                                                                    objectFit:
                                                                        "cover",
                                                                    transition:
                                                                        "transform 0.3s",
                                                                }}
                                                                alt={
                                                                    product.name
                                                                }
                                                                onMouseEnter={(
                                                                    e,
                                                                ) =>
                                                                    (e.currentTarget.style.transform =
                                                                        "scale(1.04)")
                                                                }
                                                                onMouseLeave={(
                                                                    e,
                                                                ) =>
                                                                    (e.currentTarget.style.transform =
                                                                        "scale(1)")
                                                                }
                                                            />
                                                        </Link>

                                                        {/* INFO DEL PRODUCTO */}
                                                        <div className="pt-3">
                                                            <span
                                                                className="text-uppercase tracking-wider text-muted d-block mb-1"
                                                                style={{
                                                                    fontSize:
                                                                        "0.75rem",
                                                                    fontWeight:
                                                                        "600",
                                                                    letterSpacing:
                                                                        "1px",
                                                                }}
                                                            >
                                                                {product.brand ||
                                                                    product.designer ||
                                                                    product.category ||
                                                                    "Diseño de Autor"}
                                                            </span>
                                                            <h5
                                                                style={{
                                                                    fontWeight:
                                                                        "600",
                                                                    fontSize:
                                                                        "1.1rem",
                                                                    margin: "0 0 8px 0",
                                                                }}
                                                            >
                                                                {product.name}
                                                            </h5>
                                                            <p
                                                                className="text-dark fw-bold mb-3"
                                                                style={{
                                                                    fontSize:
                                                                        "1.15rem",
                                                                }}
                                                            >
                                                                ${" "}
                                                                {product.price}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* BOTÓN DINÁMICO DE CONTACTO / ADQUISICIÓN */}
                                                    <div className="mt-2">
                                                        <a
                                                            href={
                                                                product.contact_url ||
                                                                "#!"
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-100 btn btn-outline-dark btn-sm pt-2 pb-2"
                                                            style={{
                                                                borderRadius:
                                                                    "6px",
                                                                fontWeight:
                                                                    "600",
                                                                letterSpacing:
                                                                    "0.5px",
                                                            }}
                                                        >
                                                            <MDBIcon
                                                                fas
                                                                icon="comment-alt me-2"
                                                            />{" "}
                                                            Contactar Diseñador
                                                        </a>
                                                    </div>
                                                </div>
                                            </MDBCol>
                                        ))}
                                </MDBRow>

                                {wishlistProducts.length === 0 &&
                                    isLoggedIn && (
                                        <div className="text-center py-5">
                                            <MDBIcon
                                                far
                                                icon="heart"
                                                size="2.5x"
                                                className="text-muted mb-3"
                                            />
                                            <p className="text-muted">
                                                Tu lista de deseos está vacía
                                                por ahora.
                                            </p>
                                        </div>
                                    )}

                                <hr className="my-4" />

                                <div className="pt-3">
                                    <MDBTypography tag="h6" className="mb-0">
                                        <Link
                                            to="/"
                                            style={{
                                                textDecoration: "none",
                                                color: "#111",
                                                fontWeight: "600",
                                                display: "inline-flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <MDBIcon
                                                fas
                                                icon="long-arrow-alt-left me-2"
                                            />
                                            Volver a la galería
                                        </Link>
                                    </MDBTypography>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}

export default Cart;
