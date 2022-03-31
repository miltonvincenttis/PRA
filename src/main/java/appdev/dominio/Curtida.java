package appdev.dominio;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.transaction.Transactional;
import java.io.Serializable;
import java.util.Objects;

/**
 * Essa classe representa uma Curtida. Padrão Active Record.
 */
@JsonIgnoreProperties({"denuncia"})
@Entity
@Table(name = "Curtidas")
public class Curtida extends PanacheEntityBase implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @GeneratedValue(generator = "uuid")
    @Column(name="curtidas_id")
    private String id;

    @OneToOne
    @JoinColumn(name = "denuncias_fk")
    private Denuncia denuncia;

    @OneToOne
    @JoinColumn(name = "pessoas_fk")
    private Pessoa pessoa;

    @Transactional
    public static boolean curtir(CurtidaRequisicao curtidaRequisicao) {
        boolean resultado = false;

        Denuncia denuncia = Denuncia.findById(curtidaRequisicao.idDenuncia);
        Pessoa pessoa = Pessoa.findById(curtidaRequisicao.idPessoa);

        //--- verificamos se achamos a Denuncia e a Pessoa
        if(denuncia != null && pessoa != null){
            resultado = true;
            Curtida curtida = new Curtida();
            curtida.setDenuncia(denuncia);
            curtida.setPessoa(pessoa);
            curtida.persist();
        }
        return resultado;
    }

    @Transactional
    public static boolean descurtir(CurtidaRequisicao curtidaRequisicao) {
        return Curtida.deleteById(curtidaRequisicao.id);
    }

    @Transactional
    public static boolean jaCurtido(CurtidaRequisicao curtidaRequisicao, Denuncia denuncia, Pessoa pessoa){
        //--- 1o vamos verificar se não esta curtindo uma curtida anterior
       return Curtida.find("denuncia = ?1 and pessoa=?2", denuncia, pessoa ).firstResult() != null;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Denuncia getDenuncia() {
        return denuncia;
    }

    public void setDenuncia(Denuncia denuncia) {
        this.denuncia = denuncia;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("id", id)
                .append("denuncia", denuncia)
                .append("pessoa", pessoa)
                .toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Curtida curtida = (Curtida) o;
        return Objects.equals(id, curtida.id) && Objects.equals(denuncia, curtida.denuncia) && Objects.equals(pessoa, curtida.pessoa);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, denuncia, pessoa);
    }
}
