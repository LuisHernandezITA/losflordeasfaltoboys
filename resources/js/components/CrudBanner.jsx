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

function CrudBanner() {
    const { userInfo } = useUser();
    const userAdmin = userInfo ? userInfo.admin : "";

    if (!userAdmin) return <Navigate to="/" />;

    const accessToken = userInfo ? userInfo.token : "";
    const [search, setSearch] = useState("");
    const [banners, setBanners] = useState([]);
    const [filteredBanners, setFilteredBanners] = useState([]);
    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    // Estados del formulario
    const [formData, setFormData] = useState({
        image_url: "",
        alt_text: "",
        link_url: "",
        interval: 2000,
    });
    const [errors, setErrors] = useState({ alt_text: "", image_url: "" });
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [bannerIdUpdate, setBannerIdUpdate] = useState(null);
    const [isButtonAddEnabled, setIsButtonAddEnabled] = useState(true);

    useEffect(() => {
        getBanners();
    }, []);

    const getBanners = () => {
        axios
            .get("/api/banners_index")
            .then((res) => {
                setBanners(res.data);
                setFilteredBanners(res.data);
            })
            .catch((err) => console.error(err));
    };

    const handleSearchChange = (e) => {
        const searchText = e.target.value;
        setSearch(searchText);
        setFilteredBanners(
            searchText
                ? banners.filter((ban) =>
                      ban.alt_text
                          .toLowerCase()
                          .includes(searchText.toLowerCase()),
                  )
                : banners,
        );
    };

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
        setTimeout(() => setNotificationVisible(false), 1500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({
            ...errors,
            [name]:
                value === "" ? `* ${name.replace("_", " ")} is required` : "",
        });
    };

    const isFormValid =
        formData.alt_text !== "" &&
        formData.image_url !== "" &&
        errors.alt_text === "" &&
        errors.image_url === "";

    const handleButtonAddClick = () => {
        setFormData({
            image_url: "",
            alt_text: "",
            link_url: "",
            interval: 2000,
        });
        setIsButtonAddEnabled(false);
        setEditMode(false);
        setShowAddForm(true);
    };

    const handleAddBanner = async (e) => {
        e.preventDefault();
        try {
            await fetch("/api/banners_store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });
            showNotification("Banner added successfully");
            setShowAddForm(false);
            setIsButtonAddEnabled(true);
            getBanners();
        } catch (err) {
            showNotification(err.message);
        }
    };

    const handleEdit = (banner) => {
        setFormData({
            image_url: banner.image_url,
            alt_text: banner.alt_text,
            link_url: banner.link_url || "",
            interval: banner.interval || 2000,
        });
        setBannerIdUpdate(banner.id);
        setEditMode(true);
        setShowAddForm(true);
    };

    const handleUpdateBanner = async (e) => {
        e.preventDefault();
        try {
            await fetch(`/api/banners_update/${bannerIdUpdate}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });
            showNotification("Banner Updated successfully");
            setShowAddForm(false);
            setIsButtonAddEnabled(true);
            getBanners();
        } catch (err) {
            showNotification(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/banners_destroy/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            showNotification("Banner deleted successfully");
            getBanners();
        } catch (err) {
            alert("Error deleting banner");
        }
    };

    return (
        <>
            <br />
            <Container className="mt-5">
                <div className="d-flex mb-4">
                    <Form className="flex-grow-1">
                        <InputGroup>
                            <InputGroup.Text
                                style={{
                                    borderRadius: "0px",
                                    backgroundColor: "#fff",
                                }}
                            >
                                🔍
                            </InputGroup.Text>
                            <FormControl
                                placeholder="Search Banners"
                                value={search}
                                onChange={handleSearchChange}
                                style={{ borderRadius: "0px" }}
                            />
                        </InputGroup>
                    </Form>
                    <MDBBtn
                        color="dark"
                        size="lg"
                        className="ms-3"
                        style={{ borderRadius: "0px" }}
                        disabled={!isButtonAddEnabled}
                        onClick={handleButtonAddClick}
                    >
                        ADD NEW BANNER
                    </MDBBtn>
                </div>

                <MDBTable style={{ verticalAlign: "middle" }}>
                    <MDBTableHead dark>
                        <tr>
                            <th>#</th>
                            <th>Alt Text</th>
                            <th>Image URL</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {filteredBanners.map((ban) => (
                            <tr key={ban.id}>
                                <th scope="row">{ban.id}</th>
                                <td>{ban.alt_text}</td>
                                <td>{ban.image_url || "No image"}</td>
                                <td className="text-center">
                                    <MDBBtn
                                        size="sm"
                                        color="light"
                                        style={{
                                            borderRadius: "0px",
                                            marginRight: "10px",
                                        }}
                                        onClick={() => handleEdit(ban)}
                                    >
                                        EDIT
                                    </MDBBtn>
                                    <MDBBtn
                                        size="sm"
                                        color="dark"
                                        style={{ borderRadius: "0px" }}
                                        onClick={() => handleDelete(ban.id)}
                                    >
                                        DELETE
                                    </MDBBtn>
                                </td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </Container>

            {/* MODAL OSCURO */}
            <Modal
                show={showAddForm}
                onHide={() => {
                    setShowAddForm(false);
                    setIsButtonAddEnabled(true);
                }}
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
                            ? "// SYSTEM_UPDATE_BANNER"
                            : "// SYSTEM_NEW_BANNER"}
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
                        onSubmit={
                            editMode ? handleUpdateBanner : handleAddBanner
                        }
                    >
                        {["alt_text", "image_url", "link_url", "interval"].map(
                            (field) => (
                                <MDBInput
                                    key={field}
                                    wrapperClass="mb-4"
                                    label={field
                                        .toUpperCase()
                                        .replace("_", " ")}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    contrast
                                    style={{ borderRadius: "0px" }}
                                />
                            ),
                        )}
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
                            {editMode ? "UPDATE BANNER" : "ADD BANNER"}
                        </MDBBtn>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default CrudBanner;
