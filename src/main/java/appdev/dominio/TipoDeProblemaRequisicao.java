package appdev.dominio;

/**
 * Essa classe representa o JSON que vem da requisição: http://localhost:8080/tipodeproblema/
 *
 * {
 *   "id": String,
 *   "descricao": "String"
 * }
 */
public class TipoDeProblemaRequisicao {
    public String id;
    public String descricao;
}
