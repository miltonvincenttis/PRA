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
    let senha1Valor = document.querySelector('#senhaInput1').value;
    let senha2Valor = document.querySelector('#senhaInput2').value;

    let temErroUsuarioInput = usuarioValor.length == 0;
    let temErroSenhaInput1 = senha1Valor.length == 0;
    let temErroSenhaInput2 = senha2Valor.length == 0;

    //--- debug
    tester('usuarioInput: ' + usuarioValor + '\n' + 'senhaInput1: ' + senha1Valor + '\n' + 'senhaInput2:'+senha2Valor);

    ligaDesligaMsgErroInput(temErroUsuarioInput, temErroSenhaInput1, temErroSenhaInput2);

    let temErroSenhasDiferentes = (senha1Valor != senha2Valor);

    ligaDesligaErroSenhasDiferentes(temErroSenhasDiferentes);
    if(!temErroSenhasDiferentes){

        //--- se nao tem erros de valor vazio, enviar os dados para o servidor
        if (!temErroUsuarioInput && !temErroSenhaInput1 && !temErroSenhaInput2) {

            //--- cria um objeto JSON e envia ao servidor para validacao
            json = JSON.stringify({ usuario: usuarioValor, senha: senha1Valor });

            let resposta = enviarDadosParaServidor(json);

            if (resposta) {
                //--- aqui tornamos invisivel a mensagem de erro
                desligarValidacao();
                
                //---Tivemos uma resposta positiva do servidor então redirecionar pra pagina principal
                document.location.href = 'index.html';

            } else {
                //--- tornar visivel a mensagem de erro de validacao do servidor
                ligarValidacao();
            }
        }
    }
}


//-----------------------------------------------------------------------------


/**
 * JSON: argumento da funcao
 * { "usuario": usuarioForm, "password": senha}
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
    let async = false;  //--- assincrono pq estamos transitando por paginas
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/registrar";

    xhr.open("POST", url, async);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 201) {
                if( xhr.response.length != 0){
                  var response = JSON.parse(xhr.responseText);
                  tester(response);
                }
                resultado = true;
                //--- esconde qualquer erro anterior
                desligarValidacao();

            //--- liga erro de nome existente    
            }else if(xhr.status === 403){
                tester("Erro: "+this.statusText);
                ligarValidacao();
            }
        }
    };
    xhr.send(json);
    return resultado;
}

//-----------------------------------------------------------------------------


/**
 * Esconde ou exibe a mensagem de erro id: #msgErroSenhaDiferentes na pagina registrar.html 
 */
function ligaDesligaErroSenhasDiferentes(temErroSenhasDiferentes){
    let msgErroSenha2 = document.querySelector('#msgErroSenhaDiferentes');

    if (temErroSenhasDiferentes) {
        msgErroSenha2.style.visibility = 'visible';
    } else {
        msgErroSenha2.style.visibility = 'hidden';
    }

}


//-----------------------------------------------------------------------------


/**
 * Esconde ou exibe a mensagem de erro id: #msgErroUsuario, #msgErroSenha1, #msgErroSenha2
 * @param {*} temErroUsuarioInput 
 * @param {*} temErroSenhaInput1 
 * @param {*} temErroSenhaInput2 
 */
function ligaDesligaMsgErroInput(temErroUsuarioInput, temErroSenhaInput1, temErroSenhaInput2) {
    //--- divs msg erros
    let msgErroUsuario = document.querySelector('#msgErroUsuario');
    let msgErroSenha1 = document.querySelector('#msgErroSenha1');
    let msgErroSenha2 = document.querySelector('#msgErroSenha2');

    if (temErroUsuarioInput) {
        msgErroUsuario.style.visibility = 'visible';
    } else {
        msgErroUsuario.style.visibility = 'hidden';
    }

    if (temErroSenhaInput1) {
        msgErroSenha1.style.visibility = 'visible';
    } else {
        msgErroSenha1.style.visibility = 'hidden';
    }

    if (temErroSenhaInput2) {
        msgErroSenha2.style.visibility = 'visible';
    } else {
        msgErroSenha2.style.visibility = 'hidden';
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