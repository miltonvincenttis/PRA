package appdev.recursos;

import appdev.dominio.Denuncia;
import appdev.dominio.TipoDeProblema;
import appdev.dominio.TipoDeProblemaRequisicao;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Essa classe Recurso faz tratamento do Caso de Uso: Gerenciar Tipos de Problemas.
 *
 * Incluir
 * 400: bad request: não veio a descrição
 * 200: ok: retorna json
 *
 * Alterar
 * 400: bad request: não veio o id ou a descrição
 * 404: not found: não encontrou o Tipo de Problema
 *
 * Remover
 * 400: bad request: não veio o id
 * 200: ok
 * 404: not found: não encontrou o Tipo de Problema
 *
 */
@Path("/tiposdeproblemas")
public class GerenciarTiposDeProblemas {

    /**
     * Ok: testado no insomnia.
     *
     * @param tipoDeProblemaRequisicao
     * @return 200, 400
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response incluir(TipoDeProblemaRequisicao tipoDeProblemaRequisicao){
        //--- verificamos se veio descricao se não BAD REQUEST
        if( tipoDeProblemaRequisicao.descricao == null || tipoDeProblemaRequisicao.descricao.length() == 0){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        TipoDeProblema tpd = TipoDeProblema.incluir(tipoDeProblemaRequisicao);

        return Response.ok(tpd).build();
    }

    /**
     * Ok: testado no insomnia.
     *
     * @param tipoDeProblemaRequisicao
     * @return 400, 403, 200, 400
     */
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response remover(TipoDeProblemaRequisicao tipoDeProblemaRequisicao){
        //--- verificamos se veio o id, se não BAD REQUEST
        if(tipoDeProblemaRequisicao.id == null || tipoDeProblemaRequisicao.id.length() == 0){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        //--- regra pra remover: não pode ter Denuncia com esse tipo de problema, se não FORBIDDEN: proibido
        Denuncia denuncia = Denuncia.encontrar(tipoDeProblemaRequisicao.id);

        if(denuncia != null){
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        if(TipoDeProblema.remover(tipoDeProblemaRequisicao)){
            return Response.ok().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    /**
     * Ok: testado no insomnia.
     *
     * @param tipoDeProblemaRequisicao
     * @return
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response alterar(TipoDeProblemaRequisicao tipoDeProblemaRequisicao){
        //--- verificamos se veio descricao se não BAD REQUEST
        if( tipoDeProblemaRequisicao.descricao == null || tipoDeProblemaRequisicao.descricao.length() == 0 ||
            tipoDeProblemaRequisicao.id == null || tipoDeProblemaRequisicao.id.length() == 0){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        TipoDeProblema tpd = TipoDeProblema.alterar(tipoDeProblemaRequisicao);
        if(tpd != null){
            return Response.ok(tpd).build();
        }

        return Response.status(Response.Status.NOT_FOUND).build();
    }

    /**
     * Ok: testado no insomnia
     *
     * @return json
     */
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response listarTodos(){
        List<TipoDeProblema> tdps = TipoDeProblema.listAll();

        return Response.ok(tdps).build();
    }
}
