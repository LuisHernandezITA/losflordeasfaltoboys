import React, { useState, useEffect } from "react";
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBtn,
    MDBInput,
} from "mdb-react-ui-kit";
import {
    Form,
    FormControl,
    InputGroup,
    Container,
    Row,
    Col,
    Modal,
} from "react-bootstrap";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { useNotification } from "./NotificationContext";

function CrudMusic() {
    const { userInfo } = useUser();
    const userAdmin = userInfo ? userInfo.admin : "";

    if (!userAdmin) return <Navigate to="/" />;

    const accessToken = userInfo ? userInfo.token : "";
    const [search, setSearch] = useState("");
    const [music, setMusic] = useState([]);
    const [filteredMusic, setFilteredMusic] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        artista: "",
        etiqueta: "",
        urlmusic: "",
        image: "",
    });
    const [errors, setErrors] = useState({
        nombre: "",
        artista: "",
        urlmusic: "",
        image: "",
    });
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [musicIdUpdate, setMusicIdUpdate] = useState(null);
    const [isButtonAddEnabled, setIsButtonAddEnabled] = useState(true);

    useEffect(() => {
        getMusic();
    }, []);

    const getMusic = () => {
        axios
            .get("/api/music_index")
            .then((res) => {
                setMusic(res.data);
                setFilteredMusic(res.data);
            })
            .catch((err) => console.error(err));
    };

    // NOTIFICATIONS
    const { showNotification } = useNotification();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({
            ...errors,
            [name]: value === "" ? `* ${name} is required` : "",
        });
    };

    const isFormValid =
        formData.nombre !== "" &&
        formData.artista !== "" &&
        formData.urlmusic !== "" &&
        formData.image !== "";

    const handleButtonAddClick = () => {
        setFormData({
            nombre: "",
            artista: "",
            etiqueta: "",
            urlmusic: "",
            image: "",
        });
        setIsButtonAddEnabled(false);
        setEditMode(false);
        setShowAddForm(true);
    };

    const handleAddMusic = async (e) => {
        e.preventDefault();
        try {
            await fetch("/api/music_store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });
            showNotification("Music added successfully");
            setShowAddForm(false);
            getMusic();
        } catch (err) {
            showNotification(err.message);
        }
    };

    const handleUpdateMusic = async (e) => {
        e.preventDefault();
        try {
            await fetch(`/api/music_update/${musicIdUpdate}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });
            showNotification("Music Updated successfully");
            setShowAddForm(false);
            getMusic();
        } catch (err) {
            showNotification(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/music_destroy/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            showNotification("Music deleted successfully");
            getMusic();
        } catch (err) {
            alert("Error deleting");
        }
    };

    return (
        <div style={{ fontFamily: "monospace" }}>
            <Container className="mt-5">
                <div className="d-flex mb-4 align-items-center">
                    <Form className="flex-grow-1">
                        <InputGroup>
                            <InputGroup.Text
                                style={{
                                    borderRadius: "0px",
                                    border: "1px solid #333",
                                }}
                            >
                                🔍
                            </InputGroup.Text>
                            <FormControl
                                placeholder="Buscar música..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setFilteredMusic(
                                        music.filter((m) =>
                                            m.nombre
                                                .toLowerCase()
                                                .includes(
                                                    e.target.value.toLowerCase(),
                                                ),
                                        ),
                                    );
                                }}
                                style={{ borderRadius: "0px" }}
                            />
                        </InputGroup>
                    </Form>
                    <MDBBtn
                        color="dark"
                        size="lg"
                        className="ms-3"
                        style={{ borderRadius: "0px" }}
                        onClick={handleButtonAddClick}
                    >
                        ADD NEW MUSIC
                    </MDBBtn>
                </div>

                <MDBTable style={{ verticalAlign: "middle" }}>
                    <MDBTableHead dark>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Artista</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {filteredMusic.map((m) => (
                            <tr key={m.id}>
                                <th>{m.id}</th>
                                <td>
                                    <strong>{m.nombre}</strong>
                                </td>
                                <td>{m.artista}</td>
                                <td className="text-center">
                                    <MDBBtn
                                        size="sm"
                                        color="light"
                                        style={{
                                            borderRadius: "0px",
                                            marginRight: "10px",
                                        }}
                                        onClick={() => {
                                            setMusicIdUpdate(m.id);
                                            setEditMode(true);
                                            setFormData(m);
                                            setShowAddForm(true);
                                        }}
                                    >
                                        EDIT
                                    </MDBBtn>
                                    <MDBBtn
                                        size="sm"
                                        color="dark"
                                        style={{ borderRadius: "0px" }}
                                        onClick={() => handleDelete(m.id)}
                                    >
                                        DELETE
                                    </MDBBtn>
                                </td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </Container>

            {/* MODAL OSCURO Y LEGIBLE */}
            <Modal
                show={showAddForm}
                onHide={() => setShowAddForm(false)}
                centered
            >
                <Modal.Header
                    className={
                        editMode
                            ? "bg-primary text-white"
                            : "bg-warning text-dark"
                    }
                    style={{ borderRadius: "0px" }}
                >
                    <Modal.Title
                        style={{ fontSize: "1rem", fontFamily: "monospace" }}
                    >
                        {editMode
                            ? "// SYSTEM_UPDATE_MUSIC"
                            : "// SYSTEM_NEW_MUSIC"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{ backgroundColor: "#121212", padding: "2rem" }}
                >
                    <img
                        src="/img/logosmc.svg"
                        alt="Logo"
                        style={{
                            maxWidth: "40%",
                            margin: "0 auto 20px",
                            display: "block",
                        }}
                    />
                    <form
                        onSubmit={editMode ? handleUpdateMusic : handleAddMusic}
                    >
                        {[
                            "nombre",
                            "artista",
                            "etiqueta",
                            "urlmusic",
                            "image",
                        ].map((field) => (
                            <MDBInput
                                key={field}
                                wrapperClass="mb-4"
                                label={field.toUpperCase()}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                contrast
                                style={{ borderRadius: "0px" }}
                            />
                        ))}
                        <MDBBtn
                            type="submit"
                            size="lg"
                            className="w-100"
                            style={{
                                borderRadius: "0px",
                                backgroundColor: "#fff",
                                color: "#000",
                            }}
                            disabled={!isFormValid}
                        >
                            {editMode ? "SAVE CHANGES" : "PUSH TO CATALOG"}
                        </MDBBtn>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default CrudMusic;
