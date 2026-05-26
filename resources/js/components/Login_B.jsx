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
import axios from "axios"; // Aseguramos que axios esté importado para los defaults
import "/resources/css/app.css";

function Login_B() {
    //NOTIFICATIONS
    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    useEffect(() => {
        if (notificationVisible) {
            const progressBar = document.querySelector(".notification-bar");
            if (progressBar)
                progressBar.classList.add("notification-bar-progress");

            const timer = setTimeout(() => {
                setNotificationVisible(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    //TABS
    const [justifyActive, setJustifyActive] = useState("tab1");

    const handleJustifyClick = (value) => {
        if (value === justifyActive) return;
        setJustifyActive(value);
    };

    //VALIDATIONS
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

    //LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();
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
                // Manejo sofisticado de respuestas HTTP erróneas del servidor
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

    //REGISTER
    const handleRegister = async (e) => {
        e.preventDefault();
        setIsButtonEnabled(false); // Deshabilitamos para evitar doble envío en registro

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
                    // En lugar de recargar, lo movemos dinámicamente a la pestaña de Login
                    setJustifyActive("tab1");
                    setIsButtonEnabled(true);
                }, 1500);
            } else {
                // Validación sofisticada leyendo las excepciones exactas de la base de datos de Laravel
                if (response.status === 422 && data.errors) {
                    const serverErrors = data.errors;

                    if (
                        serverErrors.email &&
                        serverErrors.email[0].includes("already")
                    ) {
                        showNotification("ERROR: EL EMAIL YA ESTÁ EN USO");
                        setIsButtonEnabled(true);
                    } else if (
                        serverErrors.name &&
                        serverErrors.name[0].includes("already")
                    ) {
                        showNotification(
                            "ERROR: EL NOMBRE DE USUARIO YA EXISTE",
                        );
                        setIsButtonEnabled(true);
                    } else {
                        // Atrapa cualquier otro error de base de datos o validación (ej: password corto)
                        const firstErrorKey = Object.keys(serverErrors)[0];
                        showNotification(
                            `ERROR: ${serverErrors[firstErrorKey][0].toUpperCase()}`,
                        );
                        setIsButtonEnabled(true);
                    }
                } else {
                    // Si Laravel manda el código 422 y trae errores específicos:
                    if (response.status === 422 && data.errors) {
                        // Tomamos el primer error que ocurra (ya sea de email, name o password)
                        const firstErrorKey = Object.keys(data.errors)[0];
                        const errorMessage = data.errors[firstErrorKey][0];

                        // Lo mandamos directo a la notificación (Saldrá en mayúsculas gracias al CSS o lo transformamos aquí)
                        showNotification(
                            `ERROR: ${errorMessage.toUpperCase()}`,
                        );
                        setIsButtonEnabled(true);
                    } else {
                        showNotification(
                            "ERROR EN EL REGISTRO. VERIFICA TUS DATOS.",
                        );
                        setIsButtonEnabled(true);
                    }
                    setIsButtonEnabled(true);
                }
            }
        } catch (error) {
            console.error("ERROR DETALLADO:", error);
            showNotification("ERROR DE RED O CONEXIÓN");
            setIsButtonEnabled(true);
        }
    };

    return (
        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
            <MDBTabs
                pills
                justify
                className="mb-3 d-flex flex-row justify-content-between"
            >
                <MDBTabsItem>
                    <MDBTabsLink
                        onClick={() => handleJustifyClick("tab1")}
                        active={justifyActive === "tab1"}
                    >
                        Login
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink
                        onClick={() => handleJustifyClick("tab2")}
                        active={justifyActive === "tab2"}
                    >
                        Register
                    </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>

            <MDBTabsContent>
                <MDBTabsPane show={justifyActive === "tab1"}>
                    <form onSubmit={handleLogin}>
                        {errors.email && (
                            <p className="error-text">{errors.email}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Email"
                            id="login_email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <p className="error-text">{errors.password}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Password"
                            id="login_password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <div className="d-flex justify-content-between mx-4 mb-4">
                            <MDBCheckbox
                                name="flexCheck"
                                value=""
                                id="flexCheckDefault"
                                label="Remember me"
                            />
                            <a href="!#">Forgot password?</a>
                        </div>

                        <MDBBtn
                            className={`mb-4 w-100 custom-button ${!isButtonEnabled ? "clicked" : ""}`}
                            size="lg"
                            type="submit"
                            disabled={!isButtonEnabled}
                        >
                            Sign in
                        </MDBBtn>
                        <p className="text-center">
                            Not a member?{" "}
                            <a
                                href="#!"
                                onClick={() => handleJustifyClick("tab2")}
                            >
                                Register
                            </a>
                        </p>
                    </form>
                </MDBTabsPane>

                <MDBTabsPane show={justifyActive === "tab2"}>
                    <form onSubmit={handleRegister}>
                        {errors.name && (
                            <p className="error-text">{errors.name}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Name"
                            id="register_name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <p className="error-text">{errors.email}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Email"
                            id="register_email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <p className="error-text">{errors.password}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Password"
                            id="register_password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.c_password && (
                            <p className="error-text">{errors.c_password}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Confirm Password"
                            id="register_c_password"
                            type="password"
                            name="c_password"
                            value={formData.c_password}
                            onChange={handleChange}
                        />

                        <MDBBtn
                            className="mb-4 w-100 custom-button"
                            size="lg"
                            type="submit"
                            disabled={!isFormValid || !isButtonEnabled}
                        >
                            Sign up
                        </MDBBtn>
                    </form>
                </MDBTabsPane>
            </MDBTabsContent>

            {notification && (
                <div
                    className={`notification ${notificationVisible ? "show" : ""}`}
                >
                    {notification}
                    <div className="notification-bar"></div>
                </div>
            )}
        </MDBContainer>
    );
}

export default Login_B;
