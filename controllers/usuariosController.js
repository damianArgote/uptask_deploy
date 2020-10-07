const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

const formCrearCuenta = (req,res) =>{

    res.render('crearCuenta',{
        nombrePagina:'Crear Cuenta en Uptask'
    })
}

const crearCuenta = async(req,res) =>{
    //leer datos
    const {email,password} = req.body;

    try {
        await Usuarios.create({
            email,
            password
        });

        //crear url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear objeto de usuario
        const usuario = {
            email
        }

        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta en Uptask',
            confirmarUrl,
            archivo:'confirmar-cuenta'
        });

        //redirigir al usuario
        req.flash('correcto','Enviamos un correo, confirma tu cuenta')
        res.redirect('/iniciar-sesion')


        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error',error.errors.map( error => error.message))
        console.log(error);
        res.render('crearCuenta',{
            mensajes:req.flash(),
            nombrePagina:'Crear Cuenta un Uptask',
            email,
            password
            
        })
    }
}

const formIniciarSesion = (req,res) =>{

    const {error} = res.locals.mensajes;

    res.render('iniciarSesion',{
        nombrePagina:'Iniciar Sesion en Uptask',
        error
    })
}

const formReestablecer = (req,res) =>{
    res.render('reestablecer',{
        nombrePagina:'Reestablecer tu contraseña'
    })
}


const confirmarCuenta = async(req,res) =>{
    const usuario = await Usuarios.findOne({
        where:{
            email:req.params.correo
        }
    });

    if(!usuario){
        req.flash('error','No valido')
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto','Cuenta Activada');
    res.redirect('/iniciar-sesion')
}


module.exports={
    formCrearCuenta,
    crearCuenta,
    formIniciarSesion,
    formReestablecer,
    confirmarCuenta
}