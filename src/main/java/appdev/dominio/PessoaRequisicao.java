package appdev.dominio;

/**
 * Essa classe representa o JSON que vem da requisição: PUT http://localhost:8080/pessoa/
 */
public class PessoaRequisicao {
    public String id;
    public String nome;
    public boolean admin;
}