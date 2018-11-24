// Required
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


//Inicializar Variables
var app = express();
var Usuario = require('../models/usuario');

///constantes 
var SEED = require('../config/config').SEED;

app.post('/', (req, res) => {

    var body = req.body;


    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error al buc',
                errors: err
            });
        }

        if (!usuarioBD) {
            res.status(400).json({
                ok: false,
                mensage: 'Usuario o password incorrecto',
                errors: { message: 'Credenciales Incorrectas - email ' }
            });

        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            res.status(400).json({
                ok: false,
                mensage: 'Usuario o password incorrecto',
                errors: { message: 'Credenciales Incorrectas - password ' }
            });
        }


        //Crear un token 
        // payload , seed, expiresIn

        usuarioBD.password = '';

        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            id: usuarioBD.id,
            token: token
        });

    });

});


module.exports = app;