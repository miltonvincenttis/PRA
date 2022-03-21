package appdev.servicos;

import appdev.dominio.Pessoa;
import appdev.dominio.Registro;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;

import static javax.transaction.Transactional.TxType;

/**
 * Essa classe é responsavel por pesquisar o nome e gravar Pessoa sendo registada.
 */
@ApplicationScoped
@Transactional(TxType.REQUIRED)
public class RegistrarServico {
    //--------------------------------------------------------------------------

    /**
     * Encontra uma Pessoa pelo nome.
     */
    @Transactional
    public Pessoa encontrePessoaPeloNome(final String nome){
        return Pessoa.find("nome", nome).firstResult();
    }

    //--------------------------------------------------------------------------

    /**
     * Grava uma Pessoa no banco de dados.
     */
    @Transactional
    public Pessoa gravarPessoa(Registro registro, boolean isAdmin){
        Pessoa pessoa = new Pessoa();
        pessoa.setNome(registro.getUsuario());
        pessoa.setSenha(registro.getSenha());
        pessoa.setAdmin(isAdmin);
        pessoa.persist();
        return pessoa;
    }
}
