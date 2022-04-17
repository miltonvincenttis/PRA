package appdev.recursos;

import appdev.dominio.*;
import io.quarkus.panache.common.Sort;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Essa classe Recurso faz tratamento do Caso de Uso: Gerenciar Denuncias.
 *
 * Incluir
 * POST: /denuncia
 * 200: ok
 * 400: bad request: id de Pessoa ou TipoDeProblema não veio ou está vazio
 * 404: not found: não encontrou ou Pessoa ou TipoDeProblema
 *
 * Alterar
 * PUT: /denuncia
 * 200: ok
 * 400: bad request: id não veio ou está vazio
 * 404: not found : não encontrou a Denuncia ou o TipoDeProblema
 *
 * Remover
 * DELETE: /denuncia
 * 200: ok
 * 400: bad request: id não veio ou está vazio
 * 403: forbidden: encontrou Comentario ou Solucao
 * 404: not found: não encontrou a Denuncia
 *
 * Lista todas
 * GET: /denuncias/curtidas
 * 200: ok
 *
 * Incluir Curtida
 * POST: /denuncias/curtidas
 * 403: forbidden: proibido a operação correta é descurtir: veio o id da curtida
 * 200: ok
 * 404: not found: não encontrou ou a Pessoa ou a Denuncia
 *
 * Remover Curtida
 * DELETE: /denuncias/curtidas
 * 200: ok
 * 400: bad request: não veio id: da Curtida
 * 404: not found: não encontrou a Curtida ou a Denuncia
 */
@Path("/denuncias")
public class GerenciarDenunciasRecurso {
    /**
     * Encontra Denuncia por seu Id.
     *
     * @param denunciaRequisicao
     * @return Response
     */
    @Path("/id")
    @POST()
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response encontrarPorId(DenunciaRequisicao denunciaRequisicao){
        //--- verificamos que id veio, se não BAD REQUEST
        if (denunciaRequisicao.id == null || denunciaRequisicao.id.length() == 0) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Denuncia denuncia = Denuncia.encontrarPorId(denunciaRequisicao);

        if(denuncia != null){
            return Response.ok(denuncia).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }


    /***
     * Ok: testado
     * Incluir Denuncia.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response incluir(DenunciaRequisicao denunciaRequisicao){
        //--- verificamos que idPessoa e idTipoDeProblema vieram, se não BAD REQUEST
        if (denunciaRequisicao.idPessoa == null || denunciaRequisicao.idPessoa.length() == 0 ||
            denunciaRequisicao.idTipoDeProblema == null || denunciaRequisicao.idTipoDeProblema.length() == 0) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if (Denuncia.incluir(denunciaRequisicao)) {
            return Response.status(Response.Status.CREATED).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }


    /**
     * Ok: testado no insomnia.
     *
     * Campos que podem ser alterados:
     *
     * -descricao
     * -idTipoDeProblema
     *
     * @param denunciaRequisicao
     * @return 200 | 400 | 404
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response alterar(DenunciaRequisicao denunciaRequisicao) {
        //--- verificamos que o idDenuncia veio, se não BAD REQUEST
        if (denunciaRequisicao.id == null || denunciaRequisicao.id.length() == 0 ||
            denunciaRequisicao.idTipoDeProblema == null || denunciaRequisicao.idTipoDeProblema.length() == 0 ||
            denunciaRequisicao.descricao == null ||  denunciaRequisicao.descricao.length() == 0) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if (Denuncia.alterar(denunciaRequisicao)) {
            return Response.status(Response.Status.OK).build();
        }
        //--- não encontrou o id no banco de dados
        return Response.status(Response.Status.NOT_FOUND).build();
    }


    /**
     * Ok: testado no insomnia.
     *
     * Regra:
     *  -Pessoa deve ser a mesma que criou a Denuncia : Isso é verificado no frontend: usuario logado mesmo criou.
     *  -Não deve ter Comentario nem Solucao.
     *
     * @param denunciaRequisicao
     * @return 400, 403, 200, 404
     */
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response remover(DenunciaRequisicao denunciaRequisicao){
        //--- verificamos que o idDenuncia veio, se não BAD REQUEST
        if (denunciaRequisicao.id == null || denunciaRequisicao.id.length() == 0) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if(!Denuncia.podeRemover(denunciaRequisicao)){
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        if (Denuncia.remover(denunciaRequisicao)) {
            return Response.status(Response.Status.OK).build();
        }
        //--- não encontrou o id no banco de dados
        return Response.status(Response.Status.NOT_FOUND).build();
    }


    /**
     * Ok: testado no insomnia.
     *
     * Verificar qual o formato de resposta no arquivo: src/tests/denuncias-lista.json.
     * @return json
     */
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response listarTodas(){
        Sort sort = Sort.descending("datahora");
        List<Denuncia> denuncias = Denuncia.listAll(sort);

        return Response.ok(denuncias).build();
    }


    /**
     * Ok: testado no insomnia.
     *
     * A decisão de qual operação chamar, curtir ou descurtir é feito no frontend.
     *
     * @param curtidaRequisicao
     * @return 400, 403, 200, 404
     */
    @Path("/curtidas")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response curtir(CurtidaRequisicao curtidaRequisicao){
        //--- verifica se veio idPessoa e idDenuncia
        if(curtidaRequisicao.idDenuncia == null || curtidaRequisicao.idPessoa == null  ||
           curtidaRequisicao.idDenuncia.length() == 0 || curtidaRequisicao.idPessoa.length() == 0){

            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        //--- se veio o id da curtida então foi feito uma solicitação errada, pois já está curtida: proibido
        if(curtidaRequisicao.id != null && curtidaRequisicao.id.length() != 0){
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        //--- verifica se já foi curtida: dois argumentos idDenuncia, idPessoa
        Denuncia denuncia = Denuncia.findById(curtidaRequisicao.idDenuncia);
        Pessoa pessoa = Pessoa.findById(curtidaRequisicao.idPessoa);

        //--- ja curtido antes, proibido
        if(Curtida.jaCurtido(curtidaRequisicao, denuncia, pessoa)){
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        denuncia = Curtida.curtir(curtidaRequisicao);
        if(denuncia != null){
            return Response.ok(denuncia).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }


    /**
     * Ok: testado no insomnia.
     *
     * A decisão de qual operação chamar, curtir ou descurtir é feito no frontend.
     *
     * @param curtidaRequisicao
     * @return 400, 200, 404
     */
    @Path("/curtidas")
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response descurtir(CurtidaRequisicao curtidaRequisicao){
        //--- verifica se veio idCurtida
        if(curtidaRequisicao.id == null || curtidaRequisicao.id.length() == 0 ||
           curtidaRequisicao.idDenuncia == null || curtidaRequisicao.idDenuncia.length() == 0){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Denuncia denuncia = Curtida.descurtir(curtidaRequisicao);
        if(denuncia != null){
            return Response.ok(denuncia).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }

}