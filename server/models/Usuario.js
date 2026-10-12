import mongoose from "mongoose";

export const ROLES = ["gerencia", "soporte"];

const usuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        // Hash de bcrypt. Nunca se guarda la contraseña en texto plano
        // y no se devuelve en las consultas salvo que se pida con select("+passwordHash").
        passwordHash: {
            type: String,
            required: true,
            select: false
        },

        rol: {
            type: String,
            enum: ROLES,
            required: true
        },

        activo: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

// Por seguridad, el hash nunca se incluye al convertir el usuario a JSON.
usuarioSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
    }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;