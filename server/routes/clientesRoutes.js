import express from "express";

import {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
} from "../controllers/clientesController.js";

const router = express.Router();

router.get("/", obtenerClientes);
router.get("/:id", obtenerClientePorId);
router.post("/", crearCliente);
router.put("/:id", actualizarCliente);
router.delete("/:id", eliminarCliente);

export default router;
