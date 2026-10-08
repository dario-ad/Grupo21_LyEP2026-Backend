import "dotenv/config";

import express from "express";

import conectarDB from "./database.js";

import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.get("/api", (req, res) => {
    res.json({ mensaje: "API funcionando correctamente" });
});

conectarDB();


const PORT = 3001;

app.get("/", (req, res) => {
    res.send("Backend funcionando correctamente");
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});