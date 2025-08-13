-- Tabelas necessárias para o PromptCompare
-- Execute este SQL no editor SQL do Supabase

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir usuário demo se não existir
INSERT INTO users (id, username, password, created_at) 
VALUES ('demo-user', 'demo', 'demo', NOW())
ON CONFLICT (id) DO NOTHING;

-- Tabela de projetos
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de comparações de prompts
CREATE TABLE IF NOT EXISTS prompt_comparisons (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  prompt_a TEXT NOT NULL,
  prompt_b TEXT NOT NULL,
  metadata JSON,
  project_id VARCHAR REFERENCES projects(id) ON DELETE CASCADE,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_comparisons_user_id ON prompt_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_comparisons_project_id ON prompt_comparisons(project_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompt_comparisons_updated_at BEFORE UPDATE ON prompt_comparisons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();