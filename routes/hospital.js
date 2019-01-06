////require

var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

//Inicializar Variables

var app = express();
var Hospital = require('../models/hospital');

//===============================================
//     Recuperando Hospitales              
//===============================================

app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'error cargando hospitales',
                    errors: err
                });
            }

            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                });
            });



        });
});

//===============================================
//      Agregrando un Hospital             
//===============================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
    });

    hospital.save((err, hospital) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error guardando hospitales',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospital
        });
    });
});

//===============================================
//        Actualizando Hospitales           
//===============================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error guardando hospitales ',
                errors: err
            });
        }

        if (!hospital) {
            res.status(400).json({
                ok: false,
                mensaje: 'no se ha podido encontrar el hospital con id: ' + id,
                errors: { message: 'no se ha podido encontrar el hospital con id: ' + id }
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = body.usuario;


        hospital.save((err, hospitalMod) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'error guardando hospitales con usuario',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalMod
            });

        });

    });
});

//===============================================
//        Borrando un Hospital           
//===============================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalEliminado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error eliminando hospital',
                errors: err
            });
        }

        if (!hospitalEliminado) {
            res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con id' + id,
                errors: { message: 'No existe un hospital con id' + id }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalEliminado
        });

    });

});


// ==========================================
// Obtener Hospital por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Hospital.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + ' no existe',
                    errors: { message: 'No existe un hospital  con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospital
            });

        });

});



module.exports = app;