CREATE DATABASE servidores1 ;

USE servidores1;

CREATE TABLE users ( 
    id INT NOT NULL AUTO_INCREMENT,
    login VARCHAR(100),
    password VARCHAR(250),
    name VARCHAR(30) NULL,
    CONSTRAINT PK_USERS_ID PRIMARY KEY(id)
);

INSERT INTO users ( login, password, name ) VALUES
( "jose@test.com", "123", "jose"),
( "marinho@gmail.cm", "234", "marinho");


CREATE TABLE municipios ( 
    id INT NOT NULL AUTO_INCREMENT NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    uf VARCHAR(2) NULL,
    populacao INT NULL,
    CONSTRAINT PK_MUNICIPIOS_ID PRIMARY KEY(id)
);

INSERT INTO municipios ( municipio, uf, populacao ) VALUES
( "Taquaritinga", "SP", 65000),
( "Monte Alto", "SP", 70000);


CREATE TABLE logradouros ( 
    id INT NOT NULL AUTO_INCREMENT NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    CONSTRAINT PK_LOGRADOUROS_ID PRIMARY KEY(id)
);

INSERT INTO logradouros ( logradouro ) VALUES
( "Prudente de Moraes"),
( "Marechal Deodora da Fonseca");

CREATE TABLE estados ( 
    id INT NOT NULL AUTO_INCREMENT NOT NULL,
    estado VARCHAR(100) NOT NULL,
    uf VARCHAR(2) NULL,
    CONSTRAINT PK_ESTADOS_ID PRIMARY KEY(id)
);

INSERT INTO estados ( estado, uf ) VALUES
( "São Paulo", "SP" ),
( "Minas Gerais", "MG" );

CREATE TABLE bairros ( 
    id INT NOT NULL AUTO_INCREMENT NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    CONSTRAINT PK_BAIRROS_ID PRIMARY KEY(id)
);


INSERT INTO bairros ( bairro ) VALUES
( "Centro"),
( "Cecap");

CREATE TABLE tarefas ( 
    id INT NOT NULL AUTO_INCREMENT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NULL,
    tempo INT NULL,
    flagurgente BOOLEAN DEFAULT FALSE,   
    flagopcional BOOLEAN DEFAULT FALSE,
    statustarefa BOOLEAN DEFAULT FALSE,
    CONSTRAINT PK_TAREFAS_ID PRIMARY KEY(id)
);

INSERT INTO tarefas ( titulo, descricao, tempo) VALUES
('Tarefa teams carlao', 'criar esta tabela e popular com dados', 5 ),
('Tarefa teams - DS-1', 'criar modal para tabela tarefas', 15 ),
('Tarefa teams - DS-1', 'criar controller para tabela tarefas', 15 ),
('Tarefa teams - DS-1', 'criar view/routes para tabela tarefas', 15 ),
('Tarefa teams - DS-1', 'adicionar no routes.js a rota tarefas', 15 ),
('Tarefa teams - DS-1', 'criar arquivo http tarefas para os testes', 15 );

DROP TABLE mensagens ;

CREATE TABLE mensagens ( 
    id INT NOT NULL AUTO_INCREMENT,
    iduser INT NOT NULL,
    idclient INT NOT NULL,
    mensagem TEXT NOT NULL,
    visualizado BOOLEAN DEFAULT FALSE,   
    CONSTRAINT PK_TAREFAS_ID PRIMARY KEY(id)
);

INSERT INTO mensagens ( iduser, idclient, mensagem ) VALUES
( 1, 2 , "teste"),
( 2, 1 , "teste - ok"),
( 1, 2 , "boa tarde"),
( 2, 1 , "boa tarde, blz"),
( 1, 2 , "tarefa de db-1 , você fez ?"),
( 2, 1 , "fiz, mas não vou te passar uma copia"),
( 2, 3 , "cara o rafael, ta me pedindo a atividade, o que faço ?");

DELETE mensagens WHERE id = 6 ;

UPDATE FROM mensagens  SET mensagem = "claro, passa o email" WHERE id = 6 ;

SELECT mensagem, visualizado 
FROM  mensagens
WHERE iduser = 1 
ORDER BY id;

SELECT mensagem, visualizado 
FROM  mensagens
WHERE iduser = 2 
ORDER BY id;


SELECT mensagem, visualizado 
FROM  mensagens
WHERE iduser = 1 AND idclient = 2
ORDER BY id;


SELECT mensagem, visualizado 
FROM  mensagens
WHERE iduser = 1 

UNIO ALL

SELECT mensagem, visualizado 
FROM  mensagens
WHERE iduser = 2
ORDER BY id;