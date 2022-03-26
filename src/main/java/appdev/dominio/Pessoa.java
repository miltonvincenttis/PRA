package appdev.dominio;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.transaction.Transactional;
import java.io.Serializable;

/**
 * Representa uma Pessoa. Padrão Active Record.
 */
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
    public static Pessoa incluir(Registro registro, boolean isAdmin){
        Pessoa pessoa = new Pessoa();
        pessoa.setNome(registro.getUsuario());
        pessoa.setSenha(registro.getSenha());
        pessoa.setAdmin(isAdmin);
        pessoa.persist();
        return pessoa;
    }

    //--------------------------------------------------------------------------

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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
