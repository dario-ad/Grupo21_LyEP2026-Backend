import express from "express";

import {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
} from "../controllers/clientesController.js";

import { verificarToken, requerirRol } from "../middleware/auth.js";

const router = express.Router();

// Todas las rutas de clientes exigen estar autenticado
router.use(verificarToken);

router.get("/", obtenerClientes);
router.get("/:id", obtenerClientePorId);
router.post("/", crearCliente);
router.put("/:id", actualizarCliente);
// Solo Gerencia puede eliminar clientes
router.delete("/:id", requerirRol("gerencia"), eliminarCliente);

export default router;
