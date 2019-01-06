const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const Usuario = require('../models/usuario')
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');


// default options
app.use(fileUpload());

app.put('/:tipo/:id', function(req, res) {

    var tipo = req.params.tipo;
    var id = req.params.id;
    var tipoColeccion = ['usuarios', 'hospitales', 'medicos'];


    if (tipoColeccion.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion incorrectO',
            errors: { mensaje: 'Los tipos de coleecion permitidos son ' + tipoColeccion.join(', ') }
        });
    }

    if (!req.files) {
        res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { mensaje: 'No selecciono nada' }
        });
    }

    /// Validar el nombre del archivo

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Solo estas extensiones aceptamos

    var extensionesValidas = ['PNG', 'JPG', 'GIF', 'JPEG'];


    if (extensionesValidas.indexOf(extensionArchivo.toUpperCase()) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { mensaje: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    //Nombre personlazado

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, (err) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error al mover archivo ',
                errors: err
            });
        }

        updateColeccion(tipo, id, nombreArchivo, res);
    })


});

function updateColeccion(tipo, id, nombreArchivo, res) {

    switch (tipo) {
        case 'usuarios':
            updateUsuarios(id, nombreArchivo, res);
            break;
        case 'medicos':
            updateMedicos(id, nombreArchivo, res);
            break;
        case 'hospitales':
            updateHospitales(id, nombreArchivo, res);
            break;
    }

}

function updateHospitales(id, nombreArchivo, res) {

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al buscar hospital con id ' + id,
                errors: err
            });
        }

        if (!hospital) {
            res.status(400).json({
                ok: false,
                mensaje: 'No existe el hospital con id ' + id,
                errors: { message: 'No existe el hospital con id ' + id }
            });
        }

        var pathViejo = './uploads/hospitales/' + hospital.img;

        if (fs.existsSync(pathViejo)) {
            fs.unlink(pathViejo);
        }

        hospital.img = nombreArchivo;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al guardar hospital con id ' + id,
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen Acyulizada',
                hospital: hospitalGuardado
            });
        });
    });
}

function updateMedicos(id, nombreArchivo, res) {

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al buscar medico con id ' + id,
                errors: err
            });
        }

        if (!medico) {
            res.status(400).json({
                ok: false,
                mensaje: 'No existe el medico con id ' + id,
                errors: err
            });
        }

        var pathViejo = './uploads/medicos/' + medico.img;

        if (fs.existsSync(pathViejo)) {
            fs.unlink(pathViejo);
        }

        medico.img = nombreArchivo;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al guardar medico con id ' + id,
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen Acyulizada',
                medico: medicoGuardado
            });


        });

    })
}

function updateUsuarios(id, nombreArchivo, res) {

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'error al buscar usuario con id ' + id,
                errors: err
            });
        }

        if (!usuario) {
            res.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario con id ' + id,
                errors: err
            });
        }

        var pathViejo = './uploads/usuarios/' + usuario.img

        if (fs.existsSync(pathViejo)) {
            fs.unlink(pathViejo);
        }

        usuario.img = nombreArchivo;
        usuario.save((err, usuarioGuardado) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'error al guardar usuario con id ' + id,
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen Acyulizada',
                usuarioGuardado: usuarioGuardado
            });
        });
    });
}


module.exports = app;