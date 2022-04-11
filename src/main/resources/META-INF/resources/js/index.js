//-----------------------------------------------------------------------------

/**
 * Funcao pra ajudar a debugar.
 * @param {*} algo 
 */
function tester(algo){
    console.log('Tester| '+algo);
}

//-----------------------------------------------------------------------------

/**
 * Cria um cookie com dados de autenticacao falso, pra testes.
 * 
 */
function criarFakeAutenticacao(){
    //--- neste estado, o usuário não está autenticado
    Cookies.remove('appToken');
    Cookies.remove('appNomeUsuario');    
    Cookies.remove('appPerfilUsuario');

    //--- neste estado o usuario esta autenticado
    //Cookies.set('appToken','9876543210')
    //Cookies.set('appNomeUsuario','Milton Lima Vincenttis');
    //Cookies.set('appPerfilUsuario','admin');
}

//-----------------------------------------------------------------------------

/**
 * Verifica se há um token registrado nos cookies da App.
 * Se não tem o token redirecionar para a pagina Entrar.html.
 */
function verificarAutenticacaoDeUsuario(){

    //--- cria fake autenticacao pra testes: deve ser comentado em produção
    //criarFakeAutenticacao(); 
      
    //--- Verifica se há o token no cookie
    let appToken = Cookies.get('appToken');

    //--- debug
    tester(appToken);

    let estaLogado = appToken !== undefined;

    //--- não encontrou então redirecionar pra pagina de entrar.html
    if(!estaLogado){
        //--- debug 
        tester('Não esta autenticado');

        //--- deve ir pra pagina Entrar.html
        window.location.href = 'entrar.html';        
    }else{
        //--- debug: está autenticado e deve exibir o nome
        tester('Está autenticado');

        let appNomeUsuario = Cookies.get('appNomeUsuario');
        //--- carregar todos dados do servidor e renderizar na pagina principal

        //--- exibir o nome do usuario no canto superior direito da pagina index.html => #usuarioLogado
        document.querySelector('#usuarioLogado').innerHTML = appNomeUsuario;

        //---debug
        tester(appNomeUsuario);

        //--- verifica se usuario é admin ou comum, e permite apenas certas opção de menu para comum
        let appPerfilUsuario = Cookies.get('appPerfilUsuario');

        //--- se usuario comum: remove as opções: Pessoas e Tipos de Problemas
        if(appPerfilUsuario == 'comum'){
            let pessoasMenu = document.querySelector('#pessoasMenu');
            let tipoProblemasMenu = document.querySelector('#tiposProblemasMenu');
            let dashboardMenu = document.querySelector('#dashboardMenu');

            pessoasMenu.parentElement.removeChild(pessoasMenu);
            tipoProblemasMenu.parentElement.removeChild(tipoProblemasMenu);
            dashboardMenu.parentElement.removeChild(dashboardMenu);
        }


    }

    tester('Todos cockies: ' + document.cookie);  

}

//-----------------------------------------------------------------------------

/**
 * Remove as informações que estão em cookies:
 * appToken
 * appNomeUsuario
 * appPerfilUsuario
 */
function sair(){
    Cookies.remove('appToken')
    Cookies.remove('appNomeUsuario')
    Cookies.remove('appPerfilUsuario')

    window.location.href = 'entrar.html'
}

//-----------------------------------------------------------------------------

/**
 * Requisita todas as denuncias que estão no banco de dados.
 * 
 */
function carregarDenuncias(){
    requisitarDenunciasBackend();
}

//-----------------------------------------------------------------------------

/**
 * JSON: nenhum
 * request: GET /denuncias
 */
 function requisitarDenunciasBackend() {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/denuncias";

    xhr.open("GET", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if( xhr.response.length != 0){
                  var denuncias = JSON.parse(xhr.responseText);
                  desligarIconePaginaSemDenuncias();
                  mostrarDenunciasComentariosSolucoes(denuncias);
                }
                resultado = true;
            }else{
                tester("Erro: "+this.statusText)
                ligarIconePaginaSemDenuncias();
            }
        }
    };
    xhr.send();
    return resultado;
}

//-----------------------------------------------------------------------------

/**
 * Apresenta o icone 'pagina sem denuncias'.
 */
function ligarIconePaginaSemDenuncias(){
    document.querySelector('#iconeSemDenuncias').style.display = 'visible'
}

//-----------------------------------------------------------------------------

/**
 * Desliga o ícone 'pagina sem denuncias'.
 * 
 */
 function desligarIconePaginaSemDenuncias(){
    document.querySelector('#iconeSemDenuncias').style.display = 'none'
}

//-----------------------------------------------------------------------------

/**
 * Liga o painel de denuncias.
 * 
 */
function ligarPainelDenuncias(){
    document.querySelector("#painelDenuncias").style.display = 'visible'
}

//-----------------------------------------------------------------------------

/**
 * Desliga o painel de denuncias.
 * 
 */
 function desligarPainelDenuncias(){
    document.querySelector("#painelDenuncias").style.display = 'none'
}

//-----------------------------------------------------------------------------

/**
 * Apresenta todas as Denuncias ao usuário.
 * Recebe um array contendo objetos denuncias.
 * 
 * IDs pra referenciar os elementos.
 * Denuncia                 outros ids:
 * ------------------------------------
 * id=denuncia              idDenuncia 
 * id=denunciaPessoaNome    idPessoa
 * id=denunciaTPD
 * id=denunciaDescricao
 * id=botaoCurtir           idCurtida
 * 
 */
 function mostrarDenunciasComentariosSolucoes(denuncias){
    document.body.style.zoom = "80%";
    
    let row = document.getElementById("rowId");
    
    //--- limpamos a tela se existir uma anterior e injetamos novo conteudo
    row.innerHTML = ``;

    //--- renderiza uma coluna por Denuncia contendo Comentarios e Solucoes ou não.
    for(i=0; i < denuncias.length; i++){
      row.insertAdjacentHTML('beforeend',(produzirHTMLDenuncias(denuncias[i])))
    }
 }

 //-----------------------------------------------------------------------------

/**
 * Gera HTML para Denuncia.
 * 
 * @param solucoes Array de objetos Denuncia
 * @returns HTML produzido
 */
 function produzirHTMLDenuncias(denuncia){
    let temComentarios = denuncia.comentarios.length != 0
    let temSolucoes = denuncia.solucoes.length != 0;
    let comentariosHTML = ``;
    let solucoesHTML = ``;

    let denunciaHTML = `
     <div class="col-md-6 col-lg-6">
        <div class="card" id="denuncia">
            <div class="row">
                <div class="col-auto my-auto">
                    <div id="denunciaPessoaNome" idPessoa="${denuncia.pessoa.id}" class="badgeDenuncia text-center" title="Denúncia por">${denuncia.pessoa.nome}</div>
                </div>
                <div class="col">
                    <div class="card-body">
                        <h5 id="denunciaTPD" class="card-title">${denuncia.tipoDeProblema.descricao}</h5>
                        <h6 id="denunciaDatahora" class="card-subtitle mb-2 text-muted">${obterData(denuncia.dataHora)} - ${obterHora(denuncia.dataHora)}</h6>
                        <p id="denunciaDescricao" class="card-text">${denuncia.descricao}</p>
                        <i title="comentário" idDenuncia="${denuncia.id}" class="far fa-sticky-note fa-lg" onclick="comentario(event);"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i title="solução"    idDenuncia="${denuncia.id}" class="far fa-edit fa-lg" onclick="solucao(event);"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span id="botaoCurtir-${denuncia.id}">
                            ${produzirHTMLIconeCurtir(denuncia)}
                        </span>
                        <i title="editar"   idDenuncia="${denuncia.id}" class="fa fa-user-edit fa-lg"  onclick="editarDenuncia(event);"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i title="remover"  idDenuncia="${denuncia.id}" class="far fa-trash-can fa-lg" onclick="removerDenuncia(event); disabled='disabled'"></i>
                    </div>
                </div>
            </div>
        </div>   
    ${temComentarios? ``: `</div>`}`;  //--- não fecha a div se tiver comentários, fecha se não tiver

    if(temComentarios){
        comentariosHTML = produzirHTMLComentarios(denuncia.comentarios);
    }
    if(temSolucoes){
        solucoesHTML = produzirHTMLSolucoes(denuncia.solucoes);
    }

    return denunciaHTML + comentariosHTML + solucoesHTML + `</div>`;
 }

//-----------------------------------------------------------------------------

/**
 * Gera HTML para Comentarios.
 * 
 * @param solucoes Array de objetos Comentario.
 * @returns HTML produzido
 */
function produzirHTMLComentarios(comentarios){
    let comentariosHTML = ``;

    for(var i=0; i < comentarios.length; i++){
        comentariosHTML += `
        <div class="card" id="comentario" idDenuncia="${comentarios[i].id}">
            <div class="row">
                <div class="col-auto my-auto">
                    <div id="comentarioPessoaNome" idPessoa="${comentarios[i].pessoa.id}" class="badgeComentario text-center" title="Comentário por">${comentarios[i].pessoa.nome}</div>
                </div>
                <div class="col">
                    <div class="card-body">
                        <h6 id="comentarioDatahora" class="card-subtitle mb-2 text-muted">${obterData(comentarios[i].dataHora)} - ${obterHora(comentarios[i].dataHora)}</h6>
                        <p id="comentarioDescricao" class="card-text">${comentarios[i].descricao}</p>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i title="editar" class="fa fa-user-edit fa-lg" onclick="editarComentario(this)"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i title="remover" class="far fa-trash-can fa-lg" onclick="removerComentario(this)"></i>
                    </div>
                </div>
            </div>
        </div>

        `;
    }
    return comentariosHTML;
}

//-----------------------------------------------------------------------------

/**
 * Gera HTML para Solucoes.
 * 
 * @param solucoes Array de objetos Solucao
 * @returns HTML produzido
 */
function produzirHTMLSolucoes(solucoes){
    let solucoesHTML = ``;

    for(var i=0; i < solucoes.length; i++){
        solucoesHTML += `
        <div class="card" id="solucao" idDenuncia="${solucoes[i].id}">
            <div class="row">
                <div class="col-auto my-auto text-center" >
                    <div id="solucaoPessoaNome" idPessoa="${solucoes[i].pessoa.id}" class="badgeSolucao text-center" title="Solução por">${solucoes[i].pessoa.nome}</div>
                </div>
                <div class="col">
                    <div class="card-body">
                        <h6 id="solucaoDatahora" class="card-subtitle mb-2 text-muted">${obterData(solucoes[i].dataHora)} - ${obterHora(solucoes[i].dataHora)}</h6>
                        <p id="solucaoDescricao" class="card-text">${solucoes[i].descricao}</p>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i title="editar" class="fa fa-user-edit fa-lg" onclick="editarSolucao(this)"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i title="remover" class="far fa-trash-can fa-lg" onclick="removerSolucao(this)"></i>
                    </div>
                </div>
            </div>
        </div>

        `;
    }
    return solucoesHTML;     
}

//-----------------------------------------------------------------------------

/**
 * Cria a tag <i> botão de curtir em Denuncia.
 * @param denuncia 
 */
function produzirHTMLIconeCurtir(denuncia){
    let idCurtida = obterIdCurtida(denuncia)
    let iconeCurtir = `
        <i style="zoom=80%" id="botaoCurtir" idCurtida="${idCurtida}" idDenuncia="${denuncia.id}" title="${idCurtida?'descurtir':'curtir'}" class="${botaoDeCurtidoOuNaoCurtido(denuncia)}" onclick="curtir(event);"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    `;

    return iconeCurtir
}

//-----------------------------------------------------------------------------

/**
 * Retira a data que esta no formato 2022-03-26T23:23:00.106062.
 */
function obterData(data){
    let date = new Date(data);
    return (date.getDate() < 10 ? "0"+date.getDate() : date.getDate())+"/"+(date.getMonth()+1 < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1)+"/"+date.getFullYear()
}

//-----------------------------------------------------------------------------

/** 
 * Retira a hora que esta no formato 2022-03-26T23:23:00.106062.
 */
function obterHora(data){
    let date = new Date(data)
    return (date.getHours() < 10 ? "0"+date.getHours():date.getHours())+":"+(date.getMinutes()<10 ? "0"+date.getMinutes() :date.getMinutes())+":"+(date.getSeconds() < 10? "0"+date.getSeconds() : date.getSeconds());
}

//-----------------------------------------------------------------------------

/**
 * Retorna botão padrão ou botão que sinaliza curtido.
 * @param denuncia JSON
 * @returns string
 */
function botaoDeCurtidoOuNaoCurtido(denuncia){
    let foiCurtido = false;

    //--- botão padrão é o de curtir
    let botaoPadrao = "far fa-thumbs-up fa-lg"

    //--- o solido é que sinaliza que foi curtido
    let botaoCurtido = "fa-solid fa-thumbs-up fa-lg"

    //--- verificar se tem curtidas, pois são várias que podem ter de varios usuários diferentes
    let temCurtidas = denuncia.curtidas.length != 0

    //--- se tem curtidas vamos ver se o usuario corrente curtiu: appToken é o ID do usuário logado
    if(temCurtidas){
        let usuarioLogado = Cookies.get("appToken")

        for(var i=0; i < denuncia.curtidas.length; i++){
            //--- comparamos o id do usuario corrente com o id de todas as curtidas
            if( usuarioLogado === denuncia.curtidas[i].pessoa.id){
                foiCurtido = true
                break
            }
        }
    }
    if(foiCurtido){
        return botaoCurtido
    }
    return botaoPadrao
}

//-----------------------------------------------------------------------------

/**
 * Obtem o idDenuncia se foi curtida pelo usuário corrente.
 */
function obterIdCurtida(denuncia){
    let idCurtida = ""
    let idPessoa = Cookies.get('appToken')
    let curtidas = denuncia.curtidas

    for(let i=0; i<curtidas.length; i++){
        //--- comparamos id usuario corrente id pessoa da curtida
        if(idPessoa == curtidas[i].pessoa.id){
            idCurtida = curtidas[i].id;
            return idCurtida
            break
        }
    }
    return idCurtida

}

//-----------------------------------------------------------------------------
// Funcionalidade para Denuncia
//-----------------------------------------------------------------------------

/**
 * Essa funcão é disparada pelo menu Denúncias.
 * Criamos o HTML por templates e incluimos dados vindos do backend.
 */
function abrirDialogoIncluirDenuncia(){
   if(!requisitarTiposDeProblemasBackend(produzirHTMLSelectTiposDeProblemas)){
      //--- avisamos se não tiver Tipo de Problema cadastrado ou der algum problema.
      alert('Fale com um usuário Admin. Houve um problema na lista de Tipos de Problemas.')
      return;
   }

   //--- abrimos o dialogo e esperamos sair
   $('#dialogoIncluirDenuncia').modal('show');

}

//-----------------------------------------------------------------------------

/**
 * Generica pq Menu Tipos de Problemas tambem usa.
 * 
 * JSON: nenhum
 * request: GET /tiposdeproblemas
 */
 function requisitarTiposDeProblemasBackend(funcaoAChamar) {
   let resultado = false;
   let async = false;
   let xhr = new XMLHttpRequest();
   let url = "http://localhost/tiposdeproblemas";

   xhr.open("GET", url, async);
   xhr.setRequestHeader("Content-Type", "application/json");
   xhr.onload = function () {
       if (xhr.readyState === 4) {
           if (xhr.status === 200) {
               if( xhr.response.length != 0){
                 var tiposDeProblemas = JSON.parse(xhr.responseText);
                 /**
                  * funcaoAChamar pode ser: produzirHTMLSelectTiposDeProblemas ou produzirHTMLListagemTiposDeProblemas
                  */
                 funcaoAChamar(tiposDeProblemas)
               }
               resultado = true;
           }else{
               tester("Erro: "+this.statusText)
           }
       }
   };
   xhr.send();
   return resultado;
}

//-----------------------------------------------------------------------------

/**
 * Recebe um Array de JSON: ver tipoDeProblema.json no backend.
 * 
 * Gera 'options' de um select com id 'selectTiposDeProblemas' que existe em index.html.
 *  
 * -faz requisição ao backend: 
 * -injetamos apenas as tags <option>:
 *  
 *                <select class="form-control" id="selectTiposDeProblemas">
 *                   <option value="${tiposDeProblemas[i].id}">${tiposDeProblemas[i].descricao}</option>
 *                </select>
 * 
 */
function produzirHTMLSelectTiposDeProblemas(tiposDeProblemas){
   //--- ponto de injeção do HTML
   let injetarHTMLAqui = document.getElementById('selectIncluirTiposDeProblemas')

   //--- limpamos 'options' conteudo de outras chamadas.
   injetarHTMLAqui.innerHTML = ``;

   let selectTiposDeProblemas = `
         <option value=""></option>
   `;

   for(var i=0; i<tiposDeProblemas.length; i++){
      selectTiposDeProblemas += `
         <option value="${tiposDeProblemas[i].id}">${tiposDeProblemas[i].descricao}</option>
      `;
   }

   injetarHTMLAqui.innerHTML = selectTiposDeProblemas;
    
}

//-----------------------------------------------------------------------------

/**
 * Cria Denuncia enviando os dados do Dialogo pro backend em formato JSON: 
 * -ver o arquivo denuncia-requisicao.json no backend.
 * 
 * {
 *    "descricao": "String",
 *    "datahora": "LocalDateTime",
 *    "idPessoa": "String",
 *    "idTipoDeProblema": "String"
 *  }
 * 
 */
function criarDenuncia(event){

   //--- pega o select 
   let selectTiposDeProblemas = document.getElementById('selectIncluirTiposDeProblemas');   

   //--- obtem o id na opção escolhida
   let idTipoDeProblema = selectTiposDeProblemas.value;

   //--- pega a descricao
   let descricaoTipoDeProblemas = document.getElementById('incluirDenunciaDescricao').value

   let idPessoa = Cookies.get('appToken');

   //--- vamos gerar um JSON 
   let json = JSON.stringify({"descricao":descricaoTipoDeProblemas,"dataHora":new Date().toISOString(),"idPessoa":idPessoa,"idTipoDeProblema":idTipoDeProblema});

   tester(json)
   
   if(incluirDenunciaBackend(json)){
      alert('Sua Denúncia foi criada com sucesso!')
      carregarDenuncias();
   }

}

//-----------------------------------------------------------------------------

/**
 * Incluir Denuncia.
 * 
 * JSON: nenhum
 * request: GET /tiposdeproblemas
 */
 function incluirDenunciaBackend(json) {
   let resultado = false;
   let async = false;
   let xhr = new XMLHttpRequest();
   let url = "http://localhost/denuncias";

   xhr.open("POST", url, async);
   xhr.setRequestHeader("Content-Type", "application/json");
   xhr.onload = function () {
       if (xhr.readyState === 4) {
          switch(xhr.status){
            case 201: /** ok **/           
                resultado = true;
                break;
            case 400: /** bad request:  id de Pessoa ou id de Tipo de Problema não foram  **/
            case 404: /** not found:    id de Pessoa ou id de Tipo de Problema não foram não existem  **/    
            case 500:
                alert('Erro de servidor: '+this.statusText)
                resultado = false;
                break;
          }
       }
   };
   xhr.send(json);
   return resultado;
}

//-----------------------------------------------------------------------------

/**
 * botão curtido: fa-solid fa-thumbs-up fa-lg
 * Qualquer um pode curtir uma Denuncia.
 * 
 * 
 * @param javascript event 
 */
function curtir(event){
    //--- descobrir em qual tag Denuncia foi clicado pra curtir
    let iconeCurtir = event.target;

    //--- descobrir se a denuncia está curtida inspecionando o atributo idCurtida: se foi a operação é descurtir, se não, curtir.
    let idCurtida = iconeCurtir.getAttribute('idCurtida')
    let idDenuncia = iconeCurtir.getAttribute('idDenuncia')
    let resultado = false;
    let argumentos = null;
    let jsonResposta = null

    if(!idCurtida){
        //--- curtir
        let jsonRequisicao = JSON.stringify({"idDenuncia": idDenuncia,"idPessoa":Cookies.get('appToken')})

        argumentos = { jsonRequisicao, jsonResposta}
        resultado = curtirBackend(argumentos, 'POST')
        
    }else{
        //--- descurtir: enviar o Id da curtida pra remoção e da denuncia pra retornar JSON
        jsonRequisicao = JSON.stringify({"id":idCurtida,"idDenuncia": idDenuncia})       
        argumentos ={ jsonRequisicao, jsonResposta}
        resultado = curtirBackend(argumentos, 'DELETE')            
    }

    //--- é necessário reconstruir a tag <i>
    if(resultado){
        let divIconeCurtir = document.getElementById(`botaoCurtir-${idDenuncia}`);
        divIconeCurtir.removeChild(iconeCurtir);
        divIconeCurtir.innerHTML = produzirHTMLIconeCurtir(argumentos.jsonResposta)
    }        
    
}

//-----------------------------------------------------------------------------

/**
 * Incluir: JSON requisicao: {"idDenuncia":idDenuncia, "idPessoa":Cookies.get('appToken')}
 * metodoHTTP: POST /denuncias/curtidas
 * 
 * Remover: JSON requisição: {"id":idCurtida, "idDenuncia":idDenuncia}
 * metodoHTTP: DELETE /denuncias/curtidas
 * 
 * JSON resposta: ver denuncias-lista.json no backend.
 * 
 * Nota: 
 * -resultadoOK vai ter o conteudo de resultado.
 * -jsonResposta vai ter o conteudo da denuncia.    
 */
 function curtirBackend(argumento, metodoHTTP) {
    let jsonRequisicao = argumento.jsonRequisicao
    let jsonResposta = argumento.jsonResposta

    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/denuncias/curtidas";
 
    xhr.open(metodoHTTP, url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
           switch(xhr.status){
             case 200: /** ok **/           
                 argumento.jsonResposta = JSON.parse(xhr.responseText);
                 resultado = true;
                 break;
             case 400: /** bad request:  id de Pessoa ou id da curtida não foram enviados **/
             case 404: /** not found:    id de Pessoa ou id de curtida não existe  **/    
             case 500:
                 alert('Erro de servidor: '+this.statusText)
                 resultado = false;
                 break;
           }
        }
    };
    xhr.send(argumento.jsonRequisicao);

    return resultado;
 }

//-----------------------------------------------------------------------------

/**
 * Somente o criador da Denuncia pode editar.
 */
function editarDenuncia(denuncia){
    if(!temPermissao(PERMISSAO.editarDenuncia, denuncia.pessoa.id)){
        alert('Só a Pessoa que criou a Denúncia pode remove-la.')
    }else{
        alert('Pode editar.')
    }
}

//-----------------------------------------------------------------------------

/**
 * Somente o criador da Denuncia pode remover.
 */
function removerDenuncia(denuncia){
    //--- passamos o Id da Pessoa que criou a Denuncia como argumento.   
    if(!temPermissao(PERMISSAO.removerDenuncia, denuncia.pessoa.id)){
        alert('Só a Pessoa que criou a Denúncia pode remove-la.')
    }else{
        alert('Pode remover.')
    }

}

//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Funcionalidade para Comentario
//-----------------------------------------------------------------------------

/**
 * Cria Comentario: qualquer um pode comentar.
 */
 function comentario(denuncia){
   alert('Criar Comentario')
}

//-----------------------------------------------------------------------------

/**
 * Somente o criador do Comentário pode editar.
 * 
 */
function editarComentario(comentario){
    temPermissao(PERMISSAO.editarComentario, '123');
}

//-----------------------------------------------------------------------------

/**
 * Somente o criador do Comentario pode remover.
 */
function removerComentario(comentario){
    alert('Remover Comentario')
    temPermissao(PERMISSAO.removerComentario, '123');
}

//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Funcionalidade para Solucao
//-----------------------------------------------------------------------------

/**
 * Cria Solucao: Só usuário Admin pode.
 * 
 * @param  denuncia 
 */
 function solucao(denuncia){
   if(!temPermissao(PERMISSAO.criarSolucao)){
       alert('Somente usuário Admin pode Incluir Solução.')
   }
}

//-----------------------------------------------------------------------------

/**
 * Somente o criador da Solucao pode editar, e deve ser Admin (ser ou não ser Admin é alteravel)
 */
function editarSolucao(solucao){
    alert('Editar Solucao')
    temPermissao(PERMISSAO.editarSolucao, '123');
}

//-----------------------------------------------------------------------------

/**
 * Somente o criador da Solucao pode remover, e deve ser Admin (ser ou não ser Admin é alteravel)
 */
function removerSolucao(solucao){
    alert('Remover Solucao')
    temPermissao(PERMISSAO.removerSolucao, '123');
}

//-----------------------------------------------------------------------------
// Funcionalidade para Permissão
//-----------------------------------------------------------------------------

/**
 * Tratamento das Funcionalidades possiveis.
 * 
 * Denuncia: 
 *  -criar                  qualquer um pode
 *  -criar comentario       qualquer um pode
 *  -criar solucao          só admin pode
 *  -curtir                 qualquer um pode
 *  -editar                 só a mesma pessoa que criou a Denuncia (verificar usuário logado contra o id da Pessoa que criou)
 *  -remover                só a mesma pessoa que criou a Denuncia (verificar usuário logado contra o id da Pessoa que criou)
 *                          restrição: Se a Denuncia tiver Comentario ou Solução não pode remover. (verificado no backend)
 * Comentario:
 *  -editar                 só a mesma pessoa que criou o Comentario (verificar usuário logado contra o id da Pessoa que criou)
 *  -remover                so a mesma pessoa que criou o Comentario (verificar usuário logado contra o id da Pessoa que criou)
 * 
 * Solucao:
 *  -editar                 só admin pode, e o mesmo admin que criou a Solucao (verificar usuário logado contra o id da Pessoa que criou)
 *  -remover                só admin pode, e o mesmo admin que criou a Solucao (verificar usuário logado contra o id da Pessoa que criou)
 * 
 * Nomes para se identificar as permissões:
 * 
 * Permissões Denuncia:
 * criarDenuncia
 * criarComentario
 * criarSolucao
 * curtirDenuncia
 * editarDenuncia
 * removerDenuncia
 * 
 * Permissões Comentario:
 * editarComentario
 * removerComentario
 * 
 * Permissões Solucao:
 * editarSolucao
 * removerSolucao
 * 
 * 
 * Argumentos dessa função:
 * 
 * permissao:  ver PERMISSAO
 * objeto: Denuncia, Comentario, Solucao, Curtida
 * 
 * O chamador da funcao 'temPermissão' sabe pegar o Id da Pessoa na pagina. 
 * 
 */
 const PERMISSAO = {
    criarDenuncia: 1,
    criarComentario: 2,
    criarSolucao: 3,
    curtirDenuncia: 4,
    editarDenuncia: 5,
    removerDenuncia: 6,
    editarComentario: 7,
    removerComentario: 8,
    editarSolucao: 9,
    removerSolucao: 10
}

const USUARIO = {
    comum: 'comum',
    admin: 'admin'
}

//-----------------------------------------------------------------------------

function temPermissao(permissao, idCriador){
    let temPermissao = false;

    switch(permissao){
        case PERMISSAO.editarDenuncia:
        case PERMISSAO.editarComentario:
        case PERMISSAO.removerDenuncia:
        case PERMISSAO.removerComentario:
            alert('Só o dono pode');
            temPermissao = verificarPermissaoSoDonoPode(idCriador)
            break;
        case PERMISSAO.criarDenuncia:    
        case PERMISSAO.criarComentario:
        case PERMISSAO.curtirDenuncia:
            alert('Qualquer um pode')
            temPermissao = true;
            break;
        case PERMISSAO.criarSolucao:
            alert('Só Admin pode')
            temPermissao = verificarPermissaoSomenteAdminPode()
            break;
        case PERMISSAO.editarSolucao:    
        case PERMISSAO.removerSolucao:
            alert('Só o dono pode e tem que ser Admin')
            temPermissao = verificarPermissaoSomenteAdminDonoPode(idCriador)
            break;
        default: 
            alert('Passou uma permissão desconhecida');
    }
    return temPermissao;
}

//-----------------------------------------------------------------------------

/**
 * Verifica se quem criou o Objeto é quem está operando o App.
 * 
 * @param objeto: Denuncia, Comentario Solucao, Curtida
 */
function verificarPermissaoSoDonoPode(idCriador){
    //--- comparamos com o id do usuario logado
    let idUsuarioLogado = Cookies.get('appToken');

    return idCriador == idUsuarioLogado;
}

//-----------------------------------------------------------------------------

/**
 * Verifica se quem está operando o App é Admin
 */
function verificarPermissaoSomenteAdminPode(){
    return (USUARIO.admin == Cookies.get('appPerfilUsuario'));
}

//-----------------------------------------------------------------------------

/**
 * Verifica se quem criou o Objeto é quem está operando o App e ele é Admin.
 * 
 */
function verificarPermissaoSomenteAdminDonoPode(idCriador){
    return verificarPermissaoSoDonoPode(idCriador) && verificarPermissaoSomenteAdminPode();
}

