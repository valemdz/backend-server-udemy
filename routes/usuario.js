// Required
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

//Inicializar Variables
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
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

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
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
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });
});


//===============================================
//                   Actualizar Usuario
//===============================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error al buscar el usuario con id' + id,
                errors: err
            });
        }

        if (!usuario) {
            res.status(400).json({
                ok: false,
                mensaje: 'el usuario no se encuentra ',
                errors: err
            });
        }

        usuario.nombre = body.nombre;
        usuario.mail = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar  el usuario con id' + id,
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });


        });

    });

});

//===============================================
//         Eliminarcion de Usuario          
//===============================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error al borrar el usuario con id' + id,
                errors: err
            });
        }

        if (!usuarioEliminado) {
            res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con id' + id,
                errors: { message: 'No existe un usuario con id' + id }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado
        });

    });

});


module.exports = app;