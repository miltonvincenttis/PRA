package appdev.dominio;

import appdev.Utils;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.transaction.Transactional;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Representa uma Denúncia. Padrão Active Record.
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
    private TipoDeProblema tipoDeProblema;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "denuncias_fk")
    private Set<Comentario> comentarios = new HashSet();

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "denuncias_fk")
    private Set<Solucao> solucoes = new HashSet<>();

    @Column(name = "datahora")
    private LocalDateTime dataHora;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "denuncia", cascade = CascadeType.ALL, orphanRemoval = true)
    //@JoinColumn(name = "denuncias_fk")
    private Set<Curtida> curtidas = new HashSet<>();

    @Column(length = 140)
    private String descricao;


    /**
     *
     * @param denunciaRequisicao
     * @return true se incluiu, false se Denuncia ou TipoDeProblema não foi encontrado
     */
    @Transactional
    public static boolean incluir(DenunciaRequisicao denunciaRequisicao){
        boolean resultado = false;
        Pessoa pessoa = Pessoa.findById(denunciaRequisicao.idPessoa);
        TipoDeProblema tpd = TipoDeProblema.findById(denunciaRequisicao.idTipoDeProblema);

        if(pessoa != null && tpd != null ){
            resultado = true;
            Denuncia denuncia = new Denuncia();
            denuncia.setDescricao(denunciaRequisicao.descricao);
            denuncia.setPessoa(pessoa);
            denuncia.setTipoDeProblema(tpd);
            System.out.println("DEBUGGING: "+denunciaRequisicao.dataHora);
            denuncia.setDataHora(Utils.convertePraLocalDateTime(denunciaRequisicao.dataHora));
            denuncia.persist();
        }

        return resultado;
    }

    /**
     * Campos possiveis de alteração:
     * -descricao
     * -idTipoDeProblema
     *
     * @param denunciaRequisicao
     * @return true se alterou, false se Denuncia ou TipoDeProblema não foi encontrado
     */
    @Transactional
    public static boolean alterar(DenunciaRequisicao denunciaRequisicao){
        boolean resultado = false;

        Denuncia denuncia = Denuncia.findById(denunciaRequisicao.id);
        TipoDeProblema tdp = null;

        if(denuncia != null){
            tdp = TipoDeProblema.findById(denunciaRequisicao.idTipoDeProblema);
        }

        if(denuncia != null && tdp != null){
            resultado = true;
            //--- se a descricao for diferente alteramos a datahora tambem
            if(!denuncia.getDescricao().equalsIgnoreCase(denunciaRequisicao.descricao)){
                denuncia.setDataHora(LocalDateTime.now());
                denuncia.setDescricao(denunciaRequisicao.descricao);
            }
            //--- atualizamos a referencia ao id do TipoDeProblema
            denuncia.setTipoDeProblema(tdp);
            denuncia.persist();
        }
        return resultado;
    }

    /**
     *
     * @param denunciaRequisicao
     * @return true se deletou false se não
     */
    @Transactional
    public static boolean remover(DenunciaRequisicao denunciaRequisicao){
        //--- remove as curtidas se tiver
        Curtida.delete("denuncias_fk",denunciaRequisicao.id);

        //--- anula as referencias pra não erros de integridade referencia,
        Denuncia denuncia = Denuncia.findById(denunciaRequisicao.id);
        denuncia.setPessoa(null);
        denuncia.setTipoDeProblema(null);
        denuncia.setCurtidas(null);
        denuncia.persist();

        return Denuncia.deleteById(denunciaRequisicao.id);
    }

    /**
     * Encontrar  Denuncia por id de Tipo de Problema.
     *
     * @param idTipoDeProblema
     * @return Denuncia ou null se não encontrou
     */
    @Transactional
    public static Denuncia encontrar(String idTipoDeProblema) {
        TipoDeProblema tpd = TipoDeProblema.findById(idTipoDeProblema);

        return Denuncia.find("tipoDeProblema", tpd).firstResult();
    }

    /**
     * Verifica se Denuncia tem Comentarios ou Soluções.
     *
     * @param denunciaRequisicao
     * @return
     */
    public static boolean podeRemover(DenunciaRequisicao denunciaRequisicao) {
        Denuncia denuncia = Denuncia.findById(denunciaRequisicao.id);

        boolean temComentario =  Comentario.find("denuncia", denuncia).firstResult() != null;
        boolean temSolucao = Solucao.find("denuncia", denuncia).firstResult() != null;
        return (!temSolucao && !temComentario);
    }

    /**
     * Procura Denuncia por id.
     * @param denunciaRequisicao
     * @return Denuncia.
     */
    public static Denuncia encontrarPorId(DenunciaRequisicao denunciaRequisicao) {
        return Denuncia.findById(denunciaRequisicao.id);
    }

    public void addCurtida(Denuncia denuncia, Pessoa pessoa){
        Curtida curtida = new Curtida();
        curtida.setDenuncia(denuncia);
        curtida.setPessoa(pessoa);
        curtida.setDenuncia(denuncia);
        curtida.setPessoa(pessoa);
        curtida.persist();
        curtidas.add(curtida);
    }

    public void removeCurtida(Curtida curtida){
        curtidas.remove(curtida);
        curtida.delete();
    }
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

    public TipoDeProblema getTipoDeProblema() {
        return tipoDeProblema;
    }

    public void setTipoDeProblema(TipoDeProblema tipoDeProblema) {
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
