import Cliente from "../models/Cliente.js";

// Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los clientes"
        });
    }
};

// Obtener un cliente por su ID
export const obtenerClientePorId = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.json(cliente);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener el cliente"
        });
    }
};

// Crear un cliente
export const crearCliente = async (req, res) => {
    try {
        const nuevoCliente = await Cliente.create(req.body);

        res.status(201).json(nuevoCliente);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                mensaje: "Faltan datos obligatorios o son inválidos"
            });
        }

        res.status(500).json({
            mensaje: "Error al crear el cliente"
        });
    }
};

// Actualizar un cliente
export const actualizarCliente = async (req, res) => {
    try {
        const clienteActualizado = await Cliente.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!clienteActualizado) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.json(clienteActualizado);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                mensaje: "Datos inválidos"
            });
        }

        res.status(500).json({
            mensaje: "Error al actualizar el cliente"
        });
    }
};

// Eliminar un cliente
export const eliminarCliente = async (req, res) => {
    try {
        const clienteEliminado = await Cliente.findByIdAndDelete(
            req.params.id
        );

        if (!clienteEliminado) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.json({
            mensaje: "Cliente eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el cliente"
        });
    }
};
