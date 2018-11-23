// Required
var express = require('express');

//Inicializar Variables
var app = express();

var Usuario = require('../models/usuario');

//Rutas

//===============================================
//                   Recuperar Usuarios
//===============================================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec((err, usuarios) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'error cargando usuarios',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });
});

//===============================================
//                   Usuario Post
//===============================================

app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    });


});

module.exports = app;