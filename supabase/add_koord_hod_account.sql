-- SQL for adding HOD Coordinator account
-- Coordinator has admin role to oversee all departments

INSERT INTO public.users (username, password, name, role)
VALUES
    ('koord_hod', '123', 'Aprilia Rahayu Wilujeng, S.Pd Gr', 'admin')
ON CONFLICT (username) 
DO UPDATE SET 
    role = EXCLUDED.role,
    name = EXCLUDED.name;
