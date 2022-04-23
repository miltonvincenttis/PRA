package appdev.recursos;

import appdev.dominio.Comentario;
import appdev.dominio.ComentarioRequisicao;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Essa classe Recurso faz tratamento do Caso de Uso: Gerenciar Comentarios.
 *
 * Incluir
 * POST: /comentarios
 * 201: included
 * 400: bad request: descricao não veio ou está vazio
 * 404: not found: não encontrou ou Pessoa ou Denuncia
 *
 * Alterar
 * PUT: /comentarios
 * 200: ok
 * 400: bad request: id ou descricao não veio ou está vazio
 * 404: not found : não encontrou a Denuncia ou Denuncia
 *
 * Remover
 * DELETE: /comentarios
 * 200: ok
 * 400: bad request: id não veio ou está vazio
 * 403: forbidden: encontrou Comentario ou Solucao
 * 404: not found: não encontrou a Denuncia
 *
 *
 */
@Path("/comentarios")
public class GerenciarComentariosRecurso {
    /**
     * Encontra Comentario por seu Id.
     *
     * @param comentarioRequisicao
     * @return Response
     */
    @Path("/id")
    @POST()
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response encontrarPorId(ComentarioRequisicao comentarioRequisicao){
        //--- verificamos que id veio, se não BAD REQUEST
        if (comentarioRequisicao.id == null || comentarioRequisicao.id.length() == 0) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Comentario comentario = Comentario.encontrarPorId(comentarioRequisicao);

        if(comentario != null){
            return Response.ok(comentario).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }

    /**
     * Ok: Testado no insomnia.
     *
     * @param comentarioRequisicao
     * @return Response
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response incluir(ComentarioRequisicao comentarioRequisicao){
        //--- verificamos se descricao, idPessoa, idDenuncia vieram
        if(comentarioRequisicao.descricao == null || comentarioRequisicao.descricao.trim().length() == 0 ||
           comentarioRequisicao.idDenuncia == null || comentarioRequisicao.idDenuncia.trim().length() == 0 ||
           comentarioRequisicao.idPessoa == null || comentarioRequisicao.idPessoa.trim().length()==0 ){

            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if(Comentario.incluir(comentarioRequisicao)){
            return Response.status(Response.Status.CREATED).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }

    /**
     * Ok: Testado no insomnia.
     * @param comentarioRequisicao
     * @return Response
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response alterar(ComentarioRequisicao comentarioRequisicao){
        //--- verificamos se id e descricao vieram
        if(comentarioRequisicao.descricao == null || comentarioRequisicao.descricao.trim().length() == 0 ||
           comentarioRequisicao.id == null || comentarioRequisicao.id.trim().length() == 0){

            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if(Comentario.alterar(comentarioRequisicao)){
            return Response.status(Response.Status.OK).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }

    /**
     * Ok: Testado no insomnia.
     *
     * @param comentarioRequisicao
     * @return Response
     */
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response remover(ComentarioRequisicao comentarioRequisicao){
        //--- verificamos se id veio
        if(comentarioRequisicao.id == null || comentarioRequisicao.id.length() == 0){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if(Comentario.remover(comentarioRequisicao)){
            return Response.status(Response.Status.OK).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }
}
