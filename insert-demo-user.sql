-- Execute apenas este comando no SQL Editor do Supabase
-- para criar o usuário demo necessário para o app funcionar

INSERT INTO users (id, username, password, created_at) 
VALUES ('demo-user', 'demo', 'demo', NOW())
ON CONFLICT (username) DO NOTHING;