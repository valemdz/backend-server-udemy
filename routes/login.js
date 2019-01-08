// Required
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


//Inicializar Variables
var app = express();
var Usuario = require('../models/usuario');

///constantes 
var SEED = require('../config/config').SEED;


///Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


//===============================================
//     Autenticacion Google              
//===============================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(err => {
            return res.status(400).json({
                ok: false,
                mensaje: 'Token no valido'
            })
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando el usuario' + googleUser.email,
                errs: err
            })
        }


        if (usuarioDB) {

            if (usuarioDB.google === false) {

                return res.status(400).json({
                    ok: false,
                    mensage: 'Debe utilizar autenticacion normal',
                    errors: { message: 'Debe utilizar autenticacion normal' }
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    id: usuarioDB.id,
                    token: token,
                    menu: obtenerMenu(usuarioDB.role)
                });
            }

        } else {

            var usuario = new Usuario();

            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al crear usuario',
                        errors: err
                    });
                }

                var token = jwt.sign({ usuario: usuarioGuardado }, SEED, { expiresIn: 14400 });

                return res.status(201).json({
                    ok: true,
                    usuario: usuarioGuardado,
                    id: usuarioGuardado.id,
                    token: token,
                    menu: obtenerMenu(usuarioGuardado.role)
                });
            });
        }

    });


});


//===============================================
//    Autenticacion Normal               
//===============================================

app.post('/', (req, res) => {

    var body = req.body;


    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error al buc',
                errors: err
            });
        }

        if (!usuarioBD) {
            res.status(400).json({
                ok: false,
                mensage: 'Usuario o password incorrecto',
                errors: { message: 'Credenciales Incorrectas - email ' }
            });

        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            res.status(400).json({
                ok: false,
                mensage: 'Usuario o password incorrecto',
                errors: { message: 'Credenciales Incorrectas - password ' }
            });
        }


        //Crear un token 
        // payload , seed, expiresIn

        usuarioBD.password = '';

        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            id: usuarioBD.id,
            token: token,
            menu: obtenerMenu(usuarioBD.role)
        });

    });

});

function obtenerMenu(ROLE) {

    let menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'Progress Bar', url: '/progress' },
                { titulo: 'Graficas', url: '/graficas1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'Rxjs', url: '/rxjs' }
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                //{ titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Hospitales', url: '/hospitales' },
                { titulo: 'Medicos', url: '/medicos' },
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }

    return menu;

}


module.exports = app;