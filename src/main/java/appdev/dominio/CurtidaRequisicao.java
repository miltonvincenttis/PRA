package appdev.dominio;

/**
 * Essa classe representa o JSON que vem da requisição:
 *
 *  - POST   http://localhost:8080/curtida  (curtida)
 *  - DELETE http://localhost:8080/curtida  (descurtida)
 *
 */
public class CurtidaRequisicao {
    public String id;
    public String idDenuncia;
    public String idPessoa;
}
