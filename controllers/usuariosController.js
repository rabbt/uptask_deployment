const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) =>{
    res.render('crearCuenta', {
        nombrePagina : 'Crear cuenta en administrador'
    })
}

exports.formIniciarSesion = (req, res) =>{
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina : 'Iniciar Sesion en App',
        error
    })
}


exports.formInicial = (req, res) =>{
    res.render('crearCuenta', {
        nombrePagina : 'Crear cuenta en administrador'
    })
}


exports.crearCuenta = async (req, res) => {
    //console.log(req.locals.mensaje);
    //res.send('Enviaste el form')

    //leer los datos
    const { email, password }= req.body;

    //manejo de errores usaurio repetido
    //crear usuarios
    try{
        await Usuarios.create({
            email,
            password
        });

        //crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto de usuario
        const usuario = {
            email
        }

        //enviar email
        await enviarEmail.enviar({
            usuario : usuario,
            subject:'confirma tu cuenta app dsi',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        //redirigir al usuario
        req.flash('correcto','Enviamos un correo, confirma tu cuenta')
        res.redirect('/iniciar-sesion')

        res.redirect('/iniciar-sesion')
    }catch (error) {
        //console.log(error)

        req.flash('error', error.errors.map(error => error.message))
        ;
        res.render('crearCuenta', {
            mensajes: req.flash() ,
            nombrePagina : 'Crear cuenta en este app',
            password,
            email, //los dos se llaman igual email:email
        })
    }

    /*
    .then(() => {
        res.redirect('/iniciar-sesion')
    })*/

}

exports.formRestablecerPassword = (req,res)=>{
    res.render('reestablecer', {
        nombrePagina:'Restablecer tu contraseña'
    })
}

//Cambia el estado de una cuenta
exports.confirmarCuenta = async(req,res) => {
    //res.json(req.params.correo);

    const usuario = await Usuarios.findOne({
        where:{
            email: req.params.correo
        }
    });

    //si no existe el usuario
    if(!usuario){
        req.flash('error','No valido');
        res.redirect('/crear-cuenta');
    }

    //gurada nueva copia
    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto','Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}