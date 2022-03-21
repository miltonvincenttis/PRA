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
 * Essa função remove as informações que estão em cookies:
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