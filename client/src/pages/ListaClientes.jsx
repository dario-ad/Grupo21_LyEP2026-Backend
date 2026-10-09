import "../css/listaclientes.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormCliente from "../components/FormCliente";
import clientesService from "../services/clientesService";

const ListaClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const cargarClientes = async (mostrarCarga = true) => {
    try {
        if (mostrarCarga) {
            setLoading(true);
        }

        const data = await clientesService.obtenerClientes();
        setClientes(data);
        setError(false);
    } catch {
        setError(true);
    } finally {
        if (mostrarCarga) {
            setLoading(false);
        }
    }
};

    useEffect(() => {
        cargarClientes();
    }, []);

    const clientesFiltrados = clientes.filter((cliente) => {
        const nombre = cliente.name.firstname || "";
        const ciudad = cliente.address.city || "";
        const termino = busqueda.toLowerCase();

        return (
            nombre.toLowerCase().includes(termino) ||
            ciudad.toLowerCase().includes(termino)
        );
    });

    if (loading) {
        return <h2>Cargando clientes...</h2>;
    }

    if (error) {
        return <h2>Error al cargar los clientes.</h2>;
    }

    return (
        <div className="clientes-container">
            <h1>Clientes</h1>

            <FormCliente onClienteCreado={() => cargarClientes(false)} />

            <hr />

            <div className="contenedor-buscador">
                <h2 className="titulo-buscador">Buscar Clientes</h2>

                <input
                    className="buscador"
                    type="text"
                    placeholder="Buscar por nombre o ciudad"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <p className="cantidad-clientes">
                    Clientes encontrados: {clientesFiltrados.length}
                </p>
            </div>

            <table className="tabla-clientes">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre completo</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Ciudad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {clientesFiltrados.map((cliente) => (
                        <tr key={cliente._id}>
                            <td>{cliente._id}</td>
                            <td>{cliente.name.firstname}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.phone}</td>
                            <td>{cliente.address.city}</td>
                            <td>
                                <Link
                                    className="btn-ficha"
                                    to={`/clientes/${cliente._id}`}
                                >
                                    Ver Ficha Completa
                                </Link>
                            </td>
                        </tr>
                    ))}

                    {clientesFiltrados.length === 0 && (
                        <tr>
                            <td colSpan="6">
                                No se encontraron clientes.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListaClientes;