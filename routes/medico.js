//require
var express = require('express');
var mdAuntenticacion = require('../middlewares/autenticacion');


/// Inicializacion de Variables 

var app = express();
var Medico = require('../models/medico');


//===============================================
//       Recuperando Medicos              
//===============================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('hospital', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, medicos) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'error al recuperar medicos',
                    errors: err
                });
            }

            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                });
            });


        });

});


//===============================================
//       Agregando un Medico             
//===============================================

app.post('/', mdAuntenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medico) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error guardando un medico',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medico
        });

    });

});
//===============================================
//       Actualizar Medicos            
//===============================================

app.put('/:id', mdAuntenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error al actualizar un medico. ',
                errors: err
            });
        }

        if (!medico) {
            res.status(400).json({
                ok: false,
                mensaje: 'No existe el medico con id:' + id,
                errors: { message: 'No existe el medico con id:' + id }
            });
        }

        medico.nombre = body.nombre;
        medico.hospital = body.hospital;


        medico.save((err, medivoGuardado) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'error al actualizar un medico. ',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medivoGuardado
            });

        });
    });
});

app.delete('/:id', mdAuntenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error al eliminar un medico. ',
                errors: err
            });
        }

        if (!medicoEliminado) {

            res.status(400).json({
                ok: false,
                mensaje: 'no existe el medico con id' + id,
                errors: { message: 'no existe el medico con id' + id }
            });
        }


        res.status(200).json({
            ok: true,
            medico: medicoEliminado
        });

    });

});

//======================================================
//  Obtener un Medico 
//======================================================

app.get('/:id', (req, res) => {
    var id = req.params.id;

    Medico.findById(id)
        .populate('hospital', 'nombre img')
        .populate('usuario', 'nombre email')
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico con el id ' + id + ' no existe',
                    errors: { message: 'No existe un medico  con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                medico: medico
            });
        });

});

module.exports = app;