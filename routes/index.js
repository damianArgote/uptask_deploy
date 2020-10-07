const express = require('express');
const router = express.Router();
const {check} = require('express-validator')

const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports= function(){
    /**Proyectos */
    router.get('/', 
        authController.autenticado,
        proyectosController.home);

    router.get('/nuevo-proyecto',
        authController.autenticado,
        proyectosController.formulario)


    router.post('/nuevo-proyecto',
        authController.autenticado,
        check('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevo);
    
    router.get('/proyectos/:url', 
        authController.autenticado,
        proyectosController.porUrl)

    router.get('/proyectos/editar/:id',
        authController.autenticado,
        proyectosController.formularioEditar)


    router.post('/nuevo-proyecto/:id',
        authController.autenticado,
        check('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizar);

    router.delete('/proyectos/:url',
        authController.autenticado,
        proyectosController.eliminar)

    /**Tarea */
    router.post('/proyectos/:url', 
        authController.autenticado,
        tareasController.agregar)

    router.patch('/tareas/:id', 
        authController.autenticado,
        tareasController.cambiarEstado)

    router.delete('/tareas/:id', 
        authController.autenticado,
        tareasController.eliminar)

    /**Crear nueva cuenta */
    router.get('/crear-cuenta', usuariosController.formCrearCuenta)
    router.post('/crear-cuenta',usuariosController.crearCuenta)
    router.get('/confirmar/:correo',usuariosController.confirmarCuenta)

    /**Iniciar sesion */
    router.get('/iniciar-sesion',usuariosController.formIniciarSesion)
    router.post('/iniciar-sesion',authController.autenticar)

    router.get('/cerrar-sesion',authController.cerrarSesion)

    router.get('/reestablecer', usuariosController.formReestablecer)
    router.post('/reestablecer',authController.enviarToken)
    router.get('/reestablecer/:token', authController.validarToken)
    router.post('/reestablecer/:token', authController.actualizarPassword)


    return router
}



