// Required
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Importar routes 

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

//Inicializar Variables

var app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if (err) throw err;
    console.log('Base de Datos : \x1b[32m', 'online');

});

/////Routes
app.use('/usuario', usuarioRoutes)
app.use('/login', loginRoutes)
app.use('/', appRoutes);


//Ejecutar peticiones 

app.listen(3000, () => {
    console.log('Express server puerto 3000 : \x1b[32m', 'online');
});