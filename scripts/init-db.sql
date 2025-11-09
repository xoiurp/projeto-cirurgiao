-- Script de inicialização do banco de dados
-- Projeto Cirurgião - Ambiente de Desenvolvimento

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Criar schema para o projeto
CREATE SCHEMA IF NOT EXISTS cirurgiao;

-- Comentários
COMMENT ON SCHEMA cirurgiao IS 'Schema principal do Projeto Cirurgião';

-- Configurações de timezone
SET timezone = 'America/Sao_Paulo';

-- Log de inicialização
DO $$
BEGIN
    RAISE NOTICE 'Banco de dados projeto_cirurgiao inicializado com sucesso!';
    RAISE NOTICE 'Schema: cirurgiao';
    RAISE NOTICE 'Extensões: uuid-ossp, pg_trgm';
    RAISE NOTICE 'Timezone: America/Sao_Paulo';
END $$;
