
CREATE DATABASE apirest;

USE apirest;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    userName VARCHAR(100),
    userPassword VARCHAR(250),
    CONSTRAINT PK_USERS_ID PRIMARY KEY (id)
);

INSERT INTO users (`userName`, `userPassword`) VALUES 
('jose@gmail.com', '123'),
('marcos@etec.sp.go.br','234'),
('mario@fate.sp.go.br','567'),
('bruno@hotmail','890');

CREATE TABLE municipios (
	id INT NOT NULL AUTO_INCREMENT,
    municipio VARCHAR(100),
    UF VARCHAR(2),
    CONSTRAINT PK_MUNICIPIOS_ID PRIMARY KEY (id)
);

INSERT INTO municipios ( municipio , UF ) VALUES 
( 'Taquaritinga','SP' ),
( 'Matão','SP' ),
( 'Rio de Janeiro','RJ' );

CREATE TABLE estados (
    id INT NOT NULL AUTO_INCREMENT,
    estado VARCHAR(100),
    uf VARCHAR(2),
    regiao VARCHAR(10)
    CONSTRAINT PK_ESTADOS_ID PRIMARY KEY(id)
);

INSERT INTO estados ( estado, uf ) VALUES 
('São Paulo','SP', 'Suldeste'),
('Rio de Janeiro','RJ', 'Suldeste'),
('Minas Gerais','MG', 'Centro Oeste');

CREATE TABLE bairros (
    id INT NOT NULL AUTO_INCREMENT,
    bairro VARCHAR(100),    
    CONSTRAINT PK_BAIRROS_ID PRIMARY KEY(id)
);

INSERT INTO bairros ( bairro ) VALUES 
('Centro'),
('Cecap'),
('Jardim Buscardi');

