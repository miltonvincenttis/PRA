package appdev.dominio;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.transaction.Transactional;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

/**
 * Representa uma Pessoa. Padrão Active Record.
 */

@JsonIgnoreProperties({"senha"})
@Entity
@Table(name="pessoas")
public class Pessoa extends PanacheEntityBase implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @GeneratedValue(generator = "uuid")
    @Column(name = "pessoas_id", length = 40)
    private String id;

    @Column(length = 25)
    private String nome;

    @Column
    private boolean admin = false;

    @Column(length = 15)
    private String senha;

    //--------------------------------------------------------------------------

    /**
     * Encontra uma Pessoa pelo nome
     */
    @Transactional(Transactional.TxType.SUPPORTS)
    public static Pessoa encontrarPessoaPeloNome(final String nome){
        return Pessoa.find("nome", nome).firstResult();
    }

    //--------------------------------------------------------------------------

    /**
     * Grava uma Pessoa no banco de dados.
     */
    @Transactional
    public static Pessoa incluir(Registro registro){
        Pessoa pessoa = new Pessoa();
        pessoa.setNome(registro.getUsuario());
        pessoa.setSenha(registro.getSenha());
        //--- no registro inicial: usuário será 'comum'. Só usuario Admin pode mudar o tipo de usuário.
        pessoa.setAdmin(false);
        pessoa.persist();
        return pessoa;
    }

    //--------------------------------------------------------------------------

    /**
     * Pega os dados da requisição e tenta gravar o que veio de la.
     * Verifica se a idPessoa existe primeiro.
     *
     * @param pessoaAlterada
     * @return
     */
    @Transactional
    public static boolean alterar(PessoaRequisicao pessoaAlterada){
        boolean result = false;

        //--- achamos a Pessoa e configuramos seus campos vindo do frontend.
        Pessoa pessoa = Pessoa.findById(pessoaAlterada.id);
        if(pessoa != null ){
            //--- Nota: unicos campos alteraveis em Pessoa: nome, admin
            //--- senha e id não se alteram
            pessoa.setNome(pessoaAlterada.nome);
            pessoa.setAdmin(pessoaAlterada.admin);
            pessoa.persist();
            result = true;
        }
        return result;
    }

    /**
     * Remove direto sem choro nem vela.
     *
     * @param pessoaRequisicao
     * @return true conseguiu revover | false não conseguiu remover
     */
    @Transactional
    public static boolean remover(PessoaRequisicao pessoaRequisicao){
        Pessoa pessoa = Pessoa.findById(pessoaRequisicao.id);

        //--- deletamos todas as curtidas dessa Pessoa
        List<Curtida> curtidas = Curtida.find("pessoa", pessoa).list();
        for (Curtida curtida: curtidas) {
            Denuncia denuncia = curtida.getDenuncia();
            denuncia.removeCurtida(curtida);

            curtida.setPessoa(null);
            curtida.delete();
        }
        return Pessoa.deleteById(pessoaRequisicao.id);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    /**
     * O limite de nome separado por espaço é 12.
     * Portanto vamos Abreviar todo nome que for > 12;
     * @return String nome abrevidado
     */
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

}
