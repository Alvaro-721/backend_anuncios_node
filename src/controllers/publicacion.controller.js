// CRUD de publicaciones en memoria (sin base de datos)

const { existeCategoria } = require("./categoria.controller");

let publicaciones = [
    {
        id: 1,
        titulo: "Laptop HP 15",
        descripcion: "Laptop en buen estado, 8GB de RAM y 256GB SSD",
        precio: 4500,
        categoriaId: 1,
        ubicacion: "Lima",
        fechaPublicacion: "2026-11-01T10:00:00.000Z"
    },
    {
        id: 2,
        titulo: "Sofa de 3 cuerpos",
        descripcion: "Sofa de cuero sintetico en buen estado",
        precio: 1200,
        categoriaId: 2,
        ubicacion: "Arequipa",
        fechaPublicacion: "2026-11-05T15:30:00.000Z"
    }
];

let ultimoId = 2;

const buscarPorId = (id) => publicaciones.find((publicacion) => publicacion.id === id);

// Devuelve un mensaje de error o null si la categoria es valida
const validarCategoria = (categoriaId) => {
    if (categoriaId === undefined || categoriaId === null) {
        return null; // la categoria es opcional
    }

    const id = Number(categoriaId);

    if (!Number.isInteger(id) || id <= 0) {
        return "El categoriaId debe ser un numero entero mayor a 0";
    }

    if (!existeCategoria(id)) {
        return `No existe la categoria con id ${id}`;
    }

    return null;
};

// Devuelve un mensaje de error o null si el precio es valido
const validarPrecio = (precio) => {
    if (precio === undefined || precio === null || precio === "") {
        return "El precio es obligatorio";
    }

    const precioNumerico = Number(precio);

    if (!Number.isFinite(precioNumerico) || precioNumerico < 0) {
        return "El precio debe ser un numero mayor o igual a 0";
    }

    return null;
};

// GET /api/publicaciones (filtro opcional: ?categoriaId=1)
const listarPublicaciones = (req, res) => {
    const { categoriaId } = req.query;

    if (categoriaId === undefined) {
        return res.status(200).json({ total: publicaciones.length, publicaciones });
    }

    const id = Number(categoriaId);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ mensaje: "El categoriaId debe ser un numero entero mayor a 0" });
    }

    const filtradas = publicaciones.filter((publicacion) => publicacion.categoriaId === id);

    return res.status(200).json({ total: filtradas.length, publicaciones: filtradas });
};

// GET /api/publicaciones/:id
const obtenerPublicacion = (req, res) => {
    const id = Number(req.params.id);
    const publicacion = buscarPorId(id);

    if (!publicacion) {
        return res.status(404).json({ mensaje: `No existe la publicacion con id ${id}` });
    }

    return res.status(200).json(publicacion);
};

// POST /api/publicaciones
const crearPublicacion = (req, res) => {
    const { titulo, descripcion, precio, categoriaId, ubicacion } = req.body;

    if (!titulo || typeof titulo !== "string" || !titulo.trim()) {
        return res.status(400).json({ mensaje: "El titulo es obligatorio" });
    }

    const errorPrecio = validarPrecio(precio);

    if (errorPrecio) {
        return res.status(400).json({ mensaje: errorPrecio });
    }

    const errorCategoria = validarCategoria(categoriaId);

    if (errorCategoria) {
        return res.status(400).json({ mensaje: errorCategoria });
    }

    ultimoId += 1;

    const nuevaPublicacion = {
        id: ultimoId,
        titulo: titulo.trim(),
        descripcion: descripcion === undefined || descripcion === null ? "" : String(descripcion).trim(),
        precio: Number(precio),
        categoriaId: categoriaId === undefined || categoriaId === null ? null : Number(categoriaId),
        ubicacion: ubicacion === undefined || ubicacion === null ? "" : String(ubicacion).trim(),
        fechaPublicacion: new Date().toISOString()
    };

    publicaciones.push(nuevaPublicacion);

    return res.status(201).json(nuevaPublicacion);
};

// PUT /api/publicaciones/:id (actualizacion parcial)
const actualizarPublicacion = (req, res) => {
    const id = Number(req.params.id);
    const publicacion = buscarPorId(id);

    if (!publicacion) {
        return res.status(404).json({ mensaje: `No existe la publicacion con id ${id}` });
    }

    const { titulo, descripcion, precio, categoriaId, ubicacion } = req.body;

    if (titulo !== undefined) {
        if (typeof titulo !== "string" || !titulo.trim()) {
            return res.status(400).json({ mensaje: "El titulo no puede estar vacio" });
        }

        publicacion.titulo = titulo.trim();
    }

    if (precio !== undefined) {
        const errorPrecio = validarPrecio(precio);

        if (errorPrecio) {
            return res.status(400).json({ mensaje: errorPrecio });
        }

        publicacion.precio = Number(precio);
    }

    if (categoriaId !== undefined) {
        const errorCategoria = validarCategoria(categoriaId);

        if (errorCategoria) {
            return res.status(400).json({ mensaje: errorCategoria });
        }

        publicacion.categoriaId = categoriaId === null ? null : Number(categoriaId);
    }

    if (descripcion !== undefined) {
        publicacion.descripcion = descripcion === null ? "" : String(descripcion).trim();
    }

    if (ubicacion !== undefined) {
        publicacion.ubicacion = ubicacion === null ? "" : String(ubicacion).trim();
    }

    return res.status(200).json(publicacion);
};

// DELETE /api/publicaciones/:id
const eliminarPublicacion = (req, res) => {
    const id = Number(req.params.id);
    const indice = publicaciones.findIndex((publicacion) => publicacion.id === id);

    if (indice === -1) {
        return res.status(404).json({ mensaje: `No existe la publicacion con id ${id}` });
    }

    const [publicacionEliminada] = publicaciones.splice(indice, 1);

    return res.status(200).json({
        mensaje: "Publicacion eliminada correctamente",
        publicacion: publicacionEliminada
    });
};

module.exports = {
    listarPublicaciones,
    obtenerPublicacion,
    crearPublicacion,
    actualizarPublicacion,
    eliminarPublicacion
};
