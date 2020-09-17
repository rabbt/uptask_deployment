const Sequelize = require('sequelize');
const db = require('../config/db')
const slug = require ('slug');
const shortid = require('shortid');

const Proyectos = db.define('proyectos', {
    id : {
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    
    nombre: Sequelize.STRING(100),
    url: Sequelize.STRING(100),
    
    responsable: Sequelize.STRING(10),
    
    //TODO: BUSCAR PARAMETRO DE (DATE)
    fechaInicio: Sequelize.STRING(100),

    fechaFinal: Sequelize.STRING(100),


    
}, {
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre, proyecto.responsable).toLowerCase()

            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos;
