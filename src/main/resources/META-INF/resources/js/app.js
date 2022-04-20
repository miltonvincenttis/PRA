/**
 * Alerta generico.
 * 
 * @param titulo 
 * @param alerta 
 */
 function mostrarAlerta(titulo, alerta){
    let divInjetarAlertaGenerico = document.getElementById('divAlertaGenerico')

    let htmlAlertaGenerico = `
     <div  class="modal fade" id="alertaGenerico" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content" style="background-color: #e6e6e6;">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">${titulo}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                ${alerta}
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
       </div> 
    `;

    divInjetarAlertaGenerico.innerHTML = htmlAlertaGenerico;
    $('#alertaGenerico').modal('show')
    divInjetarAlertaGenerico.innerHTML = ""
}