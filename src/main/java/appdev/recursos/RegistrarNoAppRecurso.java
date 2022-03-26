package appdev.recursos;

import appdev.dominio.Registro;
import appdev.dominio.Pessoa;
import org.jboss.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;

/**
 * Esse recurso faz tratamento do caso de uso Registrar no App.
 */
@Path("/registrar")
public class RegistrarNoAppRecurso {
    private static final Logger LOGGER = Logger.getLogger(RegistrarNoAppRecurso.class);

    /**
     * Recebemos um JSON: Autenticacao {"usuario":"valor", "senha":"valor"}.
     *
     * Retornos possiveis:
     * -Se Pessoa encontrada: HTTP 403 forbidden (proibido)
     * -Se Pessoa registrada ok: HTTP 201 criado
     * @param registro JSON
     * @return 201 se ok, ou 403, proibido (FORBIDDEN) se já existe o nome.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registrar(Registro registro){
        LOGGER.debug("usuario: "+registro.getUsuario()+"\n "+"senha: "+registro.getSenha());

        boolean pessoaExiste = false;

        //--- procuramos pessoa pelo nome que esta tentando registrar
        Pessoa pessoa  = Pessoa.encontrarPessoaPeloNome(registro.getUsuario());

        //--- se pessoa é igual a null (não encontrou) então vamos gravar o registro e retornar os cookies
        if(pessoa == null) {
            //--- no registro inicial: usuário será 'comum'. Só usuario Admin pode mudar o tipo de usuário.
            boolean isAdmin = false;

            //--- gravamos a Pessoa se registrando no banco de dados
            pessoa = Pessoa.incluir(registro, isAdmin);

            return Response.status(Response.Status.CREATED).
                    cookie(
                            new NewCookie("appToken", pessoa.getId()),
                            new NewCookie("appNomeUsuario", registro.getUsuario()),
                            new NewCookie("appPerfilUsuario", isAdmin? "admin":"comum")
                    ).build();
        }else{
            //--- 403: Forbidden resposta: já existe usuario com mesmo nome
            return Response.status(Response.Status.FORBIDDEN).build();
        }
    }
}
