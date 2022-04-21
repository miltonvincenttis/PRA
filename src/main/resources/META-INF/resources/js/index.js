//-----------------------------------------------------------------------------

/**
 * Funcao pra ajudar a debugar.
 * @param {*} algo 
 */
function tester(algo) {
    console.log('Tester| ' + algo);
}

//-----------------------------------------------------------------------------

/**
 * Cria um cookie com dados de autenticacao falso, pra testes.
 * 
 */
function criarFakeAutenticacao() {
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
function verificarAutenticacaoDeUsuario() {

    //--- cria fake autenticacao pra testes: deve ser comentado em produção
    //criarFakeAutenticacao(); 

    //--- Verifica se há o token no cookie
    let appToken = Cookies.get('appToken');

    //--- debug
    tester(appToken);

    let estaLogado = appToken != undefined;

    //--- não encontrou então redirecionar pra pagina de entrar.html
    if (!estaLogado) {
        //--- debug 
        tester('Não esta autenticado');

        //--- deve ir pra pagina Entrar.html
        window.location.href = 'entrar.html';
    } else {
        //--- debug: está autenticado e deve exibir o nome
        tester('Está autenticado');

        //--- pegar os outros dados do Usuário fazendo uma requisição
        let jsonRequisicao = JSON.stringify({ "id": appToken })
        let jsonResposta = null
        let json = { jsonRequisicao, jsonResposta }
        requisitarPessoaPorIdBackend(json)

        let appNomeUsuario = json.jsonResposta.nome;
        //--- carregar todos dados do servidor e renderizar na pagina principal

        //--- exibir o nome do usuario no canto superior direito da pagina index.html => #usuarioLogado
        document.querySelector('#usuarioLogado').innerHTML = appNomeUsuario;

        //---debug
        tester(appNomeUsuario);

        //--- verifica se usuario é admin ou comum, e permite apenas certas opção de menu para comum
        let appPerfilUsuario = Cookies.get('appPerfilUsuario')

        //--- se usuario comum: remove as opções: Pessoas e Tipos de Problemas
        if (appPerfilUsuario == 'comum') {
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
 * JSON: {"id": appToken}
 * request: POST /pessoas/id
 */
function requisitarPessoaPorIdBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/pessoas/id";

    xhr.open("POST", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    json.jsonResposta = JSON.parse(xhr.responseText);
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Pessoa não foi enviado  **/
                case 404: /** not found:    id de Pessoa não existem  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json.jsonRequisicao);
    return resultado;
}

//-----------------------------------------------------------------------------

/**
 * Remove as informações que estão em cookies:
 * appToken
 * appNomeUsuario
 * appPerfilUsuario
 */
function sair() {
    Cookies.remove('appToken')
    Cookies.remove('appPerfilUsuario')

    window.location.href = 'entrar.html'
}

//-----------------------------------------------------------------------------

/**
 * Requisita todas as denuncias que estão no banco de dados.
 * 
 */
function carregarDenuncias() {
    desligarTelaGerenciarPessoas()
    desligarTelaGerenciarTiposDeProblemas()
    desligarDashboard()

    ligarPainelDenuncias()   
    requisitarDenunciasBackend()
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
                if (xhr.response.length != 0) {
                    var denuncias = JSON.parse(xhr.responseText);
                    if (denuncias.length != 0) {
                        desligarIconePaginaSemDenuncias();
                        mostrarDenunciasComentariosSolucoes(denuncias);
                    } else {
                        //--- isso limpa a tela de denuncias
                        mostrarDenunciasComentariosSolucoes([])
                        ligarIconePaginaSemDenuncias();
                    }
                }
                resultado = true;
            } else {
                mostrarAlerta('', 'Erro de servidor ' + this.statusText)
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
function ligarIconePaginaSemDenuncias() {
    document.querySelector('#iconeSemDenuncias').style.display = 'block'
}

//-----------------------------------------------------------------------------

/**
 * Desliga o ícone 'pagina sem denuncias'.
 * 
 */
function desligarIconePaginaSemDenuncias() {
    document.querySelector('#iconeSemDenuncias').style.display = 'none'
}

//-----------------------------------------------------------------------------

/**
 * Liga o painel de denuncias.
 */
function ligarPainelDenuncias() {
    document.querySelector("#painelDenuncias").style.display = 'block'
}

//-----------------------------------------------------------------------------

/**
 * Desliga o painel de denuncias.
 */
function desligarPainelDenuncias() {
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
function mostrarDenunciasComentariosSolucoes(denuncias) {
    document.body.style.zoom = "80%";

    let row = document.getElementById("rowId");

    //--- limpamos a tela se existir uma anterior e injetamos novo conteudo
    row.innerHTML = ``;

    //--- renderiza uma coluna por Denuncia contendo Comentarios e Solucoes ou não.
    for (i = 0; i < denuncias.length; i++) {
        row.insertAdjacentHTML('beforeend', (produzirHTMLDenuncias(denuncias[i])))
    }
}

//-----------------------------------------------------------------------------

/**
 * Gera HTML para Denuncia.
 * 
 * @param solucoes Array de objetos Denuncia
 * @returns HTML produzido
 */
function produzirHTMLDenuncias(denuncia) {
    let temComentarios = denuncia.comentarios.length != 0
    let temSolucoes = denuncia.solucoes.length != 0;
    let comentariosHTML = ``;
    let solucoesHTML = ``;

    let denunciaHTML = `
     <div class="col-md-6 col-lg-6">
        <div class="card" id="denuncia">
            <div class="row">
                <div class="col-auto my-auto">
                    <div id="denunciaPessoaNome" idPessoa="${denuncia.pessoa.id}" class="badgeDenuncia text-center" title="Denúncia por ${denuncia.pessoa.nome}">${reduzirNomeUsuario(denuncia.pessoa.nome)}</div>
                </div>
                <div class="col">
                    <div class="card-body">
                        <h5 id="denunciaTPD" class="card-title">${denuncia.tipoDeProblema.descricao}</h5>
                        <h6 id="denunciaDatahora" class="card-subtitle mb-2 text-muted">${obterData(denuncia.dataHora)} - ${obterHora(denuncia.dataHora)}</h6>
                        <p id="denunciaDescricao" class="card-text">${denuncia.descricao}</p>
                        <i title="comentário" idDenuncia="${denuncia.id}" class="far fa-sticky-note fa-lg" onclick="abrirDialogoIncluirComentario(event);"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i title="solução"    idDenuncia="${denuncia.id}" class="far fa-edit fa-lg" onclick="abrirDialogoIncluirSolucao(event);"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span id="botaoCurtir-${denuncia.id}">
                            ${produzirHTMLIconeCurtir(denuncia)}
                        </span>
                        <i title="editar"  idPessoa="${denuncia.pessoa.id}" idTipoDeProblema="${denuncia.tipoDeProblema.id}" idDenuncia="${denuncia.id}" class="fa fa-user-edit fa-lg"  onclick="abrirDialogoEditarDenuncia(event);"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i title="remover" idPessoa="${denuncia.pessoa.id}" idTipoDeProblema="${denuncia.tipoDeProblema.id}" idDenuncia="${denuncia.id}" class="far fa-trash-can fa-lg" onclick="abrirDialogoRemoverDenuncia(event);"></i>
                    </div>
                </div>
            </div>
        </div>   
    ${temComentarios || temSolucoes ? `` : `</div>`}`;  //--- não fecha a div se tiver comentários ou soluções, fecha se não tiver

    if (temComentarios) {
        comentariosHTML = produzirHTMLComentarios(denuncia.comentarios);
    }
    if (temSolucoes) {
        solucoesHTML = produzirHTMLSolucoes(denuncia.solucoes);
    }

    return denunciaHTML + comentariosHTML + solucoesHTML + `</div>`;
}

//-----------------------------------------------------------------------------

function reduzirNomeUsuario(nome) {
    let nomeAbrevidado = '';
    let nomes = nome.split(' ');
    const tamanhoMaximo = 11;

    let tamanhoMaximoNomeIndividual = tamanhoMaximo;

    loopDeNovo:
    for (let i = 0; i < nomes.length; i++) {
        if (nomes[i].length > tamanhoMaximoNomeIndividual) {
            nomeAbrevidado += nomes[i].substring(0, 1).toUpperCase()
        } else {
            nomeAbrevidado += nomes[i]
        }
        if (i != nomes.length - 1) {
            nomeAbrevidado += ' '
        }
        //--- caso o nome final seja maior que tamanhoMaximoNomeIndividual, a gente faz tudo de novo
        if (i == nomes.length - 1 && temNomeMaior(tamanhoMaximo, nomeAbrevidado.split(' '))) {
            //--- refaz o array novamente agora com o nome finalizado inteiro
            nomes = nomeAbrevidado.split(' ');

            //--- dividimos o tamanho maximo do nome pra metade
            tamanhoMaximoNomeIndividual = tamanhoMaximoNomeIndividual / 2;
            i = -1;
            nomeAbrevidado = '';

            continue loopDeNovo;
        }
    }
    return nomeAbrevidado;

}

function temNomeMaior(tamanhoMaximo, nomes) {
    let resultado = false;

    for (umNome in nomes) {
        if (umNome.length > tamanhoMaximo) {
            resultado = true;
            break;
        }
    }
    return resultado;
}
//-----------------------------------------------------------------------------

/**
 * Gera HTML para Comentarios.
 * 
 * @param solucoes Array de objetos Comentario.
 * @returns HTML produzido
 */
function produzirHTMLComentarios(comentarios) {
    let comentariosHTML = ``;

    for (var i = 0; i < comentarios.length; i++) {
        comentariosHTML += `
        <div class="card" id="comentario" idDenuncia="${comentarios[i].id}">
            <div class="row">
                <div class="col-auto my-auto">                                                                                                      
                    <div id="comentarioPessoaNome" idPessoa="${comentarios[i].pessoa.id}" class="badgeComentario text-center" title="Comentário por ${comentarios[i].pessoa.nome}">${reduzirNomeUsuario(comentarios[i].pessoa.nome)}</div>
                </div>
                <div class="col">
                    <div class="card-body">
                        <h6 id="comentarioDatahora" class="card-subtitle mb-2 text-muted">${obterData(comentarios[i].dataHora)} - ${obterHora(comentarios[i].dataHora)}</h6>
                        <p id="comentarioDescricao" class="card-text">${comentarios[i].descricao}</p>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i title="editar"  idPessoa="${comentarios[i].pessoa.id}" idComentario="${comentarios[i].id}" class="fa fa-user-edit fa-lg" onclick="abrirDialogoEditarComentario(event)"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i title="remover" idPessoa="${comentarios[i].pessoa.id}" idComentario="${comentarios[i].id}" class="far fa-trash-can fa-lg" onclick="abrirDialogoRemoverComentario(event)"></i>
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
function produzirHTMLSolucoes(solucoes) {
    let solucoesHTML = ``;

    for (var i = 0; i < solucoes.length; i++) {
        solucoesHTML += `
        <div class="card" id="solucao" idDenuncia="${solucoes[i].id}">
            <div class="row">
                <div class="col-auto my-auto text-center" >                                                                             
                    <div id="solucaoPessoaNome" idPessoa="${solucoes[i].pessoa.id}" class="badgeSolucao text-center" title="Solução por ${solucoes[i].pessoa.nome}">${reduzirNomeUsuario(solucoes[i].pessoa.nome)}</div>
                </div>
                <div class="col">
                    <div class="card-body">
                        <h6 id="solucaoDatahora" class="card-subtitle mb-2 text-muted">${obterData(solucoes[i].dataHora)} - ${obterHora(solucoes[i].dataHora)}</h6>
                        <p id="solucaoDescricao" class="card-text">${solucoes[i].descricao}</p>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i title="editar"  idPessoa="${solucoes[i].pessoa.id}" idSolucao="${solucoes[i].id}" class="fa fa-user-edit fa-lg" onclick="abrirDialogoEditarSolucao(event)"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i title="remover" idPessoa="${solucoes[i].pessoa.id}" idSolucao="${solucoes[i].id}" class="far fa-trash-can fa-lg" onclick="abrirDialogoRemoverSolucao(event)"></i>
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
function produzirHTMLIconeCurtir(denuncia) {
    let idCurtida = obterIdCurtida(denuncia)
    let iconeCurtir = `
        <i style="zoom=80%" id="botaoCurtir" idCurtida="${idCurtida}" idDenuncia="${denuncia.id}" title="${idCurtida ? 'descurtir' : 'curtir'}" class="${botaoDeCurtidoOuNaoCurtido(denuncia)}" onclick="curtir(event);"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    `;

    return iconeCurtir
}

//-----------------------------------------------------------------------------

/**
 * Retira a data que esta no formato 2022-03-26T23:23:00.106062.
 */
function obterData(data) {
    let date = new Date(data);
    return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/" + date.getFullYear()
}

//-----------------------------------------------------------------------------

/** 
 * Retira a hora que esta no formato 2022-03-26T23:23:00.106062.
 */
function obterHora(data) {
    let date = new Date(data)
    return (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
}

//-----------------------------------------------------------------------------

/**
 * Retorna botão padrão ou botão que sinaliza curtido.
 * @param denuncia JSON
 * @returns string
 */
function botaoDeCurtidoOuNaoCurtido(denuncia) {
    let foiCurtido = false;

    //--- botão padrão é o de curtir
    let botaoPadrao = "far fa-thumbs-up fa-lg"

    //--- o solido é que sinaliza que foi curtido
    let botaoCurtido = "fa-solid fa-thumbs-up fa-lg"

    //--- verificar se tem curtidas, pois são várias que podem ter de varios usuários diferentes
    let temCurtidas = denuncia.curtidas.length != 0

    //--- se tem curtidas vamos ver se o usuario corrente curtiu: appToken é o ID do usuário logado
    if (temCurtidas) {
        let usuarioLogado = Cookies.get("appToken")

        for (var i = 0; i < denuncia.curtidas.length; i++) {
            //--- comparamos o id do usuario corrente com o id de todas as curtidas
            if (usuarioLogado === denuncia.curtidas[i].pessoa.id) {
                foiCurtido = true
                break
            }
        }
    }
    if (foiCurtido) {
        return botaoCurtido
    }
    return botaoPadrao
}

//-----------------------------------------------------------------------------

/**
 * Obtem o idDenuncia se foi curtida pelo usuário corrente.
 */
function obterIdCurtida(denuncia) {
    let idCurtida = ""
    let idPessoa = Cookies.get('appToken')
    let curtidas = denuncia.curtidas

    for (let i = 0; i < curtidas.length; i++) {
        //--- comparamos id usuario corrente id pessoa da curtida
        if (idPessoa == curtidas[i].pessoa.id) {
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
function abrirDialogoIncluirDenuncia() {
    desligarTelaGerenciarPessoas()
    desligarTelaGerenciarTiposDeProblemas()
    desligarDashboard()

    carregarDenuncias()

    if (!requisitarTiposDeProblemasBackend(produzirHTMLIncluirSelectTiposDeProblemas)) {
        //--- avisamos se não tiver Tipo de Problema cadastrado ou der algum problema.
        mostrarAlerta('', 'Fale com um usuário Admin. Houve um problema na lista de Tipos de Problemas.')
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
                if (xhr.response.length != 0) {
                    var tiposDeProblemas = JSON.parse(xhr.responseText);
                    /**
                     * funcaoAChamar pode ser: produzirHTMLSelectTiposDeProblemas ou produzirHTMLListagemTiposDeProblemas
                     */
                    funcaoAChamar(tiposDeProblemas)
                }
                resultado = true;
            } else {
                tester("Erro: " + this.statusText)
            }
        }
    };
    xhr.send();
    return resultado;
}

//-----------------------------------------------------------------------------

/**
 * JSON: nenhum
 * request: GET /tiposdeproblemas
 */
function requisitarEditarTiposDeProblemasBackend(funcaoAChamar, idTipoDeProblema, idElementoAInjetar) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/tiposdeproblemas";

    xhr.open("GET", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var tiposDeProblemas = JSON.parse(xhr.responseText);
                /**
                * funcaoAChamar pode ser: produzirHTMLSelectTiposDeProblemas ou produzirHTMLListagemTiposDeProblemas
                */
                funcaoAChamar(tiposDeProblemas, idTipoDeProblema, idElementoAInjetar)
                resultado = true;
            } else {
                tester("Erro: " + this.statusText)
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
function produzirHTMLIncluirSelectTiposDeProblemas(tiposDeProblemas) {
    //--- ponto de injeção do HTML
    let injetarHTMLAqui = document.getElementById('selectIncluirTiposDeProblemas')

    //--- limpamos 'options' conteudo de outras chamadas.
    injetarHTMLAqui.innerHTML = ``;

    let selectTiposDeProblemas = `
         <option value=""></option>
   `;

    for (var i = 0; i < tiposDeProblemas.length; i++) {
        selectTiposDeProblemas += `
         <option value="${tiposDeProblemas[i].id}">${tiposDeProblemas[i].descricao}</option>
      `;
    }

    injetarHTMLAqui.innerHTML = selectTiposDeProblemas;

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
function produzirHTMLEditarSelectTiposDeProblemas(tiposDeProblemas, idTipoDeProblema, idElementoAInjetar) {
    //--- ponto de injeção do HTML              
    let injetarHTMLAqui = document.getElementById(idElementoAInjetar)  // 'selectEditarTiposDeProblemas'

    //--- limpamos 'options' conteudo de outras chamadas.
    injetarHTMLAqui.innerHTML = ``;

    let selectTiposDeProblemas = `
          <option value=""></option>
    `;

    for (var i = 0; i < tiposDeProblemas.length; i++) {
        if (tiposDeProblemas[i].id == idTipoDeProblema) {
            selectTiposDeProblemas += `
                <option value="${tiposDeProblemas[i].id}" selected>${tiposDeProblemas[i].descricao}</option>
            `;
        } else {
            selectTiposDeProblemas += `
                <option value="${tiposDeProblemas[i].id}">${tiposDeProblemas[i].descricao}</option>
            `;
        }
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
 *    "dataHora": "String",
 *    "idPessoa": "String",
 *    "idTipoDeProblema": "String"
 *  }
 *  
 * botao Ok onclick(event)
 * 
 */
function incluirDenuncia(event) {

    //--- obtem o id na opção escolhida
    let idTipoDeProblema = document.getElementById('selectIncluirTiposDeProblemas').value;

    //--- pega a descricao
    let descricao = document.getElementById('incluirDenunciaDescricao').value

    //--- valida se escolheu um Tipo de Problema
    if (!idTipoDeProblema) {
        ligarMsgErro('msgErroIncluirTipoDeProblemaDenuncia')
    } else {
        desligarMsgErro('msgErroIncluirTipoDeProblemaDenuncia')
    }

    //--- valida se descricao foi preenchido
    if (!descricao || descricao.trim().length == 0) {
        ligarMsgErro('msgErroIncluirDescricaoDenuncia');
    } else {
        desligarMsgErro('msgErroIncluirDescricaoDenuncia');
    }

    //--- se qualquer erro
    if (descricao.trim().length == 0 || !idTipoDeProblema)
        return false;

    //--- fechar o dialogo manualmente
    $('#dialogoIncluirDenuncia').modal('hide')

    let idPessoa = Cookies.get('appToken');

    //--- vamos gerar um JSON 
    let json = JSON.stringify({ "descricao": descricao, "dataHora": new Date().toISOString(), "idPessoa": idPessoa, "idTipoDeProblema": idTipoDeProblema });

    tester(json)

    if (incluirDenunciaBackend(json)) {
        mostrarAlerta('', 'Sua Denúncia foi incluida com sucesso!')
        carregarDenuncias();
    }

}

//-----------------------------------------------------------------------------

function ligarMsgErro(id) {
    document.getElementById(id).style.visibility = 'visible'
}

//-----------------------------------------------------------------------------

function desligarMsgErro(id) {
    document.getElementById(id).style.visibility = 'hidden'
}

//-----------------------------------------------------------------------------

/**
 * Incluir Denuncia.
 * 
 * request: POST /denuncias
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
            switch (xhr.status) {
                case 201: /** created **/
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Pessoa ou id de Tipo de Problema não foram  **/
                case 404: /** not found:    id de Pessoa ou id de Tipo de Problema não foram não existem  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
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
function curtir(event) {
    //--- descobrir em qual tag Denuncia foi clicado pra curtir
    let iconeCurtir = event.target;

    //--- descobrir se a denuncia está curtida inspecionando o atributo idCurtida: se foi a operação é descurtir, se não, curtir.
    let idCurtida = iconeCurtir.getAttribute('idCurtida')
    let idDenuncia = iconeCurtir.getAttribute('idDenuncia')
    let resultado = false;
    let argumentos = null;
    let jsonResposta = null

    if (!idCurtida) {
        //--- curtir
        let jsonRequisicao = JSON.stringify({ "idDenuncia": idDenuncia, "idPessoa": Cookies.get('appToken') })

        argumentos = { jsonRequisicao, jsonResposta }
        resultado = curtirBackend(argumentos, 'POST')

    } else {
        //--- descurtir: enviar o Id da curtida pra remoção e da denuncia pra retornar JSON
        jsonRequisicao = JSON.stringify({ "id": idCurtida, "idDenuncia": idDenuncia })
        argumentos = { jsonRequisicao, jsonResposta }
        resultado = curtirBackend(argumentos, 'DELETE')
    }

    //--- é necessário reconstruir a tag <i>
    if (resultado) {
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
 * Nota: chamado por curtir para curtir/descurtir, dependendo do conteudo de argumento.
 * 
 * 
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
            switch (xhr.status) {
                case 200: /** ok **/
                    argumento.jsonResposta = JSON.parse(xhr.responseText);
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Pessoa ou id da curtida não foram enviados **/
                case 404: /** not found:    id de Pessoa ou id de curtida não existe  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(argumento.jsonRequisicao);

    return resultado;
}

//-----------------------------------------------------------------------------

function abrirDialogoEditarDenuncia(event) {
    let iconeEditar = event.target

    //--- pegamos o idPessoa 
    let idPessoa = iconeEditar.getAttribute('idpessoa')

    if (!temPermissao(PERMISSAO.editarDenuncia, idPessoa)) {
        mostrarAlerta('', 'Só a Pessoa que criou a Denúncia pode edita-la.')
        return false;
    }

    let idTipoDeProblema = iconeEditar.getAttribute('idtipodeproblema')

    if (!requisitarEditarTiposDeProblemasBackend(produzirHTMLEditarSelectTiposDeProblemas, idTipoDeProblema, 'selectEditarTiposDeProblemas')) {
        //--- avisamos se não tiver Tipo de Problema cadastrado ou der algum problema.
        mostrarAlerta('', 'Aviso', 'Fale com um usuário Admin. Houve um problema na lista de Tipos de Problemas.')
        return;
    }

    //--- devemos pegar o idDenuncia que está no atributo 'iddenuncia'
    let idDenuncia = iconeEditar.getAttribute('iddenuncia')

    //--- criamos um pacote pra requsição
    let jsonRequisicao = JSON.stringify({ "id": idDenuncia })
    let jsonResposta = null;
    let json = { jsonRequisicao, jsonResposta }

    //--- pegamos o json a partir do backend: tipo de problema e descrição
    requisitarDenunciaPorIdBackend(json)

    let descricao = json.jsonResposta.descricao

    //--- injetamos no botão OK os seguintes atributos
    let jsonInjecao = { "idPessoa": idPessoa, "idDenuncia": idDenuncia, "idTipoDeProblema": idTipoDeProblema, "descricao": descricao }
    $('#dialogoEditarDenuncia').on('show.bs.modal', injetarAtributos(jsonInjecao, 'botaoOkEditarDenuncia'))
    $('#dialogoEditarDenuncia').on('show.bs.modal', injetarValorEmCampo(descricao, 'editarDenunciaDescricao'))

    //--- abrimos o dialogo e esperamos sair
    $('#dialogoEditarDenuncia').modal('show');

}

//-----------------------------------------------------------------------------

function injetarValorEmCampo(valor, idCampoAlvo) {
    document.getElementById(idCampoAlvo).value = valor;
}

//-----------------------------------------------------------------------------

function injetarValorEmCampoCheckbox(valor, idCampoAlvo) {
    document.getElementById(idCampoAlvo).checked = valor;
}

//-----------------------------------------------------------------------------

/**
 * Editar Denuncia.
 * 
 * JSON: nenhum
 * request: POST /denuncias
 */
function requisitarDenunciaPorIdBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/denuncias/id";

    xhr.open("POST", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    json.jsonResposta = JSON.parse(xhr.responseText)
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Pessoa ou id de Tipo de Problema não foram  **/
                case 404: /** not found:    id de Pessoa ou id de Tipo de Problema não foram não existem  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json.jsonRequisicao);
    return resultado;
}

//-----------------------------------------------------------------------------

/**
 * Editar Denuncia.
 * 
 */
function editarDenuncia(event) {
    //--- pegar o select
    let idTipoDeProblema = document.getElementById('selectEditarTiposDeProblemas').value

    //--- pega a descricao
    let descricao = document.getElementById('editarDenunciaDescricao').value

    //--- pega o idDenuncia
    let idDenuncia = document.getElementById('botaoOkEditarDenuncia').getAttribute('idDenuncia')

    //--- valida se escolheu um Tipo de Problema
    if (!idTipoDeProblema) {
        ligarMsgErro('msgErroEditarTipoDeProblemaDenuncia')
    } else {
        desligarMsgErro('msgErroEditarTipoDeProblemaDenuncia')
    }

    //--- valida se descricao foi preenchido
    if (!descricao || descricao.trim().length == 0) {
        ligarMsgErro('msgErroEditarDescricaoDenuncia');
    } else {
        desligarMsgErro('msgErroEditarDescricaoDenuncia');
    }

    //--- se qualquer erro
    if (!descricao || descricao.trim().length == 0 || !idTipoDeProblema)
        return false;

    //--- fechar o dialogo manualmente
    $('#dialogoEditarDenuncia').modal('hide')

    let idPessoa = Cookies.get('appToken');

    //--- vamos gerar um JSON 
    let json = JSON.stringify({ "id": idDenuncia, "descricao": descricao, "dataHora": new Date().toISOString(), "idPessoa": idPessoa, "idTipoDeProblema": idTipoDeProblema });

    tester(json)

    if (editarDenunciaBackend(json)) {
        mostrarAlerta('', 'Sua Denúncia foi alterada com sucesso!')
        carregarDenuncias();
    }

}

//-----------------------------------------------------------------------------

/**
 * Editar Denuncia.
 * 
 * request: PUT /denuncias
 */
function editarDenunciaBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/denuncias";

    xhr.open("PUT", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Pessoa ou id de Tipo de Problema não foram  **/
                case 404: /** not found:    id de Pessoa ou id de Tipo de Problema não foram não existem  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json);
    return resultado;
}

//-----------------------------------------------------------------------------

function abrirDialogoRemoverDenuncia(event) {
    let iconeEditar = event.target

    //--- pegamos o idPessoa 
    let idPessoa = iconeEditar.getAttribute('idpessoa')

    if (!temPermissao(PERMISSAO.editarDenuncia, idPessoa)) {
        mostrarAlerta('', 'Só a Pessoa que criou a Denúncia pode remove-la.')
        return false;
    }

    let idTipoDeProblema = iconeEditar.getAttribute('idtipodeproblema')

    if (!requisitarEditarTiposDeProblemasBackend(produzirHTMLEditarSelectTiposDeProblemas, idTipoDeProblema, 'selectRemoverTiposDeProblemas')) {
        //--- avisamos se não tiver Tipo de Problema cadastrado ou der algum problema.
        mostrarAlerta('', 'Fale com um usuário Admin. Houve um problema na lista de Tipos de Problemas.')
        return;
    }

    //--- devemos pegar o idDenuncia que está no atributo 'iddenuncia'
    let idDenuncia = iconeEditar.getAttribute('iddenuncia')

    //--- criamos um pacote pra requsição
    let jsonRequisicao = JSON.stringify({ "id": idDenuncia })
    let jsonResposta = null;
    let json = { jsonRequisicao, jsonResposta }

    //--- pegamos o json a partir do backend: tipo de problema e descrição
    requisitarDenunciaPorIdBackend(json)

    let descricao = json.jsonResposta.descricao

    //--- injetamos no botão OK os seguintes atributos
    let jsonInjecao = { "idPessoa": idPessoa, "idDenuncia": idDenuncia, "idTipoDeProblema": idTipoDeProblema, "descricao": descricao }
    $('#dialogoRemoverrDenuncia').on('show.bs.modal', injetarAtributos(jsonInjecao, 'botaoOkRemoverDenuncia'))
    $('#dialogoRemoverrDenuncia').on('show.bs.modal', injetarValorEmCampo(descricao, 'removerDenunciaDescricao'))

    //--- abrimos o dialogo e esperamos sair
    $('#dialogoRemoverDenuncia').modal('show');

}

//-----------------------------------------------------------------------------

/**
 * Somente o criador da Denuncia pode remover.
 */
function removerDenuncia(event) {
    //--- pegamos apenas o id da denuncia pra requisição de remoção 
    let idDenuncia = event.target.getAttribute('idDenuncia');

    //--- criamos um JSON pra requisição
    let json = JSON.stringify({ "id": idDenuncia })

    //--- mandamos remover
    removerDenunciaBackend(json)

    //--- fechamos o dialogo manualmente
    $('#dialogoRemoverDenuncia').modal('hide')

    carregarDenuncias();
}

//-----------------------------------------------------------------------------

/**
 * Remover Denuncia.
 * 
 * request: PUT /denuncias
 */
function removerDenunciaBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/denuncias";

    xhr.open("DELETE", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Pessoa ou id de Tipo de Problema não foram  **/
                case 403:
                    mostrarAlerta('', 'A Denúncia não pode ser removida pois tem Comentários ou Soluções.')
                    break;
                case 404: /** not found:    id de Pessoa ou id de Tipo de Problema não foram não existem  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json);
    return resultado;
}

//-----------------------------------------------------------------------------
// Funcionalidade para Comentario
//-----------------------------------------------------------------------------

/**
 * Essa funcão é disparada no ícone 'comentarios' de uma denuncia.
 */
function abrirDialogoIncluirComentario(onClickEventAbrirDialogoIncluirComentario) {
    //--- pegamos o idDenuncia que vem no ícone
    let botaoOkIncluirComentario = onClickEventAbrirDialogoIncluirComentario.target
    let idDenuncia = botaoOkIncluirComentario.getAttribute('iddenuncia');

    //--- registramos um manipulador de evento pro modal a abrir.
    //--- queremos registrar o idDenunca no botão de ok do dialogo.
    $('#dialogoIncluirComentario').on('show.bs.modal', injetarAtributos({ "idDenuncia": idDenuncia }, 'botaoOkIncluirComentario'));

    //--- abrimos o dialogo e esperamos sair
    $('#dialogoIncluirComentario').modal('show');

}

//-----------------------------------------------------------------------------

/**
 * Injeta atributos em determinado objeto do HTML DOM.
 *   
 * @param jsonAInjetar jsonAInjetar: {nome1:valor1, nome2:valor2,...}.
 * @param idOndeInjetar id do elemento pra ser injetados os atributos.
 */
function injetarAtributos(jsonAInjetar, idOndeInjetar) {
    /*
     --- agora estamos dentro do dialogo Modal
     --- procuramos pelo botão Ok e inseriamos um atributo iddenuncia
    */
    for (let nome in jsonAInjetar) {
        document.getElementById(idOndeInjetar).setAttribute(nome, jsonAInjetar[nome])
    }

}

//-----------------------------------------------------------------------------

/**
 * Incluir Comentário enviando os dados do Dialogo pro backend em formato JSON: 
 * -ver o arquivo comentario-requisicao.json no backend.
 * 
 * {
 *    "descricao": "String",
 *    "dataHora": "String",
 *    "idPessoa": "String"
 *    "idDenuncia": String
 *  }
 * 
 */
function incluirComentario(event) {
    //--- pegamos o atributo idDenuncia contido no objeto que disparou o evento
    let botaoOk = event.target
    let idDenuncia = botaoOk.getAttribute('iddenuncia')

    //--- pega a descricao
    let descricaoComentario = document.getElementById('incluirComentarioDescricao').value

    //--- limpa o campo para não vir sujo na proxima entrada
    document.getElementById('incluirComentarioDescricao').value = ''

    //--- validar a descricao
    if (!descricaoComentario || descricaoComentario.trim().length == 0) {
        ligarMsgErro('msgErroIncluirComentarioDescricao')
        return false;
    } else {
        desligarMsgErro('msgErroIncluirComentarioDescricao')
    }

    $('#dialogoIncluirComentario').modal('hide')

    let idPessoa = Cookies.get('appToken');

    //--- vamos gerar um JSON 
    let json = JSON.stringify({ "descricao": descricaoComentario, "dataHora": new Date().toISOString(), "idPessoa": idPessoa, "idDenuncia": idDenuncia });

    tester(json)

    if (incluirComentarioBackend(json)) {
        mostrarAlerta('', 'Seu Comentário foi incluido com sucesso!')
        carregarDenuncias();
    }
}

//-----------------------------------------------------------------------------

/**
 * Incluir Comentario.
 * 
 * JSON: nenhum
 * request: POST /comentarios
 */
function incluirComentarioBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/comentarios";

    xhr.open("POST", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 201: /** created **/
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Pessoa ou id de Tipo de Problema não foram  **/
                case 404: /** not found:    id de Pessoa ou id de Tipo de Problema não foram não existem  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json);
    return resultado;
}

//-----------------------------------------------------------------------------

function abrirDialogoEditarComentario(event) {
    let iconeEditar = event.target

    //--- pegamos o idPessoa 
    let idPessoa = iconeEditar.getAttribute('idpessoa')

    if (!temPermissao(PERMISSAO.editarComentario, idPessoa)) {
        mostrarAlerta('', 'Só a Pessoa que criou o Comentário pode edita-lo.')
        return false;
    }

    //--- devemos pegar o idDenuncia que está no atributo 'iddenuncia'
    let idComentario = iconeEditar.getAttribute('idComentario')

    //--- criamos um pacote pra requsição
    let jsonRequisicao = JSON.stringify({ "id": idComentario })
    let jsonResposta = null;
    let json = { jsonRequisicao, jsonResposta }

    //--- pegamos o json a partir do backend: tipo de problema e descrição
    requisitarComentarioPorIdBackend(json)

    let descricao = json.jsonResposta.descricao

    //--- injetamos no botão OK os seguintes atributos
    let jsonInjecao = { "idPessoa": idPessoa, "idComentario": idComentario, "descricao": descricao }
    $('#dialogoEditarComentario').on('show.bs.modal', injetarAtributos(jsonInjecao, 'botaoOkEditarComentario'))
    $('#dialogoEditarComentario').on('show.bs.modal', injetarValorEmCampo(descricao, 'editarComentarioDescricao'))

    //--- abrimos o dialogo e esperamos sair
    $('#dialogoEditarComentario').modal('show');

}

//-----------------------------------------------------------------------------

/**
 * Editar Comentário. Obter Comentario por Id.
 * 
 * JSON: nenhum
 * request: POST /comentarios
 */
function requisitarComentarioPorIdBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/comentarios/id";

    xhr.open("POST", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    json.jsonResposta = JSON.parse(xhr.responseText)
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Comentario não foram enviados  **/
                case 404: /** not found:    id de Comentario não existem no backend  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json.jsonRequisicao);
    return resultado;
}

//-----------------------------------------------------------------------------

/**
 * Editar Comentário.
 * 
 */
function editarComentario(event) {
    //--- pega a descricao
    let descricao = document.getElementById('editarComentarioDescricao').value

    //--- pega o idDenuncia
    let idComentario = document.getElementById('botaoOkEditarComentario').getAttribute('idComentario')

    //--- valida se descricao foi preenchido
    if (!descricao || descricao.trim().length == 0) {
        ligarMsgErro('msgErroEditarDescricaoComentario');
        return false
    } else {
        desligarMsgErro('msgErroEditarDescricaoComentario');
    }

    //--- fechar o dialogo manualmente
    $('#dialogoEditarComentario').modal('hide')

    let idPessoa = Cookies.get('appToken');

    //--- vamos gerar um JSON 
    let json = JSON.stringify({ "id": idComentario, "descricao": descricao, "dataHora": new Date().toISOString(), "idPessoa": idPessoa });

    tester(json)

    if (editarComentarioBackend(json)) {
        mostrarAlerta('', 'Sua Comentário foi alterado com sucesso!')
    }
    carregarDenuncias();

}

//-----------------------------------------------------------------------------


/**
 * Editar Comentário.
 * 
 * JSON: {"id":idComentario, "descricao":descricao, "dataHora":new Date().toISOString(),"idPessoa":idPessoa}
 * 
 * request: PUT /comentarios
 */
function editarComentarioBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/comentarios";

    xhr.open("PUT", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Comentario não foram enviados  **/
                case 404: /** not found:    id de Comentario não existem no backend  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json);
    return resultado;
}

//-----------------------------------------------------------------------------

function abrirDialogoRemoverComentario(event) {
    let iconeEditar = event.target

    //--- pegamos o idPessoa 
    let idPessoa = iconeEditar.getAttribute('idpessoa')

    if (!temPermissao(PERMISSAO.removerComentario, idPessoa)) {
        mostrarAlerta('', 'Só a Pessoa que criou o Comentário pode remove-lo.')
        return false;
    }

    //--- devemos pegar o idDenuncia que está no atributo 'iddenuncia'
    let idComentario = iconeEditar.getAttribute('idComentario')

    //--- criamos um pacote pra requsição
    let jsonRequisicao = JSON.stringify({ "id": idComentario })
    let jsonResposta = null;
    let json = { jsonRequisicao, jsonResposta }

    //--- pegamos o json a partir do backend: tipo de problema e descrição
    requisitarComentarioPorIdBackend(json)

    let descricao = json.jsonResposta.descricao

    //--- injetamos no botão OK os seguintes atributos
    let jsonInjecao = { "idComentario": idComentario, "descricao": descricao }
    $('#dialogoRemoverComentario').on('show.bs.modal', injetarAtributos(jsonInjecao, 'botaoOkRemoverComentario'))
    $('#dialogoRemoverComentario').on('show.bs.modal', injetarValorEmCampo(descricao, 'removerComentarioDescricao'))

    //--- abrimos o dialogo e esperamos sair
    $('#dialogoRemoverComentario').modal('show');

}

//-----------------------------------------------------------------------------

/**
 * Somente o criador do Comentário pode remover.
 */
function removerComentario(event) {
    //--- pegamos apenas o id do comentário pra requisição de remoção 
    let idComentario = event.target.getAttribute('idComentario');

    //--- criamos um JSON pra requisição
    let json = JSON.stringify({ "id": idComentario })

    //--- mandamos remover
    removerComentarioBackend(json)

    //--- fechamos o dialogo manualmente
    $('#dialogoRemoverComentario').modal('hide')

    carregarDenuncias();
}

//-----------------------------------------------------------------------------

/**
 * Remover Comentário.
 * 
 * JSON: {"id":idComentario}
 * 
 * request: DELETE /comentarios
 */
function removerComentarioBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/comentarios";

    xhr.open("DELETE", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Comentario não foram enviados  **/
                case 404: /** not found:    id de Comentario não existem no backend  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json);
    return resultado;
}


//-----------------------------------------------------------------------------
// Funcionalidade para Solucao
//-----------------------------------------------------------------------------

/**
 * Essa funcão é disparada no ícone 'solução' de uma denuncia.
 */
function abrirDialogoIncluirSolucao(onClickEventAbrirDialogoIncluirSolucao) {
    //--- verificamos se tem permissão
    if (!temPermissao(PERMISSAO.criarSolucao)) {
        mostrarAlerta('', 'Somente usuário Admin pode incluir Solução.')
        return false;
    }

    //--- pegamos o idDenuncia que vem no ícone
    let botaoOkIncluirSolucao = onClickEventAbrirDialogoIncluirSolucao.target
    let idDenuncia = botaoOkIncluirSolucao.getAttribute('iddenuncia');

    //--- registramos um manipulador de evento pro modal a abrir.
    //--- queremos registrar o idDenunca no botão de ok do dialogo.
    $('#dialogoIncluirSolucao').on('show.bs.modal', injetarAtributos({ "idDenuncia": idDenuncia }, 'botaoOkIncluirSolucao'));

    //--- abrimos o dialogo e esperamos sair
    $('#dialogoIncluirSolucao').modal('show');

}

//-----------------------------------------------------------------------------

/**
 * Incluir Solução enviando os dados do Dialogo pro backend em formato JSON: 
 * -ver o arquivo solucao-requisicao.json no backend.
 * 
 * {
 *    "descricao": "String",
 *    "dataHora": "String",
 *    "idPessoa": "String"
 *    "idDenuncia": String
 *  }
 * 
 */
function incluirSolucao(event) {

    //--- pegamos o atributo idDenuncia contido no objeto que disparou o evento
    let botaoOk = event.target
    let idDenuncia = botaoOk.getAttribute('iddenuncia')

    //--- pega a descricao
    let descricaoComentario = document.getElementById('incluirSolucaoDescricao').value

    //--- limpa o campo para não vir sujo na proxima entrada
    document.getElementById('incluirSolucaoDescricao').value = ''

    //--- validar a descricao
    if (!descricaoComentario || descricaoComentario.trim().length == 0) {
        ligarMsgErro('msgErroIncluirSolucaoDescricao')
        return false;
    } else {
        desligarMsgErro('msgErroIncluirSolucaoDescricao')
    }

    $('#dialogoIncluirSolucao').modal('hide')

    let idPessoa = Cookies.get('appToken');

    //--- vamos gerar um JSON 
    let json = JSON.stringify({ "descricao": descricaoComentario, "dataHora": new Date().toISOString(), "idPessoa": idPessoa, "idDenuncia": idDenuncia });

    tester(json)

    if (incluirSolucaoBackend(json)) {
        mostrarAlerta('', 'Sua Solução foi incluido com sucesso!')
        carregarDenuncias();
    }
}

//-----------------------------------------------------------------------------

/**
 * Incluir Solucao.
 * 
 * JSON: nenhum
 * request: POST /solucoes
 */
function incluirSolucaoBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/solucoes";

    xhr.open("POST", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 201: /** criado **/
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Pessoa ou id de Tipo de Problema não foram  **/
                case 404: /** not found:    id de Pessoa ou id de Tipo de Problema não foram não existem  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json);
    return resultado;
}

//-----------------------------------------------------------------------------

function abrirDialogoEditarSolucao(event) {
    let iconeEditar = event.target

    //--- pegamos o idPessoa 
    let idPessoa = iconeEditar.getAttribute('idpessoa')

    if (!temPermissao(PERMISSAO.editarSolucao, idPessoa)) {
        mostrarAlerta('', 'Só a Pessoa que criou a Solução pode edita-la e deve ser Admin.')
        return false;
    }

    //--- devemos pegar o idDenuncia que está no atributo 'iddenuncia'
    let idSolucao = iconeEditar.getAttribute('idSolucao')

    //--- criamos um pacote pra requsição
    let jsonRequisicao = JSON.stringify({ "id": idSolucao })
    let jsonResposta = null;
    let json = { jsonRequisicao, jsonResposta }

    //--- pegamos o json a partir do backend: tipo de problema e descrição
    requisitarSolucaoPorIdBackend(json)

    let descricao = json.jsonResposta.descricao

    //--- injetamos no botão OK os seguintes atributos
    let jsonInjecao = { "idPessoa": idPessoa, "idSolucao": idSolucao, "descricao": descricao }
    $('#dialogoEditarSolucao').on('show.bs.modal', injetarAtributos(jsonInjecao, 'botaoOkEditarSolucao'))
    $('#dialogoEditarSolucao').on('show.bs.modal', injetarValorEmCampo(descricao, 'editarSolucaoDescricao'))

    //--- abrimos o dialogo e esperamos sair
    $('#dialogoEditarSolucao').modal('show');

}

//-----------------------------------------------------------------------------

/**
 * Editar Solução. Obter Solução por Id.
 * 
 * JSON: nenhum
 * request: POST /solucoes
 */
function requisitarSolucaoPorIdBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/solucoes/id";

    xhr.open("POST", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    json.jsonResposta = JSON.parse(xhr.responseText)
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Comentario não foram enviados  **/
                case 404: /** not found:    id de Comentario não existem no backend  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json.jsonRequisicao);
    return resultado;
}

//----------------------------------------------------------------------------- 

/**
 * Somente o criador da Solucao pode editar, e deve ser Admin (ser ou não ser Admin é alteravel)
 */
function editarSolucao(event) {
    //--- pega a descricao
    let descricao = document.getElementById('editarSolucaoDescricao').value

    //--- pega o idDenuncia
    let idSolucao = document.getElementById('botaoOkEditarSolucao').getAttribute('idSolucao')

    //--- valida se descricao foi preenchido
    if (!descricao || descricao.trim().length == 0) {
        ligarMsgErro('msgErroEditarSolucaoDescricao');
    } else {
        desligarMsgErro('msgErroEditarSolucaoDescricao');
    }

    //--- se qualquer erro
    if (!descricao || descricao.trim().length == 0)
        return false;

    //--- fechar o dialogo manualmente
    $('#dialogoEditarSolucao').modal('hide')

    let idPessoa = Cookies.get('appToken');

    //--- vamos gerar um JSON 
    let json = JSON.stringify({ "id": idSolucao, "descricao": descricao, "dataHora": new Date().toISOString() });

    tester(json)

    if (editarSolucaoBackend(json)) {
        mostrarAlerta('', 'Sua Solução foi alterada com sucesso!')
        carregarDenuncias();
    }

}

//-----------------------------------------------------------------------------

/**
 * Editar Solucao.
 * 
 * JSON: nenhum
 * request: PUT /solucoes
 */
function editarSolucaoBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/solucoes";

    xhr.open("PUT", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Solucao ou descricao não foram  **/
                case 404: /** not found:    id de Solucao ou descricao não existem  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json);
    return resultado;
}

//-----------------------------------------------------------------------------

function abrirDialogoRemoverSolucao(event) {
    let iconeEditar = event.target

    //--- pegamos o idPessoa 
    let idPessoa = iconeEditar.getAttribute('idpessoa')

    if (!temPermissao(PERMISSAO.removerSolucao, idPessoa)) {
        mostrarAlerta('', 'Só a Pessoa que criou a Solução pode remove-la e deve ser Admin.')
        return false;
    }

    //--- devemos pegar o idDenuncia que está no atributo 'iddenuncia'
    let idSolucao = iconeEditar.getAttribute('idSolucao')

    //--- criamos um pacote pra requsição
    let jsonRequisicao = JSON.stringify({ "id": idSolucao })
    let jsonResposta = null;
    let json = { jsonRequisicao, jsonResposta }

    //--- pegamos o json a partir do backend: tipo de problema e descrição
    requisitarSolucaoPorIdBackend(json)

    let descricao = json.jsonResposta.descricao

    //--- injetamos no botão OK os seguintes atributos
    let jsonInjecao = { "idSolucao": idSolucao, "descricao": descricao }
    $('#dialogoRemoverSolucao').on('show.bs.modal', injetarAtributos(jsonInjecao, 'botaoOkRemoverSolucao'))
    $('#dialogoRemoverSolucao').on('show.bs.modal', injetarValorEmCampo(descricao, 'removerSolucaoDescricao'))

    //--- abrimos o dialogo e esperamos sair
    $('#dialogoRemoverSolucao').modal('show');

}

//-----------------------------------------------------------------------------

/**
 * Somente o criador da Solução pode remover.
 */
function removerSolucao(event) {
    //--- pegamos apenas o id do comentário pra requisição de remoção 
    let idSolucao = event.target.getAttribute('idSolucao');

    //--- criamos um JSON pra requisição
    let json = JSON.stringify({ "id": idSolucao })

    //--- mandamos remover
    removerSolucaoBackend(json)

    //--- fechamos o dialogo manualmente
    $('#dialogoRemoverSolucao').modal('hide')

    carregarDenuncias();
}

//-----------------------------------------------------------------------------

/**
 * Remover Solucao.
 * 
 * JSON: {"id": idSolucao}
 * 
 * request: DELETE /solucoes
 */
function removerSolucaoBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/solucoes";

    xhr.open("DELETE", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Comentario não foram enviados  **/
                case 404: /** not found:    id de Comentario não existem no backend  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json);
    return resultado;
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
    removerSolucao: 10,
    gerenciarPessoas: 11,
    gerenciarTiposDeProblemas: 12
}

const USUARIO = {
    comum: 'comum',
    admin: 'admin'
}

//-----------------------------------------------------------------------------

function temPermissao(permissao, idCriador) {
    let temPermissao = false;

    switch (permissao) {
        case PERMISSAO.editarDenuncia:
        case PERMISSAO.editarComentario:
        case PERMISSAO.removerDenuncia:
        case PERMISSAO.removerComentario:
            temPermissao = verificarPermissaoSoDonoPode(idCriador)
            break;
        case PERMISSAO.criarDenuncia:
        case PERMISSAO.criarComentario:
        case PERMISSAO.curtirDenuncia:
            temPermissao = true;
            break;
        case PERMISSAO.criarSolucao:
        case PERMISSAO.gerenciarPessoas:
        case PERMISSAO.gerenciarTiposDeProblemas:
            temPermissao = verificarPermissaoSomenteAdminPode()
            break;
        case PERMISSAO.editarSolucao:
        case PERMISSAO.removerSolucao:
            temPermissao = verificarPermissaoSomenteAdminDonoPode(idCriador)
            break;
        default:
            mostrarAlerta('', 'Passou uma permissão desconhecida');
    }
    return temPermissao;
}

//-----------------------------------------------------------------------------

/**
 * Verifica se quem criou o Objeto é quem está operando o App.
 * 
 * @param objeto: Denuncia, Comentario Solucao, Curtida
 */
function verificarPermissaoSoDonoPode(idCriador) {
    //--- comparamos com o id do usuario logado
    let idUsuarioLogado = Cookies.get('appToken');

    return idCriador == idUsuarioLogado;
}

//-----------------------------------------------------------------------------

/**
 * Verifica se quem está operando o App é Admin
 */
function verificarPermissaoSomenteAdminPode() {
    return (USUARIO.admin == Cookies.get('appPerfilUsuario'));
}

//-----------------------------------------------------------------------------

/**
 * Verifica se quem criou o Objeto é quem está operando o App e ele é Admin.
 * 
 */
function verificarPermissaoSomenteAdminDonoPode(idCriador) {
    return verificarPermissaoSoDonoPode(idCriador) && verificarPermissaoSomenteAdminPode();
}

//-----------------------------------------------------------------------------

/**
 * Gerencia Pessoas: 
 *  Incluir: é feito no dialogo Entrar, opção 'Novo aqui? crie uma conta>'
 *  Editar:
 *  Remover:
 * 
 * @param event 
 */
function abrirDialogoGerenciarPessoas() {
    if (!temPermissao(PERMISSAO.gerenciarPessoas, Cookies.get('appToken'))) {
        mostrarAlerta('', 'Somente usuários Admin pode usar essa opção.')
    }

    //--- desligar a tela de Denuncias
    desligarPainelDenuncias()
    desligarTelaGerenciarTiposDeProblemas()
    desligarIconePaginaSemDenuncias()
    desligarDashboard()

    requisitarPessoasBackend();
    ligarTelaGerenciarPessoas()

}

//-----------------------------------------------------------------------------

/**
 * JSON: nenhum
 * request: GET /pessoas
 */
function requisitarPessoasBackend() {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/pessoas";

    xhr.open("GET", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (xhr.response.length != 0) {
                    var pessoas = JSON.parse(xhr.responseText);
                    if (pessoas.length != 0) {
                        mostrarPessoas(pessoas);
                    } else {
                        mostrarAlerta('', 'Não há pessoas pra gerenciar.');
                        ligarIconePaginaSemDenuncias();
                    }
                }
                resultado = true;
            } else {
                tester("Erro: " + this.statusText)
            }
        }
    };
    xhr.send();
    return resultado;
}

//-----------------------------------------------------------------------------

/**
 * Mostra a tela Gerenciamento de Pessoas
 */
function ligarTelaGerenciarPessoas() {
    document.querySelector("#telaGerenciarPessoas").style.display = 'block'
}

//-----------------------------------------------------------------------------

/**
 * Esconde a tela Gerenciamento de Pessoas
 */
function desligarTelaGerenciarPessoas() {
    document.querySelector("#telaGerenciarPessoas").style.display = 'none'
}


//-----------------------------------------------------------------------------

/**
 * Editar Pessoa. Obter Pessoa por Id.
 * 
 * JSON: nenhum
 * request: POST /pessoas
 */
function requisitarPessoaPorIdBackend2(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/pessoas/id";

    xhr.open("POST", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    json.jsonResposta = JSON.parse(xhr.responseText)
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Comentario não foram enviados  **/
                case 404: /** not found:    id de Comentario não existem no backend  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json.jsonRequisicao);
    return resultado;
}

//-----------------------------------------------------------------------------

/**
 * Remover Pessoa.
 * @param event 
 */
function abrirDialogoRemoverPessoa(event) {
    mostrarAlerta('', 'RemoverPessoa')
}

//-----------------------------------------------------------------------------

/**
 * Liga e Desliga os eventos de gerenciamento para uma Pessoa.
 * 
 * @param event 
 */
function ligarDesligarGerenciamentoPessoas(event) {
    //--- pega o id da Pessoa
    let idPessoa = event.target.getAttribute('idPessoa')
    let estaLigado = event.target.hasAttribute('ligado')

    //---procura pelo elemento 1
    let isAdmin = document.getElementById(idPessoa + '-1')

    //--- procura pelo elemento 2
    let icones = document.getElementById(idPessoa + '-2')

    if (!estaLigado) {
        //--- cria o atributo 'ligado' no event.target 
        event.target.setAttribute('ligado', '')

        isAdmin.classList.remove('disabledbutton')
        icones.classList.remove('disabledbutton')
    }
    else {
        event.target.removeAttribute('ligado')
        isAdmin.classList.add('disabledbutton')
        icones.classList.add('disabledbutton')
    }
}

//-----------------------------------------------------------------------------

/**
 * Liga e Desliga os eventos de gerenciamento para um Tipo de Problema.
 * 
 * @param event 
 */
function ligarDesligarGerenciamentoTDP(event) {
    //--- pega o id do TDP
    let idTipoDeProblema = event.target.getAttribute('idTipoDeProblema')
    let estaLigado = event.target.hasAttribute('ligado')

    //--- procura pelo elemento 1
    let icones = document.getElementById(idTipoDeProblema + '-1')

    if (!estaLigado) {
        //--- cria o atributo 'ligado' no event.target 
        event.target.setAttribute('ligado', '')
        icones.classList.remove('disabledbutton')
    }
    else {
        event.target.removeAttribute('ligado')
        icones.classList.add('disabledbutton')
    }
}

//-----------------------------------------------------------------------------

/**
 * Preenche dados das Pessoas contidas no App.
 * 
 * @param pessoas 
 */
function mostrarPessoas(pessoas) {
    document.body.style.zoom = "80%";

    let pontoInsercao = document.getElementById("pontoInsercaoTelaGerenciarPessoas");

    //--- tem nenhuma pessoa pra gerenciar, então 
    if (pessoas.length == 1) {
        pontoInsercao.innerHTML = `
        <div class="row" style="font-size: 22px; padding-left: 00px;">
            <div class="border-bottom border-secondary col-md-3 col-lg-4">Pessoas</div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block"></div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block"></div>
        </div>
      
        <div class="row" style="padding-left:10x;">
            <div class="border-bottom border-secondary col-md-3 col-lg-4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pessoas:</div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block" text-center>
            Não há Pessoas para gerenciar.
            </div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block"></div>
        </div>    
        `;
    } else {

        //--- limpamos a tela se existir uma anterior e injetamos novo conteudo
        pontoInsercao.innerHTML = `
        <div class="row" style="font-size: 22px; padding-left: 00px;">
            <div class="border-bottom border-secondary col-md-3 col-lg-4">Pessoas</div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block"></div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block"></div>
        </div>
    
        <div class="row" style="padding-left:10x;">
            <div class="border-bottom border-secondary col-md-3 col-lg-4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pessoas:</div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block"></div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block"></div>
        </div>

        `;

        //--- renderiza uma coluna por Denuncia contendo Comentarios e Solucoes ou não.
        for (i = 0; i < pessoas.length; i++) {
            pontoInsercao.insertAdjacentHTML('beforeend', (produzirHTMLGerenciarPessoas(pessoas[i])))
        }
    }
}

//-----------------------------------------------------------------------------

/**
 * Cria um template por Pessoa.
 * 
 * @param pessoa 
 */
function produzirHTMLGerenciarPessoas(pessoa) {
    let htmlPessoa = ``;

    if (pessoa.id == Cookies.get('appToken')) {
        return htmlPessoa
    }

    htmlPessoa = `

        <div class="row" style="padding-left:10x;">
            <div class="col-md-3 col-lg-4" style="padding-bottom: 0px; padding-top: 5px;">
                <form>
                    <div class="form-group form-check">
                        <label class="form-check-label">
                            <input idPessoa="${pessoa.id}" class="form-check-input" type="checkbox" onclick="ligarDesligarGerenciamentoPessoas(event)"> ${pessoa.nome}
                        </label>
                    </div>               
                </form>
            </div>
            
            <div id="${pessoa.id}-1" class="col-md-3 col-lg-4 disabledbutton" style="padding-bottom: 0px; padding-top: 5px;">
                <form>
                    <div class="form-group form-check">
                        <label class="form-check-label">
                            <input  class="form-check-input" type="checkbox" disabled ${pessoa.admin ? `checked` : ``}> É admin
                        </label>
                    </div>               
                </form>
            </div>

            <div id="${pessoa.id}-2" class="col-md-3 col-lg-4 disabledbutton" style="padding-bottom: 0px; padding-top: 5px;">
                <span><i title="editar"  idPessoa="${pessoa.id}" class="fa fa-pencil" aria-disabled="disabled" onclick="abrirDialogoEditarPessoa(event)"></i></span> 
                <span><i title="remover" idPessoa="${pessoa.id}" class="far fa-trash-can" aria-disabled="disabled" onclick="abrirDialogoRemoverPessoa(event)"></i></span>
            </div>     
        </div>

    `;
    return htmlPessoa
}

//-----------------------------------------------------------------------------

/**
 * Editar Pessoa.
 * @param event 
 */
function abrirDialogoEditarPessoa(event) {
    //--- obter id da pessoa pra requisitar seus dados
    let idPessoa = event.target.getAttribute('idPessoa')

    //--- solicitar os dados no backend
    let jsonRequisicao = JSON.stringify({ "id": idPessoa })
    let jsonResposta = null
    let json = { jsonRequisicao, jsonResposta }

    //--- pegamos o json a partir do backend: tipo de problema e descrição
    requisitarPessoaPorIdBackend(json)

    let nome = json.jsonResposta.nome
    let isAdmin = json.jsonResposta.admin

    //--- injetamos no botão OK os seguintes atributos
    let jsonInjecao = { "idPessoa": idPessoa }
    $('#dialogoEditarPessoa').on('show.bs.modal', injetarAtributos(jsonInjecao, 'botaoOkEditarPessoa'))
    $('#dialogoEditarPessoa').on('show.bs.modal', injetarValorEmCampo(nome, 'editarPessoaNome'))
    $('#dialogoEditarPessoa').on('show.bs.modal', injetarValorEmCampoCheckbox((isAdmin ? 'checked' : ''), 'editarPessoaIsAdmin'))

    //--- abrimos o dialogo e esperamos sair
    $('#dialogoEditarPessoa').modal('show');
}

//-----------------------------------------------------------------------------

function editarPessoa(event) {
    let nome = document.getElementById('editarPessoaNome').value

    valido = nome.trim().length != 0
    if (!valido) {
        ligarMsgErro('msgErroEditarPessoa')
        return false
    } else {
        desligarMsgErro('msgErroEditarPessoa')
    }

    let idPessoa = event.target.getAttribute('idPessoa')
    let isAdmin = document.getElementById('editarPessoaIsAdmin').checked

    let json = JSON.stringify({ "id": idPessoa, "nome": nome, "admin": isAdmin })

    tester(json)

    if (editarPessoaBackend(json)) {
        mostrarAlerta('', 'Pessoa editada com sucesso!')
    }

    $('#dialogoEditarPessoa').modal('hide');

    abrirDialogoGerenciarPessoas()

}

//-----------------------------------------------------------------------------

/**
 * Editar Pessoa.
 * 
 * request: PUT /pessoas
 */
function editarPessoaBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/pessoas";

    xhr.open("PUT", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Pessoa ou nome ou isAdmin não foram enviados  **/
                case 404: /** not found:    id de Pessoa não existe  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
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
* Remover Pessoa.
* @param event 
*/
function abrirDialogoRemoverPessoa(event) {
    //--- obter id da pessoa pra requisitar seus dados
    let idPessoa = event.target.getAttribute('idPessoa')

    //--- solicitar os dados no backend
    let jsonRequisicao = JSON.stringify({ "id": idPessoa })
    let jsonResposta = null
    let json = { jsonRequisicao, jsonResposta }

    //--- pegamos o json a partir do backend: tipo de problema e descrição
    requisitarPessoaPorIdBackend(json)

    let nome = json.jsonResposta.nome
    let isAdmin = json.jsonResposta.admin

    //--- injetamos no botão OK os seguintes atributos
    let jsonInjecao = { "idPessoa": idPessoa }
    $('#dialogoRemoverPessoa').on('show.bs.modal', injetarAtributos(jsonInjecao, 'botaoOkRemoverPessoa'))
    $('#dialogoRemoverPessoa').on('show.bs.modal', injetarValorEmCampo(nome, 'removerPessoaNome'))
    $('#dialogoRemoverPessoa').on('show.bs.modal', injetarValorEmCampoCheckbox((isAdmin ? 'checked' : ''), 'removerPessoaIsAdmin'))

    //--- abrimos o dialogo e esperamos sair
    $('#dialogoRemoverPessoa').modal('show');
}

//-----------------------------------------------------------------------------

function removerPessoa(event) {
    //--- pegamos apenas o id do comentário pra requisição de remoção 
    let idPessoa = event.target.getAttribute('idPessoa');

    //--- criamos um JSON pra requisição
    let json = JSON.stringify({ "id": idPessoa })

    //--- mandamos remover
    removerPessoaBackend(json)

    //--- fechamos o dialogo manualmente
    $('#dialogoRemoverPessoa').modal('hide')

    abrirDialogoGerenciarPessoas()

}

//-----------------------------------------------------------------------------

/**
 * Remover Pessoa.
 * 
 * JSON: {"id": idPessoa}
 * 
 * request: DELETE /pessoas
 */
function removerPessoaBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/pessoas";

    xhr.open("DELETE", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    resultado = true;
                    break;
                case 400: /** bad request:  id de pessoa não foi enviado  **/
                case 403:
                    mostrarAlerta('Remoção não é possível', 'Usuário possui Denúncias ou Comentário ou Solução em Denúncia.')
                    break;
                case 404: /** not found:    id de pessoa não existe no backend  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
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
 * Gerencia Pessoas: 
 *  Incluir: é feito no dialogo Entrar, opção 'Novo aqui? crie uma conta>'
 *  Editar:
 *  Remover:
 * 
 * @param event 
 */
function abrirDialogoGerenciarTiposDeProblemas() {
    if (!temPermissao(PERMISSAO.gerenciarTiposDeProblemas, Cookies.get('appToken'))) {
        mostrarAlerta('', 'Somente usuários Admin pode usar essa opção.')
    }

    //--- desligar a tela de Denuncias
    desligarPainelDenuncias()
    desligarTelaGerenciarPessoas()
    desligarIconePaginaSemDenuncias()
    desligarDashboard()

    requisitarTiposDeProblemasBackend2()
    ligarTelaGerenciarTiposDeProblemas()

}

//-----------------------------------------------------------------------------

/**
 * JSON: nenhum
 * request: GET /pessoas
 */
function requisitarTiposDeProblemasBackend2() {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/tiposdeproblemas";

    xhr.open("GET", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (xhr.response.length != 0) {
                    var tiposDeProblemas = JSON.parse(xhr.responseText);
                    mostrarTiposDeProblemas(tiposDeProblemas);
                }
                resultado = true;
            } else {
                tester("Erro: " + this.statusText)
                ligarIconePaginaSemDenuncias();
            }
        }
    };
    xhr.send();
    return resultado;
}

//-----------------------------------------------------------------------------

/**
 * Mostra a tela Gerenciamento de Tipos de Problemas
 */
function ligarTelaGerenciarTiposDeProblemas() {
    document.querySelector("#telaGerenciarTiposDeProblemas").style.display = 'block'
}

//-----------------------------------------------------------------------------

/**
 * Esconde a tela Gerenciamento de Tipos de Problemas
 */
function desligarTelaGerenciarTiposDeProblemas() {
    document.querySelector("#telaGerenciarTiposDeProblemas").style.display = 'none'
}


//-----------------------------------------------------------------------------

/**
 * Preenche dados dos Tipos de Problemas contidas no App.
 * 
 * @param tiposDeProblemas 
 */
function mostrarTiposDeProblemas(tiposDeProblemas) {
    document.body.style.zoom = "80%";

    let pontoInsercao = document.getElementById("pontoInsercaoTelaGerenciarTiposDeProblemas");
    let botaoAdicionar = ``; 

    if(tiposDeProblemas.length == 0){
        //--- limpamos a tela se existir uma anterior e injetamos novo conteudo
        pontoInsercao.innerHTML = `
        <div class="row" style="font-size: 22px; padding-left: 00px;">
            <div class="border-bottom border-secondary col-md-3 col-lg-4">Tipos de Problemas</div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block"></div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block"></div>
        </div>
    
        <div class="row" style="padding-left:10x;">
            <div class="border-bottom border-secondary col-md-3 col-lg-4">&nbsp;&nbsp;&nbsp;&nbsp;Tipos de Problemas:</div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block text-center">
                Não há Tipos de Problemas por enquanto.
            </div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block">
            </div>
        </div>
    
        `;

        botaoAdicionar = `
            <div class="row mt-4 mb-4" style="padding-left:10x;">
                <div class="col-md-3 col-lg-4" style="padding-bottom: 0px; padding-top: 5px;">
                </div>
                
                <div class="text-center col-md-3 col-lg-4" style="padding-bottom: 0px; padding-top: 5px;">       
                    <span>
                        <button type="button" class="btn btn-primary rounded-circle">
                            <i title="incluir" class="fa fa-plus" aria-disabled="disabled" onclick="abrirDialogoIncluirTipoDeProblema(event)">
                            </i>
                        </button>
                    </span>
                </div>     

            </div>      
            
        `;
        
    }else{
        //--- limpamos a tela se existir uma anterior e injetamos novo conteudo
        pontoInsercao.innerHTML = `
        <div class="row" style="font-size: 22px; padding-left: 00px;">
            <div class="border-bottom border-secondary col-md-3 col-lg-4">Tipos de Problemas</div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block"></div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block"></div>
        </div>
    
        <div class="row" style="padding-left:10x;">
            <div class="border-bottom border-secondary col-md-3 col-lg-4">&nbsp;&nbsp;&nbsp;&nbsp;Tipos de Problemas:</div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block">
            </div>
            <div class="border-bottom border-secondary col-md-3 col-lg-4 .d-none .d-md-none .d-lg-block">
            </div>
        </div>
    
        `;

        //--- renderiza uma coluna por Denuncia contendo Comentarios e Solucoes ou não.
        for (i = 0; i < tiposDeProblemas.length; i++) {
            pontoInsercao.insertAdjacentHTML('beforeend', (produzirHTMLGerenciarTiposDeProblemas(tiposDeProblemas[i])))
        }

        botaoAdicionar = `
            <div class="row mt-4 mb-4" style="padding-left:10x;">
                <div class="col-md-3 col-lg-4" style="padding-bottom: 0px; padding-top: 5px;">
                </div>
                
                <div class="text-center col-md-3 col-lg-4" style="padding-bottom: 0px; padding-top: 5px;">       
                    <span>
                        <button type="button" class="btn btn-primary rounded-circle">
                            <i title="incluir" class="fa fa-plus" aria-disabled="disabled" onclick="abrirDialogoIncluirTipoDeProblema(event)">
                            </i>
                        </button>
                    </span>
                </div>     

            </div>      
            
        `;

    }

    pontoInsercao.insertAdjacentHTML('beforeend', botaoAdicionar);
}

//-----------------------------------------------------------------------------

/**
 * Cria um template por Tipo de Problema.
 * 
 * @param tipoDeProblema 
 */
function produzirHTMLGerenciarTiposDeProblemas(tipoDeProblema) {
    let htmlTipoDeProblema = `

        <div class="row" style="padding-left:10x;">
            <div class="col-md-3 col-lg-4" style="padding-bottom: 0px; padding-top: 5px;">
                <form>
                    <div class="form-group form-check">
                        <label class="form-check-label">
                            <input idTipoDeProblema="${tipoDeProblema.id}" class="form-check-input" type="checkbox" onclick="ligarDesligarGerenciamentoTDP(event)"> ${tipoDeProblema.descricao}
                        </label>
                    </div>               
                </form>
            </div>
            
            <div class="col-md-3 col-lg-4" style="padding-bottom: 0px; padding-top: 5px;">
            </div>
            
            <div id="${tipoDeProblema.id}-1" class="col-md-3 col-lg-4 disabledbutton" style="padding-bottom: 0px; padding-top: 5px;">
                <span><i title="editar"  idTipoDeProblema="${tipoDeProblema.id}" class="fa fa-pencil" aria-disabled="disabled" onclick="abrirDialogoEditarTipoDeProblema(event)"></i></span> 
                <span><i title="remover" idTipoDeProblema="${tipoDeProblema.id}" class="far fa-trash-can" aria-disabled="disabled" onclick="abrirDialogoRemoverTipoDeProblema(event)"></i></span>
            </div>     
        </div>

    `;
    return htmlTipoDeProblema
}


//-----------------------------------------------------------------------------

/**
 * Editar Tipo de Problema.
 * @param event 
 */
function abrirDialogoEditarTipoDeProblema(event) {
    //--- obter id Tipo De Problema pra requisitar seus dados
    let idTipoDeProblema = event.target.getAttribute('idTipoDeProblema')

    //--- solicitar os dados no backend
    let jsonRequisicao = JSON.stringify({ "id": idTipoDeProblema })
    let jsonResposta = null
    let json = { jsonRequisicao, jsonResposta }

    //--- pegamos o json a partir do backend: tipo de problema e descrição
    requisitarTipoDeProblemaPorIdBackend(json)

    let descricao = json.jsonResposta.descricao

    //--- injetamos no botão OK os seguintes atributos
    let jsonInjecao = { "idTipoDeProblema": idTipoDeProblema }
    $('#dialogoEditarTipoDeProblema').on('show.bs.modal', injetarAtributos(jsonInjecao, 'botaoOkEditarTipoDeProblema'))
    $('#dialogoEditarTipoDeProblema').on('show.bs.modal', injetarValorEmCampo(descricao, 'editarTipoDeProblemaDescricao'))

    //--- abrimos o dialogo e esperamos sair
    $('#dialogoEditarTipoDeProblema').modal('show');
}

//-----------------------------------------------------------------------------

/**
 * JSON: {"id": appToken}
 * request: POST /tipodeproblemas/id
 */
function requisitarTipoDeProblemaPorIdBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/tiposdeproblemas/id";

    xhr.open("POST", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    json.jsonResposta = JSON.parse(xhr.responseText);
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Pessoa não foi enviado  **/
                case 404: /** not found:    id de Pessoa não existem  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json.jsonRequisicao);
    return resultado;
}

//-----------------------------------------------------------------------------

function editarTipoDeProblema(event) {
    let descricao = document.getElementById('editarTipoDeProblemaDescricao').value

    valido = descricao.trim().length != 0
    if (!valido) {
        ligarMsgErro('msgErroEditarTipoDeProblema')
        return false
    } else {
        desligarMsgErro('msgErroEditarTipoDeProblema')
    }

    let idTipoDeProblema = event.target.getAttribute('idTipoDeProblema')

    let json = JSON.stringify({ "id": idTipoDeProblema, "descricao": descricao })

    tester(json)

    if (editarTipoDeProblemaBackend(json)) {
        mostrarAlerta('', 'Tipo de Problema editado com sucesso!')
    }

    $('#dialogoEditarTipoDeProblema').modal('hide');

    abrirDialogoGerenciarTiposDeProblemas()

}

//-----------------------------------------------------------------------------

/**
 * Editar Pessoa.
 * 
 * request: PUT /pessoas
 */
function editarTipoDeProblemaBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/tiposdeproblemas";

    xhr.open("PUT", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Tipo de Problema ou descricao ou isAdmin não foram enviados  **/
                    mostrarAlerta('Problema na Requisição', '400: Requisição mal feita.')
                    break
                case 404: /** not found:    id de Tipo de Problema não existe  **/
                    mostrarAlerta('Problema na Requisição', '404: Não encontrou.')
                    break
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
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
* Remover Tipo de Problema.
* @param event 
*/
function abrirDialogoRemoverTipoDeProblema(event) {
    //--- obter id Tipo De Problema pra requisitar seus dados
    let idTipoDeProblema = event.target.getAttribute('idTipoDeProblema')

    //--- solicitar os dados no backend
    let jsonRequisicao = JSON.stringify({ "id": idTipoDeProblema })
    let jsonResposta = null
    let json = { jsonRequisicao, jsonResposta }

    //--- pegamos o json a partir do backend: tipo de problema e descrição
    requisitarTipoDeProblemaPorIdBackend(json)

    let descricao = json.jsonResposta.descricao

    //--- injetamos no botão OK os seguintes atributos
    let jsonInjecao = { "idTipoDeProblema": idTipoDeProblema }
    $('#dialogoRemoverTipoDeProblema').on('show.bs.modal', injetarAtributos(jsonInjecao, 'botaoOkRemoverTipoDeProblema'))
    $('#dialogoRemoverTipoDeProblema').on('show.bs.modal', injetarValorEmCampo(descricao, 'removerTipoDeProblemaDescricao'))

    //--- abrimos o dialogo e esperamos sair
    $('#dialogoRemoverTipoDeProblema').modal('show');
}

//-----------------------------------------------------------------------------

function removerTipoDeProblema(event) {
    let idTipoDeProblema = event.target.getAttribute('idTipoDeProblema')

    let json = JSON.stringify({ "id": idTipoDeProblema })

    tester(json)

    if (removerTipoDeProblemaBackend(json)) {
        mostrarAlerta('', 'Tipo de Problema removido com sucesso!')
    }

    $('#dialogoRemoverTipoDeProblema').modal('hide');

    abrirDialogoGerenciarTiposDeProblemas()

}

//-----------------------------------------------------------------------------

/**
 * Remover Tipo de Problema.
 * 
 * JSON: {"id": idTipoDeProblema}
 * 
 * request: DELETE /tipodesolucoes
 */
function removerTipoDeProblemaBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/tiposdeproblemas";

    xhr.open("DELETE", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Tipo de Problema não foi enviados  **/
                case 403:
                    mostrarAlerta('Remoção não é possível.', 'Tipo de Problema já usado em Denúncia.')
                    break
                case 404: /** not found:    id de Tipo de Problema não existe no backend  **/
                    mostrarAlerta('Remoção não é possível.', 'Tipo de Problema não foi encontrado.')
                    break
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
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
* Incluir Tipo de Problema.
* @param event 
*/
function abrirDialogoIncluirTipoDeProblema(event) {

    //--- abrimos o dialogo e esperamos sair
    $('#dialogoIncluirTipoDeProblema').modal('show');
}

//-----------------------------------------------------------------------------

function incluirTipoDeProblema(event) {
    let descricao = document.getElementById('incluirTipoDeProblemaDescricao').value

    valido = descricao.trim().length != 0
    if (!valido) {
        ligarMsgErro('msgErroIncluirTipoDeProblema')
        return false
    } else {
        desligarMsgErro('msgErroIncluirTipoDeProblema')
    }

    let json = JSON.stringify({ "descricao": descricao })

    tester(json)

    if (incluirTipoDeProblemaBackend(json)) {
        mostrarAlerta('', 'Tipo de Problema incluido com sucesso!')
    }

    $('#dialogoIncluirTipoDeProblema').modal('hide');

    abrirDialogoGerenciarTiposDeProblemas()

}

//-----------------------------------------------------------------------------

/**
 * Incluir Pessoa.
 * 
 * request: POST /pessoas
 */
function incluirTipoDeProblemaBackend(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/tiposdeproblemas";

    xhr.open("POST", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 201: /** created **/
                    resultado = true;
                    break;
                case 400: /** bad request:  descricao não foi enviados  **/
                    mostrarAlerta('Problema na Requisição', '400: Requisição mal feita.')
                    break
                case 413: /** too large:    descrição muito grande  **/
                    mostrarAlerta('Problema na Requisição', '413: Descrição muito grande.')
                    break
                case 500:
                    mostrarAlerta('', 'Erro de servidor ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send(json);
    return resultado;
}


//-----------------------------------------------------------------------------

function ligarDashboard() {
    document.getElementById('dashboard').style.display = 'block'
 }
 
 //-----------------------------------------------------------------------------
 
 function desligarDashboard() {
    document.getElementById('dashboard').style.display = 'none'
 }
 
 //-----------------------------------------------------------------------------
 
 /**
  * DadosParaDashboard: JSON
  * {
  *    data1: [6, 5, 4, 3, 2, 1],
  *    data2: [1, 2, 3, 4, 5, 6]
  * }
  */

 //--- atenção: variavel global, pois temos que destruir o gráfico antes de fazer outro.
 let myChart = null;

 function abrirDashboard() {
    //--- esconde todas as outras janelas
    desligarTudo()

    //--- requisição ao backend de dados para o dashboard e lá ele mostra o gráfico
    requisitarDadosDashboardBackend()
    ligarDashboard()
 }
 
 //-----------------------------------------------------------------------------

 function desligarTudo(){
    desligarIconePaginaSemDenuncias()
    desligarPainelDenuncias()
    desligarTelaGerenciarPessoas()
    desligarTelaGerenciarTiposDeProblemas()            
 }

//-----------------------------------------------------------------------------

function mostrarGraficoDeBarrasDashboard(json){
    const ctx = document.getElementById('myChart').getContext('2d');
    
    //--- se for diferente de null, já foi utilizado antes, então vamos destrui-lo
    if(myChart != null){
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
       type: 'bar',
       data: {
          labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
          datasets: [
             {
                label: 'Denúncia aberta',
                data: json.data1,                       //[6, 5, 4, 3, 2, 1],
                backgroundColor: [
                   'rgba(255, 99, 132, 0.2)',
                   'rgba(255, 99, 132, 0.2)',
                   'rgba(255, 99, 132, 0.2)',
                   'rgba(255, 99, 132, 0.2)',
                   'rgba(255, 99, 132, 0.2)',
                   'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                   'rgba(255, 165, 184, 1)',
                   'rgba(255, 165, 184, 1)',
                   'rgba(255, 165, 184, 1)',
                   'rgba(255, 165, 184, 1)',
                   'rgba(255, 165, 184, 1)',
                   'rgba(255, 165, 184, 1)',
                ],
                borderWidth: 1
             },
             {
                label: 'Denúncia fechada',
                data: json.data2,                       //[1, 2, 3, 4, 5, 6],
                backgroundColor: [
                   'rgba(75, 192, 192, 0.2)',
                   'rgba(75, 192, 192, 0.2)',
                   'rgba(75, 192, 192, 0.2)',
                   'rgba(75, 192, 192, 0.2)',
                   'rgba(75, 192, 192, 0.2)',
                   'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                   'rgba(127, 210, 210, 1)',
                   'rgba(127, 210, 210, 1)',
                   'rgba(127, 210, 210, 1)',
                   'rgba(127, 210, 210, 1)',
                   'rgba(127, 210, 210, 1)',
                   'rgba(127, 210, 210, 1)',
                ],
                borderWidth: 1
             }
          ],
 
       },
       options: {
          layout: {
             padding: 100
          },
          scales: {
             y: {
                beginAtZero: true
             }
          }
       }
    });
     
}

 //-----------------------------------------------------------------------------
 
 function requisitarDadosDashboardBackend2() {
    return { "data1": [6, 5, 4, 3, 2, 1], "data2": [1, 2, 3, 4, 5, 6] }
 }

//-----------------------------------------------------------------------------


 /**
 * Requisitar dados para o Dashboard.
 * 
 * request: POST /dashboard
 */
function requisitarDadosDashboardBackend() {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/dashboard";

    xhr.open("POST", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200: /** ok **/
                    json = JSON.parse(xhr.responseText)
                    mostrarGraficoDeBarrasDashboard(json)
                    resultado = true;
                    break;
                case 400: /** bad request:  id de Pessoa ou id de Tipo de Problema não foram  **/
                case 404: /** not found:    id de Pessoa ou id de Tipo de Problema não foram não existem  **/
                case 500:
                    mostrarAlerta('', 'Erro de servidor: ' + this.statusText)
                    resultado = false;
                    break;
            }
        }
    };
    xhr.send();
    return resultado;
}

//-----------------------------------------------------------------------------