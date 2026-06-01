import React from "react";
import {
    MDBFooter,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
} from "mdb-react-ui-kit";

function Footer() {
    return (
        <MDBFooter
            className="text-center text-lg-start text-white" // Cambiamos text-muted por text-white
            style={{ backgroundColor: "rgb(18, 18, 18)" }} // Aplicamos tu color
        >
            {/* Sección de redes sociales con borde sutil */}
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom border-secondary">
                <div className="me-5 d-none d-lg-block">
                    <span>Conecta con nosotros mi am0o0r!</span>
                </div>

                <div>
                    <a
                        href="https://www.youtube.com/@losflordeasfaltoboys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="me-4 text-reset custom-footer-icon"
                    >
                        <MDBIcon fab icon="youtube" color="light" />
                    </a>
                    <a
                        href="https://instagram.com/losflordeasfalto"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="me-4 text-reset custom-footer-icon"
                    >
                        <MDBIcon fab icon="instagram" color="light" />
                    </a>
                    <a
                        href="https://open.spotify.com/intl-es/artist/1Bp0YWLVnkxrJ9SJE4RS1E"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="me-4 text-reset custom-footer-icon"
                    >
                        <MDBIcon fab icon="spotify" color="light" />
                    </a>
                    <a
                        href="https://www.tiktok.com/@losflordeasfaltoboys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="me-4 text-reset custom-footer-icon"
                    >
                        <MDBIcon fab icon="tiktok" color="light" />
                    </a>
                </div>
            </section>

            <section className="">
                <MDBContainer className="text-center text-md-start mt-5">
                    <MDBRow className="mt-3">
                        <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                <img
                                    alt="Logo"
                                    src="/img/logosmc.svg"
                                    width="120"
                                    height="60"
                                    className="d-inline-block align-top"
                                    style={{
                                        filter: "brightness(0) invert(1)",
                                    }} // Si el logo es negro, esto lo hace blanco
                                />
                            </h6>
                            <p className="text-white-50">
                                {" "}
                                {/* Texto un poco más suave que el blanco puro */}
                                Hu0la, esta web es para difusión artistica, te
                                amamos, esperamos verte pronto!
                            </p>
                        </MDBCol>

                        <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                Productos
                            </h6>
                            <p>
                                <a href="/store" className="text-white-50">
                                    Store
                                </a>
                            </p>
                            <p>
                                <a href="/blogs" className="text-white-50">
                                    Blogs
                                </a>
                            </p>
                        </MDBCol>

                        <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                Links
                            </h6>
                            <p>
                                <a href="/about-us" className="text-white-50">
                                    Nosotros
                                </a>
                            </p>
                            <p>
                                <a
                                    href="/legal-notice"
                                    className="text-white-50"
                                >
                                    Avisos Legales
                                </a>
                            </p>
                        </MDBCol>

                        <MDBCol
                            md="4"
                            lg="3"
                            xl="3"
                            className="mx-auto mb-md-0 mb-4"
                        >
                            <h6 className="text-uppercase fw-bold mb-4">
                                Contacto
                            </h6>
                            <p>
                                <MDBIcon
                                    icon="home"
                                    className="me-2"
                                    color="light"
                                />{" "}
                                Aguascalientes, MX
                            </p>
                            <p>
                                <MDBIcon
                                    icon="envelope"
                                    className="me-3"
                                    color="light"
                                />{" "}
                                losoutsiders420@gmail.com
                            </p>
                            <p>
                                <MDBIcon
                                    icon="phone"
                                    className="me-3"
                                    color="light"
                                />{" "}
                                + 01 800 NOTENEMOS
                            </p>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>

            {/* Copyright con un tono de negro ligeramente distinto para dar profundidad */}
            <div
                className="text-center p-4"
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                }}
            >
                © 2026 Copyright:
                <a className="text-reset fw-bold ms-1" href="#">
                    Los Flor de Asfalto
                </a>
            </div>
        </MDBFooter>
    );
}

export default Footer;
