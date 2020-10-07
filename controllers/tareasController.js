const Tareas = require('../models/Tareas');
const Proyectos = require('../models/Proyectos');

const agregar = async(req,res,next) =>{
    //obtener proyecto actual
    const proyecto = await Proyectos.findOne({where: {url: req.params.url}});
    
    const {tarea} = req.body;
    //estado 0 = incompleto
    const estado = 0;
    const proyectoId = proyecto.id;

    const resultado= await Tareas.create({tarea,estado,proyectoId});

    if(!resultado) return next();

    res.redirect(`/proyectos/${req.params.url}`);

}

const cambiarEstado = async(req,res,next) =>{
    const {id} = req.params;
    const tarea =  await Tareas.findOne({where:{id}});

    let estado = 0;
    if(tarea.estado === estado){
        estado = 1;
    }

    tarea.estado=estado;

    const resultado = await tarea.save();

    if(!resultado) return next();

    res.status(200).send('Actualizado');
}

const eliminar = async(req,res,next) =>{

    const {id} = req.params;
    
    const resultado = await Tareas.destroy({where:{id}});

    if(!resultado) return next();

    res.status(200).send('Tarea Eliminada')
}

module.exports={
    agregar,
    cambiarEstado,
    eliminar
}