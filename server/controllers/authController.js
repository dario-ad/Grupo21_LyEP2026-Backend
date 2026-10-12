import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

// Hash de relleno: se compara igual aunque el email no exista,
// así el tiempo de respuesta no revela qué cuentas existen.
const HASH_FALSO = bcrypt.hashSync("contrasena-inexistente", 10);

// Iniciar sesión
export const login = async (req, res) => {
    try {
        const { email, password, sector } = req.body ?? {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                mensaje: "El email y la contraseña son obligatorios"
            });
        }

        // process.env se lee acá (y no al importar el archivo) porque
        // dotenv se carga en server.js después de resolver los imports.
        if (!process.env.JWT_SECRET) {
            console.error("Falta JWT_SECRET en server/.env");
            return res.status(500).json({
                mensaje: "Error de configuración del servidor"
            });
        }

        const usuario = await Usuario
            .findOne({ email: email.trim().toLowerCase() })
            .select("+passwordHash");

        const coincide = await bcrypt.compare(
            password,
            usuario ? usuario.passwordHash : HASH_FALSO
        );

        if (!usuario || !coincide) {
            return res.status(401).json({
                mensaje: "Credenciales inválidas"
            });
        }

        if (!usuario.activo) {
            return res.status(403).json({
                mensaje: "La cuenta está desactivada"
            });
        }

        // El sector que elige el usuario en el formulario solo se acepta
        // si coincide con el rol real de la cuenta. El rol lo define la base de datos.
        if (
            typeof sector === "string" &&
            sector.trim() &&
            sector.trim().toLowerCase() !== usuario.rol
        ) {
            return res.status(401).json({
                mensaje: "Credenciales inválidas"
            });
        }

        const token = jwt.sign(
            { id: usuario._id.toString(), rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
        );

        res.json({
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({
            mensaje: "Error al iniciar sesión"
        });
    }
};