package appdev.recursos;

import appdev.dominio.Autenticacao;
import appdev.dominio.Pessoa;
import org.jboss.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;


/**
 * Esse recurso faz tratamento do caso de uso Entrar no App.
 */
@Path("/entrar")
public class EntrarNoAppRecurso {
    private static final Logger LOGGER = Logger.getLogger(EntrarNoAppRecurso.class);

    /**
     * Recebemos um JSON: Autenticacao {"usuario":"valor", "senha":"valor"}.
     *
     * Retornos possiveis:
     * -Se Pessoa não encontrada: HTTP 404 not found
     * -Se senhas não combinam:   HTTP 403 forbidden (proibido)
     * @param autenticacao JSON
     * @return 200 se ok, ou 403, proibido (FORBIDDEN) se não encontramos o nome.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response entrar(Autenticacao autenticacao) {
        LOGGER.debug("usuario: "+autenticacao.getUsuario()+"\n "+"senha: "+autenticacao.getSenha());

        boolean resultadoOk = false;

        //--- procuramos a pessoa tentando entrar pelo nome
        Pessoa pessoa  = Pessoa.encontrarPessoaPeloNome(autenticacao.getUsuario());

        //--- se pessoa é diferente de null então vamos comparar a senha recebida com a do banco de dados.
        if(pessoa != null){
            resultadoOk = pessoa.getSenha().equals(autenticacao.getSenha());
        }
        if(resultadoOk) {
            //--- que tipo de usuário ele é:
            boolean isAdmin = pessoa.isAdmin();

            return Response.ok().
                    cookie(
                            new NewCookie("appToken", pessoa.getId()),
                            new NewCookie("appNomeUsuario", autenticacao.getUsuario()),
                            new NewCookie("appPerfilUsuario", isAdmin? "admin":"comum")
                    ).build();
        }else{
            //--- 403: Forbidden resposta: senhas não combinam
            return Response.status(Response.Status.FORBIDDEN).build();
        }
    }
}

