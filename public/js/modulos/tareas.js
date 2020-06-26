import axios from "axios";
import Swal from 'sweetalert2'

import {actualizarAvance} from '../funciones/avance';


const tareas = document.querySelector('.listado-pendientes');

if(tareas){

    tareas.addEventListener('click',e => {
        
        ////////////////////////////////
        if(e.target.classList.contains('fa-check-circle')){
            //console.log('actualizando...')
            //console.log(e.target.classList);

            const icono = e.target
            const idTarea = 
            icono.parentElement.parentElement.dataset.tarea;

            //console.log(idTarea);
            const url = `${location.origin}/tareas/${idTarea}`;
            
            axios.patch(url, { idTarea })
                .then(function(respuesta){
                    //console.log(respuesta);
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')){
            //console.log(e.target);

            const tareaHTML = e.target.parentElement.parentElement,
            idTarea = tareaHTML.dataset.tarea;
            // console.log(tareaHTML);
            // console.log(idTarea);

            Swal.fire({
                title: 'Deseas borrar esta tarea',
                text: "Un tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText:'No, Cancelar'
            }).then((result) => {
                if (result.value) { 
                    //console.log('eliminando...')

                    const url = `${location.origin}/tareas/${idTarea}`;
                    //enviar delete por medio de axios
                    axios.delete(url, { params:{idTarea} })
                        .then(function(respuesta){
                            //console.log(respuesta)
                            if(respuesta.status === 200){
                                //Eliminar el nodo
                                tareaHTML.parentElement.removeChild(tareaHTML)
                                
                                //alerta option
                                Swal.fire(
                                    'Tarea Eliminada',
                                    respuesta.data,
                                    'success'
                                )

                                actualizarAvance();

                            }
                        });
                }
            })
        }
    });

}

export default tareas;