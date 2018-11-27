const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

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

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];


    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
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

        res.status(200).json({
            ok: true,
            mensaje: 'Archivo movido',
            nombreArchivo: nombreArchivo
        });
    })


});


module.exports = app;