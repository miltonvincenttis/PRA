package appdev.dominio;

import com.thoughtworks.xstream.converters.time.LocalDateTimeConverter;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Esses são os testes para classes de Dominio.
 *
 * Nota: executar o arquivo /src/main/resources/inserts.sql antes de executar os testes.
 *       UUID.randomUUID().toString() sempre traz um uuid diferente toda vez que é executado.
 *
 * Vamos testar as classes abaixo com suas operações.
 * Elas usam o padrão Active Record.
 *
 * Denuncia:   inclusão, alteracão, remoção    ok
 * Comentário: inclusão, alteracao, remoção    ok
 * Solução:    inclusão, alteracao, remoção    ok
 * Curtida: Curtir, Descurtir                 ...
 *
 * A gente assume que o Postgresql está configurado e rodando.
 *
 */
@QuarkusTest    //--- pq vamos fazer testes sem estar em quarkus:dev
@Transactional  //--- pq será utilizado banco de dados
public class DominioClassesTester {

    @Order(1)
    @Test
    public void testaDenunciaIncluirFoiSucesso(){
        //--- pessoa que está criando a denuncia (admin)
        Pessoa admin = Pessoa.findById("367a2fa3-ab08-4f76-95bc-c7d9bd684493");

        //--- tipo de problema: Iluminação publica (ver /resources/inserts.sql
        TipoDeProblema tpb = TipoDeProblema.findById("456ff903-02bd-4545-961c-8ee0ca28d685");
        Denuncia denuncia = new Denuncia();
        denuncia.setDescricao("DenunciaInclusaoTeste");
        denuncia.setDataHora(LocalDateTime.now());
        denuncia.setPessoa(admin);
        denuncia.setTipoDeProblema(tpb);
        denuncia.persist();

        assertNotNull(denuncia.getId());
    }

    @Order(2)
    @Test
    public void testaDenunciaAlterarDescricao(){
        String uuid = UUID.randomUUID().toString();

        //--- encontrar uma Denuncia existente e alterar sua descricao
        Denuncia denuncia = Denuncia.findById("f881eae7-b445-478c-8beb-6c3927e52aaf");

        assertNotNull(denuncia,"Denuncia f881eae7-b445-478c-8beb-6c3927e52aaf não foi encontrada");

        String descricao = denuncia.getDescricao();

        //--- alteramos a descricao
        descricao = "DenunciaTeste:"+ uuid;
        denuncia.setDescricao(descricao);

        //--- alteramos a data da descrição tambem
        denuncia.setDataHora(LocalDateTime.now());

        //--- gravamos
        denuncia.persist();

        //--- encontrar a Denuncia alterada e comparar se a modificacao foi feita
        denuncia = Denuncia.findById("f881eae7-b445-478c-8beb-6c3927e52aaf");
        assertTrue(denuncia.getDescricao().contains(uuid));
    }

    //@Order(3) ok
    //@Test  se for testar, pegar uma denuncia criada no inicio do teste
    public void testaDenunciaRemocao(){
        /*
          Encontra uma Denuncia existente e remover apenas se :
          -não tiver solução
          -não tiver comentário
          -se quem estiver removendo for quem criou a Denuncia
          nota: usar a denuncia incluida no inicio do teste (procurar o id dela no pgAdmin)

        */
        Pessoa pessoa = Pessoa.encontrarPessoaPeloNome("admin");

        Denuncia denuncia = Denuncia.findById("63cd2e4b-e4b1-4e3e-b938-d754b5853448");
        Pessoa pessoaDenuncia = denuncia.getPessoa();
        Set<Comentario> comentarios = denuncia.getComentarios();
        Set<Solucao> solucoes = denuncia.getSolucoes();

        assertTrue(pessoaDenuncia.getId().equalsIgnoreCase(pessoa.getId()));
        assertTrue(comentarios.size() == 0, "Lista de Comentarios em Denuncia 63cd2e4b-e4b1-4e3e-b938-d754b5853448 tem Comentario");
        assertTrue(solucoes.size() == 0, "Lista de Solucoes em Denuncia 63cd2e4b-e4b1-4e3e-b938-d754b5853448 tem Solucao");

        //--- tudo ok, é a mesma pessoa que criou, não tem comentários nem soluções então vamos deletar.

        //--- deve atribuir null para pessoa antes
        //--- deve atribuir null para tipo de problema antes

        denuncia.setPessoa(null);
        denuncia.setTipoDeProblema(null);
        denuncia.delete();

        //--- vamos procurar pelo id daquela denuncia pra ver se encontrarmos
        denuncia = Denuncia.findById("63cd2e4b-e4b1-4e3e-b938-d754b5853448");
        assertNull(denuncia, "Denuncia 63cd2e4b-e4b1-4e3e-b938-d754b5853448 não foi encontrada");
    }


    @Order(4)
    @Test
    public void testaDenunciaInclusaoDeComentario(){
        //--- encontrar uma Pessoa existente
        Pessoa pessoa = Pessoa.findById("d5d6dc5f-4028-4ad2-ad2b-2f5af1c651e8");

        assertNotNull(pessoa, "Pessoa d5d6dc5f-4028-4ad2-ad2b-2f5af1c651e8 não foi encontrada");

        //--- encontrar uma Denuncia existente
        Denuncia denuncia = Denuncia.findById("28e53548-5bf4-423b-bd4b-5ffc0793d242");

        assertNotNull(denuncia, "Denuncia 28e53548-5bf4-423b-bd4b-5ffc0793d242 não foi encontrada");

        //--- criar um Comentário e adicionar a lista de Comentarios na Denuncia
        Comentario comentario = new Comentario();

        String uuid = UUID.randomUUID().toString();

        //--- relacionamos a denuncia com o comentário
        comentario.setDenuncia(denuncia);
        comentario.setDescricao("ComentarioTestePessoaComum " + uuid);
        comentario.setDataHora(LocalDateTime.now());
        comentario.setPessoa(pessoa);
        comentario.persist();

        //--- esperamos que o comentario foi gravado, entao pegamos o Id dele e o procuramos novamente
        Comentario comentarioGravado = Comentario.findById(comentario.getId());

        assertNotNull(comentarioGravado, "Comentario "+comentario.getId() + " não foi encontrado");

        //--- verificamos se na descricao do comentário tem o nosso uuid
        assertTrue(comentarioGravado.getDescricao().contains(uuid), "Inclusão não corresponde nas descrições");
    }

    @Order(5)
    @Test
    public void testaDenunciaAlteracaoDeComentario(){
        //--- obter uma denuncia existente com comentários, pegar um comentário da lista e alterar sua descrição
        Denuncia denuncia = Denuncia.findById("28e53548-5bf4-423b-bd4b-5ffc0793d242");

        assertNotNull(denuncia, "Denuncia 28e53548-5bf4-423b-bd4b-5ffc0793d242 não foi encontrada");
        
        Set<Comentario> comentarios = denuncia.getComentarios();
        assertTrue(comentarios.size() != 0, "Denuncia não tem Comentarios");

        //--- pega o 1o comentario que estiver na lista
        Comentario comentario = null;
        for (Comentario comentarioTemp : comentarios) {
            //--- so pegar o 1o e sai fora do loop
            comentario = comentarioTemp;
            break;
        }

        assertNotNull(comentario, "Não tem nenhum comentario na Denuncia 28e53548-5bf4-423b-bd4b-5ffc0793d242");

        //--- alteramos a descrição e gravamos
        String descricao = comentario.getDescricao();
        String uuid = UUID.randomUUID().toString();
        descricao = "ComentarioAlterado "+uuid;
        comentario.setDescricao(descricao);
        comentario.setDataHora(LocalDateTime.now());
        comentario.persist();

        //--- procuramos no banco pelo id daquele comentario pra vermos se ele gravou as alteracoes
        Comentario comentarioAlterado = Comentario.findById(comentario.getId());

        assertNotNull(comentarioAlterado, "Comentario "+comentario.getId() + " não foi encontrado");
        assertTrue(comentarioAlterado.getDescricao().contains(uuid), "A alteracão não corresponde nas descrições");
    }

    @Order(6)
    @Test
    public void testaDenunciaRemocaoDeComentario(){
        Comentario comentario = Comentario.findById("be8ab20c-3e33-425f-b88b-838b6c0b48b3");
        assertNotNull(comentario, "Comentario be8ab20c-3e33-425f-b88b-838b6c0b48b3 não foi encontrado");

        assertTrue(Comentario.deleteById(comentario.getId()),"Comentario "+comentario.getId()+" não foi deletado" );

        //--- verifica que foi deletado no banco de dados
        Comentario comentarioQueFoiRemovido = Comentario.findById(comentario.getId());

        assertTrue(comentarioQueFoiRemovido == null);
    }

    @Order(7)
    @Test
    public void testaDenunciaInclusaoDeSolucao(){
        //--- encontrar uma Pessoa existente: só deveria ser Pessoa 'admin'
        Pessoa pessoa = Pessoa.findById("d5d6dc5f-4028-4ad2-ad2b-2f5af1c651e8");

        assertNotNull(pessoa, "Pessoa d5d6dc5f-4028-4ad2-ad2b-2f5af1c651e8 não foi encontrada");

        //--- encontrar uma Denuncia existente
        Denuncia denuncia = Denuncia.findById("28e53548-5bf4-423b-bd4b-5ffc0793d242");

        assertNotNull(denuncia, "Denuncia 28e53548-5bf4-423b-bd4b-5ffc0793d242 não foi encontrada");

        //--- criar uma Solucao
        Solucao solucao = new Solucao();

        //--- relacionamos a solucao com a denuncia
        solucao.setDenuncia(denuncia);

        String uuid = UUID.randomUUID().toString();
        solucao.setDescricao("SolucaoTestePessoaAdmin "+uuid);
        solucao.setDataHora(LocalDateTime.now());
        solucao.setPessoa(pessoa);
        solucao.persist();

        //--- esperamos que a solucação foi gravada, entao procuramos por ela pelo Id
        Solucao solucaoGravada = Solucao.findById(solucao.getId());

        //--- comparamos a descrição do comentário incluido com esse que achamos pra ver se são os mesmos objetos
        assertTrue(solucaoGravada.getDescricao().contains(uuid), "A inclusao não corresponde nas descrições");
    }

    @Order(8)
    @Test
    public void testaDenunciaAlteracaoDeSolucao(){
        //--- obter uma denuncia existente com soluções, pegar uma solucao da lista e alterar sua descrição
        Denuncia denuncia = Denuncia.findById("28e53548-5bf4-423b-bd4b-5ffc0793d242");

        assertNotNull(denuncia, "Denuncia 28e53548-5bf4-423b-bd4b-5ffc0793d242 não foi encontrada");

        Set<Solucao> solucoes = denuncia.getSolucoes();
        assertTrue(solucoes.size() != 0, "Denuncia 28e53548-5bf4-423b-bd4b-5ffc0793d242 não tem Solucao");

        //--- pega a 1o solucao que estiver na lista
        Solucao solucao = null;
        for (Solucao solucaoTemp : solucoes) {
            //--- so pegar a 1a e sai fora do loop
            solucao = solucaoTemp;
            break;
        }

        assertNotNull(solucao, "Denuncia 28e53548-5bf4-423b-bd4b-5ffc0793d242 não tem Solucao");

        //--- alteramos a descrição e gravamos
        String descricao = solucao.getDescricao();
        String uuid = UUID.randomUUID().toString();

        descricao = "SolucaoAlterada "+uuid;
        solucao.setDescricao(descricao);
        solucao.setDataHora(LocalDateTime.now());
        solucao.persist();

        //--- procuramos no banco pelo id daquela solucao pra vermos se ele gravou as alteracoes
        Solucao solucaoAlterada = Solucao.findById(solucao.getId());

        assertNotNull(solucaoAlterada, "Solucao "+solucao.getId() + " não foi encontrada");
        assertTrue(solucaoAlterada.getDescricao().contains(uuid), "A alteracão não corresponde nas descrições");
    }

    @Order(9)
    @Test
    public void testaDenunciaRemocaoDeSolucao(){
        Solucao solucao = Solucao.findById("03434719-29d7-4e95-974e-d52a9527a2e3");
        assertNotNull(solucao, "Solucao 03434719-29d7-4e95-974e-d52a9527a2e3 não foi encontrado");

        assertTrue(Solucao.deleteById(solucao.getId()),"Solucao "+solucao.getId()+" não foi deletada" );

        //--- verifica que foi deletado no banco de dados
        Solucao solucaoQueFoiRemovida = Solucao.findById(solucao.getId());

        assertNull(solucaoQueFoiRemovida,"Solucao "+ solucaoQueFoiRemovida.getId()+ " não foi removida");
    }


}

