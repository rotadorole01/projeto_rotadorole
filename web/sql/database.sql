-- Script SQL para o projeto Rota do Rolê

CREATE DATABASE IF NOT EXISTS rota_do_role;
USE rota_do_role;

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL
);

-- Inserindo categorias iniciais
INSERT INTO categorias (nome, slug) VALUES 
('Shows', 'shows'),
('Bares', 'bares'),
('Restaurantes', 'restaurantes'),
('Cultural', 'cultural');

-- Tabela de Eventos
CREATE TABLE IF NOT EXISTS eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    data_evento DATE NOT NULL,
    horario TIME NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    imagem_url VARCHAR(255),
    categoria_id INT,
    destaque BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);


INSERT INTO eventos (titulo, descricao, data_evento, horario, localizacao, imagem_url, categoria_id, destaque) VALUES 
('Noite de Samba com Raízes','Samba ao vivo com as melhores escolas da região. Venha dançar e se divertir!', '2026-05-22', '20:00:00','Espaço Cultural Downtown'),
('Eletrônico Fest 2026','Festival de música eletrônica com os melhores DJs nacionais e internacionais!','2026-05-28', '22:00:00', 'Arena Eventos',)
('Festival de Jazz na Praça', 'Um evento cultural incrível com os melhores músicos da região.', '2026-05-15', '18:00:00', 'Praça Central', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80', 4, TRUE),
('Noite do Rock no Bar do Zé', 'As melhores bandas de rock clássico a noite toda.', '2026-05-20', '21:00:00', 'Rua das Flores, 123', 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=800&q=80', 2, TRUE),
('Degustação de Vinhos', 'Venha conhecer os melhores vinhos nacionais e importados.', '2026-06-01', '19:30:00', 'Restaurante Bella Italia', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80', 3, FALSE),
('Campanha institucional para melhoria da climatização das salas de aulas','2026-05-07', '11:00:00','Fatec Taquaritinga, Av. Dr. Flávio Henrique Lemos 585 (Portal Itamaracá), Taquaritinga-SP','Estamos iniciando uma deliciosa promoção para angariar fundos para a melhoria da climatização das salas de aulas da Fatec Taquaritinga!Pedidos: até 01/05/2026 Retirada: 06/05/2026 a 08/05/2026','https://www.tribunaonline.net/em-taquaritinga-sp-atleta-ministra-aulas-de-karate-gratuitamente-para-criancas-e-jovens/'),
('Aulas de karatê','2026-06-18','18:00:00','Ginásio Poliesportivo de Taquaritinga (SP)', 'conta com um projeto social que dá oportunidade para crianças e adolescentes, de 5 a 18 anos, aprenderem karatê de forma gratuita.','Os interessados em participarem das aulas, ministradas todas as terças e quintas-feiras, ás 16h30, devem procurar o Professor Soneca no Ginásio de Esportes.','https://www.tribunaonline.net/em-taquaritinga-sp-atleta-ministra-aulas-de-karate-gratuitamente-para-criancas-e-jovens/'),
('Vestibular Fatec','2026-04-07','15:00:00','Fatec Taquaritinga, Av. Dr. Flávio Henrique Lemos 585 Portal Itamaracá, Taquaritinga-SP, 15906-522','Inscrições para o processo seletivo da Fatec, venha fazer seu curso superior gratuito e ficar em outro nível, inscrições abertas do dia 07/04/2026 até as 15hrs de 01/06/2026','https://vestibular.fatec.sp.gov.br/home/'),
('Curso de Cálculo: Reforçado e Aprendizado','2026-05-15','19:00:00','Fatec Taquaritinga, Av. Dr. Flávio Henrique Lemos 585 (Portal Itamaracá), Taquaritinga-SP, 15906-522','Aulas Presenciais: Interação direta com o professor e troca de experiências com outros alunos.Foco na Prática: Chega de teoria abstrata! O aprendizado acontece por meio da resolução de exercícios passo a passoTecnologia e Suporte: Utilização de lousa digital para uma visualização clara e dinâmica, das 19:00 até 22:00.','https://fatectq.cps.sp.gov.br/curso-de-calculo-reforco-e-aprendizado/');





