// Librerías
const express = require('express');

// Modelos
let Habitacion = require(__dirname + '/../models/habitacion');
let Limpieza = require(__dirname + '/../models/limpieza');
const autenticacion = require('../utils/autenticacion');

let router = express.Router();

// Añadir limpieza (redirige al formulario)
router.get('/nueva/:id', autenticacion, async (req, res) => {
    const habitacion = await Habitacion.findById(req.params.id);
    if (!habitacion) {
        res.render('error', {error: 'Habitación no encontrada'});
        return;
    }
    res.render('limpiezas_nueva', {habitacion: habitacion});
});


// Listado de todas las limpiezas de una habitación
router.get('/:id', async (req, res) => {

    const habitacion = await Habitacion.findById(req.params.id);
    const limpiezas = await Limpieza.find({habitacion: req.params.id}).sort('-fecha');

    if (!habitacion) {
        res.render('error', {error: 'Habitación no encontrada'});
        return;
    }

    res.render('limpiezas_listado', {habitacion: habitacion, limpiezas: limpiezas});
});

// Añadir limpieza
router.post('/:id', autenticacion, (req, res) => {
    let nuevaLimpieza = new Limpieza({
        habitacion: req.params.id,
    });

    if (req.body.fecha) {
        nuevaLimpieza.fecha = req.body.fecha;
    }

    if(req.body.observaciones) {
        nuevaLimpieza.observaciones = req.body.observaciones;
    }

    nuevaLimpieza.save().then(() => {
        // Modificación de la fecha de la última limpieza de la habitación
        Habitacion.findByIdAndUpdate(req.params.id, { ultimaLimpieza: nuevaLimpieza.fecha }, { new: true })
            .then(habitacionActualizada => {
                if (!habitacionActualizada) {
                    res.render('error', {error: 'Error actualizando la limpieza de la habitación'});
                }
                res.redirect(req.baseUrl + '/' + req.params.id);
            }).catch(() => {
                res.render('error', {error: 'Error actualizando la fecha de la última limpieza de la habitación'});
            });
    }).catch(() => {
        res.render('error', {error: 'Error añadiendo la limpieza'});
    });
});

module.exports = router;