package appdev.dominio;

import java.time.LocalDateTime;

/**
 * Essa classe representa o JSON que vem da requisição:
 *
 *  Requisicões:
 *
 *  POST   http://localhost:8080/solucoes   (incluir)
 *  PUT    http://localhost:8080/solucoes   (alterar)
 *  DELETE http://localhost:8080/solucoes   (remover)
 *
 *  JSON: consultar o arquivo: src/test/solucao-requisicao.json
 *
 */
public class SolucaoRequisicao {
    public String id;
    public String descricao;
    public String dataHora;
    public String idPessoa;
    public String idDenuncia;
}
