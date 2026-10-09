import dotenv from "dotenv";

dotenv.config({ path: "server/.env" });

import express from "express";

import conectarDB from "./database.js";

import cors from "cors";

import clientesRoutes from "./routes/clientesRoutes.js"

const app = express();

app.use(express.json());

app.use(cors());

conectarDB();


app.get("/api", (req, res) => {
    res.json({ mensaje: "API funcionando correctamente" });
});



app.get("/", (req, res) => {
    res.send("Backend funcionando correctamente");
});

//Rutas del CRUD de clientes

app.use("/api/clientes", clientesRoutes);


const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});