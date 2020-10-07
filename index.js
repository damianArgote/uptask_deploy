const express = require('express');
const routes = require('./routes');
const path = require('path');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

require('dotenv').config({path:'varaibles.env'})

//crear conexion a db
const db = require('./config/db');
//modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado a db'))
    .catch(error => console.log(error))



const app = express();

//habilitar archivos staticos
app.use(express.static('public'));

//habilitar pug
app.set('view engine','pug');


//habilitar express json
app.use(express.urlencoded({extended:true}));


//agregar flash messages
app.use(flash());

//cookie parser
app.use(cookieParser());

//sesiones
app.use(session({
    secret:'supersecreto',
    resave:false, 
    saveUninitialized:false
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//usar el helpers
app.use((req,res,next) =>{
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
})

//fecha actual
app.use((req,res,next) =>{
    const fecha = new Date();
    res.locals.year = fecha.getFullYear()
    next();
})

//Añadir carpeta vistas
app.set('views',path.join(__dirname,'./views'));



//rutas
app.use('/',routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port,host,() =>{
    console.log('El servidor esta funcionando')
});
