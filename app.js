// Required
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Importar routes 

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicosRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadsRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

//Inicializar Variables

var app = express();


///CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    next();
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if (err) throw err;
    console.log('Base de Datos : \x1b[32m', 'online');

});



//Server index config

// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));



/////Routes
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicosRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadsRoutes);
app.use('/img', imagenesRoutes);

//Al ultimo sino siempre entraria por aqui.
app.use('/', appRoutes);


//Ejecutar peticiones 

app.listen(3000, () => {
    console.log('Express server puerto 3000 : \x1b[32m', 'online');
});