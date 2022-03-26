package appdev.recursos;

import appdev.dominio.Autenticacao;
import appdev.dominio.Registro;
import com.google.gson.Gson;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;

import java.rmi.server.UID;
import java.util.UUID;

import static io.restassured.RestAssured.given;

/**
 * Esse são os testes para classes Recursos.
 */
@QuarkusTest
public class RecursosClassesTester {

    /**
     * Testa registrar usuario nao existente.
     */
    @Order(1)
    @Test
    public void testaRegistrarNoAppRecursoUsuarioNaoExiste() {
        String id = UUID.randomUUID().toString();
        Registro registro = new Registro();
        registro.setUsuario(id);
        registro.setSenha(id);
        String body = new Gson().toJson(registro);

        given().header("Content-Type","application/json")
                .and()
                .body(body)
                .when().post("/registrar")
                .then()
                .statusCode(201);
    }


    /**
     * Testa se a autenticacao de um usuario de teste funciona.
     */
    @Order(2)
    @Test
    public void testaEntrarNoAppRecursoUsuarioESenhasExistem() {
        Autenticacao autenticacao = new Autenticacao();
        autenticacao.setUsuario("admin");
        autenticacao.setSenha("root");
        String body = new Gson().toJson(autenticacao);

        given()
                .header("Content-Type","application/json")
                .and()
                .body(body)
                .when().post("/entrar")
                .then()
                .statusCode(200);
    }

    /**
     * Testa registrar usuario ja existente.
     */
    @Order(3)
    @Test
    public void testaRegistrarNoAppRecursoUsuarioExiste() {
        Registro registro = new Registro();
        registro.setUsuario("admin");
        registro.setSenha("root");
        String body = new Gson().toJson(registro);

        given().header("Content-Type","application/json")
                .and()
                .body(body)
                .when().post("/registrar")
                .then()
                .statusCode(403);
    }
}
