package appdev.recursos;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *  Essa classe Recurso faz tratamento do Caso de Uso: Visualizar Dashboard.
 *
 *  Apenas retorna os dados necessários para se gerar o gráfico no frontend.
 *
 */
@Path("/dashboard")
public class VisualizarDashboard {
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response gerarDadosDashboard(){
        return Response.status(Response.Status.OK).build();
    }
}
