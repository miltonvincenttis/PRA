package appdev.dominio;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Representa uma Solução. Padrão Active Record.
 */
@Entity
@Table(name = "Solucoes")
public class Solucao extends PanacheEntityBase implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @GeneratedValue(generator = "uuid")
    @Column(name="solucoes_id", length = 40)
    private String id;

    @Column(name = "datahora")
    private LocalDateTime dataHora;

    @Column(length = 140)
    private String descricao;

    @OneToOne
    @JoinColumn(name = "pessoas_fk")
    private Pessoa pessoa;

    @OneToOne
    @JoinColumn(name = "denuncias_fk")
    @JsonIgnore
    private Denuncia denuncia;

    public static boolean incluir(SolucaoRequisicao solucaoRequisicao) {
        return false;
    }

    public static boolean alterar(SolucaoRequisicao solucaoRequisicao) {
        return false;
    }

    public static boolean remover(SolucaoRequisicao solucaoRequisicao) {
        return false;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public Denuncia getDenuncia() {
        return denuncia;
    }

    public void setDenuncia(Denuncia denuncia) {
        this.denuncia = denuncia;
    }
}
