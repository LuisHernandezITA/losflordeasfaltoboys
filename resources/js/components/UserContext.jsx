import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const user_id = getCookie("user_id");

                if (user_id) {
                    // AUTH USER WITH ID
                    const response = await axios.post("/api/login", {
                        user_id: user_id,
                    });

                    axios.defaults.headers.common["Authorization"] =
                        `Bearer ${response.data.user.token}`;

                    if (response.data.success) {
                        // OBTAINING USER INFO
                        const userInfoResponse = await axios.post(
                            `/api/user_show?id=${user_id}`,
                        );
                        const userData = {
                            ...userInfoResponse.data[0],
                            token: response.data.user.token,
                        };

                        if (userData) {
                            setUserInfo(userData);
                        } else {
                            console.warn("User data not found");
                        }
                    } else {
                        console.warn("Failed Authentication");
                    }
                } else {
                    // Ya no es un error, es el estado normal de un invitado
                    console.log("Usuario no autenticado (Invitado)");
                    setUserInfo(null);
                }
            } catch (error) {
                console.error("Error en la autenticación:", error);
            }
        };

        authenticateUser();
    }, []);

    const getCookie = (name) => {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split("=");
            if (cookie[0] === name) {
                return cookie[1];
            }
        }
        return null;
    };

    return (
        <UserContext.Provider value={{ userInfo }}>
            {children}
        </UserContext.Provider>
    );
};
