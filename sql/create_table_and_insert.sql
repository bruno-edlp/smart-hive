CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nome_completo VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL,
  ultimo_login DATETIME
);


CREATE TABLE apiarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  localizacao VARCHAR(255) NOT NULL,
  responsavel VARCHAR(255),
  descricao TEXT
);

CREATE TABLE colmeias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  localizacao VARCHAR(255) NOT NULL,
  status ENUM('Ativa', 'Em manutenção', 'Inativa') DEFAULT 'Ativa'
);

CREATE TABLE monitoramento_abelhas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data_hora DATETIME NOT NULL,
  numero_abelhas INT NOT NULL,
  temperatura DECIMAL(5,2),
  clima VARCHAR(100),
  situacao VARCHAR(100),
  observacoes TEXT,
  colmeia_id INT NOT NULL,
  FOREIGN KEY (colmeia_id) REFERENCES colmeias(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS predator_detections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  colmeia_id INT NOT NULL,
  predator_type_id INT,
  data_hora DATETIME NOT NULL,
  descricao TEXT,
  acoes_tomadas TEXT,
  resolvido BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (colmeia_id) REFERENCES colmeias(id) ON DELETE CASCADE,
  FOREIGN KEY (predator_type_id) REFERENCES predator_types(id) ON DELETE SET NULL
);

ALTER TABLE colmeias
ADD COLUMN apiario_id INT,
ADD CONSTRAINT fk_colmeias_apiario
FOREIGN KEY (apiario_id) REFERENCES apiarios(id) ON DELETE SET NULL;

ALTER TABLE colmeias ADD nome TEXT;
ALTER TABLE colmeias MODIFY status TEXT;

--INSERÇÃO DOS DADOS A PARTIR DAQUI

-- Inserir dados de exemplo na tabela colmeias
INSERT INTO colmeias (nome, localizacao, status) VALUES 
  ('Jataí 01', 'Jardim Botânico - Setor A', 'Ativa'),
  ('Mandaçaia 02', 'Reserva Ambiental - Setor B', 'Ativa'),
  ('Uruçu 03', 'Fazenda Experimental - Setor C', 'Em manutenção'),
  ('Mirim 04', 'Campus Universitário - Setor D', 'Ativa'),
  ('Manduri 05', 'Parque Ecológico - Setor E', 'Inativa');

-- Inserir dados de exemplo na tabela alertas
INSERT INTO alertas (colmeia_id, descricao_alerta, data_hora) VALUES 
  (1, 'Temperatura elevada detectada - acima de 35°C', NOW() - INTERVAL 3 DAY),
  (2, 'Diminuição súbita na atividade de voo das abelhas', NOW() - INTERVAL 2 DAY),
  (1, 'Presença de formigas na proximidade da colmeia', NOW() - INTERVAL 1 DAY),
  (3, 'Colmeia com umidade excessiva após chuva forte', NOW() - INTERVAL 12 HOUR),
  (4, 'Alteração no padrão de entrada e saída das abelhas', NOW() - INTERVAL 6 HOUR);

-- Inserir dados de exemplo na tabela usuários
INSERT INTO usuarios (username, password, nome_completo, email, role, ultimo_login) VALUES 
  ('gerente', 'gerente123', 'Gerente de Apiário', 'gerente@exemplo.com', 'manager', NOW() - INTERVAL 5 DAY),
  ('tecnico', 'tecnico123', 'Técnico de Campo', 'tecnico@exemplo.com', 'user', NOW() - INTERVAL 1 DAY),
  ('pesquisador', 'pesq123', 'Pesquisador UFPR', 'pesquisador@exemplo.com', 'researcher', NOW() - INTERVAL 2 HOUR);

-- Inserir dados de exemplo na tabela monitoramento_abelhas
INSERT INTO monitoramento_abelhas (data_hora, numero_abelhas, temperatura, clima, situacao, observacoes, colmeia_id)
VALUES 
  (NOW() - INTERVAL 3 DAY, 180, 26.8, 'Ensolarado', 'Normal', 'Atividade intensa de forrageamento', 1),
  (NOW() - INTERVAL 2 DAY + INTERVAL 6 HOUR, 150, 28.2, 'Ensolarado', 'Normal', 'Comportamento normal', 1),
  (NOW() - INTERVAL 2 DAY, 85, 22.4, 'Parcialmente nublado', 'Alerta', 'Redução de atividade', 2),
  (NOW() - INTERVAL 1 DAY + INTERVAL 12 HOUR, 200, 25.6, 'Ensolarado', 'Normal', 'Pico de atividade no período da tarde', 4),
  (NOW() - INTERVAL 1 DAY, 60, 19.8, 'Chuvoso', 'Em observação', 'Pouca atividade devido à chuva', 3),
  (NOW() - INTERVAL 12 HOUR, 120, 24.5, 'Parcialmente nublado', 'Normal', 'Retorno da atividade normal após chuva', 2),
  (NOW() - INTERVAL 6 HOUR, 95, 23.0, 'Nublado', 'Normal', 'Algumas abelhas com pólen nas corbículas', 1),
  (NOW() - INTERVAL 3 HOUR, 110, 25.2, 'Ensolarado', 'Normal', 'Observada a rainha na entrada da colmeia', 4),
  (NOW() - INTERVAL 1 HOUR, 75, 22.8, 'Parcialmente nublado', 'Em observação', 'Movimentação menor que o esperado para o horário', 5);

  -- Inserção de tipos de predadores
INSERT INTO predator_types (nome, descricao, nivel_perigo, recomendacoes) VALUES
('Formigas', 'Podem invadir colmeias em busca de mel e pólen, causando estresse às abelhas', 'Médio', 'Manter a colmeia elevada e usar barreiras físicas como graxa ou água ao redor dos suportes'),
('Aranhas', 'Podem caçar abelhas individualmente na entrada da colmeia', 'Baixo', 'Manter a área ao redor da colmeia limpa de teias'),
('Vespas', 'Predadores agressivos que podem matar várias abelhas e invadir a colmeia', 'Alto', 'Instalar armadilhas para vespas nas proximidades e reduzir a entrada da colmeia'),
('Pássaros', 'Algumas espécies de pássaros se alimentam de abelhas', 'Médio', 'Instalar redes de proteção ou arbustos próximos para oferecer refúgio às abelhas'),
('Lagartos', 'Podem se posicionar na entrada da colmeia para capturar abelhas', 'Baixo', 'Manter a área ao redor da colmeia livre de esconderijos para répteis'),
('Outros insetos', 'Diversos insetos podem predar abelhas ou competir por recursos', 'Médio', 'Monitorar regularmente e identificar o tipo específico para ação apropriada');

-- Adicionando algumas detecções de predadores
INSERT INTO predator_detections (colmeia_id, predator_type_id, data_hora, descricao, acoes_tomadas, resolvido) VALUES
(1, 3, '2023-10-25 14:30:00', 'Grupo de vespas atacando abelhas na entrada da colmeia', 'Instalada armadilha para vespas', TRUE),
(2, 1, '2023-10-30 09:45:00', 'Trilha de formigas tentando acessar a colmeia', 'Aplicada graxa nos suportes da colmeia', TRUE),
(4, 5, '2023-11-02 16:20:00', 'Lagarto observado caçando abelhas na entrada', 'Área ao redor da colmeia limpa de vegetação', FALSE);

-- Inserção de alguns apiarios
INSERT INTO apiarios (nome, localizacao, responsavel, descricao) VALUES
  ('Apiário Bela Flor', 'Fazenda Santa Rita - MG', 'João Pereira', 'Apiário especializado em abelhas Jataí, com produção de mel para consumo local.'),
  ('Doce Colmeia', 'Sítio São João - SP', 'Maria das Graças', 'Área de pesquisa e desenvolvimento com monitoramento automatizado.'),
  ('Mel do Cerrado', 'Chapada dos Veadeiros - GO', 'Carlos Eduardo', 'Apiário sustentável com foco em preservação de espécies nativas.'),
  ('Florada Pura', 'Vale do Ribeira - SP', 'Ana Luiza', 'Pequena produção familiar voltada para produtos orgânicos.'),
  ('EcoMel', 'Reserva Ambiental do Pantanal - MS', 'Rafael Monteiro', 'Apiário em área de preservação, com estudo de comportamento das abelhas.'),
  ('Abelha Viva', 'Campus Rural da UFPR - PR', 'Dr. Helena Rocha', 'Instalação voltada para ensino e extensão universitária.');
