const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const peliculas = require('./peliculas.json');


// Obtener la lista de todas las peliculas(GET).
app.get("/peliculas/all", (req, res) => {
    if (peliculas.data.length > 0) {
        res.status(200).json({
            estado: 1,
            mensaje: "Peliculas encontradas",
            peliculas: peliculas.data,
        });
    } else {
        res.status(404).json({
            estado: 0,
            mensaje: "Peliculas no encontradas",
        });
    }
});
// Obtener un pelicula por su ID (GET).
app.get("/peliculas/:id", (req, res) => {
    const id = req.params.id;
    const pelicula = peliculas.data.find(pelicula => pelicula.id == id)

    if (pelicula) {
        res.status(200).json({
            estado: 1,
            mensaje: "Pelicula encontrada",
            pelicula: pelicula,
        });
    } else {
        res.status(404).json({
            estado: 0,
            mensaje: "Pelicula no encontrada",
        });
    }
});
// Agregar una nueva pelicula (POST).
app.post("/peliculas/", (req, res) => {
    const { titulo, director, genero, añoLanzamiento, calificacion } = req.body;

    var fecha = new Date();
    var anioActual = fecha.getFullYear();

    if (titulo == undefined || director == undefined || calificacion == undefined || añoLanzamiento == undefined || genero == undefined) {
        res.status(400).json({
            estado: 0,
            mensaje: "Rellena todos los campos",
        });
    } else if (calificacion < 0 || calificacion > 10) {
        res.status(400).json({
            estado: 0,
            mensaje: "La calificacion debe ser entre 0 y 10",
        });
    } else if (añoLanzamiento < 1895 || añoLanzamiento > anioActual) {
        res.status(400).json({
            estado: 0,
            mensaje: `El año de lanzamiento debe ser entre 1895 y ${anioActual}`,
        });
    } else {
        const id = peliculas.data.length + 1;

        const pelicula = {
            id: id,
            titulo: titulo,
            director: director,
            genero: genero,
            añoLanzamiento: añoLanzamiento,
            calificacion: calificacion,
        };

        peliculas.data.push(pelicula);

        if (peliculas.data.length > id - 1) {
            res.status(200).json({
                estado: 1,
                mensaje: "Pelicula creada correctamente",
                pelicula: pelicula,
            });
        } else {
            res.status(500).json({
                estado: 0,
                mensaje: "No se pudo agregar la pelicula, error de servidor",
            });
        }
    }
});

// Actualizar un pelicula por su ID (PUT).
app.put("/peliculas/:id", (req, res) => {
    const { id } = req.params;
    const { titulo, director, genero, añoLanzamiento, calificacion } = req.body;
    var fecha = new Date();
    var anioActual = fecha.getFullYear();

    if (titulo == undefined || director == undefined || calificacion == undefined || añoLanzamiento == undefined || genero == undefined) {
        res.status(400).json({
            estado: 0,
            mensaje: "Rellena todos los campos",
        });
    } else if (calificacion < 0 || calificacion > 10) {
        res.status(400).json({
            estado: 0,
            mensaje: "La calificacion debe ser entre 0 y 10",
        });
    } else if (añoLanzamiento < 1895 || añoLanzamiento > anioActual) {
        res.status(400).json({
            estado: 0,
            mensaje: `El año de lanzamiento debe ser entre 1895 y ${anioActual}`,
        });
    } else {
        const posActualizar = peliculas.data.findIndex((pelicula) => pelicula.id == id);

        if (posActualizar >= 0) {
            peliculas.data[posActualizar].titulo = titulo;
            peliculas.data[posActualizar].director = director;
            peliculas.data[posActualizar].calificacion = calificacion;
            peliculas.data[posActualizar].añoLanzamiento = añoLanzamiento;
            peliculas.data[posActualizar].genero = genero;
            res.status(200).json({
                estado: 1,
                mensaje: "Pelicula actualizada correctamente",
                pelicula: peliculas.data[posActualizar],
            });
        } else {
            res.status(404).json({
                estado: 0,
                mensaje: "Pelicula no encontrada",
            });
        }
    }
});
// Eliminar un pelicula por su ID (DELETE).
app.delete("/peliculas/:id", (req, res) => {
    const { id } = req.params;

    const peliculaIndex = peliculas.data.findIndex((pelicula) => pelicula.id == id);

    if (peliculaIndex >= 0) {
        peliculas.data.splice(peliculaIndex, 1);
        res.status(200).json({
            estado: 1,
            mensaje: "pelicula eliminada correctamente",
        });
    } else {
        res.status(404).json({
            estado: 0,
            mensaje: "Pelicula no encontrada",
        });
    }
});

app.listen(port, () => {
    console.log("Server listening on port: ", port);
});