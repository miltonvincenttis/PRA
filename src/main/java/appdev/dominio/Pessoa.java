package appdev.dominio;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * Representa uma Pessoa.
 */
@Entity
@Table(name="pessoas")
public class Pessoa extends PanacheEntityBase implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @GeneratedValue(generator = "uuid")
    private String id;

    @Column
    private String nome;

    @Column
    private boolean admin;

    @Column
    private String senha;

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

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("id", id)
                .append("nome", nome)
                .append("admin", admin)
                .append("senha", senha)
                .toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Pessoa pessoa = (Pessoa) o;
        return admin == pessoa.admin && id.equals(pessoa.id) && Objects.equals(nome, pessoa.nome) && Objects.equals(senha, pessoa.senha);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nome, admin, senha);
    }
}
