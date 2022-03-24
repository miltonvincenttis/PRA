package appdev.dominio;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Representa uma Denúncia.
 */
@Entity
@Table(name = "denuncias")
public class Denuncia extends PanacheEntityBase implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @GeneratedValue(generator = "uuid")
    @Column(name = "denuncias_id", length = 40)
    private String id;

    @OneToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "pessoas_fk")
    private Pessoa pessoa;

    @OneToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "tipo_problemas_fk")
    private TipoProblema tipoDeProblema;

    @OneToMany
    @JoinColumn(name = "denuncias_fk")
    private Set<Comentario> comentarios = new HashSet();

    @OneToMany
    @JoinColumn(name = "denuncias_fk")
    private Set<Solucao> solucoes = new HashSet<>();

    @Column(name = "datahora")
    private LocalDateTime dataHora;

    @OneToMany
    @JoinColumn(name = "denuncias_fk")
    private Set<Curtida> curtidas = new HashSet<>();

    @Column(length = 140)
    private String descricao;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public TipoProblema getTipoDeProblema() {
        return tipoDeProblema;
    }

    public void setTipoDeProblema(TipoProblema tipoDeProblema) {
        this.tipoDeProblema = tipoDeProblema;
    }

    public Set<Comentario> getComentarios() {
        return comentarios;
    }

    public void setComentarios(Set<Comentario> comentarios) {
        this.comentarios = comentarios;
    }

    public Set<Solucao> getSolucoes() {
        return solucoes;
    }

    public void setSolucoes(Set<Solucao> solucoes) {
        this.solucoes = solucoes;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public Set<Curtida> getCurtidas() {
        return curtidas;
    }

    public void setCurtidas(Set<Curtida> curtidas) {
        this.curtidas = curtidas;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
