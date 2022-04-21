package appdev.recursos;

import appdev.dominio.DashboardResposta;
import appdev.dominio.Denuncia;
import io.quarkus.panache.common.Sort;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.time.Month;
import java.util.List;

/**
 * Esse recurso faz tratamento do caso de uso Dashboard.
 * Queremos apenas as denuncias entre janeiro e junho de 2022.
 */
@Path("/dashboard")
public class Dashboard {
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response gerarDadosDashboard(){
        //---criamos uma resposta
        DashboardResposta dashboardResposta = new DashboardResposta();

        //--- obter todas as denuncias durante o ano atual: 2022
        Sort sort = Sort.descending("datahora");
        List<Denuncia> denunciasList = Denuncia.listAll(sort);

        //--- denuncias abertas
        int[] data1 = new int[6];       //--- tipo primitivo iniciado com zero (0)

        //--- denuncias fechadas
        int[] data2 = new int[6];       //--- tipo primitivo iniciado com zero (0)

        for (Denuncia denuncia: denunciasList) {
            /*
                pegamos o mes da denuncia e decidimos qual o
                array que vamos preencher: data1 ou data2: não se tiver solução, data1 (aberta) se tiver (fechada).
            */
            int mes = denuncia.getDataHora().getMonth().getValue();
            int ano = denuncia.getDataHora().getYear();

            if(ano == 2022 && mes >= Month.JANUARY.getValue() && mes <= Month.JUNE.getValue()){
                //--- se não tem solucoes então é data1
                if(denuncia.getSolucoes().size() == 0){
                    //--- somamos 1
                    data1[mes-1]++;
                }else{
                    data2[mes-1]++;
                }
            }
        }
        dashboardResposta.data1 = data1;
        dashboardResposta.data2 = data2;

        return Response.ok(dashboardResposta).build();
    }
}
