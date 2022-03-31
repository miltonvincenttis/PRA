package appdev.recursos;

import appdev.dominio.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

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
 * 400: bad request: id não veio ou está vazio
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
 * GET: /denuncia/todas
 * 200: ok
 *
 * Incluir Curtida
 * POST: /denuncia/curtida
 * 403: forbidden: proibido a operação correta é descurtir: veio o id da curtida
 * 200: ok
 * 404: not found: não encontrou ou a Pessoa ou a Denuncia
 *
 * Remover Curtida
 * DELETE: /denuncia/curtida
 * 200: ok
 * 400: bad request: não veio id: da Curtida
 * 404: not found: não encontrou a Curtida
 */
@Path("/denuncias")
public class GerenciarDenunciasRecurso {

    /***
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
        if (denunciaRequisicao.id == null || denunciaRequisicao.id.length() == 0) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if (Denuncia.alterar(denunciaRequisicao)) {
            return Response.status(Response.Status.OK).build();
        }
        //--- não encontrou o id no banco de dados
        return Response.status(Response.Status.NOT_FOUND).build();
    }


    /**
     * Remover Denuncia.
     *
     * Regra:
     *  -Pessoa deve ser a mesma que criou a Denuncia : Isso é verificado no frontend: usuario logado mesmo criou.
     *  -Não deve ter Comentario nem Solucao
     *
     * @param denunciaRequisicao
     * @return 400, 403, 200, 404
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response remover(DenunciaRequisicao denunciaRequisicao){
        //--- verificamos que o idDenuncia veio, se não BAD REQUEST
        if (denunciaRequisicao.id == null || denunciaRequisicao.id.length() == 0) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        boolean temComentario =  Comentario.find("denuncia_fk", denunciaRequisicao.id).firstResult() != null;
        boolean temSolucao = Solucao.find("denuncia_fk", denunciaRequisicao.id).firstResult() != null;

        //--- se tem comentario ou tem solucao entao retornamos FORBIDDEN: proibido.
        if(temSolucao || temComentario)
            return Response.status(Response.Status.FORBIDDEN).build();

        if (Denuncia.remover(denunciaRequisicao)) {
            return Response.status(Response.Status.OK).build();
        }
        //--- não encontrou o id no banco de dados
        return Response.status(Response.Status.NOT_FOUND).build();
    }


    /**
     * Ok: testado no insomnia.
     *
     * Verificar qual o formato de resposta no arquivo: src/tests/pessoa.list.json
     * @return json
     */
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response listarTodas(){
        List<Denuncia> denuncias = Denuncia.listAll();

        /**
         * Usamos aqui Gson (google) pois o jackson (Resteasy) engasga com um objeto tipo Denuncia
         */
        GsonBuilder builder = new GsonBuilder();
        builder.serializeNulls();
        Gson json = builder.setPrettyPrinting().create();

        return Response.ok(json.toJson(denuncias)).build();
    }


    /**
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

        if(Curtida.curtir(curtidaRequisicao)){
            return Response.status(Response.Status.OK).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }


    /**
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
        //--- verifica se veio idCurtida e idPessoa e idDenuncia
        if(curtidaRequisicao.id != null && curtidaRequisicao.id.length() != 0){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if(Curtida.descurtir(curtidaRequisicao)){
            return Response.status(Response.Status.OK).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }

}