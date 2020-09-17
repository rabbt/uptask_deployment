const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const Usuarios = require('../models/Usuarios');

//const getAllUsers = require('./usuariosController');

exports.proyectosHome = async (req, res) => {

    // console.log(res.locals.usuario);

    const usuarioId = res.locals.usuario.id;
    
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});


    res.render('index', {
        nombrePagina : 'Proyectos',
        proyectos
    });
}

///////////////////////////////// seccion de vista de proyectos //////////////////////////////
exports.proyectosAll = async (req, res) => {

    // console.log(res.locals.usuario);

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});

    res.render('proyectos', {
        nombrePagina : 'Proyectos',
        proyectos
    });
}

//////////////////////////////////////vista de proyectos empleados/////////////////////////////////////////
exports.empleadosVista = async (req, res) => {

    // console.log(res.locals.usuario);

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});

    res.render('empleados', {
        nombrePagina : 'Vista Proyectos (empleados)',
        proyectos
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////





exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});
    const responsable = res.locals.usuario.responsable;
    const fechaInicio = res.locals.usuario.fechaInicio;
    const fechaFinal = res.locals.usuario.fechaFinal;

    // const usuariosAll = await Usuarios.findAll({
    //     where: {activo:1}
    // });

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos,
        responsable,
        fechaInicio,
        fechaFinal,
    })
}

//////////////////////////////////
/*
exports.getAllUsers = async(req,res) =>{

    console.log("@f Entre a la funcion obtener usuarios")
    const usuarios = await Usuarios.findAll(Usuarios.email)

    
    console.log(usuarios);
    
    res.render('usuarios',
    usuarios)
}
*/
/////////////////////////////////



exports.nuevoProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});
    
    // Enviar a la consola lo que el usuario escriba. 
    // console.log(req.body);

    // validar que tengamos algo en el input
    const responsable = req.body.responsable;
    const nombre = req.body.nombre;
    const fechaInicio = req.body.fechaInicio;
    const fechaFinal = req.body.fechaFinal;

    let errores = [];

    if(!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'})
    }

    if(!responsable) {
        errores.push({'texto': 'Agrega un Responsable al Proyecto'})
    }

    if(!fechaInicio || !fechaFinal){
        errores.push({'texto': 'Agrega una fecha valida al proyecto'})
    } 

    // si hay errores
    if(errores.length > 0 ){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // No hay errores
        // Insertar en la BD.
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre,  responsable, usuarioId, fechaInicio, fechaFinal});
        res.redirect('/proyectos-all');

        
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId  }});

    const proyectoPromise =  Proyectos.findOne({
        where: {
            url: req.params.url, 
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise ]);

    // Consultar tareas del Proyecto actual

    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        },
        // include: [
        //     { model: Proyectos }
        // ]
    });

    if(!proyecto) return next();
    // render a la vista
    res.render('tareas', {
        nombrePagina : 'Tareas del Proyecto',
        proyecto,
        proyectos, 
        tareas
    })
}

/////////////////////////////////////////////proyecto por url empleados ////////////////////////////////////////
exports.proyectoEmpleado = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId  }});

    const proyectoPromise =  Proyectos.findOne({
        where: {
            url: req.params.url, 
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise ]);

    // Consultar tareas del Proyecto actual

    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        },
        // include: [
        //     { model: Proyectos }
        // ]
    });

    if(!proyecto) return next();
    // render a la vista
    res.render('tareas-empleado', {
        nombrePagina : 'Tareas del Proyecto',
        proyecto,
        proyectos, 
        tareas
    })
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;

    const proyectosPromise = Proyectos.findAll({where: { usuarioId  }});

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id, 
            usuarioId,
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise ]);

    // render a la vista
    res.render('nuevoProyecto', {
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto
    })
}



exports.actualizarProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
   

    const proyectos = await Proyectos.findAll({where: { usuarioId }});

    // Enviar a la consola lo que el usuario escriba.
    // console.log(req.body);

    // validar que tengamos algo en el input
    const nombre = req.body.nombre;
    const responsable = req.body.responsable;

    let errores = [];

    if(!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'})
    }

    if(!responsable) {
        errores.push({'texto': 'Agrega un Responsable al Proyecto'})
    }

    // si hay errores
    if(errores.length > 0 ){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // No hay errores
        // Insertar en la BD.
        await Proyectos.update(
            { nombre: nombre , responsable: responsable},
            { where: { id: req.params.id }} 
        );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    // req, query o params
    // console.log(req.query);
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: { url : urlProyecto}});

    if(!resultado){
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}

