// Esquema de las incidencias registradas en las habitaciones

const mongoose = require('mongoose');

let incidenciaSchema = new mongoose.Schema({
    // descripción de la incidencia: no funciona el aire acondicinado, etc
    descripcion: {
        type: String,
        trim: true, 
        required: [true, 'La descripción de la incidencia es obligatoria.']
    },
    // fecha en la que se registra la incidencia
    inicio: {
        type: Date,
        required: [true, 'La fecha de inicio de la incidencia es obligatoria.'],
        default: Date.now
    }, 
    // fecha en la que se resuelve la incidencia
    fin: {
        type: Date, 
        required: false
    },
    // imagen de la incidencia
    imagen: {
        type: String,
        required: false
    }
});

// Esquema y modelo que representa cada habitación del hotel.

let habitacionSchema = new mongoose.Schema({
    // número de habitación
    numero: {
        type: Number,
        required: [true, 'El número de habitación es obligatorio.'],
        min: [1,'El número de habitación debe ser mayor que 0.'],
        max: [50,'El número de habitación debe ser 51 o inferior.'],
        unique: true
    },
    // tipo de habitación
    tipo: {
        type: String,
        required: [true, 'El tipo de habitación es obligatorio.'],
        enum: ['individual', 'doble', 'familiar', 'suite']
    },        
    // descripción de la habitación: número de camas, tipo de cama, si tiene terraza, si tiene vistas, televisor, etc
    descripcion: {
        type: String,
        required: [true, 'La descripción de la habitación es obligatoria.'],
        trim: true
    }, 
    // fecha de la última limpieza
    ultimaLimpieza: {
        type: Date,
        required: true,
        default: Date.now
    },    
    // precio de la habitación por noche
    precio: {
        type: Number,
        required: [true, 'El precio de la habitación es obligatorio'],
        min: [0,'El precio de la habitación debe ser 0 o superior.'],
        max: [300,'El precio de la habitación debe ser de 300 o inferior.']
    },
    // imagen de la habitación
    imagen: {
        type: String,
        required: false
    },

    // Array de incidencias producidas en la habitación
    incidencias: [incidenciaSchema]
});

let Habitacion = mongoose.model('habitaciones', habitacionSchema);

module.exports = Habitacion;