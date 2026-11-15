const express = require("express");

const categoriaController = require("../controllers/categoria.controller");
const publicacionController = require("../controllers/publicacion.controller");

const router = express.Router();

//CRUD API categoria sin BD
router.get("/categorias", categoriaController.listarCategorias);
router.get("/categorias/:id", categoriaController.obtenerCategoria);
router.post("/categorias", categoriaController.crearCategoria);
router.put("/categorias/:id", categoriaController.actualizarCategoria);
router.delete("/categorias/:id", categoriaController.eliminarCategoria);

//CRUD API publicacion sin BD
router.get("/publicaciones", publicacionController.listarPublicaciones);
router.get("/publicaciones/:id", publicacionController.obtenerPublicacion);
router.post("/publicaciones", publicacionController.crearPublicacion);
router.put("/publicaciones/:id", publicacionController.actualizarPublicacion);
router.delete("/publicaciones/:id", publicacionController.eliminarPublicacion);

module.exports = router;
