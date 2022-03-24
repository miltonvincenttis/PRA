delete from comentarios;
delete from solucoes;
delete from curtidas;
delete from denuncias;
delete from pessoas;
delete from tiposdeproblemas;
--===========================================================
-- Testes: Pessoa
--===========================================================

-- deleta todas pessoas
delete from pessoas;

-- Insert para Pessoas comuns
insert into pessoas
(
	pessoas_id,
	nome,
	senha
)
values
(
	'367a2fa3-ab08-4f76-95bc-c7d9bd684493',
	'Milton Lima Vincenttis',
	'123'
);

-- insert para pessoas 'admin
insert into pessoas
(
	pessoas_id,
	nome,
	admin,
	senha
)
values
(	'd5d6dc5f-4028-4ad2-ad2b-2f5af1c651e8',
	'Milton Lima Vincenttis',
	't',
    '123'
);
-- select todo mundo
select * from pessoas;

-- select para pessoas admin
select * from pessoas where admin='t';

-- select para pessoas comuns
select * from pessoas where admin='f';

-- remover baseado na pk
update pessoas set admin = true where pessoas_id = '81ae6bb3-57d5-4e08-a176-6d5d1b478ad5';


--===========================================================
-- Testes: Tipo de Problemas
--===========================================================
delete from tiposdeproblemas;

insert into tiposdeproblemas
(
	tipo_problemas_id, 
	descricao
)
values
(
	'123ff903-02bd-4545-961c-8ee0ca28d685', 
	'Mobilidade Urbana'	
);

insert into tiposdeproblemas
(
	tipo_problemas_id,
	descricao
)
values
(
	'456ff903-02bd-4545-961c-8ee0ca28d685',
	'Iluminação Pública'	
);

insert into tiposdeproblemas
(
	tipo_problemas_id,
	descricao
)
values
(
	'789ff903-02bd-4545-961c-8ee0ca28d685',
	'Saneamento Básico'	
);

-- select todos os registros;
select * from tiposdeproblemas;

-- alterar um tipo de problema
update tiposdeproblemas 
 -- coluna a ter seu valor modificado
 set descricao = '<valor alterado>'  --original: 'Mobilidade Urbana'
 where -- para esse Tipo de Problema 
  tipo_problemas_id='123ff903-02bd-4545-961c-8ee0ca28d685';

--remover um tipo de problema baseado na pk:
--delete from tiposdeproblemas where tipo_problemas_id='ec04219c-a7ae-435c-9b70-92272c0e3ff4'
 
 
--===========================================================
-- Testes: Denuncia
--===========================================================
delete from denuncias;

insert into denuncias
(
    denuncias_id      ,
    pessoas_fk        ,
    tipo_problemas_fk ,
    datahora          ,
    descricao         
)
values
(   '28e53548-5bf4-423b-bd4b-5ffc0793d242',  -- denuncia id
    '367a2fa3-ab08-4f76-95bc-c7d9bd684493',  -- usuario comum
    '456ff903-02bd-4545-961c-8ee0ca28d685',  -- iluminacao publica
    localtimestamp(6),
    'A ciclo via do bairro foi totalmente destruida pelas obras que repararam um problema com tubulação.-----------------------------------------'
);

insert into denuncias
(
    denuncias_id      , 
    pessoas_fk        ,
    tipo_problemas_fk ,
    datahora          ,
    descricao         
)
values
(
	'5873c27a-c3fb-4aa0-a9ea-d0b784d38688',  -- denuncia id
	'367a2fa3-ab08-4f76-95bc-c7d9bd684493',  -- usuario comum
	'456ff903-02bd-4545-961c-8ee0ca28d685',  -- iluminacao publica
	localtimestamp(6),
	'A ciclo via do bairro foi totalmente destruida pelas obras que repararam um problema com tubulação.-----------------------------------------'
);

insert into denuncias
(
	denuncias_id      , 
    pessoas_fk        ,
    tipo_problemas_fk ,
    datahora          ,
    descricao         
)
values
(
	'eeacc3e0-0367-4895-8112-00916f811973', 
	'367a2fa3-ab08-4f76-95bc-c7d9bd684493',  -- usuario comum
	'456ff903-02bd-4545-961c-8ee0ca28d685',  -- iluminacao publica
	localtimestamp(6),
	'A ciclo via do bairro foi totalmente destruida pelas obras que repararam um problema com tubulação.-----------------------------------------'
);
select * from denuncias order by datahora; -- desc;

update denuncias
 set descricao = 'A ciclo via do bairro foi totalmente destruida pelas obras que repararam um problema com tubulação.-----------------------------------------';
 --where denuncias_id = '088eb681-955d-470d-8852-74cb2dfbf9ae'
 
 -- deletar denuncia sem comentários nem solução funciona
 --delete from denuncias where denuncias_id='088eb681-955d-470d-8852-74cb2dfbf9ae';
 
  
--===========================================================
-- Testes: Comentários
--===========================================================
 delete from comentarios;
 
 insert into comentarios
 (
 	comentarios_id,
	denuncias_fk,
	datahora,
	descricao,
	pessoas_fk 
 )
 values
 (
	'be8ab20c-3e33-425f-b88b-838b6c0b48b3',
	'28e53548-5bf4-423b-bd4b-5ffc0793d242', 
	localtimestamp(6),
	'Essa denuncia já havia sido reportada para o pessoal da Prefeitura há um tempo atrás e nada havia sido feito.',
	'367a2fa3-ab08-4f76-95bc-c7d9bd684493' 	 	
 );
 
 select * from comentarios;
 
 --===========================================================
-- Testes: Soluções
--===========================================================
delete from solucoes;

insert into solucoes
(
    solucoes_id,
    denuncias_fk,
    pessoas_fk  ,
    datahora    ,
    descricao 
)
values
(
	'03434719-29d7-4e95-974e-d52a9527a2e3',
	'28e53548-5bf4-423b-bd4b-5ffc0793d242',
	'd5d6dc5f-4028-4ad2-ad2b-2f5af1c651e8',	
	localtimestamp(6),
	'O problema foi resolvido pelo departamento de obras viárias em 28.02.2022.'
);

select * from solucoes;


--===========================================================
-- Testes: Curtidas
--===========================================================
delete from curtidas;

insert into curtidas
(
    curtidas_id,
    denuncias_fk,
    pessoas_fk
)
values
(
	'5cce02a9-7394-4479-a883-26c49938bda8',
	'28e53548-5bf4-423b-bd4b-5ffc0793d242',
	'd5d6dc5f-4028-4ad2-ad2b-2f5af1c651e8'		
);

-- select baseado na PK
select * from curtidas where denuncias_fk='28e53548-5bf4-423b-bd4b-5ffc0793d242' and pessoas_fk='d5d6dc5f-4028-4ad2-ad2b-2f5af1c651e8';

-- descurtida baseado num delete por pk
--delete from curtidas where denuncias_fk='28e53548-5bf4-423b-bd4b-5ffc0793d242' and pessoas_fk='d5d6dc5f-4028-4ad2-ad2b-2f5af1c651e8';

select * from curtidas;