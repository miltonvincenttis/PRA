package appdev.recursos;

import appdev.dominio.Solucao;
import appdev.dominio.SolucaoRequisicao;

import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

/**
 * Essa classe Recurso faz tratamento do Caso de Uso: Gerenciar Solucao.
 *
 * Incluir
 * POST: /solucoes
 * 200: ok
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
public class GerenciarSolucaoRecurso {
    @POST
    public Response incluir(SolucaoRequisicao solucaoRequisicao){
        //--- verificamos se descricao, idPessoa, idDenuncia vieram
        if(solucaoRequisicao.descricao == null || solucaoRequisicao.descricao.length() == 0 ||
                solucaoRequisicao.idDenuncia == null || solucaoRequisicao.idDenuncia.length() == 0 ||
                solucaoRequisicao.idPessoa == null || solucaoRequisicao.idPessoa.length()==0 ){

            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if(Solucao.incluir(solucaoRequisicao)){
            return Response.status(Response.Status.OK).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @PUT
    public Response alterar(SolucaoRequisicao solucaoRequisicao){
        //--- verificamos se id e descricao vieram
        if(solucaoRequisicao.descricao == null || solucaoRequisicao.descricao.length() == 0 ||
                solucaoRequisicao.id == null || solucaoRequisicao.id.length() == 0){

            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if(Solucao.alterar(solucaoRequisicao)){
            return Response.status(Response.Status.OK).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @DELETE
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
