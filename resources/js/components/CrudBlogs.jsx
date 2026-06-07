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

function CrudBlogs() {
    const { userInfo } = useUser();
    const userAdmin = userInfo ? userInfo.admin : "";
    const accessToken = userInfo ? userInfo.token : "";

    if (!userAdmin) {
        return <Navigate to="/" />;
    }

    const [search, setSearch] = useState("");
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);

    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [blogIdUpdate, setBlogIdUpdate] = useState(null);
    const [isButtonAddEnabled, setIsButtonAddEnabled] = useState(true);

    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    const initialFormState = {
        banner: "",
        title: "",
        slug: "",
        author: "",
        published_at: "",
        category: "",
        content: "",
        content_secondary: "",
        extra_image: "",
        image_position: "left",
        youtube_url: "",
        external_url: "",
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({
        banner: "",
        title: "",
        author: "",
        published_at: "",
        content: "",
    });

    useEffect(() => {
        getBlogs();
    }, []);

    const getBlogs = () => {
        axios
            .get("/api/blogs_index")
            .then((response) => {
                setBlogs(response.data);
                setFilteredBlogs(response.data);
            })
            .catch((error) => {
                console.error("Error fetching blogs:", error);
            });
    };

    useEffect(() => {
        if (notificationVisible) {
            const progressBar = document.querySelector(".notification-bar");
            if (progressBar)
                progressBar.classList.add("notification-bar-progress");

            const timer = setTimeout(() => {
                setNotificationVisible(false);
                getBlogs();
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    const handleSearchChange = (e) => {
        const searchText = e.target.value;
        setSearch(searchText);

        if (!searchText) {
            setFilteredBlogs(blogs);
            return;
        }

        const filtered = blogs.filter(
            (b) =>
                (b.title &&
                    b.title.toLowerCase().includes(searchText.toLowerCase())) ||
                (b.author &&
                    b.author.toLowerCase().includes(searchText.toLowerCase())),
        );
        setFilteredBlogs(filtered);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (
            ["banner", "title", "author", "published_at", "content"].includes(
                name,
            )
        ) {
            setErrors({
                ...errors,
                [name]: value.trim() === "" ? `* ${name} is required` : "",
            });
        }
    };

    const isFormValid =
        formData.banner.trim() !== "" &&
        formData.title.trim() !== "" &&
        formData.author.trim() !== "" &&
        formData.published_at.trim() !== "" &&
        formData.content.trim() !== "";

    const handleButtonAddClick = () => {
        setFormData(initialFormState);
        setErrors({
            banner: "",
            title: "",
            author: "",
            published_at: "",
            content: "",
        });
        setIsButtonAddEnabled(false);
        setEditMode(false);
        setShowAddForm(true);
    };

    const handleCloseModal = () => {
        setShowAddForm(false);
        setIsButtonAddEnabled(true);
        setIsButtonEnabled(true);
    };

    const configHeaders = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const handleAddBlog = async (e) => {
        e.preventDefault();
        setIsButtonEnabled(false);
        try {
            await axios.post("/api/blogs_store", formData, configHeaders);
            showNotification("Post added successfully");
            setShowAddForm(false);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(
                error.response?.data?.message || "Error adding post.",
            );
        } finally {
            setIsButtonEnabled(true);
        }
    };

    const handleEdit = (blog) => {
        setFormData({
            banner: blog.banner || "",
            title: blog.title || "",
            slug: blog.slug || "",
            author: blog.author || "",
            published_at: blog.published_at
                ? blog.published_at.substring(0, 10)
                : "",
            category: blog.category || "",
            content: blog.content || "",
            content_secondary: blog.content_secondary || "",
            extra_image: blog.extra_image || "",
            image_position: blog.image_position || "left",
            youtube_url: blog.youtube_url || "",
            external_url: blog.external_url || "",
        });
        setBlogIdUpdate(blog.id);
        setEditMode(true);
        setShowAddForm(true);
    };

    const handleUpdateBlog = async (e) => {
        e.preventDefault();
        setIsButtonEnabled(false);
        try {
            await axios.put(
                `/api/blogs_update/${blogIdUpdate}`,
                formData,
                configHeaders,
            );
            showNotification("Post updated successfully");
            setShowAddForm(false);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(
                error.response?.data?.message || "Error updating post.",
            );
        } finally {
            setIsButtonEnabled(true);
        }
    };

    const handleDelete = async (id) => {
        setIsButtonEnabled(false);
        try {
            const response = await axios.delete(`/api/blogs_destroy/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (response.status === 200) {
                showNotification("Post deleted successfully");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting post");
        } finally {
            setIsButtonEnabled(true);
        }
    };

    // --- ESTILOS DE ADAPTACIÓN BASE ARTWORK (image_40cce5.png) ---
    const brutalistButtonStyles = {
        backgroundColor: "#ffffff",
        color: "#000000",
        borderRadius: "0px",
        border: "none",
        fontWeight: "normal",
        fontSize: "0.85rem",
        padding: "10px 24px",
        boxShadow: "none",
    };

    const tableActionBtnStyles = {
        backgroundColor: "#ffffff",
        color: "#000000",
        borderRadius: "0px",
        border: "none",
        fontWeight: "normal",
        fontSize: "0.8rem",
        padding: "6px 18px",
        boxShadow: "none",
        minWidth: "85px",
    };

    return (
        <>
            <br />
            <div className="d-flex align-items-center justify-content-between JSON-header-container">
                <Container className="mt-4 px-0">
                    <Row className="align-items-center">
                        <Col md={6}>
                            <Form onSubmit={(e) => e.preventDefault()}>
                                <InputGroup
                                    style={{
                                        borderRadius: "0px",
                                        maxWidth: "400px",
                                    }}
                                >
                                    <InputGroup.Text
                                        className="bg-white border-0"
                                        style={{ borderRadius: "0px" }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                        >
                                            <path d="M9.5 3a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM1 9.5a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0z" />
                                            <path d="M16.853 16.854a.5.5 0 0 0 .707 0l3.793-3.793a.5.5 0 0 0 0-.707l-3.793-3.793a.5.5 0 0 0-.707.707L19.293 12H10.5a.5.5 0 0 0 0 1h8.793l-2.646 2.646a.5.5 0 0 0 0 .707z" />
                                        </svg>
                                    </InputGroup.Text>
                                    <FormControl
                                        type="search"
                                        style={{
                                            borderRadius: "0px",
                                            border: "none",
                                        }}
                                        placeholder="Buscar por Título, Autor o Técnica..."
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                </InputGroup>
                            </Form>
                        </Col>
                        <Col md={6} className="d-flex justify-content-end">
                            <MDBBtn
                                style={brutalistButtonStyles}
                                type="button"
                                disabled={!isButtonAddEnabled}
                                onClick={handleButtonAddClick}
                            >
                                ADD NEW POST
                            </MDBBtn>
                        </Col>
                    </Row>
                </Container>
            </div>
            <br />

            <div className="px-4">
                <MDBTable
                    responsive
                    align="middle"
                    className="text-white border-0"
                    style={{ backgroundColor: "#121212" }}
                >
                    <MDBTableHead>
                        <tr style={{ borderBottom: "1px solid #222" }}>
                            <th
                                scope="col"
                                style={{
                                    fontWeight: "normal",
                                    color: "#ffffff",
                                    fontSize: "0.85rem",
                                }}
                            >
                                #
                            </th>
                            <th
                                scope="col"
                                style={{
                                    fontWeight: "normal",
                                    color: "#ffffff",
                                    fontSize: "0.85rem",
                                }}
                            >
                                Título
                            </th>
                            <th
                                scope="col"
                                style={{
                                    fontWeight: "normal",
                                    color: "#ffffff",
                                    fontSize: "0.85rem",
                                }}
                            >
                                Autor
                            </th>
                            <th
                                scope="col"
                                className="text-end"
                                style={{
                                    fontWeight: "normal",
                                    color: "#ffffff",
                                    fontSize: "0.85rem",
                                    width: "240px",
                                    paddingRight: "24px",
                                }}
                            >
                                Actions
                            </th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {filteredBlogs.map((b) => (
                            <tr
                                key={b.id}
                                style={{ borderBottom: "1px solid #222" }}
                            >
                                <td
                                    style={{
                                        color: "#ffffff",
                                        fontWeight: "normal",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {b.id}
                                </td>
                                <td
                                    style={{
                                        color: "#ffffff",
                                        fontWeight: "normal",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {b.title}
                                </td>
                                <td
                                    style={{
                                        color: "#ffffff",
                                        fontWeight: "normal",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {b.author}
                                </td>
                                <td
                                    className="text-end"
                                    style={{ paddingRight: "24px" }}
                                >
                                    <MDBBtn
                                        style={{
                                            ...tableActionBtnStyles,
                                            marginRight: "10px",
                                        }}
                                        disabled={!isButtonEnabled}
                                        onClick={() => handleEdit(b)}
                                    >
                                        EDIT
                                    </MDBBtn>
                                    <MDBBtn
                                        style={tableActionBtnStyles}
                                        disabled={!isButtonEnabled}
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    "Are you sure you want to delete this post?",
                                                )
                                            ) {
                                                handleDelete(b.id);
                                            }
                                        }}
                                    >
                                        DELETE
                                    </MDBBtn>
                                </td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </div>

            {/* MODAL COMPLETAMENTE CORREGIDA Y OPERATIVA */}
            <Modal
                show={showAddForm}
                onHide={handleCloseModal}
                size="lg"
                centered
            >
                <Modal.Header
                    className="bg-dark text-white border-secondary"
                    closeButton
                    style={{ borderRadius: "0px" }}
                >
                    <Modal.Title
                        style={{ fontSize: "1.1rem", fontWeight: "normal" }}
                    >
                        {editMode ? "Edit Post" : "Create New Post"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="bg-dark text-white"
                    style={{ borderRadius: "0px" }}
                >
                    <img
                        src="/img/logosmc.svg"
                        alt="Logo"
                        style={{
                            maxWidth: "35%",
                            margin: "auto",
                            display: "block",
                            marginBottom: "30px",
                        }}
                    />
                    <form
                        onSubmit={editMode ? handleUpdateBlog : handleAddBlog}
                    >
                        <h5
                            className="text-muted small border-bottom border-secondary pb-2 mb-3"
                            style={{ letterSpacing: "1px" }}
                        >
                            1. PRIMARY INFORMATION
                        </h5>

                        {errors.title && (
                            <p className="text-danger small">{errors.title}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Post Title"
                            id="title"
                            type="text"
                            name="title"
                            contrast
                            value={formData.title}
                            onChange={handleChange}
                        />

                        <MDBInput
                            wrapperClass="mb-4"
                            label="Slug (Optional - Auto generated if empty)"
                            id="slug"
                            type="text"
                            name="slug"
                            contrast
                            value={formData.slug}
                            onChange={handleChange}
                        />

                        <Row>
                            <Col md={6}>
                                {errors.author && (
                                    <p className="text-danger small">
                                        {errors.author}
                                    </p>
                                )}
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Author"
                                    id="author"
                                    type="text"
                                    name="author"
                                    contrast
                                    value={formData.author}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={6}>
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Category (Optional)"
                                    id="category"
                                    type="text"
                                    name="category"
                                    contrast
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                {errors.published_at && (
                                    <p className="text-danger small">
                                        {errors.published_at}
                                    </p>
                                )}
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Publish Date"
                                    id="published_at"
                                    type="date"
                                    name="published_at"
                                    contrast
                                    value={formData.published_at}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={6}>
                                {errors.banner && (
                                    <p className="text-danger small">
                                        {errors.banner}
                                    </p>
                                )}
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Main Banner Image URL"
                                    id="banner"
                                    type="text"
                                    name="banner"
                                    contrast
                                    value={formData.banner}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>

                        <h5
                            className="text-muted small border-bottom border-secondary pb-2 mb-3 mt-4"
                            style={{ letterSpacing: "1px" }}
                        >
                            2. LAYOUT CONTENT & STRUCTURE
                        </h5>

                        {errors.content && (
                            <p className="text-danger small">
                                {errors.content}
                            </p>
                        )}
                        <div className="mb-4">
                            <label
                                htmlFor="content"
                                className="form-label text-muted small mb-1"
                            >
                                Main Text Block (Required)
                            </label>
                            <textarea
                                className="form-control bg-dark text-white border-secondary"
                                id="content"
                                rows="5"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                style={{ borderRadius: "0px" }}
                            ></textarea>
                        </div>

                        <Row className="align-items-center">
                            <Col md={8}>
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Secondary Support Image URL (Optional)"
                                    id="extra_image"
                                    type="text"
                                    name="extra_image"
                                    contrast
                                    value={formData.extra_image}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={4}>
                                <div className="mb-4">
                                    <label className="form-label text-muted small mb-1">
                                        Image Alignment
                                    </label>
                                    <select
                                        className="form-select bg-dark text-white border-secondary"
                                        name="image_position"
                                        value={formData.image_position}
                                        onChange={handleChange}
                                        style={{ borderRadius: "0px" }}
                                    >
                                        <option value="left">Left Side</option>
                                        <option value="right">
                                            Right Side
                                        </option>
                                    </select>
                                </div>
                            </Col>
                        </Row>

                        <div className="mb-4">
                            <label
                                htmlFor="content_secondary"
                                className="form-label text-muted small mb-1"
                            >
                                Secondary Text Block (Optional)
                            </label>
                            <textarea
                                className="form-control bg-dark text-white border-secondary"
                                id="content_secondary"
                                rows="4"
                                name="content_secondary"
                                value={formData.content_secondary}
                                onChange={handleChange}
                                style={{ borderRadius: "0px" }}
                            ></textarea>
                        </div>

                        <h5
                            className="text-muted small border-bottom border-secondary pb-2 mb-3 mt-4"
                            style={{ letterSpacing: "1px" }}
                        >
                            3. MEDIA & EXTERNAL LINKS
                        </h5>

                        <MDBInput
                            wrapperClass="mb-4"
                            label="YouTube Video URL (Optional)"
                            id="youtube_url"
                            type="text"
                            name="youtube_url"
                            contrast
                            value={formData.youtube_url}
                            onChange={handleChange}
                        />

                        <MDBInput
                            wrapperClass="mb-4"
                            label="External Link / Project Action URL (Optional)"
                            id="external_url"
                            type="text"
                            name="external_url"
                            contrast
                            value={formData.external_url}
                            onChange={handleChange}
                        />

                        <MDBBtn
                            style={{ ...brutalistButtonStyles, width: "100%" }}
                            className="mt-4"
                            type="submit"
                            disabled={!isFormValid || !isButtonEnabled}
                        >
                            {editMode ? "UPDATE POST" : "ADD POST"}
                        </MDBBtn>
                    </form>
                </Modal.Body>
            </Modal>

            {/* NOTIFICATION UI */}
            {notification && (
                <div
                    className={`notification ${notificationVisible ? "show" : ""}`}
                >
                    {notification}
                    <div className="notification-bar"></div>
                </div>
            )}
        </>
    );
}

export default CrudBlogs;
