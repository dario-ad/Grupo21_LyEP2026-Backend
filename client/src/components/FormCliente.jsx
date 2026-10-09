import '../css/formcliente.css';
import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import clientesService from "../services/clientesService";

const FormCliente = ({ onClienteCreado}) => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [calle, setCalle] = useState("");
    const [numero, setNumero] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");
    const [ciudad, setCiudad] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const manejarSubmit = async (e) => {
        e.preventDefault();

        setMensaje("");
        setError("");

        if (
            !nombre.trim() ||
            !email.trim() ||
            !telefono.trim() ||
            !calle.trim() ||
            !numero.trim() ||
            !codigoPostal.trim() ||
            !ciudad.trim()
        ) {
            setError("Complete todos los campos.");
            return;
        }

        const nuevoCliente = {
            name: {
                firstname: nombre.trim()
            },
            email: email.trim(),
            phone: telefono.trim(),
            address: {
                street: calle.trim(),
                number: numero.trim(),
                zipcode: codigoPostal.trim(),
                city: ciudad.trim()
            }
        };

        try {
            setLoading(true);

            const respuesta =
                await clientesService.crearCliente(nuevoCliente);

            setMensaje(
                `Cliente creado correctamente. ID: ${respuesta._id}`
            );

            if (onClienteCreado) {
                    await onClienteCreado();
            }

            setNombre("");
            setEmail("");
            setTelefono("");
            setCalle("");
            setNumero("");
            setCodigoPostal("");
            setCiudad("");
        } catch (error) {
            setError(
                error.response?.data?.mensaje ||
                "Ocurrió un error al crear el cliente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="formulario-cliente">
            <h3>Nuevo Cliente</h3>

            <Form onSubmit={manejarSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre completo</Form.Label>
                    <Form.Control
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Calle</Form.Label>
                    <Form.Control
                        type="text"
                        value={calle}
                        onChange={(e) => setCalle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Número</Form.Label>
                    <Form.Control
                        type="text"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Código postal</Form.Label>
                    <Form.Control
                        type="text"
                        value={codigoPostal}
                        onChange={(e) => setCodigoPostal(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                        type="text"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <Spinner size="sm" /> : "Guardar Cliente"}
                </Button>
            </Form>

            {mensaje && (
                <Alert className="mt-3" variant="success">
                    {mensaje}
                </Alert>
            )}

            {error && (
                <Alert className="mt-3" variant="danger">
                    {error}
                </Alert>
            )}
        </div>
    );
};

export default FormCliente;