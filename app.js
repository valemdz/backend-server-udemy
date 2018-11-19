// Required
var express = require('express');
var mongoose = require('mongoose');


//Inicializar Variables

var app = express();

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if (err) throw err;
    console.log('Base de Datos : \x1b[32m', 'online');

});

//Rutas

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});



//Ejecutar peticiones 

app.listen(3000, () => {
    console.log('Express server puerto 3000 : \x1b[32m', 'online');
});