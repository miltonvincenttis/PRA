package appdev.dominio;

/**
 * Essa classe representa um registro feito na pagina Registrar.html.
 */
public class Registro {
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
