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
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicosRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadsRoutes);

//Al ultimo sino siempre entraria por aqui.
app.use('/', appRoutes);


//Ejecutar peticiones 

app.listen(3000, () => {
    console.log('Express server puerto 3000 : \x1b[32m', 'online');
});