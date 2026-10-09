import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    name: {
        firstname: {
            type: String,
            required: true
        }
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    address: {
        street: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        zipcode: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        }
    }
});

const Cliente = mongoose.model("Cliente", clienteSchema);

export default Cliente;
