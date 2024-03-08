// Librerías */
const express = require('express');

// Modelos */
let Habitacion = require(__dirname + '/../models/habitacion');
const {uploadIncs, uploadHabs} = require('../utils/uploads');
const autenticacion = require('../utils/autenticacion');

const tiposDeHabs = Habitacion.schema.path('tipo').enumValues;
let router = express.Router();

// Listado de todas las habitaciones
router.get('/', (req, res) => {
    Habitacion.find()
        .then((resultado) => {
            if (!resultado || resultado.length === 0)
                throw new Error();
            else 
                res.render('habitaciones_listado', {habitaciones: resultado});
        }).catch(() => {
            res.render('error', {error: 'No hay habitaciones registradas'});
        });
});

// Añadir habitación (redirige al formulario)
router.get('/nueva', autenticacion, (req, res) => {
    res.render('habitaciones_nueva', {tiposDeHabs: tiposDeHabs});
});

// Ficha de una habitación
router.get('/:id', (req, res) => {
    Habitacion.findById(req.params.id)
        .then((resultado) => {
            if (!resultado)
                throw new Error();
            else 
                res.render('habitaciones_ficha', {habitacion: resultado});
        }).catch(() => {
            res.render('error', {error: 'Habitación no encontrada'});
        });
});

// Inserción de habitación
router.post('/', autenticacion, uploadHabs.single('imagen'), (req, res) => {
    let nuevaHabitacion = new Habitacion({
        numero: req.body.numero,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
    });

    if(req.file)
        nuevaHabitacion.imagen = req.file.filename;

    nuevaHabitacion.save().then(() => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('habitaciones_nueva', {errores: error.errors, datos:req.body, tiposDeHabs: tiposDeHabs});
    });  
});

// Editar habitación (redirige al formulario de edición)
router.get('/edicion/:id', autenticacion, (req, res) => {
    Habitacion.findById(req.params.id).then(resultado => {
        if(resultado)
            res.render('habitaciones_edicion', {habitacion: resultado});
        else
            throw new Error();
    }).catch(() => {
        res.render('error', {error: 'Habitación no encontrada'});
    });
});

// Modificación básica de habitación
router.post('/edicion/:id', uploadHabs.single('imagen'), autenticacion, (req, res) => {

    let habitacionEditada = {
        numero: req.body.numero,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        precio: req.body.precio
    };

    if (req.file) {
        habitacionEditada.imagen = req.file.filename;
    }

    Habitacion.findByIdAndUpdate(req.params.id, habitacionEditada, {new: true, runValidators: true})
        .then(resultado => {
            if(resultado)   
                res.redirect(req.baseUrl);
            else
                throw new Error();
        }).catch(error => {
            res.render('habitaciones_nueva', {errores: error.errors});
        });
});

// Borrado de habitación
router.delete('/:id', autenticacion, (req, res) => {
    Habitacion.findByIdAndRemove(req.params.id)
        .then(() => {
            res.redirect(req.baseUrl);
        }).catch(() => {
            res.render('error', {error: 'Error borrando la habitación'});
        });
});

// Añadir incidencia
router.post('/:id/incidencias', autenticacion, uploadIncs.single('imagen'), async (req, res) => {
    try {
        let habitacion = await Habitacion.findById(req.params.id);

        if (habitacion) {
            let incidencia = {
                descripcion: req.body.descripcion,
            };

            if (req.file) {
                incidencia.imagen = req.file.filename;
            }

            habitacion.incidencias.push(incidencia);
            await habitacion.save();
            res.render('habitaciones_ficha', {habitacion: habitacion});

        } else {
            throw new Error();
        }
    } catch (error) {
        res.render('error', {error: 'Error añadiendo la incidencia'});
    }
});

// Actualizar incidencia
router.put('/:idHab/incidencias/:idInc', autenticacion, async (req, res) => {
    try {
        let habitacion = await Habitacion.findById(req.params['idHab']);
        if (habitacion) {
            let incidencia = habitacion.incidencias.filter(i => i._id == req.params['idInc']);
            if (incidencia.length > 0) {
                incidencia[0].fin = Date.now();
                await habitacion.save();
                res.render('habitaciones_ficha', {habitacion: habitacion});
            } else {
                throw new Error();
            }
        } else {
            throw new Error();
        }
    } catch (error) {
        res.render('error', {error: 'Error actualizando incidencia'});
    }
});

module.exports = router;