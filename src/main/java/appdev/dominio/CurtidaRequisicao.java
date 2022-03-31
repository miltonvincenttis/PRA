package appdev.dominio;

/**
 * Essa classe representa o JSON que vem da requisição:
 *
 *  Requisicões:
 *
 *  POST   http://localhost:8080/denuncias/curtidas        (curtir)
 *  DELETE http://localhost:8080/denuncias/curtidas        (descurtir)
 *
 *  JSON: consultar o arquivo: src/test/curtida-requisicao.json
 *
 */
public class CurtidaRequisicao {
    public String id;
    public String idDenuncia;
    public String idPessoa;
}
