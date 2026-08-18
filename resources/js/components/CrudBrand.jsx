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
    Modal,
} from "react-bootstrap";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { useNotification } from "./NotificationContext";

function CrudBrand() {
    const { userInfo } = useUser();
    const userAdmin = userInfo ? userInfo.admin : "";

    if (!userAdmin) return <Navigate to="/" />;

    const accessToken = userInfo ? userInfo.token : "";
    const [search, setSearch] = useState("");
    const [brands, setBrands] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);

    // Estados del formulario (acorde a la nueva tabla)
    const [formData, setFormData] = useState({
        name: "",
        banner_url: "",
        alt_text: "",
    });

    const [errors, setErrors] = useState({ name: "", banner_url: "" });
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [brandIdUpdate, setBrandIdUpdate] = useState(null);
    const [isButtonAddEnabled, setIsButtonAddEnabled] = useState(true);

    useEffect(() => {
        getBrands();
    }, []);

    const getBrands = () => {
        axios
            .get("/api/brands_index")
            .then((res) => {
                setBrands(res.data);
                setFilteredBrands(res.data);
            })
            .catch((err) => console.error(err));
    };

    const handleSearchChange = (e) => {
        const searchText = e.target.value;
        setSearch(searchText);
        setFilteredBrands(
            searchText
                ? brands.filter((brand) =>
                      brand.name
                          .toLowerCase()
                          .includes(searchText.toLowerCase()),
                  )
                : brands,
        );
    };

    const { showNotification } = useNotification();

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
        formData.name !== "" &&
        formData.banner_url !== "" &&
        errors.name === "" &&
        errors.banner_url === "";

    const handleButtonAddClick = () => {
        setFormData({ name: "", banner_url: "", alt_text: "" });
        setIsButtonAddEnabled(false);
        setEditMode(false);
        setShowAddForm(true);
    };

    const handleAddBrand = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/brands_store", formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            showNotification("Brand added successfully");
            setShowAddForm(false);
            setIsButtonAddEnabled(true);
            getBrands();
        } catch (err) {
            showNotification("Error adding brand");
        }
    };

    const handleEdit = (brand) => {
        setFormData({
            name: brand.name,
            banner_url: brand.banner_url,
            alt_text: brand.alt_text || "",
        });
        setBrandIdUpdate(brand.id);
        setEditMode(true);
        setShowAddForm(true);
    };

    const handleUpdateBrand = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/brands_update/${brandIdUpdate}`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            showNotification("Brand updated successfully");
            setShowAddForm(false);
            setIsButtonAddEnabled(true);
            getBrands();
        } catch (err) {
            showNotification("Error updating brand");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this brand?")) return;
        try {
            await axios.delete(`/api/brands_destroy/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            showNotification("Brand deleted successfully");
            getBrands();
        } catch (err) {
            showNotification("Error deleting brand");
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
                                placeholder="Search Brands"
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
                        ADD NEW BRAND
                    </MDBBtn>
                </div>

                <MDBTable style={{ verticalAlign: "middle" }}>
                    <MDBTableHead dark>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Banner URL</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {filteredBrands.map((brand) => (
                            <tr key={brand.id}>
                                <th scope="row">{brand.id}</th>
                                <td>{brand.name}</td>
                                <td>{brand.banner_url}</td>
                                <td className="text-center">
                                    <MDBBtn
                                        size="sm"
                                        color="light"
                                        style={{
                                            borderRadius: "0px",
                                            marginRight: "10px",
                                        }}
                                        onClick={() => handleEdit(brand)}
                                    >
                                        EDIT
                                    </MDBBtn>
                                    <MDBBtn
                                        size="sm"
                                        color="dark"
                                        style={{ borderRadius: "0px" }}
                                        onClick={() => handleDelete(brand.id)}
                                    >
                                        DELETE
                                    </MDBBtn>
                                </td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </Container>

            {/* MODAL */}
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
                            ? "// SYSTEM_UPDATE_BRAND"
                            : "// SYSTEM_NEW_BRAND"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{ backgroundColor: "#121212", padding: "2rem" }}
                >
                    <form
                        onSubmit={editMode ? handleUpdateBrand : handleAddBrand}
                    >
                        {["name", "banner_url", "alt_text"].map((field) => (
                            <MDBInput
                                key={field}
                                wrapperClass="mb-4"
                                label={field.toUpperCase().replace("_", " ")}
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
                            {editMode ? "UPDATE BRAND" : "ADD BRAND"}
                        </MDBBtn>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default CrudBrand;
