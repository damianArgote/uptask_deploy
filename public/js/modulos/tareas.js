import axios from 'axios';
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';
const tareas = document.querySelector('.listado-pendientes');

if(tareas){

    tareas.addEventListener('click', e =>{
        if(e.target.classList.contains('fa-check-circle')){
            
            const icono = e.target;
            const idTarea= icono.parentElement.parentElement.dataset.tarea;

            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url,{idTarea})
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
            
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement,
                  idTarea = tareaHTML.dataset.tarea;
                  
                  Swal.fire({
                    title: "Desea Borrar esta Tarea?",
                    text: "Una tarea eliminada no se puede recuperar",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si,Borrar",
                    cancelButtonText: "No, Cancelar",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      //enviar peticion a axios
                        const url = `${location.origin}/tareas/${idTarea}`;

                        axios.delete(url,{params: {idTarea}})
                            .then(function(respuesta){
                                if(respuesta.status === 200){
                                    //eliminar nodo
                                    tareaHTML.parentElement.removeChild(tareaHTML);

                                    //alerta
                                    Swal.fire(
                                        'Tarea Eliminada',
                                        respuesta.data,
                                        'success'
                                    )
                                }

                                actualizarAvance();
                            })
                    }
                })
                
        
        }
    })

}

export default tareas;