import axios from "axios";

const API_URL = "http://localhost:3001/api";

// Agrega el token a cada petición dirigida al backend
axios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");

    if (token && config.url?.startsWith(API_URL)) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Si el backend responde 401 (sesión vencida o token inválido), se cierra la sesión.
// El propio login queda excluido: ahí un 401 significa "credenciales incorrectas".
axios.interceptors.response.use(
    (respuesta) => respuesta,
    (error) => {
        const url = error.config?.url || "";
        const esLogin = url.endsWith("/auth/login");

        if (error.response?.status === 401 && !esLogin) {
            sessionStorage.removeItem("token");
            localStorage.removeItem("admin");
            localStorage.removeItem("role");

            if (window.location.pathname !== "/login") {
                window.location.assign("/login");
            }
        }

        return Promise.reject(error);
    }
);
