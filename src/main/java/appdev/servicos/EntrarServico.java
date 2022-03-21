package appdev.servicos;

import appdev.dominio.Pessoa;
import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import  javax.transaction.Transactional.TxType;

/**
 * Essa classe é responsavel por pesquisar o nome e a senha na base de dados.
 */
@ApplicationScoped
@Transactional(TxType.REQUIRED)
public class EntrarServico {
    /**
     * Encontra uma Pessoa pelo nome
     */
    @Transactional(TxType.SUPPORTS)
    public Pessoa encontrePessoaPeloNome(final String nome){
        return Pessoa.find("nome", nome).firstResult();
    }
}
