import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

// Verifica que la petición traiga un token válido (Authorization: Bearer <token>)
// y deja el usuario verificado en req.usuario.
export const verificarToken = async (req, res, next) => {
    try {
        const [tipo, token] = (req.headers.authorization || "").split(" ");

        if (tipo !== "Bearer" || !token) {
            return res.status(401).json({
                mensaje: "Se requiere autenticación"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("Falta JWT_SECRET en server/.env");
            return res.status(500).json({
                mensaje: "Error de configuración del servidor"
            });
        }

        let payload;

        try {
            payload = jwt.verify(token, process.env.JWT_SECRET, {
                algorithms: ["HS256"]
            });
        } catch {
            return res.status(401).json({
                mensaje: "Token inválido o vencido"
            });
        }

        // El rol se toma de la base de datos, no del frontend.
        const usuario = await Usuario.findById(payload.id);

        if (!usuario || !usuario.activo) {
            return res.status(401).json({
                mensaje: "La cuenta no existe o está desactivada"
            });
        }

        req.usuario = {
            id: usuario._id.toString(),
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        };

        next();
    } catch (error) {
        console.error("Error al verificar la autenticación:", error);
        res.status(500).json({
            mensaje: "Error al verificar la autenticación"
        });
    }
};

// Permite continuar solo si el rol del usuario autenticado está permitido.
// Debe usarse después de verificarToken.
export const requerirRol = (...rolesPermitidos) => (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({
            mensaje: "Se requiere autenticación"
        });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({
            mensaje: "No tiene permisos para realizar esta acción"
        });
    }

    next();
};