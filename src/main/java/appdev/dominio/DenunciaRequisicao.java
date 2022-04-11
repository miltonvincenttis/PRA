package appdev.dominio;

/**
 * Essa classe representa o JSON que vem da requisição: PUT http://localhost:8080/denuncia/
 *
 * {
 *   "id": null,
 *   "descricao": "String",
 *   "datahora": "String",
 *   "idPessoa": "String",
 *   "idTipoDeProblema": "String"
 * }
 *
 */
public class DenunciaRequisicao {
    public String id;
    public String descricao;
    public String dataHora;
    public String idPessoa;
    public String idTipoDeProblema;
}