import '../css/detallecliente.css';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clientesService from "../services/clientesService";

const DetalleCliente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const [cliente, setCliente] = useState(null);
    const [editando, setEditando] = useState(false);
    const [formulario, setFormulario] = useState({
        nombre: "",
        email: "",
        telefono: "",
        calle: "",
        numero: "",
        codigoPostal: "",
        ciudad: ""
    });
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        clientesService.obtenerClientePorId(id)
            .then((data) => {
                setCliente(data);
                setFormulario({
                    nombre: data.name.firstname,
                    email: data.email,
                    telefono: data.phone,
                    calle: data.address.street,
                    numero: data.address.number,
                    codigoPostal: data.address.zipcode,
                    ciudad: data.address.city
                });
            })
            .catch(() => setError(true));
    }, [id]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));
    };

    const actualizarCliente = async (e) => {
        e.preventDefault();
        setMensaje("");

        const clienteActualizado = {
            name: {
                firstname: formulario.nombre.trim()
            },
            email: formulario.email.trim(),
            phone: formulario.telefono.trim(),
            address: {
                street: formulario.calle.trim(),
                number: formulario.numero.trim(),
                zipcode: formulario.codigoPostal.trim(),
                city: formulario.ciudad.trim()
            }
        };

        if (Object.values(formulario).some((valor) => !valor.trim())) {
            setMensaje("Complete todos los campos.");
            return;
        }

        try {
            const respuesta = await clientesService.actualizarCliente(
                id,
                clienteActualizado
            );

            setCliente(respuesta);
            setEditando(false);
            setMensaje("Cliente actualizado correctamente.");
        } catch (error) {
            setMensaje(
                error.response?.data?.mensaje ||
                "Error al actualizar el cliente."
            );
        }
    };

    const eliminarCliente = async () => {
        try {
            await clientesService.eliminarCliente(id);
            navigate("/clientes");
        } catch {
            setMensaje("Error al eliminar el cliente.");
        }
    };

    if (error) {
        return <h2>No se pudo cargar el cliente.</h2>;
    }

    if (!cliente) {
        return <h2>Cargando cliente...</h2>;
    }

    return (
        <div className="detalle-cliente">
            <h1>Ficha del Cliente</h1>

            <p>Rol actual: {role}</p>

            {mensaje && <p className="mensaje-eliminado">{mensaje}</p>}

            <p><strong>ID:</strong> {cliente._id}</p>
            <p><strong>Nombre completo:</strong> {cliente.name.firstname}</p>
            <p><strong>Email:</strong> {cliente.email}</p>
            <p><strong>Teléfono:</strong> {cliente.phone}</p>

            <h2>Dirección</h2>
            <p><strong>Calle:</strong> {cliente.address.street}</p>
            <p><strong>Número:</strong> {cliente.address.number}</p>
            <p><strong>Código postal:</strong> {cliente.address.zipcode}</p>
            <p><strong>Ciudad:</strong> {cliente.address.city}</p>

            {!editando && (
                <button onClick={() => setEditando(true)}>
                    Editar Cliente
                </button>
            )}

            {editando && (
                <form onSubmit={actualizarCliente}>
                    <h2>Editar datos del cliente</h2>

                    <label>Nombre completo</label>
                    <input
                        name="nombre"
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        required
                    />

                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formulario.email}
                        onChange={manejarCambio}
                        required
                    />

                    <label>Teléfono</label>
                    <input
                        name="telefono"
                        value={formulario.telefono}
                        onChange={manejarCambio}
                        required
                    />

                    <label>Calle</label>
                    <input
                        name="calle"
                        value={formulario.calle}
                        onChange={manejarCambio}
                        required
                    />

                    <label>Número</label>
                    <input
                        name="numero"
                        value={formulario.numero}
                        onChange={manejarCambio}
                        required
                    />

                    <label>Código postal</label>
                    <input
                        name="codigoPostal"
                        value={formulario.codigoPostal}
                        onChange={manejarCambio}
                        required
                    />

                    <label>Ciudad</label>
                    <input
                        name="ciudad"
                        value={formulario.ciudad}
                        onChange={manejarCambio}
                        required
                    />

                    <button type="submit">Guardar cambios</button>

                    <button
                        type="button"
                        onClick={() => {
                            setEditando(false);
                            setMensaje("");
                        }}
                    >
                        Cancelar
                    </button>
                </form>
            )}

            {role?.trim() === "Gerencia" && (
                <button
                    className="btn-eliminar"
                    onClick={eliminarCliente}
                >
                    Eliminar Cliente
                </button>
            )}
        </div>
    );
};

export default DetalleCliente;