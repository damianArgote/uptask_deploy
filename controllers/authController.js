const Usuarios = require('../models/Usuarios');
const passport = require('passport');
const  Sequelize  = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');

const enviarEmail = require('../handlers/email');


const autenticar = passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos Campos son Obligatorios'
    
});

//revisar si el usuario esta logueado o no
const autenticado = (req,res,next) =>{

    //si esta autenticado
    if(req.isAuthenticated()){
        return next();
    }

    //si no esta autenticado
    return res.redirect('/iniciar-sesion');
}

const cerrarSesion = (req,res) =>{
    req.session.destroy(() =>{
        res.redirect('/');
    })
}

const enviarToken = async (req,res) =>{
    //verificar usuario
    const usuario = await Usuarios.findOne({where:{email: req.body.email}});

    //Si no existe
    if(!usuario){
        req.flash('error','No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    //existe
    usuario.token = crypto.randomBytes(20).toString('hex');

    usuario.expiracion = Date.now() + 3600000;

    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //Envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo:'reestablecer-password'
    });

    //terminar ejecucion
    req.flash('correcto','Se envio un mensaje a tu correo')
    res.redirect('/iniciar-sesion')


}

const validarToken = async (req,res) =>{
    const usuario = await Usuarios.findOne({where:{
        token: req.params.token
        }
    });

    if(!usuario){
        req.flash('error','No valido');
        res.redirect('/reestablecer');
    }

    res.render('resetPassword',{
        nombrePagina: 'Reestablecer contraseña'
    })
}

const actualizarPassword = async (req,res) =>{
    //verifica token y fecha de expiracion
    const usuario = await Usuarios.findOne({
        where:{
            token:req.params.token,
            expiracion:{
                [Op.gte] : Date.now()
            }
        }
    });

    if(!usuario){
        req.flash('error','No valido');
        req.redirect('/reestablecer');
    }
    //hashear password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null,
    usuario.expiracion=null;

    await usuario.save();

    req.flash('correcto','Tu Passwored se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}


module.exports={
    autenticar,
    autenticado,
    cerrarSesion,
    enviarToken,
    validarToken,
    actualizarPassword
}