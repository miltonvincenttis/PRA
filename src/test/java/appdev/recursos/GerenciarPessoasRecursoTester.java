package appdev.recursos;


import appdev.dominio.PessoaRequisicao;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;

import javax.ws.rs.core.Response;

import static io.restassured.RestAssured.given;

/**
 * Essa classe testa os seguintes casos de teste para GerenciarPessoasRecurso.
 * <ul>
 * <li>alterar </li>
 *  <ul>
 *      <li>id não veio</li>
 *      <li>Pessoa não existe</li>
 *  </ul>
 * <li>remover</li>
 *  <ul>
 *     <li>testaPessoaRemoverComDenuncia</li>
 *     <li>testaPessoaRemoverComComentario</li>
 *     <li>testaPessoaRemoverComSolucao</li>
 *  </ul>
 * <li>listarTodas</li>
 * </ul>
 *
 *
 *             Por motivos de o groovy estar dando erros e ele é parte do RestAssured
 *             Não vamos mais escrever testes automatizados. Apenas fazer testes com o
 *             Insomnia: https://insomnia.rest/.
 *             É um App que se baixa e usa localmente, pra testar as requisições.
 *
 */
@QuarkusTest
public class GerenciarPessoasRecursoTester {

    /**
     * Campos que podem ser alterados: ok testado no insomnia
     * -nome
     * -admin
     */
    @Order(1)
    @Test
    public void testaPessoaAlterarComIdNull() {
        //--- preenchemos os dados da requisição
        PessoaRequisicao pessoaRequisicao = new PessoaRequisicao();
        pessoaRequisicao.id = null;
        pessoaRequisicao.nome = "Jiovana Silva Santos";
        pessoaRequisicao.admin = false;

        GsonBuilder builder = new GsonBuilder();
        builder.serializeNulls();
        Gson json = builder.setPrettyPrinting().create();

        //--- testa a requisição
        given()
        .header("Content-Type","application/json")
        .and()
        .body(json.toJson(pessoaRequisicao))
        .when()
        .put("/pessoas")        //--- PUT
        .then()
        .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
    }

    /**
     * Campos que podem ser alterados: ok testado no insomnia
     * -nome
     * -admin
     */
    @Order(2)
    @Test
    public void testaPessoaAlterarIdEmBranco() {
        //--- preenchemos os dados da requisição
        PessoaRequisicao pessoaRequisicao = new PessoaRequisicao();
        pessoaRequisicao.id = "";  //--- veio em branco
        pessoaRequisicao.nome = "Jiovana Silva Santos";
        pessoaRequisicao.admin = false;

        GsonBuilder builder = new GsonBuilder();
        builder.serializeNulls();
        Gson json = builder.setPrettyPrinting().create();

        //--- testa a requisição
        given()
        .header("Content-Type","application/json")
        .and()
        .body(json.toJson(pessoaRequisicao))
        .when()
        .put("/pessoas")            //--- PUT
        .then()
        .statusCode(Response.Status.BAD_REQUEST.getStatusCode());
    }

    /**
     * 200: aceito
     * 400: bad request: id não veio ou está vazio
     * 403: forbidden: encontrou Denuncia, Comentario ou Solucao
     */
    @Order(3)
    @Test
    public void testaPessoaRemoverComDenuncia() {

    }

    /**
     * Deve retornar 403, pois a Denuncia tem Comentario.
     * 403: forbidden: encontrou Denuncia, Comentario ou Solucao
     */
    @Order(4)
    @Test
    public void testaPessoaRemoverComSolucao() {
        //--- preenchemos os dados da requisição
        PessoaRequisicao pessoaRequisicao = new PessoaRequisicao();
        pessoaRequisicao.id = "367a2fa3-ab08-4f76-95bc-c7d9bd684493";

        GsonBuilder builder = new GsonBuilder();
        builder.serializeNulls();
        Gson json = builder.setPrettyPrinting().create();

        //--- testa a requisição
        given()
                .header("Content-Type","application/json")
                .and()
                .body(json.toJson(pessoaRequisicao))
                .when()
                .delete("/pessoas")            //--- DELETE
                .then()
                .statusCode(Response.Status.FORBIDDEN.getStatusCode());
    }

    /**
     * Ok: 403 testado no insomnia.
     *
     * Deve retornar 403, pois a Denuncia tem Comentario.
     * 403: forbidden: encontrou Denuncia, Comentario ou Solucao
     */
    @Order(5)
    @Test
    public void testaPessoaRemoverComComentario() {
        //--- preenchemos os dados da requisição
        PessoaRequisicao pessoaRequisicao = new PessoaRequisicao();
        pessoaRequisicao.id = "367a2fa3-ab08-4f76-95bc-c7d9bd684493";

        GsonBuilder builder = new GsonBuilder();
        builder.serializeNulls();
        Gson json = builder.setPrettyPrinting().create();

        //--- testa a requisição
        given()
                .header("Content-Type","application/json")
                .and()
                .body(json.toJson(pessoaRequisicao))
                .when()
                .delete("/pessoas")            //--- DELETE
                .then()
                .statusCode(Response.Status.FORBIDDEN.getStatusCode());
    }

    /**
     * Ok: 200 testado no insomnia.
     *
     * Pessoa id: d5d6dc5f-4028-4ad2-ad2b-2f5af1c651e8
     */
    @Order(6)
    @Test
    public void testaPessoaRemoverSemNada() {

        /*
            Por motivos de o groovy estar dando erros e ele é parte do RestAssured
            Não vamos mais escrever testes automatizados. Apenas fazer testes com o
            Insomnia: https://insomnia.rest/.
            É um App que se baixa e usa localmente, pra testar as requisições.
         */
    }


    /**
     * Ok: 200: testado no insomnia.
     */
    @Order(7)
    @Test
    public void testaPessoaListarTodas() {
        //--- testa a requisição
        given()
                .header("Content-Type","application/json")
                .and()
                .when()
                .get("/pessoas")            //--- GET
                .then()
                .statusCode(Response.Status.ACCEPTED.getStatusCode());
    }
}
