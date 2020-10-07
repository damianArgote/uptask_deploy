const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const home = async (req,res) =>{

    const usuarioId= res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where:{usuarioId}});

    res.render('index', {
        nombrePagina: 'Proyectos ' + res.locals.year,
        proyectos
    });
}

const formulario = async (req,res) =>{

    const usuarioId= res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    res.render('nuevoProyecto',{
        nombrePagina:'Nuevo Proyecto',
        proyectos
    })
}

const nuevo = async (req,res) =>{
    const usuarioId= res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    const {nombre} = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto':'Agrega un nombre al proyecto'});
    }

    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina:'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //insertar en la bd
        const usuarioId= res.locals.usuario.id;
        await Proyectos.create({nombre,usuarioId});

         res.redirect('/');
    }
}

const porUrl =  async(req,res,next) =>{
    const usuarioId= res.locals.usuario.id;

    const proyectosPromise =  Proyectos.findAll({where:{usuarioId}});
    
    const proyectoPromise =  Proyectos.findOne({
        where:{
            url:req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    //Consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where:{
            proyectoId: proyecto.id
        }
        //include:[
          //  {model:Proyectos}
        //]
    })

    if(!proyecto) return next();

    res.render('tareas',{
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

const formularioEditar =async (req,res) =>{

    const usuarioId= res.locals.usuario.id;

    const proyectosPromise =  Proyectos.findAll({where:{usuarioId}});
    
    const proyectoPromise =  Proyectos.findOne({
        where:{
            url:req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    res.render('nuevoProyecto',{
        nombrePagina:'Editar Proyecto',
        proyectos,
        proyecto
    });
}

const actualizar = async (req,res) =>{
    const usuarioId= res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    const {nombre} = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto':'Agrega un nombre al proyecto'});
    }

    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina:'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //insertar en la bd
        
        await Proyectos.update({ nombre: nombre}, {
            where: {
              id:req.params.id
            }
          });

         res.redirect('/');
    }
}

const eliminar = async(req,res,next) =>{

    //console.log(req.query);
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({where:{url: urlProyecto}});

    if(!resultado) return next();

    res.send('Proyecto Eliminado Correctamente');
}

module.exports={
    home,
    formulario,
    nuevo,
    porUrl,
    formularioEditar,
    actualizar,
    eliminar
}