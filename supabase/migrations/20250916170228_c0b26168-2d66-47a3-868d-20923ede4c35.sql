-- Remove users "ffff" and "קמיל" from the database
DELETE FROM public.users 
WHERE email IN ('admin@aaa.com', 'kamilfucs82@gmail.com');