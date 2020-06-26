const Proyectos = require ('../models/Proyectos');
const Tareas = require('../models/Tareas')

exports.agregarTarea = async (req, res, next) => {
   // res.send('Enviado');

   //obtener el proyecto actual
   const proyecto = await Proyectos.findOne({ where: { url:req.params.url } });

   //  leer el input
   const {tarea }= req.body;
   
   //estado a 0 y id del 'proyecto'
   const estado = 0;

   const proyectoId = proyecto.id;

   //insertar en la base dedatos
   const resultado = await Tareas.create({tarea, estado, proyectoId})

   if(!resultado){
       return next();
   }

   //redireccionar 
   res.redirect(`/proyectos/${req.params.url}`);

}

exports.cambiarEstadoTarea = async (req, res) => {
    //console.log(req.params) //params query no funciona para aceder a los datos
    const { id } = req.params;
    const tarea = await Tareas.findOne({where: { id }})
    
    console.log(tarea)

    //cambair el estado
    let estado = 0;
    if(tarea.estado === estado){
        estado = 1;
    }

    tarea.estado = estado;

    const resultado =  await tarea.save();

    if(!resultado) return next();

    res.status(200).send('Actualizando')

}

exports.eliminarTarea = async (req, res) => {
   //console.log(req.params); //params solo si usa delete prefernete
   
   const { id } = req.params;

   //eliminar la tarea
   const resultado = await Tareas.destroy({where : { id : id }})

   if(!resultado) return next();

    res.status(200).send(' Tarea Eliminada Correctamente')
}