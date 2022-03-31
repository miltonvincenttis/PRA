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
        boolean resultado = false;
        Denuncia denuncia = Denuncia.findById(solucaoRequisicao.idDenuncia);
        Pessoa pessoa = Pessoa.findById(solucaoRequisicao.idPessoa);

        Comentario solucao = new Comentario();
        if(denuncia != null && pessoa != null){
            solucao.setDenuncia(denuncia);
            solucao.setPessoa(pessoa);
            solucao.setDescricao(solucaoRequisicao.descricao);
            solucao.setDataHora(LocalDateTime.now());
            solucao.persist();

            resultado = true;
        }

        return resultado;
    }

    /**
     *
     * @param solucaoRequisicao
     * @return true encontrou ou alterou Solucao | false se não encontrou o Solucao
     */
    public static boolean alterar(SolucaoRequisicao solucaoRequisicao) {
        boolean resultado = false;
        Solucao solucao = Comentario.findById(solucaoRequisicao.id);

        if(solucao != null){
            //--- se descricao é diferente do gravado, alterar descricao e datahora
            if(!solucao.getDescricao().equalsIgnoreCase(solucaoRequisicao.descricao)){
                solucao.setDescricao(solucaoRequisicao.descricao);
                solucao.setDataHora(LocalDateTime.now());
                solucao.persist();
            }
            resultado = true;
        }
        return resultado;
    }

    /**
     *
     * @param solucaoRequisicao
     * @return true se deletou | false se não
     */
    public static boolean remover(SolucaoRequisicao solucaoRequisicao) {
        return Solucao.deleteById(solucaoRequisicao.id);
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
