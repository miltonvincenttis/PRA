package appdev.dominio;

import com.thoughtworks.xstream.converters.time.LocalDateTimeConverter;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Esses são os testes para classes Dominio.
 *
 * Vamos testar as classes abaixo com suas operações.
 * Elas usam o padrão Active Record.
 *
 * Denuncia:
 *      inclusão        ok
 *      alteracão       ok
 *      remoção         ok se mesmo criador, se sem comentários nem soluções
 *      inclusão, alteracao remoção Comentário
 *      inclusão, alteracao, remoção Solução
 * Curtida: Curtir, Descurtir
 *
 * A gente assume que o Postgresql está configurado e rodando.
 *
 */
@QuarkusTest
@Transactional
public class DominioClassesTester {

    @Order(1)
    @Test
    public void testaDenunciaIncluirFoiSucesso(){
        //--- pessoa que está criando a denuncia (admin)
        Pessoa admin = Pessoa.encontrarPessoaPeloNome("admin");

        //--- tipo de problema: Iluminação publica (ver /resources/inserts.sql
        TipoDeProblema tpb = TipoDeProblema.findById("456ff903-02bd-4545-961c-8ee0ca28d685");
        Denuncia denuncia = new Denuncia();
        denuncia.setDescricao("DenunciaTeste1");
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
        assertTrue(comentarios.size() == 0);
        assertTrue(solucoes.size() == 0);

        //--- tudo ok, é a mesma pessoa que criou, não tem comentários nem soluções então vamos deletar.

        //--- deve atribuir null para pessoa antes
        //--- deve atribuir null para tipo de problema antes

        denuncia.setPessoa(null);
        denuncia.setTipoDeProblema(null);
        denuncia.delete();

        //--- vamos procurar pelo id daquela denuncia pra ver se encontrarmos
        denuncia = Denuncia.findById("63cd2e4b-e4b1-4e3e-b938-d754b5853448");
        assertTrue(denuncia == null);
    }


    @Order(4)
    @Test
    public void testaDenunciaInclusaoDeComentario(){
        //--- encontrar uma Pessoa existente
        Pessoa pessoa = Pessoa.encontrarPessoaPeloNome("comum");

        //--- encontrar uma Denuncia existente
        Denuncia denuncia = Denuncia.findById("f881eae7-b445-478c-8beb-6c3927e52aaf");

        //--- criar um Comentário e adicionar ao Set de Comentarios na Denuncia
        Comentario comentario = new Comentario();

        //--- relacionamos a denuncia com o comentário
        comentario.setDenuncia(denuncia);
        comentario.setDescricao("ComentarioTestePessoaComum");
        comentario.setDataHora(LocalDateTime.now());
        comentario.setPessoa(pessoa);

        //--- adiciona o comentário ao conjunto de comentarios do objeto denuncia
        denuncia.getComentarios().add(comentario);

        //--- deve gravar o comentário tambem
        denuncia.persist();

        //--- esperamos que o comentario foi gravado, entao pegamos o Id dele e o procuramos novamente
        Comentario comentarioGravado = Comentario.findById(comentario.getId());

        //--- comparamos a descrição do comentário incluido com esse que achamos pra ver se são os mesmos objetos
        assertTrue(comentario.getDescricao().equalsIgnoreCase(comentarioGravado.getDescricao()));
    }
}
