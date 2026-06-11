import React, { useState, useEffect } from "react";
import {
    MDBContainer,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane,
    MDBBtn,
    MDBInput,
    MDBCheckbox,
} from "mdb-react-ui-kit";
import axios from "axios";
import "/resources/css/app.css";
import { useNotification } from "./NotificationContext";

function Login_B() {
    // NOTIFICATIONS
    const { showNotification } = useNotification();

    // TABS
    const [justifyActive, setJustifyActive] = useState("tab1");

    const handleJustifyClick = (value) => {
        if (value === justifyActive) return;
        setJustifyActive(value);
    };

    // VALIDATIONS
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        c_password: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        c_password: "",
    });

    const [isButtonEnabled, setIsButtonEnabled] = useState(true);

    // ESTADO DEL CAPTCHA SEGURIDAD
    const [isRobotChecked, setIsRobotChecked] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const newErrors = { ...errors };

        if (name === "name") {
            newErrors[name] = value.trim() === "" ? "* Name is required" : "";
        } else if (name === "email") {
            newErrors[name] =
                value.trim() === ""
                    ? "* Email is required"
                    : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
                      ? "* Invalid email address"
                      : "";
        } else if (name === "password") {
            newErrors[name] =
                value.trim() === "" ? "* Password is required" : "";
        } else if (name === "c_password") {
            newErrors[name] =
                value.trim() === ""
                    ? "* Confirm Password is required"
                    : value !== formData.password
                      ? "* Passwords do not match"
                      : "";
        }

        setErrors(newErrors);
    };

    const isFormValid =
        Object.values(errors).every((error) => error === "") &&
        Object.values(formData).every((value) => value.trim() !== "");

    // LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!isRobotChecked) {
            showNotification("ERROR: POR FAVOR VERIFICA QUE NO ERES UN ROBOT");
            return;
        }

        setIsButtonEnabled(false);

        const loginData = {
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                const { success, message, user } = data;
                showNotification(message || "¡BIENVENIDO DE NUEVO!");

                if (success) {
                    document.cookie = `user_id=${user.user_id}; path=/`;
                    axios.defaults.headers.common["Authorization"] =
                        `Bearer ${user.token}`;

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1500);
                }
            } else {
                if (response.status === 401) {
                    showNotification("ERROR: CREDENCIALES INCORRECTAS");
                } else if (response.status === 422 && data.errors) {
                    const firstErrorKey = Object.keys(data.errors)[0];
                    showNotification(
                        `ERROR: ${data.errors[firstErrorKey][0].toUpperCase()}`,
                    );
                } else {
                    showNotification(
                        data.message || "ERROR AL VERIFICAR DATOS",
                    );
                }
                setIsButtonEnabled(true);
            }
        } catch (error) {
            console.error("ERROR DETALLADO:", error);
            showNotification("ERROR DE CONEXIÓN CON EL SERVIDOR");
            setIsButtonEnabled(true);
        }
    };

    // REGISTER
    const handleRegister = async (e) => {
        e.preventDefault();
        setIsButtonEnabled(false);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification("¡USUARIO REGISTRADO CON ÉXITO!");
                setTimeout(() => {
                    setJustifyActive("tab1");
                    setIsButtonEnabled(true);
                    setIsRobotChecked(false);
                }, 1500);
            } else {
                if (response.status === 422 && data.errors) {
                    const serverErrors = data.errors;

                    if (
                        serverErrors.email &&
                        serverErrors.email[0].includes("already")
                    ) {
                        showNotification("ERROR: EL EMAIL YA ESTÁ EN USO");
                    } else if (
                        serverErrors.name &&
                        serverErrors.name[0].includes("already")
                    ) {
                        showNotification(
                            "ERROR: EL NOMBRE DE USUARIO YA EXISTE",
                        );
                    } else {
                        const firstErrorKey = Object.keys(serverErrors)[0];
                        showNotification(
                            `ERROR: ${serverErrors[firstErrorKey][0].toUpperCase()}`,
                        );
                    }
                } else {
                    showNotification(
                        "ERROR EN EL REGISTRO. VERIFICA TUS DATOS.",
                    );
                }
                setIsButtonEnabled(true);
            }
        } catch (error) {
            console.error("ERROR DETALLADO:", error);
            showNotification("ERROR DE RED O CONEXIÓN");
            setIsButtonEnabled(true);
        }
    };

    // ESTILOS EN LÍNEA COMUNES PARA ASEGURAR VISIBILIDAD DE LETRAS
    const inputStyle = {
        color: "#ffffff",
        backgroundColor: "transparent",
    };

    return (
        <MDBContainer
            className="p-3 my-5 d-flex flex-column w-50"
            style={{ maxWidth: "500px" }}
        >
            {/* TABS CON COHESIÓN VISUAL OSCURA */}
            <MDBTabs
                pills
                justify
                className="mb-4 d-flex flex-row justify-content-between"
                style={{ borderBottom: "1px solid #222" }}
            >
                <MDBTabsItem>
                    <MDBTabsLink
                        onClick={() => handleJustifyClick("tab1")}
                        active={justifyActive === "tab1"}
                        style={{
                            backgroundColor:
                                justifyActive === "tab1"
                                    ? "#ffffff"
                                    : "transparent",
                            color:
                                justifyActive === "tab1"
                                    ? "#000000"
                                    : "#ffffff",
                            borderRadius: "0px",
                            fontWeight: "bold",
                            border: "1px solid #ffffff",
                            transition: "all 0.2s ease",
                        }}
                    >
                        LOGIN
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink
                        onClick={() => handleJustifyClick("tab2")}
                        active={justifyActive === "tab2"}
                        style={{
                            backgroundColor:
                                justifyActive === "tab2"
                                    ? "#ffffff"
                                    : "transparent",
                            color:
                                justifyActive === "tab2"
                                    ? "#000000"
                                    : "#ffffff",
                            borderRadius: "0px",
                            fontWeight: "bold",
                            border: "1px solid #ffffff",
                            transition: "all 0.2s ease",
                        }}
                    >
                        REGISTER
                    </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>

            <MDBTabsContent>
                {/* PESTAÑA 1: LOGIN */}
                <MDBTabsPane show={justifyActive === "tab1"}>
                    <form onSubmit={handleLogin}>
                        {errors.email && (
                            <p
                                className="error-text"
                                style={{
                                    color: "#ff4444",
                                    fontSize: "0.85rem",
                                }}
                            >
                                {errors.email}
                            </p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Email"
                            id="login_email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={inputStyle}
                            className="text-white"
                        />

                        {errors.password && (
                            <p
                                className="error-text"
                                style={{
                                    color: "#ff4444",
                                    fontSize: "0.85rem",
                                }}
                            >
                                {errors.password}
                            </p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Password"
                            id="login_password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={inputStyle}
                            className="text-white"
                        />

                        {/* CAJA DE VERIFICACIÓN ANTI-BOTS */}
                        <div
                            className="d-flex align-items-center justify-content-between p-3 mb-4 rounded-0"
                            style={{
                                backgroundColor: "#111111",
                                border: "1px solid #333333",
                            }}
                        >
                            <MDBCheckbox
                                name="robotCheck"
                                id="robotCheckDefault"
                                label="I'm not a robot"
                                checked={isRobotChecked}
                                onChange={(e) =>
                                    setIsRobotChecked(e.target.checked)
                                }
                                className="custom-captcha-checkbox text-white"
                                style={{ cursor: "pointer" }}
                            />
                            <div
                                className="text-end"
                                style={{
                                    opacity: 0.5,
                                    fontSize: "0.65rem",
                                    letterSpacing: "1px",
                                }}
                            >
                                <span className="d-block text-white fw-bold">
                                    STORE SECURITY
                                </span>
                                <span className="text-muted">v1.0-LOCAL</span>
                            </div>
                        </div>

                        <MDBBtn
                            className={`mb-4 w-100 ${!isButtonEnabled ? "clicked" : ""}`}
                            size="lg"
                            type="submit"
                            disabled={!isButtonEnabled || !isRobotChecked}
                            style={{ borderRadius: "0px", fontWeight: "bold" }}
                        >
                            SIGN IN
                        </MDBBtn>
                        <p
                            className="text-center style-link"
                            style={{ color: "#888888" }}
                        >
                            Not a member?{" "}
                            <a
                                href="#!"
                                onClick={() => handleJustifyClick("tab2")}
                                style={{
                                    color: "#ffffff",
                                    textDecoration: "underline",
                                }}
                            >
                                Register
                            </a>
                        </p>
                    </form>
                </MDBTabsPane>

                {/* PESTAÑA 2: REGISTER */}
                <MDBTabsPane show={justifyActive === "tab2"}>
                    <form onSubmit={handleRegister}>
                        {/* REGISTER NAME - INSTAGRAM STYLE */}
                        {errors.name && (
                            <p
                                className="error-text"
                                style={{
                                    color: "#ff4444",
                                    fontSize: "0.85rem",
                                }}
                            >
                                {errors.name}
                            </p>
                        )}
                        <div className="mb-4">
                            <div className="input-group">
                                <span
                                    className="input-group-text rounded-0 border-end-0 text-white"
                                    style={{
                                        backgroundColor: "#111",
                                        border: "1px solid #ffffff",
                                        fontSize: "0.8rem",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    instagram.com/
                                </span>
                                <MDBInput
                                    wrapperClass="flex-grow-1"
                                    label="username"
                                    id="register_name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{
                                        ...inputStyle,
                                        borderLeft: "none",
                                        borderRadius: "0px",
                                    }}
                                    className="text-white"
                                />
                            </div>
                            <small
                                className="text-white-50 mt-1 d-block"
                                style={{
                                    fontSize: "0.65rem",
                                    letterSpacing: "1px",
                                }}
                            >
                                * Escribe solo tu usuario sin el símbolo @
                            </small>
                        </div>

                        {errors.email && (
                            <p
                                className="error-text"
                                style={{
                                    color: "#ff4444",
                                    fontSize: "0.85rem",
                                }}
                            >
                                {errors.email}
                            </p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Email"
                            id="register_email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={inputStyle}
                            className="text-white"
                        />

                        {errors.password && (
                            <p
                                className="error-text"
                                style={{
                                    color: "#ff4444",
                                    fontSize: "0.85rem",
                                }}
                            >
                                {errors.password}
                            </p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Password"
                            id="register_password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={inputStyle}
                            className="text-white"
                        />

                        {errors.c_password && (
                            <p
                                className="error-text"
                                style={{
                                    color: "#ff4444",
                                    fontSize: "0.85rem",
                                }}
                            >
                                {errors.c_password}
                            </p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Confirm Password"
                            id="register_c_password"
                            type="password"
                            name="c_password"
                            value={formData.c_password}
                            onChange={handleChange}
                            style={inputStyle}
                            className="text-white"
                        />

                        <MDBBtn
                            className="mb-4 w-100"
                            size="lg"
                            type="submit"
                            disabled={!isFormValid || !isButtonEnabled}
                            style={{ borderRadius: "0px", fontWeight: "bold" }}
                        >
                            SIGN UP
                        </MDBBtn>
                    </form>
                </MDBTabsPane>
            </MDBTabsContent>
        </MDBContainer>
    );
}

export default Login_B;
