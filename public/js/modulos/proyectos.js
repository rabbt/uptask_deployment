import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){

    btnEliminar.addEventListener('click',(e) => {
        const urlProyecto = e.target.dataset.proyectoUrl

        //console.log(urlProyecto);

        //return;

        Swal.fire({
            title: 'Deseas borrar este proyecto',
            text: "Un proyecto eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText:'No, Cancelar'
        }).then((result) => {
            if (result.value) {
                //enviar peticion a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                //console.log(url)

                //return;

                axios.delete(url, { params: {urlProyecto}})
                    .then(function(respuesta){
                        console.log(respuesta)
                            Swal.fire(
                                'Proyecto Eliminado',
                                'El proyecto se ha eliminado',
                                'success'
                            )
                
                            //redireccionamos al inicio
                            setTimeout(() => {
                                window.location.href = '/'
                            }, 1000);
                    })
                    .catch(() => {
                        Swal.fire({
                            type:'error',
                            title:'hubo un error',
                            text: 'no se pudo eliminar el proyecto'

                        })
                    })
            }
        })
    })
}

export default btnEliminar;