package appdev.dominio;

import appdev.Utils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.transaction.Transactional;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Representa um Comentário. Padrão Active Record.
 */
@Entity
@Table(name = "Comentarios")
public class Comentario extends PanacheEntityBase implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @GeneratedValue(generator = "uuid")
    @Column(name="comentarios_id", length = 40)
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

    /**
     * @param comentarioRequisicao
     * @return true se inclusa ok | false se não encontrou ou denuncia ou pessoa.
     */
    @Transactional
    public static boolean incluir(ComentarioRequisicao comentarioRequisicao) {
        boolean resultado = false;
        Denuncia denuncia = Denuncia.findById(comentarioRequisicao.idDenuncia);
        Pessoa pessoa = Pessoa.findById(comentarioRequisicao.idPessoa);

        if(denuncia != null && pessoa != null){
            Comentario comentario = new Comentario();
            comentario.setDenuncia(denuncia);
            comentario.setPessoa(pessoa);
            comentario.setDescricao(comentarioRequisicao.descricao);
            comentario.setDataHora(Utils.convertePraLocalDateTime(comentarioRequisicao.dataHora));
            comentario.persist();

            resultado = true;
        }

        return resultado;
    }

    /**
     *
     * @param comentarioRequisicao
     * @return true encontrou ou alterou Comentario | false se não encontrou o Comentario
     */
    @Transactional
    public static boolean alterar(ComentarioRequisicao comentarioRequisicao) {
        boolean resultado = false;
        Comentario comentario = Comentario.findById(comentarioRequisicao.id);

        if(comentario != null){
            //--- se descricao é diferente do gravado, alterar descricao e datahora
            if(!comentario.getDescricao().equalsIgnoreCase(comentarioRequisicao.descricao)){
                comentario.setDescricao(comentarioRequisicao.descricao);
                comentario.setDataHora(LocalDateTime.now());
                comentario.persist();
            }
            resultado = true;
        }
        return resultado;
    }

    /**
     * @param comentarioRequisicao
     * @return true se deletou | false se não
     */
    @Transactional
    public static boolean remover(ComentarioRequisicao comentarioRequisicao) {
        return Comentario.deleteById(comentarioRequisicao.id);
    }

    /**
     * @param comentarioRequisicao
     * @return objeto Comentarios se encontrou | null se não
     */
    public static Comentario encontrarPorId(ComentarioRequisicao comentarioRequisicao) {
        return Comentario.findById(comentarioRequisicao.id);
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
