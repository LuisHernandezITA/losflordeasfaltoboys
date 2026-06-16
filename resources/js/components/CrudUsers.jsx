import React, { useState, useEffect } from "react";
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBtn,
    MDBContainer,
} from "mdb-react-ui-kit";
import { FormControl, InputGroup, Form } from "react-bootstrap";
import axios from "axios";
import { Navigate } from "react-router-dom"; // Importante
import { useUser } from "./UserContext";
import { useNotification } from "./NotificationContext";

function CrudUsers() {
    const { userInfo } = useUser();

    // VALIDACIÓN DE ADMINISTRADOR
    // Si no hay userInfo o admin es falso/null, redirigimos a "/"
    const userAdmin = userInfo ? userInfo.admin : "";
    if (!userAdmin) return <Navigate to="/" />;

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const { showNotification } = useNotification();

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const res = await axios.get("/api/user_index", {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            showNotification("Error al cargar usuarios");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

        try {
            await axios.delete(`/api/user_destroy/${id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            showNotification("Usuario eliminado correctamente");
            getUsers();
        } catch (err) {
            showNotification("Error al eliminar usuario");
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <MDBContainer className="mt-5">
            <h2 className="mb-4">// SYSTEM_USER_MANAGER</h2>
            <Form className="mb-4">
                <InputGroup>
                    <FormControl
                        placeholder="Buscar por nombre o correo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
            </Form>

            <MDBTable hover align="middle">
                <MDBTableHead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Instagram</th>
                        <th>Correo</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td className="text-center">
                                <MDBBtn
                                    color="danger"
                                    size="sm"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    DELETE
                                </MDBBtn>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>
        </MDBContainer>
    );
}

export default CrudUsers;
