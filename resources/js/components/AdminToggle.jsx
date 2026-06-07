import React, { useState } from "react";
import axios from "axios";

const AdminToggle = ({ product, onUpdate }) => {
    // Forzamos a booleano: Si es 1, true; si es 0, false
    const [isAvailable, setIsAvailable] = useState(!!product.available);
    const [loading, setLoading] = useState(false);

    const toggleAvailability = async () => {
        setLoading(true);
        try {
            // El nuevo valor inverso al actual
            const nextStatus = !isAvailable;

            await axios.put(
                `http://127.0.0.1:8000/api/products_update/${product.id}`,
                {
                    ...product,
                    available: nextStatus ? 1 : 0, // Enviamos 1 o 0 para base de datos
                },
            );

            setIsAvailable(nextStatus);
            if (onUpdate) onUpdate(nextStatus);
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            alert("No se pudo actualizar el estado del producto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleAvailability}
            disabled={loading}
            style={{
                background: isAvailable ? "#28a745" : "#dc3545",
                color: "white",
                border: "none",
                padding: "10px 20px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                marginBottom: "20px",
                borderRadius: "4px",
            }}
        >
            {loading
                ? "PROCESANDO..."
                : isAvailable
                  ? "ESTADO: DISPONIBLE"
                  : "ESTADO: AGOTADO"}
        </button>
    );
};

export default AdminToggle;
