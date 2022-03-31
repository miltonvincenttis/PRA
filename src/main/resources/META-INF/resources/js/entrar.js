//-----------------------------------------------------------------------------

/**
 * Funcao pra ajudar a debugar. Basta comentar //console.log que nada saira no console.
 * @param {*} algo 
 */
function tester(algo) {
    console.log('Tester| ' + algo);
}

//-----------------------------------------------------------------------------

/**
 * Tratamento de envio de dados do formulario entrar.html.
 */
function validarDadosForm() {
    //--- verificar primeiro: todos dados entrados?
    let usuarioValor = document.querySelector('#usuarioInput').value;
    let senhaValor = document.querySelector('#senhaInput').value;

    let temErroUsuarioInput = usuarioValor.length == 0;
    let temErroSenhaInput = senhaValor.length == 0;
    let resultado = false;

    //--- debug
    tester('usuarioInput: ' + usuarioValor + '\n' + 'senhaInput: ' + senhaValor);

    ligaDesligaMsgErro(temErroUsuarioInput, temErroSenhaInput);

    //--- se nao tem erros enviar os dados para o servidor
    if (!temErroUsuarioInput && !temErroSenhaInput) {
        //--- resposta é true = se tudo ocorreu ok, false = houve erro de validacao

        //--- cria um objeto JSON, a partir de um objeto JS, e envia ao servidor para validacao
        json = JSON.stringify({ usuario: usuarioValor, senha: senhaValor });

        //--- essa chamada ao servidor é sincrona, pois se trata de uma trasição entre paginas.
        resultado = enviarDadosParaServidor(json);
        if(resultado){
            document.location.href = 'index.html';
        }
    }
}

//-----------------------------------------------------------------------------

/**
 * JSON: argumento da funcao
 * { "usuario": usuarioForm, "senha": senha}
 * 
 * 
 * Deve responder com cookie contendo o seguinte:
 * -appToken
 * -appNomeUsuario
 * -appPerfilUsuario  => 'admin' ou 'comum'
 * 
 * Os valores do cookie são globais, portanto todas as paginas podem consultar os valores com o seguinte codigo:
 *  Cookies.get('appToken');    
 *  Cookies.get('appNomeUsuario');
 *  Cookies.get('appPerfilUsuario');
 * 
 * @param { valor string } usuarioForm 
 * @param { valor string } senhaForm 
 * @returns true=se resposta do servidor ok, false=resposta do servidor não ok
 */
function enviarDadosParaServidor(json) {
    let resultado = false;
    let async = false;
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/entrar";

    xhr.open("POST", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if( xhr.response.length != 0){
                  var response = JSON.parse(xhr.responseText);
                  tester(response);
                }
                resultado = true;
                desligarValidacao();
            }else{
                tester("Erro: "+this.statusText)
                ligarValidacao();
            }
        }
    };
    xhr.send(json);
    return resultado;
}

//-----------------------------------------------------------------------------

function ligaDesligaMsgErro(temErroUsuarioInput, temErroSenhaInput) {
    //--- divs msg erros
    let msgErroUsuario = document.querySelector('#msgErroUsuario');
    let msgErroSenha = document.querySelector('#msgErroSenha');

    if (temErroUsuarioInput) {
        msgErroUsuario.style.visibility = 'visible';
    } else {
        msgErroUsuario.style.visibility = 'hidden';
    }

    if (temErroSenhaInput) {
        msgErroSenha.style.visibility = 'visible';
    } else {
        msgErroSenha.style.visibility = 'hidden';
    }
}

//-----------------------------------------------------------------------------

/**
 * Desliga a mensagem de validacao do servidor
 */
function desligarValidacao() {
    document.querySelector('#msgErroServidor').style.visibility = 'hidden';
}

/**
 *  Liga a mensagem de validacao do servidor
 */
 function ligarValidacao() {
    document.querySelector('#msgErroServidor').style.visibility = 'visible';
}

//-----------------------------------------------------------------------------

/**
 * Limpa msgs de alerta do input que tiver messagem de erro, que estiver sendo digitado no momento.
 */
function limparAlerta(idMsgErro) {
    document.querySelector(idMsgErro).style.visibility = 'hidden';
}