import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import Usuario from "../models/Usuario.js";

// Carga server/.env sin importar desde qué carpeta se ejecute el script
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const cuentas = [
    { rol: "gerencia", prefijo: "SEED_GERENCIA" },
    { rol: "soporte", prefijo: "SEED_SOPORTE" }
];

const leerCuenta = ({ rol, prefijo }) => {
    const nombre = process.env[`${prefijo}_NOMBRE`];
    const email = process.env[`${prefijo}_EMAIL`];
    const password = process.env[`${prefijo}_PASSWORD`];

    if (!nombre || !email || !password) {
        throw new Error(
            `Faltan ${prefijo}_NOMBRE, ${prefijo}_EMAIL o ${prefijo}_PASSWORD en server/.env`
        );
    }

    if (password.length < 8) {
        throw new Error(`${prefijo}_PASSWORD debe tener al menos 8 caracteres`);
    }

    return {
        rol,
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password
    };
};

const inicializar = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("Falta MONGODB_URI en server/.env");
    }

    // Se validan las variables antes de conectar a la base
    const datos = cuentas.map(leerCuenta);

    if (datos[0].email === datos[1].email) {
        throw new Error("Los emails de Gerencia y Soporte deben ser distintos");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    for (const { rol, nombre, email, password } of datos) {
        const existente = await Usuario.findOne({ email });

        if (existente) {
            console.log(`La cuenta de ${rol} (${email}) ya existe. No se modifica.`);
            continue;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        await Usuario.create({ nombre, email, passwordHash, rol });
        console.log(`Cuenta de ${rol} creada: ${email}`);
    }
};

inicializar()
    .catch((error) => {
        console.error("Error al inicializar las cuentas:", error.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());