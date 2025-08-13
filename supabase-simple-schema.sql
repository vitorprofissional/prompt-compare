-- Schema simplificado para MVP sem sistema de usuários
-- Execute este SQL no editor SQL do Supabase

-- Tabela de projetos (sem referência a usuários)
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de comparações de prompts (sem referência a usuários)
CREATE TABLE IF NOT EXISTS prompt_comparisons (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  prompt_a TEXT NOT NULL,
  prompt_b TEXT NOT NULL,
  metadata JSON,
  project_id VARCHAR REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para melhor performance
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
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_prompt_comparisons_updated_at ON prompt_comparisons;
CREATE TRIGGER update_prompt_comparisons_updated_at BEFORE UPDATE ON prompt_comparisons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();