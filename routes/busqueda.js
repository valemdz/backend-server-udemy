//require 

var express = require('express');

//Inicializar variables

var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


//========================================================
//         Busqueda GENERAL en todas las colecciones          
//======================================================


app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i'); //insensitive

    Promise.all([buscarHospitales(busqueda, regexp),
            buscarMedicos(busqueda, regexp),
            buscarUsuarios(busqueda, regexp)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                mensaje: 'Busqueda de todo ' + busqueda,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

//===============================================
//    Buscar por collecion                
//===============================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regexp);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regexp);
            break;
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regexp);
            break;
        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son hospital, medico y usuario',
                errors: { message: 'Los tipos de busqueda solo son hospitales, medicos y usuarios' }
            });

    }

    promesa.then(resultado => {
        res.status(200).json({
            ok: true,
            mensaje: 'Busqueda en tabla ' + tabla + ' ' + busqueda,
            [tabla]: resultado,
        });
    });

});


function buscarHospitales(busqueda, regexp) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regexp })
            .populate("usuario", ' nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('error buscando hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regexp) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regexp })
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre')
            .exec((err, medicos) => {
                if (err) {
                    reject('error buscando los medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, regexp) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, ' nombre email role img google ')
            .or([{ 'nombre': regexp }, { 'email': regexp }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('error al buscar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}


/*app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i');


    Hospital.find({ nombre: regexp }, (err, hospitales) => {

        res.status(200).json({
            ok: true,
            mensaje: 'Busqueda de todo ' + busqueda,
            hospitales: hospitales
        });

    });


});*/


module.exports = app;