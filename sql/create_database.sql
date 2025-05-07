-- Create respective tables

CREATE DATABASE abelhas_nativas;

USE abelhas_nativas;

CREATE TABLE colmeias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    status ENUM('Ativa', 'Em manutenção', 'Inativa') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    colmeia_id INT NOT NULL,
    descricao_alerta VARCHAR(255) NOT NULL,
    data_hora DATETIME NOT NULL,
    FOREIGN KEY (colmeia_id) REFERENCES colmeias(id) ON DELETE CASCADE
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('manager', 'user', 'researcher') NOT NULL,
    ultimo_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE monitoramento_abelhas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_hora DATETIME NOT NULL,
    numero_abelhas INT NOT NULL,
    temperatura DECIMAL(4,1) NOT NULL,
    clima VARCHAR(50) NOT NULL,
    situacao ENUM('Normal', 'Alerta', 'Em observação') NOT NULL,
    observacoes TEXT,
    colmeia_id INT NOT NULL,
    FOREIGN KEY (colmeia_id) REFERENCES colmeias(id) ON DELETE CASCADE
);

CREATE TABLE apiarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  localizacao VARCHAR(255) NOT NULL,
  responsavel VARCHAR(255),
  descricao TEXT
);


CREATE TABLE IF NOT EXISTS predator_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  nivel_perigo ENUM('Baixo', 'Médio', 'Alto') DEFAULT 'Médio',
  recomendacoes TEXT
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

-- Add after creating the existing tables

-- Create predator_types table
-- CREATE TABLE IF NOT EXISTS predator_types (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   nome VARCHAR(100) NOT NULL,
--   descricao TEXT,
--   nivel_perigo ENUM('Baixo', 'Médio', 'Alto') DEFAULT 'Médio',
--   recomendacoes TEXT
-- );

-- -- Create predator_detection table to track detections
-- CREATE TABLE IF NOT EXISTS predator_detections (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   colmeia_id INT NOT NULL,
--   predator_type_id INT,
--   data_hora DATETIME NOT NULL,
--   descricao TEXT,
--   acoes_tomadas TEXT,
--   resolvido BOOLEAN DEFAULT FALSE,
--   FOREIGN KEY (colmeia_id) REFERENCES colmeias(id) ON DELETE CASCADE,
--   FOREIGN KEY (predator_type_id) REFERENCES predator_types(id) ON DELETE SET NULL
-- );
