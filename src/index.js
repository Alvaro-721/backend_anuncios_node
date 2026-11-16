const express = require("express");
var cors = require('cors')
const router = require("./router");

const app = express();

app.use(cors())
const PORT = process.env.PORT || 3000;

// Middleware para interpretar el JSON del body
app.use(express.json());

app.get("/", function(req, res) {
    return res.json({
        mensaje: "Bienvenido a mi Proyecto backend API",
        endpoints: {
            categorias: "/api/categorias",
            publicaciones: "/api/publicaciones"
        }
    });
});

// Rutas de la API
app.use("/api", router);

// Ruta no encontrada
app.use(function(req, res) {
    return res.status(404).json({ mensaje: `No existe la ruta ${req.method} ${req.originalUrl}` });
});

// Manejo de errores (JSON invalido y errores inesperados)
app.use(function(error, req, res, next) {
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ mensaje: "El cuerpo de la peticion no es un JSON valido" });
    }

    console.error(error);

    return res.status(500).json({ mensaje: "Error interno del servidor" });
});

app.listen(PORT, function() {
    console.log(`Servidor iniciado en: http://127.0.0.1:${PORT}`);
});
