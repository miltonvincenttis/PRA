package appdev.dominio;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.transaction.Transactional;
import java.io.Serializable;

/**
 * Essa classe representa uma Curtida. Padrão Active Record.
 */
@Entity
@Table(name = "Curtidas")
public class Curtida extends PanacheEntityBase implements Serializable {
    @Id
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @GeneratedValue(generator = "uuid")
    @Column(name="curtidas_id")
    private String id;

    /**
     * TODO: achar um jeito de não serializar isso aqui!
     */
    @OneToOne
    @JoinColumn(name = "denuncias_fk")
    private Denuncia curtida;

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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Denuncia getDenuncia() {
        return curtida;
    }

    public void setDenuncia(Denuncia denuncia) {
        this.curtida = denuncia;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }
}
