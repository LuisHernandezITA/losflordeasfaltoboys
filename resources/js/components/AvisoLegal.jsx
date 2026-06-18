import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MDBIcon } from "mdb-react-ui-kit";
import "/resources/css/app.css";

function AvisoLegal() {
    return (
        <Container
            fluid
            className="px-3 px-md-5 py-5"
            style={{ backgroundColor: "#121212", minHeight: "100vh" }}
        >
            {/* CABECERA ESTILO INDUSTRIAL */}
            <div className="mb-5 border-bottom border-secondary pb-4">
                <h1
                    className="text-white display-4 fw-black text-uppercase m-0"
                    style={{
                        fontFamily: "'Impact', 'Arial Black', sans-serif",
                        letterSpacing: "2px",
                    }}
                >
                    TÉRMINOS LEGALES
                </h1>
                <p className="text-muted text-uppercase small tracking-widest mt-2">
                    [ // REGLAMENTO DE NAVEGACIÓN Y USO DE LOSFLORDEASFALTO.COM
                    ]
                </p>
            </div>

            <Row className="justify-content-start text-white">
                <Col lg={9} xl={8}>
                    {/* BLOQUE 1: TITULARIDAD */}
                    <section
                        className="mb-5 p-4 bg-black border border-secondary position-relative"
                        style={{ boxShadow: "6px 6px 0px #222" }}
                    >
                        <h2
                            className="h4 text-uppercase fw-bold text-warning mb-3"
                            style={{ letterSpacing: "1px" }}
                        >
                            01. IDENTIFICACIÓN Y TITULARIDAD
                        </h2>
                        <p
                            className="text-white-50"
                            style={{ fontWeight: "300", lineHeight: "1.6" }}
                        >
                            En cumplimiento de las normativas de Comercio
                            Electrónico y Servicios de la Sociedad de la
                            Información, el Titular expone sus datos
                            identificativos para la gestión y administración del
                            sitio web oficial de{" "}
                            <strong>losflordeasfalto.com</strong>.
                        </p>
                        <ul
                            className="list-unstyled text-white-50 ps-2 border-start border-warning"
                            style={{ fontSize: "0.95rem" }}
                        >
                            <li>
                                <strong className="text-white">
                                    PROYECTO:
                                </strong>{" "}
                                Difusión Cultural - Los Flor de Asfalto
                            </li>
                            <li>
                                <strong className="text-white">
                                    SITIO WEB:
                                </strong>{" "}
                                www.losflordeasfalto.com
                            </li>
                            <li>
                                <strong className="text-white">
                                    CONTACTO DIRECTO:
                                </strong>{" "}
                                losoutsider420@gmail.com
                            </li>
                        </ul>
                    </section>

                    {/* BLOQUE 2: CONDICIONES */}
                    <section className="mb-5">
                        <h2
                            className="h4 text-uppercase fw-bold mb-3 text-white"
                            style={{ letterSpacing: "1px" }}
                        >
                            02. CONDICIONES DE USO Y RESPONSABILIDAD
                        </h2>
                        <p
                            className="text-white-50"
                            style={{ fontWeight: "300" }}
                        >
                            La utilización del Sitio Web le otorga la condición
                            de Usuario, e implica la aceptación completa de
                            todas las cláusulas y condiciones de uso incluidas
                            en las páginas de <strong>Aviso Legal</strong>,{" "}
                            <strong>Política de Privacidad</strong> y{" "}
                            <strong>Política de Cookies</strong>.
                        </p>
                        <p
                            className="text-white-50"
                            style={{ fontWeight: "300" }}
                        >
                            Si no estuviera conforme con estas cláusulas,
                            absténgase de utilizar este Sitio Web. El acceso no
                            supone, en modo alguno, el inicio de una relación
                            comercial con el Titular. Queda prohibido utilizar
                            los contenidos para fines ilícitos, lesivos de
                            derechos de terceros o que puedan sobrecargar o
                            deteriorar la infraestructura del servidor
                            informático.
                        </p>
                    </section>

                    {/* BLOQUE 3: MEDIDAS DE SEGURIDAD */}
                    <section
                        className="mb-5 p-4 bg-black border border-secondary"
                        style={{ boxShadow: "6px 6px 0px #222" }}
                    >
                        <h2
                            className="h4 text-uppercase fw-bold text-danger mb-3"
                            style={{ letterSpacing: "1px" }}
                        >
                            03. TRATAMIENTO DE DATOS Y SEGURIDAD
                        </h2>
                        <p
                            className="text-white-50"
                            style={{ fontWeight: "300" }}
                        >
                            Los datos personales que facilite al Titular pueden
                            ser almacenados en bases de datos automatizadas o
                            no, cuya titularidad corresponde en exclusiva al
                            Titular, asumiendo las medidas técnicas y
                            organizativas necesarias para garantizar la
                            confidencialidad e integridad de la información.
                        </p>
                        <div className="p-3 bg-dark border-start border-3 border-danger my-3">
                            <p className="small m-0 text-white-50">
                                <MDBIcon
                                    fas
                                    icon="exclamation-triangle"
                                    className="text-danger me-2"
                                />
                                <strong>AVISO EN LA RED:</strong> Aunque
                                encriptamos mediante protocolos HTTPS seguros,
                                el Usuario debe ser consciente de que las
                                medidas de seguridad informática en Internet no
                                son infalibles a vulnerabilidades externas fuera
                                del control del Titular.
                            </p>
                        </div>
                    </section>

                    {/* BLOQUE 4: PROPIEDAD INTELECTUAL */}
                    <section className="mb-5">
                        <h2
                            className="h4 text-uppercase fw-bold mb-3 text-white"
                            style={{ letterSpacing: "1px" }}
                        >
                            04. PROPIEDAD INTELECTUAL E INDUSTRIAL
                        </h2>
                        <p
                            className="text-white-50"
                            style={{ fontWeight: "300" }}
                        >
                            Todos los derechos están reservados. Todo acceso a{" "}
                            <strong>losflordeasfalto.com</strong> está sujeto a
                            las siguientes condiciones: la reproducción, el
                            almacenaje permanente, el uso de imágenes de
                            productos de la tienda y la difusión de los
                            contenidos multimedia con finalidades públicas o
                            comerciales queda expresamente prohibida sin el
                            consentimiento previo por escrito de los
                            administradores de la marca y colaboradores.
                        </p>
                    </section>

                    {/* BLOQUE 5: RECLAMACIONES */}
                    <section
                        className="mb-5 p-4 bg-black border border-secondary"
                        style={{ boxShadow: "6px 6px 0px #222" }}
                    >
                        <h2
                            className="h4 text-uppercase fw-bold text-white mb-3"
                            style={{ letterSpacing: "1px" }}
                        >
                            05. RECLAMACIONES Y RESOLUCIÓN DE CONFLICTOS
                        </h2>
                        <p
                            className="text-white-50"
                            style={{ fontWeight: "300" }}
                        >
                            Informamos que existen hojas de reclamación a
                            disposición de usuarios y clientes. El Usuario podrá
                            realizar reclamos solicitando su hoja o remitiendo
                            un correo electrónico directamente a{" "}
                            <strong>losoutsiders420@gmail.com</strong> indicando
                            su nombre, apellidos, el producto adquirido y
                            exponiendo de manera directa los motivos de su
                            inconformidad.
                        </p>
                    </section>

                    {/* BLOQUE 6: EXCLUSIÓN DE GARANTÍAS */}
                    <section className="mb-5">
                        <h2
                            className="h4 text-uppercase fw-bold mb-3 text-white"
                            style={{ letterSpacing: "1px" }}
                        >
                            06. EXCLUSIÓN DE GARANTÍAS Y RESPONSABILIDAD
                        </h2>
                        <p
                            className="text-white-50"
                            style={{ fontWeight: "300" }}
                        >
                            El Prestador no otorga ninguna garantía ni se hace
                            responsable de daños de cualquier naturaleza
                            derivados de la falta de disponibilidad del
                            servidor, caídas del sistema, mantenimiento o mal
                            funcionamiento del sitio web, así como de la
                            presencia de malware transmitido por agentes
                            maliciosos externos.
                        </p>
                    </section>

                    {/* CIERRE ESTILO TICKET */}
                    <div className="mt-5 pt-4 border-top border-secondary text-center text-md-start">
                        <p className="text-muted small m-0 tracking-widest text-uppercase">
                            GRACIAS POR LEER LOS TÉRMINOS LEGALES DE LOS FLOR DE
                            ASFALTO © 2026.
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default AvisoLegal;
