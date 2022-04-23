package appdev.recursos;

import appdev.dominio.Solucao;
import appdev.dominio.SolucaoRequisicao;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Essa classe Recurso faz tratamento do Caso de Uso: Gerenciar Solucao.
 *
 * Incluir
 * POST: /solucoes
 * 201: created: incluiu
 * 400: bad request: descricao não veio ou está vazio
 * 404: not found: não encontrou ou Pessoa ou TipoDeProblema
 *
 * Alterar
 * PUT: /solucoes
 * 200: ok
 * 400: bad request: id ou descricao não veio ou está vazio
 * 404: not found : não encontrou a Denuncia ou o TipoDeProblema
 *
 * Remover
 * DELETE: /solucoes
 * 200: ok
 * 400: bad request: id não veio ou está vazio
 * 403: forbidden: encontrou Comentario ou Solucao
 * 404: not found: não encontrou a Denuncia
 *
 */
@Path("/solucoes")
public class GerenciarSolucoesRecurso {
    /**
     * Encontra Comentario por seu Id.
     *
     * @param solucaoRequisicao
     * @return Response
     */
    @Path("/id")
    @POST()
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response encontrarPorId(SolucaoRequisicao solucaoRequisicao){
        //--- verificamos que id veio, se não BAD REQUEST
        if (solucaoRequisicao.id == null || solucaoRequisicao.id.length() == 0) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Solucao comentario = Solucao.encontrarPorId(solucaoRequisicao);

        if(comentario != null){
            return Response.ok(comentario).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response incluir(SolucaoRequisicao solucaoRequisicao){
        //--- verificamos se descricao, idPessoa, idDenuncia vieram
        if(solucaoRequisicao.descricao == null || solucaoRequisicao.descricao.trim().length() == 0 ||
                solucaoRequisicao.idDenuncia == null || solucaoRequisicao.idDenuncia.trim().length() == 0 ||
                solucaoRequisicao.idPessoa == null || solucaoRequisicao.idPessoa.trim().length()==0 ){

            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if(Solucao.incluir(solucaoRequisicao)){
            return Response.status(Response.Status.CREATED).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response alterar(SolucaoRequisicao solucaoRequisicao){
        //--- verificamos se id e descricao vieram
        if(solucaoRequisicao.descricao == null || solucaoRequisicao.descricao.trim().length() == 0 ||
                solucaoRequisicao.id == null || solucaoRequisicao.id.trim().length() == 0){

            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if(Solucao.alterar(solucaoRequisicao)){
            return Response.status(Response.Status.OK).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response remover(SolucaoRequisicao solucaoRequisicao){
        //--- verificamos se id veio
        if(solucaoRequisicao.id == null || solucaoRequisicao.id.length() == 0){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if(Solucao.remover(solucaoRequisicao)){
            return Response.status(Response.Status.OK).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }
}
