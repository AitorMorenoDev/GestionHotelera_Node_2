// Librerías
const mongoose = require('mongoose');
const express = require('express');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const dateFilter = require('nunjucks-date-filter');
const methodOverride = require('method-override');
const session = require('express-session');

// Enrutadores
const habitaciones = require(__dirname + '/routes/habitaciones');
const limpiezas = require(__dirname + '/routes/limpiezas');
const auth = require(__dirname + '/routes/auth');

dotenv.config();

// Conexión a la BD
mongoose.connect(process.env.URLBD).then(() => {});

// Servidor Express
let app = express();

// Configuración de Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
}).addFilter('date', dateFilter);

// Asignación del motor de plantillas
app.set('view engine', 'njk');

// Middleware para peticiones
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Middleware methodOverride para PUT y DELETE
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// Middleware para sesiones
app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: false
}));

// Middleware para vistas
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Middleware para estilos
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

// Middleware para subida de archivos
app.use('/uploads', express.static(__dirname + '/uploads'));

// Redirección a la página de habitaciones
app.get('/', (req, res) => {
    res.redirect('/habitaciones');
});

// Use de los enrutadores
app.use('/habitaciones', habitaciones);
app.use('/limpiezas', limpiezas);
app.use('/auth', auth);

// Puesta en marcha del servidor
app.listen(process.env.PUERTO);
