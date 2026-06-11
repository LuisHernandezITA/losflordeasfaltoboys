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

function CrudCategory() {
    const { userInfo } = useUser();
    const userAdmin = userInfo ? userInfo.admin : "";

    if (!userAdmin) return <Navigate to="/" />;

    const accessToken = userInfo ? userInfo.token : "";
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);

    // Estados del formulario
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [errors, setErrors] = useState({ name: "" });
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [categoryIdUpdate, setCategoryIdUpdate] = useState(null);
    const [isButtonAddEnabled, setIsButtonAddEnabled] = useState(true);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = () => {
        axios
            .get("/api/category_index")
            .then((res) => {
                setCategories(res.data);
                setFilteredCategories(res.data);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    };

    const handleSearchChange = (e) => {
        const searchText = e.target.value;
        setSearch(searchText);
        setFilteredCategories(
            searchText
                ? categories.filter(
                      (cat) =>
                          cat.name
                              .toLowerCase()
                              .includes(searchText.toLowerCase()) ||
                          (cat.description &&
                              cat.description
                                  .toLowerCase()
                                  .includes(searchText.toLowerCase())),
                  )
                : categories,
        );
    };

    // NOTIFICATIONS
    const { showNotification } = useNotification();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({
            ...errors,
            [name]:
                value === ""
                    ? `* ${name.charAt(0).toUpperCase() + name.slice(1)} is required`
                    : "",
        });
    };

    const isFormValid = formData.name !== "" && errors.name === "";

    const handleButtonAddClick = () => {
        setFormData({ name: "", description: "" });
        setIsButtonAddEnabled(false);
        setEditMode(false);
        setShowAddForm(true);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await fetch("/api/categories_store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });
            showNotification("Category added successfully");
            setShowAddForm(false);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
            getCategories();
        } catch (err) {
            showNotification(err.message);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        }
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            description: category.description || "",
        });
        setCategoryIdUpdate(category.id);
        setEditMode(true);
        setShowAddForm(true);
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        try {
            await fetch(`/api/categories_update/${categoryIdUpdate}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });
            showNotification("Category Updated successfully");
            setShowAddForm(false);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
            getCategories();
        } catch (err) {
            showNotification(err.message);
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/categories_destroy/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            showNotification("Category deleted successfully");
            setIsButtonEnabled(true);
            getCategories();
        } catch (err) {
            setIsButtonEnabled(true);
            alert("Error deleting category");
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
                                placeholder="Search Categories"
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
                        ADD NEW CATEGORY
                    </MDBBtn>
                </div>

                <MDBTable style={{ verticalAlign: "middle" }}>
                    <MDBTableHead dark>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {filteredCategories.map((cat) => (
                            <tr key={cat.id}>
                                <th scope="row">{cat.id}</th>
                                <td>{cat.name}</td>
                                <td>{cat.description || "No description"}</td>
                                <td className="text-center">
                                    <MDBBtn
                                        size="sm"
                                        color="light"
                                        style={{
                                            borderRadius: "0px",
                                            marginRight: "10px",
                                        }}
                                        onClick={() => {
                                            setIsButtonEnabled(false);
                                            handleEdit(cat);
                                        }}
                                    >
                                        EDIT
                                    </MDBBtn>
                                    <MDBBtn
                                        size="sm"
                                        color="dark"
                                        style={{ borderRadius: "0px" }}
                                        onClick={() => {
                                            setIsButtonEnabled(false);
                                            handleDelete(cat.id);
                                        }}
                                    >
                                        DELETE
                                    </MDBBtn>
                                </td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </Container>

            {/* MODAL ESTILO BRUTALISTA */}
            <Modal
                show={showAddForm}
                onHide={() => {
                    setShowAddForm(false);
                    setIsButtonAddEnabled(true);
                    setIsButtonEnabled(true);
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
                            ? "// SYSTEM_UPDATE_CATEGORY"
                            : "// SYSTEM_NEW_CATEGORY"}
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
                            editMode ? handleUpdateCategory : handleAddCategory
                        }
                    >
                        <MDBInput
                            wrapperClass="mb-4"
                            label="CATEGORY NAME"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            contrast
                            style={{ borderRadius: "0px" }}
                        />
                        <MDBInput
                            wrapperClass="mb-4"
                            label="DESCRIPTION"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            contrast
                            style={{ borderRadius: "0px" }}
                        />
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
                            {editMode ? "UPDATE CATEGORY" : "ADD CATEGORY"}
                        </MDBBtn>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default CrudCategory;
