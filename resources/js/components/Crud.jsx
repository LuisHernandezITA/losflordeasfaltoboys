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
import "/resources/css/app.css";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { useNotification } from "./NotificationContext";

function Crud() {
    const { userInfo } = useUser();
    const userAdmin = userInfo ? userInfo.admin : "";

    if (!userAdmin) {
        return <Navigate to="/" />;
    }

    const accessToken = userInfo ? userInfo.token : "";

    // --- ESTADOS ---
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [isButtonAddEnabled, setIsButtonAddEnabled] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [productIdUpdate, setProductIdUpdate] = useState(null);

    // --- CARGAR DATOS ---
    const getProducts = () => {
        axios
            .get("/api/products_index")
            .then((response) => {
                setProducts(response.data);
                setFilteredProducts(response.data);
            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        getProducts();
    }, []);

    // --- BÚSQUEDA AUTOMÁTICA ---
    const handleSearchChange = (e) => {
        const searchText = e.target.value;
        setSearch(searchText);
        const filtered = searchText
            ? products.filter(
                  (p) =>
                      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
                      p.description
                          .toLowerCase()
                          .includes(searchText.toLowerCase()),
              )
            : products;
        setFilteredProducts(filtered);
    };

    // NOTIFICATIONS
    const { showNotification } = useNotification();

    // --- FORMULARIO (CAMPOS ACTUALIZADOS) ---
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        available_stock: "",
        image_primary: "",
        image_detail_1: "",
        image_detail_2: "",
        shipping_type: "0",
        seller_url: "",
        designer: "",
        available: false,
        category_id: "",
    });

    const [selectedColors, setSelectedColors] = useState([]);
    const [sizeFormData, setSizeFormData] = useState({ sizes: [] });
    const [errors, setErrors] = useState({});

    // --- HANDLERS ---
    const handleButtonClick = () => setIsButtonEnabled(false);

    const handleButtonAddClick = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            available_stock: "",
            image_primary: "",
            image_detail_1: "",
            image_detail_2: "",
            shipping_type: "0",
            seller_url: "",
            designer: "",
            available: false,
            category_id: "",
        });
        setSelectedColors([]);
        setSizeFormData({ sizes: [] });
        setErrors({});
        setEditMode(false);
        setIsButtonAddEnabled(false);
        setShowAddForm(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "category") {
            const selectedCategoryId = value ? parseInt(value, 10) : "";
            setFormData((prev) => ({
                ...prev,
                category_id: selectedCategoryId,
            }));
            setErrors({
                ...errors,
                category: value ? "" : "* Category is required",
            });
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));

        // Validaciones rápidas
        const newErrors = { ...errors };
        const isEmpty = typeof value === "string" && value.trim() === "";

        switch (name) {
            case "name":
            case "description":
                newErrors[name] = isEmpty
                    ? `* ${name.charAt(0).toUpperCase() + name.slice(1)} is required`
                    : "";
                break;
            case "price":
                newErrors[name] = isEmpty
                    ? "* Price is required"
                    : !/^\d+(\.\d{1,2})?$/.test(value)
                      ? "* Invalid price format. Only numbers allowed."
                      : "";
                break;
            case "available_stock":
                newErrors[name] = isEmpty
                    ? "* Stock is required"
                    : !/^\d+$/.test(value)
                      ? "* Invalid stock format. Only integers allowed."
                      : "";
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const handleColorChange = (colorId) => {
        setSelectedColors((prevColors) =>
            prevColors.includes(colorId)
                ? prevColors.filter((id) => id !== colorId)
                : [...prevColors, colorId],
        );
    };

    const handleSizeChange = (sizeId) => {
        setSizeFormData((prevData) => ({
            ...prevData,
            sizes: prevData.sizes.includes(sizeId)
                ? prevData.sizes.filter((id) => id !== sizeId)
                : [...prevData.sizes, sizeId],
        }));
    };

    const handleSwitchChange = () => {
        setFormData((prevData) => ({
            ...prevData,
            available: !prevData.available,
        }));
    };

    // --- OPCIONES DE SELECTS Y CHECKBOXES ---
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);

    useEffect(() => {
        axios
            .get("/api/category_index")
            .then((res) =>
                setCategoryOptions(Array.isArray(res.data) ? res.data : []),
            )
            .catch((err) => console.error("Error categories:", err));

        axios
            .get("/api/color_index")
            .then((res) => setColorOptions(res.data))
            .catch((err) => console.error("Error colors:", err));

        axios
            .get("/api/size_index")
            .then((res) => setSizeOptions(res.data))
            .catch((err) => console.error("Error sizes:", err));
    }, []);

    // Validación para habilitar botones de guardar
    const isFormValid =
        formData.name &&
        formData.description &&
        formData.price &&
        formData.available_stock &&
        formData.category_id &&
        Object.values(errors).every((error) => !error);

    // --- ACCIONES CRUD ---

    const handleAddProduct = async (e) => {
        e.preventDefault();

        // Limpiamos los campos opcionales antes de enviar
        const payload = {
            ...formData,
            image_detail_1:
                formData.image_detail_1?.trim() === ""
                    ? null
                    : formData.image_detail_1,
            image_detail_2:
                formData.image_detail_2?.trim() === ""
                    ? null
                    : formData.image_detail_2,
        };

        try {
            const productResponse = await fetch("api/products_store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!productResponse.ok) throw new Error("Error adding product.");

            const productData = await productResponse.json();
            const productId = productData.id;

            if (selectedColors.length > 0) {
                await fetch("api/productcolors_store", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        product_id: productId,
                        color_ids: selectedColors,
                    }),
                });
            }

            if (sizeFormData.sizes.length > 0) {
                await fetch("api/productsizes_store", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        product_id: productId,
                        size_ids: sizeFormData.sizes,
                    }),
                });
            }

            showNotification("Product added successfully");
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
            setShowAddForm(false);
            getProducts();
        } catch (error) {
            showNotification(error.message || "Network error.");
        }
    };

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`/api/products/${id}/edit`);
            const productData = response.data;

            setFormData({
                name: productData.name || "",
                description: productData.description || "",
                category_id: productData.category_id || "",
                price: productData.price || "",
                available_stock: productData.available_stock || "",
                image_primary: productData.image_primary || "",
                image_detail_1: productData.image_detail_1 || "",
                image_detail_2: productData.image_detail_2 || "",
                shipping_type:
                    productData.shipping_type !== undefined
                        ? String(productData.shipping_type)
                        : "0",
                seller_url: productData.seller_url || "",
                designer: productData.designer || "",
                available: !!productData.available,
            });

            setSelectedColors(
                productData.colors ? productData.colors.map((c) => c.id) : [],
            );
            setSizeFormData({
                sizes: productData.sizes
                    ? productData.sizes.map((s) => s.id)
                    : [],
            });

            setProductIdUpdate(id);
            setEditMode(true);
            setShowAddForm(true);
        } catch (error) {
            console.error("Error loading product data", error);
        } finally {
            setIsButtonEnabled(true);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        // Limpiamos los campos opcionales antes de enviar
        const payload = {
            ...formData,
            image_detail_1:
                formData.image_detail_1?.trim() === ""
                    ? null
                    : formData.image_detail_1,
            image_detail_2:
                formData.image_detail_2?.trim() === ""
                    ? null
                    : formData.image_detail_2,
        };

        try {
            const response = await fetch(
                `/api/products_update/${productIdUpdate}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                },
            );

            if (!response.ok) throw new Error("Error updating product.");

            // Sincronizar Colores
            await axios.delete(`api/productcolors_destroy/${productIdUpdate}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (selectedColors.length > 0) {
                await axios.post(
                    "api/productcolors_store",
                    { product_id: productIdUpdate, color_ids: selectedColors },
                    { headers: { Authorization: `Bearer ${accessToken}` } },
                );
            }

            // Sincronizar Tallas
            await axios.delete(`api/productsizes_destroy/${productIdUpdate}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (sizeFormData.sizes.length > 0) {
                await axios.post(
                    "api/productsizes_store",
                    {
                        product_id: productIdUpdate,
                        size_ids: sizeFormData.sizes,
                    },
                    { headers: { Authorization: `Bearer ${accessToken}` } },
                );
            }

            showNotification("Product Updated successfully");
            setIsButtonEnabled(true);
            setIsButtonAddEnabled(true);
            setEditMode(false);
            setShowAddForm(false);
            getProducts();
        } catch (error) {
            showNotification(error.message || "Network error.");
        }
    };

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`api/productcolors_destroy/${productId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            await axios.delete(`api/productsizes_destroy/${productId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const deleteResponse = await axios.delete(
                `api/products_destroy/${productId}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            );

            if (deleteResponse.status === 200) {
                showNotification("Product deleted successfully");
            } else {
                showNotification("Error deleting product");
            }
        } catch (error) {
            console.error("Network error or server issue", error);
        } finally {
            setIsButtonEnabled(true);
        }
    };

    return (
        <>
            <br />
            <div className="d-flex align-items-center justify-content-between px-5">
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
                                            <path
                                                fillRule="evenodd"
                                                d="M9.5 3a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM1 9.5a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0z"
                                            />
                                        </svg>
                                    </InputGroup.Text>
                                    <FormControl
                                        type="search"
                                        className="me-2"
                                        placeholder="Search"
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
                    ADD NEW PRODUCT
                </MDBBtn>
            </div>
            <br />

            <MDBTable>
                <MDBTableHead dark>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Category</th>
                        <th scope="col">Price</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Images</th>
                        <th scope="col">Available</th>
                        <th scope="col">Actions</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {filteredProducts.map((product) => (
                        <tr key={product.id}>
                            <th scope="row">{product.id}</th>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.category_id}</td>
                            <td>{product.price}</td>
                            <td>{product.available_stock}</td>
                            <td>
                                {product.image_primary
                                    ? "✓ Principal"
                                    : "✗ Sin imagen"}
                            </td>
                            <td>{product.available ? "Yes" : "No"}</td>
                            <td>
                                <MDBBtn
                                    class={`custom-button ${!isButtonEnabled ? "clicked" : ""} mb-4 w-100`}
                                    size="lg"
                                    className="mb-4 w-100"
                                    style={{ width: "98px" }}
                                    disabled={!isButtonEnabled}
                                    onClick={() => {
                                        handleButtonClick();
                                        handleEdit(product.id);
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
                                        handleDelete(product.id);
                                    }}
                                >
                                    DELETE
                                </MDBBtn>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            {/* MODAL | ADD & UPDATE | DARK MODE */}
            <Modal
                show={showAddForm}
                onHide={() => {
                    setShowAddForm(false);
                    setIsButtonAddEnabled(true);
                    setIsButtonEnabled(true);
                }}
                contentClassName="bg-dark text-white"
            >
                <Modal.Header
                    className={
                        editMode
                            ? "bg-primary text-white"
                            : "bg-dark text-warning border-secondary"
                    }
                    closeButton
                    closeVariant="white"
                >
                    <Modal.Title>
                        {editMode ? "Update Product" : "Add Product"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
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
                        onSubmit={
                            editMode ? handleUpdateProduct : handleAddProduct
                        }
                    >
                        {/* Los inputs mantienen tu lógica, puedes aplicar 'bg-dark text-white' a los inputs si es necesario */}
                        {errors.name && (
                            <p className="text-danger small">{errors.name}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Name"
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            contrast // MDB prop para modo oscuro
                        />

                        {errors.description && (
                            <p className="text-danger small">
                                {errors.description}
                            </p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Description"
                            id="description"
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            contrast
                        />

                        {errors.price && (
                            <p className="text-danger small">{errors.price}</p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Price"
                            id="price"
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            contrast
                        />

                        {errors.available_stock && (
                            <p className="text-danger small">
                                {errors.available_stock}
                            </p>
                        )}
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Available Stock"
                            id="available_stock"
                            type="text"
                            name="available_stock"
                            value={formData.available_stock}
                            onChange={handleChange}
                            contrast
                        />

                        {/* Imagenes (Inputs estándar) */}
                        {[
                            "image_primary",
                            "image_detail_1",
                            "image_detail_2",
                        ].map((field) => (
                            <div className="mb-3" key={field}>
                                <label className="form-label">
                                    {field.replace("_", " ").toUpperCase()}
                                </label>
                                <input
                                    type="text"
                                    className="form-control bg-dark text-white border-secondary"
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}

                        <label htmlFor="category">Category:</label>
                        <select
                            className="form-control mb-3 bg-dark text-white border-secondary"
                            id="category"
                            name="category"
                            value={formData.category_id}
                            onChange={handleChange}
                        >
                            <option value="" hidden>
                                Select a category
                            </option>
                            {categoryOptions.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <div className="mb-3">
                            <label className="form-label">Tipo de Envío</label>
                            <select
                                className="form-control bg-dark text-white border-secondary"
                                name="shipping_type"
                                value={formData.shipping_type}
                                onChange={handleChange}
                            >
                                <option value="0">Envío Local</option>
                                <option value="1">Envío Nacional</option>
                                <option value="2">
                                    Envío Internacional / Otro
                                </option>
                            </select>
                        </div>

                        <MDBInput
                            wrapperClass="mb-4"
                            label="Seller URL"
                            id="seller_url"
                            name="seller_url"
                            value={formData.seller_url}
                            onChange={handleChange}
                            contrast
                        />
                        <MDBInput
                            wrapperClass="mb-4"
                            label="Designer"
                            id="designer"
                            name="designer"
                            value={formData.designer}
                            onChange={handleChange}
                            contrast
                        />

                        {/* Checkboxes */}
                        <label className="fw-bold d-block mt-2">
                            Color (Optional):
                        </label>
                        {colorOptions.map((color) => (
                            <div key={color.id} className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input bg-dark border-secondary"
                                    checked={selectedColors.includes(color.id)}
                                    onChange={() => handleColorChange(color.id)}
                                />
                                <label className="form-check-label">
                                    {color.name}
                                </label>
                            </div>
                        ))}

                        <label className="fw-bold d-block mt-3">
                            Size (Optional):
                        </label>
                        {sizeOptions.map((size) => (
                            <div key={size.id} className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input bg-dark border-secondary"
                                    checked={sizeFormData.sizes.includes(
                                        size.id,
                                    )}
                                    onChange={() => handleSizeChange(size.id)}
                                />
                                <label className="form-check-label">
                                    {size.name}
                                </label>
                            </div>
                        ))}

                        <div className="my-3">
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label="Available"
                                name="available"
                                checked={formData.available}
                                onChange={handleSwitchChange}
                            />
                        </div>

                        <MDBBtn
                            className="w-100"
                            size="lg"
                            type="submit"
                            disabled={!isFormValid}
                            style={{
                                backgroundColor: editMode
                                    ? "#0d6efd"
                                    : "#ffc107",
                                color: "#000",
                            }}
                        >
                            {editMode ? "UPDATE PRODUCT" : "ADD PRODUCT"}
                        </MDBBtn>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Crud;
