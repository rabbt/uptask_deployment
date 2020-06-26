const express = require('express');
const router = express.Router();

const tareasController = require('../controllers/tareasController')
const usuariosController = require('../controllers/usuariosController')

// importar express validator
const { body, check } = require('express-validator');

// importar el controlador
const proyectosController = require('../controllers/proyectosController');
const authController = require('../controllers/authController')

module.exports = function() {
    // ruta para el home
    router.get('/', 
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );
    router.get('/nuevo-proyecto',

        proyectosController.formularioProyecto
    );
    router.post('/nuevo-proyecto', 
    authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    // Listar Proyecto
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );

    // Actualizar el Proyecto
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );  

    router.post('/nuevo-proyecto/:id', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
);    

    //ELiminar proyecto
    router.delete('/proyectos/:url', 
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto);
    
    
    //tareas
    router.post('/proyectos/:url', 
    authController.usuarioAutenticado,
    tareasController.agregarTarea)
    
    //actualizar tarea
    router.patch('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea)

    //borrar
    router.delete('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.eliminarTarea)

    //crear nueva cuenta

    router.get('/crear-cuenta',usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo',usuariosController.confirmarCuenta);

    //iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);

    router.post('/iniciar-sesion', authController.auntenticarUsuario);

    //cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //restablecer contraseña
    router.get('/reestablecer', usuariosController.formRestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);

    router.get('/proyectos-all', 
        authController.usuarioAutenticado,
        proyectosController.proyectosAll,
        tareasController.cambiarEstadoTarea
    );

    // router.patch('/proyectos-all/:id', 
    // authController.usuarioAutenticado,
    // tareasController.cambiarEstadoTarea)

    return router;
}

