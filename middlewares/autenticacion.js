//   requires 
var express = require('express');
var jwt = require('jsonwebtoken');
//constantes
var SEED = require('../config/config').SEED;



//===============================================
//                   Verificar Token 
// De aqui en adelante verificara el token |
//                                         <
//===============================================

exports.verificaToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();

        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });


    });
}