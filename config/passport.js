const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//referencia al modelo
const Usuarios = require('../models/Usuarios');

//local strategy - Login con credenciales
passport.use(
    new LocalStrategy(
        //por default espera un usuario y password
        {
            usernameField:'email',
            passwordField:'password'
        },
        async (email,password,done) =>{
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo:1
                    }
                });
                //verificar password
                if(!usuario.verificarPassword(password)){
                    return done(null,null,{
                        message:'Password incorrecto'
                    })
                }
                //Todo correcto
                return done(null,usuario);

            } catch (error) {
                //El usuario no existe
                return done(null,null,{
                    message:'Esa cuenta no existe'
                })
            }
        }
    )
);

//serializar el usuario
passport.serializeUser((usuario,callback) =>{
    callback(null,usuario);
})

//deserializar
passport.deserializeUser((usuario,callback) =>{
    callback(null,usuario);
})


module.exports=passport;