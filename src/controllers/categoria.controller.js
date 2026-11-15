// CRUD de categorias en memoria (sin base de datos)

let categorias = [
    { id: 1, nombre: "Tecnologia", descripcion: "Equipos electronicos y accesorios" },
    { id: 2, nombre: "Hogar", descripcion: "Muebles y articulos para el hogar" },
    { id: 3, nombre: "Vehiculos", descripcion: "Autos, motos y repuestos" }
];

let ultimoId = 3;

const buscarPorId = (id) => categorias.find((categoria) => categoria.id === id);

// Permite que otros controllers (por ejemplo publicacion) validen la categoria
const existeCategoria = (id) => Boolean(buscarPorId(Number(id)));

const nombreDuplicado = (nombre, idExcluir) => categorias.some(
    (categoria) => categoria.nombre.toLowerCase() === nombre.toLowerCase() && categoria.id !== idExcluir
);

// GET /api/categorias
const listarCategorias = (req, res) => {
    return res.status(200).json({ total: categorias.length, categorias });
};

// GET /api/categorias/:id
const obtenerCategoria = (req, res) => {
    const id = Number(req.params.id);
    const categoria = buscarPorId(id);

    if (!categoria) {
        return res.status(404).json({ mensaje: `No existe la categoria con id ${id}` });
    }

    return res.status(200).json(categoria);
};

// POST /api/categorias
const crearCategoria = (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
        return res.status(400).json({ mensaje: "El nombre es obligatorio" });
    }

    const nombreLimpio = nombre.trim();

    if (nombreDuplicado(nombreLimpio)) {
        return res.status(409).json({ mensaje: `La categoria "${nombreLimpio}" ya existe` });
    }

    ultimoId += 1;

    const nuevaCategoria = {
        id: ultimoId,
        nombre: nombreLimpio,
        descripcion: descripcion === undefined || descripcion === null ? "" : String(descripcion).trim()
    };

    categorias.push(nuevaCategoria);

    return res.status(201).json(nuevaCategoria);
};

// PUT /api/categorias/:id (actualizacion parcial)
const actualizarCategoria = (req, res) => {
    const id = Number(req.params.id);
    const categoria = buscarPorId(id);

    if (!categoria) {
        return res.status(404).json({ mensaje: `No existe la categoria con id ${id}` });
    }

    const { nombre, descripcion } = req.body;

    if (nombre !== undefined) {
        if (typeof nombre !== "string" || !nombre.trim()) {
            return res.status(400).json({ mensaje: "El nombre no puede estar vacio" });
        }

        const nombreLimpio = nombre.trim();

        if (nombreDuplicado(nombreLimpio, id)) {
            return res.status(409).json({ mensaje: `La categoria "${nombreLimpio}" ya existe` });
        }

        categoria.nombre = nombreLimpio;
    }

    if (descripcion !== undefined) {
        categoria.descripcion = descripcion === null ? "" : String(descripcion).trim();
    }

    return res.status(200).json(categoria);
};

// DELETE /api/categorias/:id
const eliminarCategoria = (req, res) => {
    const id = Number(req.params.id);
    const indice = categorias.findIndex((categoria) => categoria.id === id);

    if (indice === -1) {
        return res.status(404).json({ mensaje: `No existe la categoria con id ${id}` });
    }

    const [categoriaEliminada] = categorias.splice(indice, 1);

    return res.status(200).json({
        mensaje: "Categoria eliminada correctamente",
        categoria: categoriaEliminada
    });
};

module.exports = {
    listarCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    existeCategoria
};
