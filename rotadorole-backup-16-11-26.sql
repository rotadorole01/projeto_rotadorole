-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: dbmaria
-- Tempo de geração: 16/11/2026 às 13:14
-- Versão do servidor: 11.7.2-MariaDB-ubu2404
-- Versão do PHP: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `rotadorole`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `Shows` varchar(50) NOT NULL,
  `Bares` varchar(50) NOT NULL,
  `Restaurantes` varchar(50) NOT NULL,
  `Cultural` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `destaques_carrossel`
--

CREATE TABLE `destaques_carrossel` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `imagem` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `destaques_carrossel`
--

INSERT INTO `destaques_carrossel` (`id`, `titulo`, `descricao`, `imagem`) VALUES
(1, 'Robson Motos', 'Venha arrumar sua moto', 'http://localhost:3600/uploads/robsonmotos.webp'),
(2, 'Tornearia Santa Izildinha', 'Venha conhecer nossos serviços', 'http://localhost:3600/uploads/TorneariaSantaIzildinha.webp'),
(3, 'Fatec Taquaritinga', 'Seja um aluno da faculdade Fatec', 'http://localhost:3600/uploads/Fateccarrossel.webp'),
(4, 'Inscrições Fatec', 'Venha fazer sua inscrição ', 'http://localhost:3600/uploads/fatecinscricoes.png');

-- --------------------------------------------------------

--
-- Estrutura para tabela `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `titulo` text DEFAULT NULL,
  `data` datetime DEFAULT NULL,
  `horario` time DEFAULT NULL,
  `local` text DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `duracao` int(11) DEFAULT NULL,
  `localizacao` varchar(50) DEFAULT NULL,
  `preco` int(11) DEFAULT NULL,
  `ingresso` text DEFAULT NULL,
  `cidade` varchar(50) DEFAULT NULL,
  `bairro` varchar(50) DEFAULT NULL,
  `descricao` text NOT NULL,
  `imagem` text DEFAULT NULL,
  `link` varchar(50) DEFAULT NULL,
  `nome` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `telefone` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `eventos`
--

INSERT INTO `eventos` (`id`, `titulo`, `data`, `horario`, `local`, `categoria`, `duracao`, `localizacao`, `preco`, `ingresso`, `cidade`, `bairro`, `descricao`, `imagem`, `link`, `nome`, `email`, `telefone`) VALUES
(12, 'Vestibular Fatec', '2026-04-07 00:00:00', '15:00:00', NULL, 'cultural', 5, 'Fatec Taquaritinga, Av. Dr. Flávio Henrique Lemos ', 80, 'pago', 'Taquaritinga', 'Portal Itamaracá - 15906-522', 'Inscrições para o processo seletivo da Fatec, venha fazer seu curso superior gratuito e ficar em outro nível, inscrições abertas do dia 07/04/2026 até as 15hrs de 01/06/2026.', 'img/Fatec inscrições.png', 'https://fatectq.cps.sp.gov.br/', 'Marcus', 'Secretaria@fatectq.edu.br', 0),
(15, 'Festival de Jazz na Praça', '2026-05-15 18:00:00', '18:00:00', NULL, 'Música', 180, 'Praça Central', 50, 'https://ingressos.com.br', 'Taquaritinga', 'Centro', 'Um evento cultural incrível com os melhores músicos da região. Entrada gratuita para todos!', 'img/FestivaldeJazz.webp', 'file:///C:/Users/carle/Pictures/projeto_rotadorole', 'João Silva', 'joao@email.com', 0),
(16, 'Noite de Samba com Raízes', '2026-05-22 20:00:00', '20:00:00', NULL, 'Música', 180, 'Espaço Cultural Downtown', 30, 'https://ingressos.eventos.com/noite-de-samba', 'Taquaritinga', 'Centro', 'Samba ao vivo com as melhores escolas da região. Venha dançar e se divertir!', 'img/NoitedeSamba.webp', 'file:///C:/Users/carle/Pictures/projeto_rotadorole', 'Produções Downtown', 'contato@downtowneventos.com.br', 0),
(17, 'Eletrônico Fest 2026', '2026-05-28 22:00:00', '22:00:00', NULL, 'Música Eletrônica', 480, 'Arena Eventos', 120, 'https://ingressos.eventos.com/eletronico-fest-2026', 'Taquaritinga', 'Centro', 'Festival de música eletrônica com os melhores DJs nacionais e internacionais!', 'img/Festateletronica.webp', 'https://eventos.com/eletronico-fest-2026', 'Arena Produções', 'contato@arenaproducoes.com.br', 0),
(18, 'Noite do Rock no Bar do Zé', '2026-05-20 21:00:00', '21:00:00', NULL, 'Rock', 240, 'Rua das Flores, 123', 25, 'https://ingressos.eventos.com/noite-do-rock', 'Taquaritinga', 'Centro', 'As melhores bandas de rock clássico a noite toda. Chopp gelado e muita diversão!', 'img/BardoseuZe.webp', 'https://eventos.com/noite-do-rock', 'Bar do Zé Eventos', 'contato@bardoze.com.br', 0),
(19, 'Degustação de Vinhos', '2026-06-01 19:30:00', '19:30:00', NULL, 'Gastronomia', 180, 'Restaurante Bella Italia', 80, 'https://ingressos.eventos.com/degustacao-de-vinhos', 'Taquaritinga', 'Centro', 'Venha conhecer os melhores vinhos nacionais e importados com especialistas.', 'img/Degustacaodevinho.webp', 'https://eventos.com/degustacao-de-vinhos', 'Bella Italia Eventos', 'contato@bellaitalia.com.br', 0),
(20, 'Curso de Cálculo: Reforçado e Aprendizado', '2026-05-15 19:00:00', '19:00:00', NULL, 'Educação', 180, 'Fatec Taquaritinga, Av. Dr. Flávio Henrique Lemos,', 0, 'https://eventos.fatectq.edu.br/curso-calculo', 'Taquaritinga', 'Portal Itamaracá', 'Aulas presenciais com interação direta com o professor e troca de experiências entre alunos. Foco na prática por meio da resolução de exercícios passo a passo. Utilização de lousa digital para uma visualização clara e dinâmica, das 19h às 22h.', 'img/Curso Cálculo - Fatec.png', 'https://fatectq.edu.br/eventos/curso-calculo', 'Fatec Taquaritinga', 'eventos@fatectq.edu.br', 0),
(21, 'Campanha Institucional para Melhoria da Climatização das Salas de Aula', '2026-03-07 11:00:00', '11:00:00', NULL, 'Campanha Institucional', 30, 'Fatec Taquaritinga, Av. Dr. Flávio Henrique Lemos,', 0, 'https://eventos.fatectq.edu.br/campanha-climatizacao', 'Taquaritinga', 'Portal Itamaracá', 'Estamos iniciando uma deliciosa promoção para angariar fundos para a melhoria da climatização das salas de aula da Fatec Taquaritinga. Pedidos até 01/05/2026. Retirada dos produtos entre 06/05/2026 e 08/05/2026.', 'img/foto_pizza.jpeg', 'https://fatectq.edu.br/campanha-climatizacao', 'Fatec Taquaritinga', 'eventos@fatectq.edu.br', 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `locais`
--

CREATE TABLE `locais` (
  `id` int(11) NOT NULL,
  `localnome` text NOT NULL,
  `endereco` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `locais`
--

INSERT INTO `locais` (`id`, `localnome`, `endereco`) VALUES
(1, 'Praça Central', 'Rua das Flores, 100, Centro, Taquaritinga-SP'),
(2, 'Espaço Cultural Downtown', 'Av. Brasil, 200, Centro, Taquaritinga-SP'),
(3, 'Arena Eventos', 'Rua dos Eventos, 50, Bairro Industrial, Taquaritinga-SP'),
(4, 'Bar do Zé', 'Rua das Laranjeiras, 123, Centro, Taquaritinga-SP'),
(5, 'Restaurante Bella Italia', 'Rua Itália, 45, Centro, Taquaritinga-SP'),
(6, 'Fatec Taquaritinga', 'Av. Dr. Flávio Henrique Lemos 585 (Portal Itamaracá), Taquaritinga-SP'),
(7, 'Ginásio Poliesportivo de Taquaritinga', 'Rua do Esporte, 10, Centro, Taquaritinga-SP');

-- --------------------------------------------------------

--
-- Estrutura para tabela `logins`
--

CREATE TABLE `logins` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `validated` bit(1) NOT NULL DEFAULT b'0',
  `telefone` varchar(20) DEFAULT NULL,
  `cidade` varchar(120) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `tipo_conta` varchar(20) NOT NULL DEFAULT 'usuario',
  `cnpj` varchar(14) DEFAULT NULL,
  `nome_empresa` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `logins`
--

INSERT INTO `logins` (`id`, `name`, `email`, `password`, `validated`, `telefone`, `cidade`, `foto_perfil`, `tipo_conta`, `cnpj`, `nome_empresa`) VALUES
(1, 'Yasmin Luiza', 'yasmin@gmail.com', 'abc123', b'1', NULL, NULL, NULL, 'usuario', NULL, NULL),
(2, 'Gustavo', 'gustavo@gmail.com', '123abc', b'1', NULL, NULL, NULL, 'usuario', NULL, NULL),
(3, 'gustavo henrique da cruz lopes', 'gustavolopes@gmail.com', '12345', b'1', NULL, NULL, NULL, 'usuario', NULL, NULL),
(4, 'Lopes Henrique', 'lopesteste@gmail.com', '12345', b'1', NULL, NULL, NULL, 'usuario', NULL, NULL),
(5, 'teste criacao', 'test@gmail.com', '$2b$12$uYkU4xziBeP4/zpqYxnDP.ItShvI.Miete.zuM55MLTNioxVSEo5i', b'1', NULL, NULL, NULL, 'usuario', NULL, NULL),
(6, 'teste inclussao', 'teste@gmail.com', '$2b$12$7KhBihObYLfVw2Aycurn8OmJ0vDNHfLhnIM.CBZNKllvq8XpCZv/m', b'1', NULL, NULL, NULL, 'usuario', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `parceiros`
--

CREATE TABLE `parceiros` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `nameempresa` text NOT NULL,
  `cnpj` varchar(20) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `emailcorporativo` text NOT NULL,
  `interesse` text NOT NULL,
  `area` text NOT NULL,
  `mensagem` text DEFAULT NULL,
  `validated` bit(1) NOT NULL DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `parceiros`
--

INSERT INTO `parceiros` (`id`, `name`, `nameempresa`, `cnpj`, `telefone`, `emailcorporativo`, `interesse`, `area`, `mensagem`, `validated`) VALUES
(1, 'Prof. Dr. Marcus Rogério de Olivei', 'Fatec Taquaritinga', '62.823.257/0022-25', '(16) 3252-5250', 'secretaria@fatectq.edu.br', 'Parceria de Divulgação Mutua', 'Outro', 'Desejo promover este projeto com fins educativos e institucionais.', b'1'),
(2, 'Canova', 'Tornearia Santa Izildinha', '12.345.678/0001-99', '16999999999', 'contato@tornocanova.com', 'parceria_divulgacao', 'tornearia', 'Gostaria de divulgar meus trabalhos.', b'0'),
(3, 'Robson', 'Rosbon Motos', '12.445.678/0001-55', '16999999999', 'contato@motosrobson.com', 'parceria_divulgacao', 'oficina', 'Gostaria de divulgar minhas motos.', b'0'),
(4, 'hjkjkuk', 'dfdfffdf', 's5753423748687524', '11111111111', 'suihasuihda@gmail.com', 'patrocinio_site', 'gastronomia', 'xadsadadad', b'0'),
(5, 'rfrvrtgtb', 'kslkxlçwkdcç', 'c34r453453', '3333333', 'nxsh@gmail.com', 'destaque_eventos', 'gastronomia', 'sxsdxs', b'0');

-- --------------------------------------------------------

--
-- Estrutura para tabela `patrocinadores_carrossel`
--

CREATE TABLE `patrocinadores_carrossel` (
  `id` int(11) NOT NULL,
  `titulo` text NOT NULL,
  `descricao` text NOT NULL,
  `imagem` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `patrocinadores_carrossel`
--

INSERT INTO `patrocinadores_carrossel` (`id`, `titulo`, `descricao`, `imagem`) VALUES
(1, 'Fatec Taquaritinga', 'Desejo promover este projeto com fins educativos e...', '/uploads/Patrocinadores.webp'),
(2, 'Tornearia Santa Izildinha', 'Gostaria de divulgar meus trabalhos.', '/uploads/TorneariaSantaIzildinha.webp'),
(3, 'Robson Motos', 'Gostaria de divulgar minhas motos.', '/uploads/robsonmotos.webp'),
(4, 'Seja um Patrocinador', 'Divulgue seus eventos pelo nosso site', '/uploads/sejaumpatrocinador.jpeg');

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `login` text NOT NULL,
  `password` text NOT NULL,
  `validated` bit(1) NOT NULL DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `name`, `login`, `password`, `validated`) VALUES
(1, 'Yasmin Luiza', 'Yasmin', 'abc123', b'1'),
(2, 'Gustavo', 'Gustavo', '123abc', b'1');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `destaques_carrossel`
--
ALTER TABLE `destaques_carrossel`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `locais`
--
ALTER TABLE `locais`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `logins`
--
ALTER TABLE `logins`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `parceiros`
--
ALTER TABLE `parceiros`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `patrocinadores_carrossel`
--
ALTER TABLE `patrocinadores_carrossel`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `destaques_carrossel`
--
ALTER TABLE `destaques_carrossel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de tabela `locais`
--
ALTER TABLE `locais`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `logins`
--
ALTER TABLE `logins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `parceiros`
--
ALTER TABLE `parceiros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `patrocinadores_carrossel`
--
ALTER TABLE `patrocinadores_carrossel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
