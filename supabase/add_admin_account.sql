-- SQL for adding Admin account that can edit all departments
-- Admin does not need a jurusan_id since they have access to all

INSERT INTO public.users (username, password, name, role)
VALUES
    ('admin', '123', 'Administrator', 'admin')
ON CONFLICT (username) 
DO UPDATE SET 
    role = EXCLUDED.role,
    name = EXCLUDED.name;
