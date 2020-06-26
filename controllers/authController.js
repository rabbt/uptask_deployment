const passport = require('passport');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto')//genera el token

const bcrypt = require('bcrypt-nodejs');

const Usuarios = require('../models/Usuarios');

const enviarEmail = require('../handlers/email');

exports.auntenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//funcion para revisar si el usaurio esta logeado o no

exports.usuarioAutenticado = (req, res, next) => {
    //si el usuario esta auntenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }

    //si no esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// Funcion para cerrar sesion 
exports.cerrarSesion = (req, res) =>{
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
      })
    }
     
    // Genera un token , si el usuario es valido
    exports.enviarToken = async(req, res) => {
        // Verificar que el usuario existe
        const {email} = req.body
        const usuario = await Usuarios.findOne({where: { email }});
     
        // Si no existe el usuario
        if(!usuario){
            req.flash('error', 'No existe esa cuenta');
            res.redirect('/reestablecer');
        }
        //Usuario Existe
        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expiracion = Date.now() + 3600000;
     
        // Guardar los nuevos datos
        await usuario.save();
     
        // url de reset
        const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
        //console.log(resetUrl);

        //envia el correo con el token
        await enviarEmail.enviar({
            usuario : usuario,
            subject:'Password Reset',
            resetUrl,
            archivo: 'reestablecer-password'
        });

        //terminar
        req.flash('correcto', 'Se envio un mensaje a tu correo')
        res.redirect('/iniciar-sesion');

    }
     
     exports.validarToken = async (req, res) => {
            const usuario = await Usuarios.findOne({
                where: {
                    token: req.params.token
                }
            });
            
            // Si no encuentra el usuario
            if(!usuario) {
                req.flash('error', 'No Valido');
                res.redirect('/reestablecer');
            }
     
            /// Formulario para generar el password
            res.render('resetPassword', {
                nombrePagina : 'Reestablecer Contraseña'
            })
     
        }
     
        // Cambiar el password por uno nuevo
        exports.actualizarPassword = async (req, res) =>{
            console.log(req.params.token);
            const usuario = await Usuarios.findOne({
                where: {
                    token: req.params.token,
                    expiracion: {
                        [Op.gte] : Date.now()
                    }
                }
            });
            
     
            //Verificamos si el usuario existe
            if(!usuario){
                req.flash('error' ,'No valido');
                res.redirect('/reestablecer');
            }
     
            //hashear  el nuevo  password
            usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
            usuario.token = null;
            usuario.expiracion = null;
     
            // Guarda el nuevo password
            await usuario.save();
            
            req.flash('correcto', ' Tu password se ha modificado correctamente');
            res.redirect('/iniciar-sesion');

     
     
     
        }