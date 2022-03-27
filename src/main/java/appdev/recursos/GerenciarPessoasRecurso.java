package appdev.recursos;

import appdev.dominio.Pessoa;
import appdev.dominio.PessoaRequisicao;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Esse Recurso faz tratamento do Caso de Uso: Gerenciar Pessoas.
 *
 * Se alteracao ok: 200
 * Se alteracao !ok: 204
 */

@Path("/pessoa")
public class GerenciarPessoasRecurso {
    /**
     * Se alteracao ok: 200
     * Se alteracao não ok: 204
     *
     * @param pessoaRequisicao
     * @return 200 | 204
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response alterar(PessoaRequisicao pessoaRequisicao){
        if(Pessoa.alterar(pessoaRequisicao)){
            return Response.accepted().build();
        }
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    /**
     * Recebe JSON: {"id":"asdaafa-adfasf-afasfa"}
     *
     * Se remocao ok: 200
     * Se remocao não ok: 204
     *
     * @param pessoaRequisicao
     * @return 200 | 204
     */
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    public Response remover(PessoaRequisicao pessoaRequisicao){
        if(Pessoa.deleteById(pessoaRequisicao.id)){
            return Response.accepted().build();
        }
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    /**
     * Verificar qual o formato de retorno
     * @return
     */
    @Path("/todas")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    public Response listarTodas(){
        List<Pessoa> pessoas = Pessoa.listAll();

        GsonBuilder builder = new GsonBuilder();
        builder.serializeNulls();
        Gson json = builder.setPrettyPrinting().create();

        //---limpa a senha dos objetos primeiro, pois campos null não aparece no JSON
        for(Pessoa pessoa: pessoas){
            pessoa.setSenha(null);
        }

        return Response.ok(json.toJson(pessoas)).build();
    }
}
