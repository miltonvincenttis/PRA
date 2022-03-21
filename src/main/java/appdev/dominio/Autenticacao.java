package appdev.dominio;

/**
 * Classe que representa uma autenticacao, para receber o JSON {usuario, senha} enviado pela pagina entrar.html.
 */
public class Autenticacao {
    private String usuario = "";
    private String senha = "";

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

}
