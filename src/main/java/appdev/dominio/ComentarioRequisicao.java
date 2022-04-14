package appdev.dominio;

import java.time.LocalDateTime;

/**
 * Essa classe representa o JSON que vem da requisição:
 *
 *  Requisicões:
 *
 *  POST   http://localhost:8080/comentarios   (incluir)
 *  PUT    http://localhost:8080/comentarios   (alterar)
 *  DELETE http://localhost:8080/comentarios   (remover)
 *
 *  JSON: consultar o arquivo: src/test/localhostrequisicao.json
 *
 */
public class ComentarioRequisicao {
    public String id;
    public String descricao;
    public String dataHora;
    public String idPessoa;
    public String idDenuncia;
}
