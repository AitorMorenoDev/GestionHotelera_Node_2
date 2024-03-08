// Librerías
const express = require('express');
const Usuario = require('../models/usuario');

let router = express.Router();

// Login (redirige a login)
router.get('/login', (req, res) => {
    res.render('login');
});

// Autenticación
router.post('/login', async (req, res) => {
    let login = req.body.login;
    let password = req.body.password;
    const usuario = await Usuario.findOne({login: login, password: password});

    if (!usuario) {
        let error = {mensaje: 'Usuario o contraseña incorrectos'};
        res.render('login', {error: error});
    } else {
        req.session.login = usuario;
        res.redirect('/');
    }
});


// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;

