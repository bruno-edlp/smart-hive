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

CREATE TABLE colmeias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  localizacao VARCHAR(255) NOT NULL,
  status ENUM('Ativa', 'Em manutenção', 'Inativa') DEFAULT 'Ativa'
);


ALTER TABLE colmeias ADD nome TEXT;
ALTER TABLE colmeias MODIFY status TEXT;

INSERT INTO usuarios (username, password, nome_completo, email, role, ultimo_login) VALUES 
  ('gerente', 'gerente123', 'Gerente de Apiário', 'gerente@exemplo.com', 'manager', NOW() - INTERVAL 5 DAY),
  ('tecnico', 'tecnico123', 'Técnico de Campo', 'tecnico@exemplo.com', 'user', NOW() - INTERVAL 1 DAY),
  ('pesquisador', 'pesq123', 'Pesquisador UFPR', 'pesquisador@exemplo.com', 'researcher', NOW() - INTERVAL 2 HOUR);


INSERT INTO colmeias (nome, localizacao, status) VALUES 
  ('Jataí 01', 'Jardim Botânico - Setor A', 'Ativa'),
  ('Mandaçaia 02', 'Reserva Ambiental - Setor B', 'Ativa'),
  ('Uruçu 03', 'Fazenda Experimental - Setor C', 'Em manutenção'),
  ('Mirim 04', 'Campus Universitário - Setor D', 'Ativa'),
  ('Manduri 05', 'Parque Ecológico - Setor E', 'Inativa');
 

INSERT INTO predator_detections (colmeia_id, predator_type_id, data_hora, descricao, acoes_tomadas, resolvido) VALUES
(1, 3, '2023-10-25 14:30:00', 'Grupo de vespas atacando abelhas na entrada da colmeia', 'Instalada armadilha para vespas', TRUE),
(2, 1, '2023-10-30 09:45:00', 'Trilha de formigas tentando acessar a colmeia', 'Aplicada graxa nos suportes da colmeia', TRUE),
(4, 5, '2023-11-02 16:20:00', 'Lagarto observado caçando abelhas na entrada', 'Área ao redor da colmeia limpa de vegetação', FALSE);