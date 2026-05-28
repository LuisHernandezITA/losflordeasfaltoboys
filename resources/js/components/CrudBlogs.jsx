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

    if (!userAdmin) {
        return <Navigate to="/" />;
    }

    const accessToken = userInfo ? userInfo.token : "";

    const [search, setSearch] = useState("");
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);

    // --- CARGAR BLOGS ---
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

    // --- BÚSQUEDA ---
    const handleSearchChange = (e) => {
        const searchText = e.target.value;
        setSearch(searchText);
        const filtered = searchText
            ? blogs.filter(
                  (b) =>
                      b.title
                          .toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                      b.author.toLowerCase().includes(searchText.toLowerCase()),
              )
            : blogs;
        setFilteredBlogs(filtered);
    };

    // --- NOTIFICACIONES ---
    const [notification, setNotification] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    useEffect(() => {
        if (notificationVisible) {
            const progressBar = document.querySelector(".notification-bar");
            if (progressBar)
                progressBar.classList.add("notification-bar-progress");

            setTimeout(() => {
                setNotificationVisible(false);
                getBlogs();
            }, 1500);
        }
    }, [notificationVisible]);

    const showNotification = (message) => {
        setNotification(message);
        setNotificationVisible(true);
    };

    // --- FORMULARIO Y VALIDACIONES ---
    const [formData, setFormData] = useState({
        banner: "",
        title: "",
        slug: "",
        author: "",
        published_at: "",
        category: "",
        content: "",
        external_url: "",
    });

    const [errors, setErrors] = useState({
        banner: "",
        title: "",
        author: "",
        published_at: "",
        content: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const newErrors = { ...errors };
        // Validamos únicamente los campos que tu controlador marca como obligatorios (required)
        if (
            ["banner", "title", "author", "published_at", "content"].includes(
                name,
            )
        ) {
            newErrors[name] = value === "" ? `* ${name} is required` : "";
        }
        setErrors(newErrors);
    };

    const isFormValid =
        formData.banner !== "" &&
        formData.title !== "" &&
        formData.author !== "" &&
        formData.published_at !== "" &&
        formData.content !== "";

    // --- BOTONES DE CONTROL ---
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [blogIdUpdate, setBlogIdUpdate] = useState(null);
    const [isButtonAddEnabled, setIsButtonAddEnabled] = useState(true);

    const handleButtonAddClick = () => {
        setFormData({
            banner: "",
            title: "",
            slug: "",
            author: "",
            published_at: "",
            category: "",
            content: "",
            external_url: "",
        });
        setIsButtonAddEnabled(false);
        setEditMode(false);
        setShowAddForm(true);
    };

    const handleButtonClick = () => {
        setIsButtonEnabled(false);
    };

    // --- CRUD ACTIONS ---

    const handleAddBlog = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/blogs_store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error adding post.");

            showNotification("Post added successfully");
            setShowAddForm(false);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(error.message);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        }
    };

    const handleEdit = (blog) => {
        setFormData({
            banner: blog.banner,
            title: blog.title,
            slug: blog.slug || "",
            author: blog.author,
            published_at: blog.published_at
                ? blog.published_at.substring(0, 10)
                : "",
            category: blog.category || "",
            content: blog.content,
            external_url: blog.external_url || "",
        });
        setBlogIdUpdate(blog.id);
        setEditMode(true);
        setShowAddForm(true);
    };

    const handleUpdateBlog = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/blogs_update/${blogIdUpdate}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error updating post.");

            showNotification("Post updated successfully");
            setShowAddForm(false);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        } catch (error) {
            showNotification(error.message);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/api/blogs_destroy/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.status === 200) {
                showNotification("Post deleted successfully");
                setIsButtonEnabled(true);
            }
        } catch (error) {
            console.error(error);
            setIsButtonEnabled(true);
            alert("Error deleting post");
        }
    };

    return (
        <>
            <br />
            <div className="d-flex">
                <Container className="mt-5">
                    <Row>
                        <Col sm={4}>
                            <Form className="d-flex">
                                <InputGroup>
                                    <InputGroup.Text className="bg-white">
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
                                        className="me-2"
                                        placeholder="Search Post"
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                </InputGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>

                <MDBBtn
                    class={`custom-button ${!isButtonAddEnabled ? "clicked" : ""}`}
                    size="lg"
                    className="mb-4 w-100"
                    type="submit"
                    disabled={!isButtonAddEnabled}
                    onClick={handleButtonAddClick}
                >
                    ADD NEW POST
                </MDBBtn>
            </div>
            <br />

            <MDBTable>
                <MDBTableHead dark>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Author</th>
                        <th scope="col" className="text-center">
                            Actions
                        </th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {filteredBlogs.map((b) => (
                        <tr key={b.id}>
                            <th scope="row">{b.id}</th>
                            <td>{b.title}</td>
                            <td>{b.author}</td>
                            <td>
                                <MDBBtn
                                    class={`custom-button ${!isButtonEnabled ? "clicked" : ""} mb-4 w-100`}
                                    size="lg"
                                    className="mb-4 w-100"
                                    style={{ width: "98px" }}
                                    disabled={!isButtonEnabled}
                                    onClick={() => {
                                        handleButtonClick();
                                        handleEdit(b);
                                    }}
                                >
                                    EDIT
                                </MDBBtn>
                                <MDBBtn
                                    class={`custom-button ${!isButtonEnabled ? "clicked" : ""} mb-4 w-100`}
                                    size="lg"
                                    className="mb-4 w-100"
                                    disabled={!isButtonEnabled}
                                    onClick={() => {
                                        handleButtonClick();
                                        handleDelete(b.id);
                                    }}
                                >
                                    DELETE
                                </MDBBtn>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            {/* MODAL | ADD & UPDATE */}
            <Modal
                show={showAddForm}
                onHide={() => {
                    setShowAddForm(false);
                    setIsButtonAddEnabled(true);
                    setIsButtonEnabled(true);
                }}
            >
                <Modal.Header
                    className={editMode ? "bg-primary" : "bg-warning"}
                ></Modal.Header>
                <Modal.Body>
                    <img
                        src="/img/logosmc.svg"
                        alt="Logo"
                        style={{
                            maxWidth: "80%",
                            margin: "auto",
                            display: "block",
                            marginBottom: "20px",
                        }}
                    />
                    <form
                        onSubmit={editMode ? handleUpdateBlog : handleAddBlog}
                    >
                        {errors.title && (
                            <p className="error-text">{errors.title}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Post Title"
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />

                        <MDBInput
                            wrapperClass="mb-4"
                            label="Slug (Optional - Auto generated if empty)"
                            id="slug"
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                        />

                        {errors.author && (
                            <p className="error-text">{errors.author}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Author"
                            id="author"
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                        />

                        {errors.banner && (
                            <p className="error-text">{errors.banner}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Banner Image URL"
                            id="banner"
                            type="text"
                            name="banner"
                            value={formData.banner}
                            onChange={handleChange}
                        />

                        {errors.published_at && (
                            <p className="error-text">{errors.published_at}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Publish Date"
                            id="published_at"
                            type="date"
                            name="published_at"
                            value={formData.published_at}
                            onChange={handleChange}
                        />

                        <MDBInput
                            wrapperClass="mb-4"
                            label="Category (Optional)"
                            id="category"
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        />

                        <MDBInput
                            wrapperClass="mb-4"
                            label="External URL (Optional)"
                            id="external_url"
                            type="text"
                            name="external_url"
                            value={formData.external_url}
                            onChange={handleChange}
                        />

                        {errors.content && (
                            <p className="error-text">{errors.content}</p>
                        )}
                        <div className="mb-4">
                            <label
                                htmlFor="content"
                                className="form-label text-muted"
                            >
                                Post Content
                            </label>
                            <textarea
                                className="form-control"
                                id="content"
                                rows="5"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <MDBBtn
                            size="lg"
                            className="mb-4 w-100"
                            type="submit"
                            disabled={!isFormValid}
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
