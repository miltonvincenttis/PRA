package appdev.dominio;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.transaction.Transactional;
import javax.ws.rs.core.Response;
import java.io.Serializable;

/**
 * Representa um Tipo de Problema. Padrão Active Record.
 */
@Entity
@Table(name = "tiposDeProblemas")
public class TipoDeProblema extends PanacheEntityBase implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @GeneratedValue(generator = "uuid")
    @Column(name="tipo_problemas_id", length = 40)
    private String id;

    @Column(length = 140)
    private String descricao;

    /**
     *
     * @param tipoDeProblemaRequisicao
     * @return TipoDeProblema criado
     */
    @Transactional
    public static TipoDeProblema incluir(TipoDeProblemaRequisicao tipoDeProblemaRequisicao) {
        TipoDeProblema tpd = new TipoDeProblema();
        tpd.setDescricao(tipoDeProblemaRequisicao.descricao);
        tpd.persist();

        return tpd;
    }

    /**
     *
     * @param tipoDeProblemaRequisicao
     * @return
     */
    @Transactional
    public static boolean remover(TipoDeProblemaRequisicao tipoDeProblemaRequisicao) {
        return TipoDeProblema.deleteById(tipoDeProblemaRequisicao.id);
    }

    /**
     *
     * @param tipoDeProblemaRequisicao
     * @return true se alterou false se não encontrou
     */
    @Transactional
    public static TipoDeProblema alterar(TipoDeProblemaRequisicao tipoDeProblemaRequisicao) {
        TipoDeProblema tpd = TipoDeProblema.findById(tipoDeProblemaRequisicao.id);

        if(tpd != null){
            tpd.setDescricao(tipoDeProblemaRequisicao.descricao);
            tpd.persist();
            return tpd;
        }

        return null;
    }

    @Transactional
    public String getId() {
        return id;
    }

    @Transactional
    public String getDescricao() {
        return descricao;
    }

    @Transactional
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
