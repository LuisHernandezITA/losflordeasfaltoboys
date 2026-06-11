import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 2000);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {/* ESTO ES LO QUE PINTA LA NOTIFICACIÓN EN LA PANTALLA */}
            {notification && (
                <div className="global-notification">
                    {notification}
                    <div className="notification-bar"></div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

// Hook para usar la notificación en cualquier componente
export const useNotification = () => useContext(NotificationContext);
