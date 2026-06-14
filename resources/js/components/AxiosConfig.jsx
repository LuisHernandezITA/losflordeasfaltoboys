import axios from "axios";

const api = axios.create({
    // Si process.env.REACT_APP_API_URL tiene un valor, usa ese.
    // Si está vacío (undefined), entonces usa el localhost.
    baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api",
});

export default api;
