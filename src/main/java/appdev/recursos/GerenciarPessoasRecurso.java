package appdev.recursos;

import appdev.dominio.*;
import io.quarkus.panache.common.Sort;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Esse Recurso faz tratamento do Caso de Uso: Gerenciar Pessoas.
 *
 * Alterar
 * PUT: /pessoas
 * 200: aceito
 * 400: bad request: id não veio ou está vazio
 * 404: not found : não encontrou a Pessoa
 *
 * Remover
 * DELETE: /pessoas
 * 200: aceito
 * 400: bad request: id não veio ou está vazio
 * 403: forbidden: encontrou Denuncia, Comentario ou Solucao
 *
 * Lista todas
 * GET: /pessoas
 *
 */

@Path("/pessoas")
public class GerenciarPessoasRecurso {
    @Path("/id")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response procurarPorId(PessoaRequisicao pessoaRequisicao){
        //--- verificamos que o idPessoa veio, se não BAD REQUEST
        if(pessoaRequisicao.id == null || pessoaRequisicao.id.length() == 0){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Pessoa pessoa = Pessoa.findById(pessoaRequisicao.id);
        //--- devolve sem a senha
        pessoa.setSenha(null);

        if(pessoa != null){
            return Response.ok(pessoa).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }


    /**
     * Ok: Testado no insomnia.
     *
     * Campos permitido alterar: nome, admin
     *
     * @param pessoaRequisicao
     * @return 200 | 400 | 404
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response alterar(PessoaRequisicao pessoaRequisicao){
        //--- verificamos que o idPessoa veio, se não BAD REQUEST
        if(pessoaRequisicao.id == null || pessoaRequisicao.id.trim().length() == 0 ||
           pessoaRequisicao.nome == null || pessoaRequisicao.nome.trim().length() == 0){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if(Pessoa.alterar(pessoaRequisicao)){
            return Response.status(Response.Status.OK).build();
        }
        //--- não encontrou o id no banco de dados
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    /**
     * Ok: Testado no insomnia.
     *
     * Condição pra remover: não ter nenhuma Denuncia, Comentario ou Solucao.
     *
     * @param pessoaRequisicao
     * @return 200 | 400 | 403
     */
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response remover(PessoaRequisicao pessoaRequisicao){
        //--- verificamos se o idPessoa veio, se não BAD REQUEST
        if(pessoaRequisicao.id == null || pessoaRequisicao.id.length() == 0){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        //---verificamos que tem condições de ser excluido
        if(naoTemDenunciaComentarioSolucao(pessoaRequisicao)){
            //--- excluimos
            if(Pessoa.remover(pessoaRequisicao)){
                return Response.status(Response.Status.OK).build();
            }
        }else{
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        //--- aqui foi pq não conseguiu remover pq a Pessoa não foi encontrada.
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    /**
     * Esse método é de ajuda para o metodo remover.
     *
     * Retorna true = não tem denuncia, comentario ou solucao.
     * Retorna false = caso contrário
     * @param pessoaRequisicao
     * @return boolean true | false
     */
    private boolean naoTemDenunciaComentarioSolucao(PessoaRequisicao pessoaRequisicao) {
        boolean isDeletavel = true;

        Pessoa pessoa = Pessoa.findById(pessoaRequisicao.id);

        //--- se encontrar Denuncia que foi criada por essa Pessoa
        if(Denuncia.find("pessoa",pessoa).firstResult() != null){
            isDeletavel = false;
        }

        //--- se encontrar Comentario que foi criada por essa Pessoa
        if(isDeletavel && Comentario.find("pessoa",pessoa).firstResult() != null){
            isDeletavel = false;
        }

        //--- se encontrar Solucao que foi criada por essa Pessoa
        if(isDeletavel && Solucao.find("pessoa",pessoa).firstResult() != null){
            isDeletavel = false;
        }
        return isDeletavel;
    }

    /**
     * Verificar qual o formato de retorno no arquivo: src/tests/pessoa.list.json
     * @return json
     */
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response listarTodas(){
        Sort sort = Sort.ascending("nome");
        List pessoas = Pessoa.listAll(sort);

        return Response.ok(pessoas).build();
    }
}
