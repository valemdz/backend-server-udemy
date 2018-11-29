// Required
var express = require('express');

//Inicializar Variables
var app = express();
var fs = require('fs');
var path = require('path');

//Rutas

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImg = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        var pathNoImg = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImg);
    }

});

module.exports = app;