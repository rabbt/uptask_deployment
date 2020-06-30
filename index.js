const express = require('express');
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport')

//email confirmacion
require('./handlers/email')

// importar las variables
require('dotenv').config({ path: 'variables.env' });

//helpesrs y funciones
const helpers = require('./helpers');

//crear la conexion a la BD
const db = require('./config/db');

//importat el modelo 
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
.then(() => console.log('Conectando al servidor'))
.catch(error => console.log(error));

const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

//habilitar body parser para lerr datos en el form
app.use(bodyParser.urlencoded({extended: true}));


// Habilitar Pug
app.set('view engine', 'pug');

// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

app.use(cookieParser());

//sesiones
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//pasra var dump a la app
app.use((req, res, next) => {
    //res.locals.year =  2020;
    console.log(req.user);
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    console.log(res.locals.usuario);
    next();
})

//aprendiendo Middleware
app.use((req, res, next) => {
    console.log('Yo soy middleware')
    next();
});

app.use('/',routes() );

//servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando')
})
