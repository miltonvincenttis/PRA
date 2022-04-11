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
            temPermissao = verificarPermissaoSomenteAdminPode(idCriador)
            break;
        case PERMISSAO.editarSolucao:    
        case PERMISSAO.removerSolucao:
            alert('Só Admin dono pode')
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