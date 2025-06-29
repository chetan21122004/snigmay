-- Clear existing data (in correct order due to foreign key constraints)
DELETE FROM public.attendance;
DELETE FROM public.students;
DELETE FROM public.batches;
DELETE FROM public.users WHERE role IN ('admin', 'coach');

-- Insert demo admin user
INSERT INTO public.users (id, email, full_name, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@academy.com', 'Academy Administrator', 'admin');

-- Insert demo coach users
INSERT INTO public.users (id, email, full_name, role) VALUES
  ('22222222-2222-2222-2222-222222222222', 'john.coach@academy.com', 'John Martinez', 'coach'),
  ('33333333-3333-3333-3333-333333333333', 'sarah.coach@academy.com', 'Sarah Johnson', 'coach'),
  ('44444444-4444-4444-4444-444444444444', 'mike.coach@academy.com', 'Mike Thompson', 'coach'),
  ('55555555-5555-5555-5555-555555555555', 'lisa.coach@academy.com', 'Lisa Rodriguez', 'coach');

-- Insert demo batches with realistic names and descriptions
INSERT INTO public.batches (id, name, description, coach_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Under 8 Beginners', 'Introduction to football for ages 6-8, focusing on basic skills and fun', '22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Under 10 Development', 'Skill development for ages 8-10, basic tactics and teamwork', '33333333-3333-3333-3333-333333333333'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Under 12 Competitive', 'Competitive training for ages 10-12, advanced skills and match preparation', '22222222-2222-2222-2222-222222222222'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Under 15 Elite', 'Elite training for ages 13-15, tactical awareness and physical conditioning', '44444444-4444-4444-4444-444444444444'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Under 18 Academy', 'Academy level training for ages 16-18, professional development pathway', '55555555-5555-5555-5555-555555555555'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Girls Under 12', 'Specialized training for girls ages 10-12, skill development and confidence building', '33333333-3333-3333-3333-333333333333'),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Adult Recreational', 'Recreational football for adults, fitness and fun focused', '44444444-4444-4444-4444-444444444444');

-- Insert demo students with realistic names and contact information
INSERT INTO public.students (id, name, age, contact_info, batch_id) VALUES
  -- Under 8 Beginners
  ('s0000001-0000-0000-0000-000000000001', 'Alex Thompson', 7, 'parent.alex@email.com, 555-0101', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('s0000002-0000-0000-0000-000000000002', 'Emma Wilson', 8, 'parent.emma@email.com, 555-0102', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('s0000003-0000-0000-0000-000000000003', 'Liam Davis', 6, 'parent.liam@email.com, 555-0103', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('s0000004-0000-0000-0000-000000000004', 'Sophia Brown', 7, 'parent.sophia@email.com, 555-0104', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('s0000005-0000-0000-0000-000000000005', 'Noah Miller', 8, 'parent.noah@email.com, 555-0105', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  
  -- Under 10 Development
  ('s0000006-0000-0000-0000-000000000006', 'Olivia Garcia', 9, 'parent.olivia@email.com, 555-0106', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('s0000007-0000-0000-0000-000000000007', 'William Jones', 10, 'parent.william@email.com, 555-0107', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('s0000008-0000-0000-0000-000000000008', 'Ava Martinez', 9, 'parent.ava@email.com, 555-0108', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('s0000009-0000-0000-0000-000000000009', 'James Anderson', 10, 'parent.james@email.com, 555-0109', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('s0000010-0000-0000-0000-000000000010', 'Isabella Taylor', 8, 'parent.isabella@email.com, 555-0110', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('s0000011-0000-0000-0000-000000000011', 'Benjamin Thomas', 9, 'parent.benjamin@email.com, 555-0111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  
  -- Under 12 Competitive
  ('s0000012-0000-0000-0000-000000000012', 'Mia Jackson', 11, 'parent.mia@email.com, 555-0112', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('s0000013-0000-0000-0000-000000000013', 'Lucas White', 12, 'parent.lucas@email.com, 555-0113', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('s0000014-0000-0000-0000-000000000014', 'Charlotte Harris', 11, 'parent.charlotte@email.com, 555-0114', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('s0000015-0000-0000-0000-000000000015', 'Henry Martin', 12, 'parent.henry@email.com, 555-0115', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('s0000016-0000-0000-0000-000000000016', 'Amelia Clark', 10, 'parent.amelia@email.com, 555-0116', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('s0000017-0000-0000-0000-000000000017', 'Alexander Lewis', 11, 'parent.alexander@email.com, 555-0117', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('s0000018-0000-0000-0000-000000000018', 'Harper Robinson', 12, 'parent.harper@email.com, 555-0118', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  
  -- Under 15 Elite
  ('s0000019-0000-0000-0000-000000000019', 'Ethan Walker', 14, 'parent.ethan@email.com, 555-0119', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('s0000020-0000-0000-0000-000000000020', 'Abigail Hall', 13, 'parent.abigail@email.com, 555-0120', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('s0000021-0000-0000-0000-000000000021', 'Sebastian Allen', 15, 'parent.sebastian@email.com, 555-0121', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('s0000022-0000-0000-0000-000000000022', 'Emily Young', 14, 'parent.emily@email.com, 555-0122', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('s0000023-0000-0000-0000-000000000023', 'Owen King', 13, 'parent.owen@email.com, 555-0123', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('s0000024-0000-0000-0000-000000000024', 'Madison Wright', 15, 'parent.madison@email.com, 555-0124', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  
  -- Under 18 Academy
  ('s0000025-0000-0000-0000-000000000025', 'Jackson Lopez', 17, 'jackson.lopez@email.com, 555-0125', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
  ('s0000026-0000-0000-0000-000000000026', 'Avery Hill', 16, 'avery.hill@email.com, 555-0126', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
  ('s0000027-0000-0000-0000-000000000027', 'Aiden Scott', 18, 'aiden.scott@email.com, 555-0127', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
  ('s0000028-0000-0000-0000-000000000028', 'Ella Green', 17, 'ella.green@email.com, 555-0128', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
  ('s0000029-0000-0000-0000-000000000029', 'Carter Adams', 16, 'carter.adams@email.com, 555-0129', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
  
  -- Girls Under 12
  ('s0000030-0000-0000-0000-000000000030', 'Grace Baker', 11, 'parent.grace@email.com, 555-0130', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
  ('s0000031-0000-0000-0000-000000000031', 'Chloe Gonzalez', 12, 'parent.chloe@email.com, 555-0131', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
  ('s0000032-0000-0000-0000-000000000032', 'Zoe Nelson', 10, 'parent.zoe@email.com, 555-0132', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
  ('s0000033-0000-0000-0000-000000000033', 'Lily Carter', 11, 'parent.lily@email.com, 555-0133', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
  ('s0000034-0000-0000-0000-000000000034', 'Natalie Mitchell', 12, 'parent.natalie@email.com, 555-0134', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
  
  -- Adult Recreational
  ('s0000035-0000-0000-0000-000000000035', 'David Roberts', 28, 'david.roberts@email.com, 555-0135', 'gggggggg-gggg-gggg-gggg-gggggggggggg'),
  ('s0000036-0000-0000-0000-000000000036', 'Jennifer Turner', 32, 'jennifer.turner@email.com, 555-0136', 'gggggggg-gggg-gggg-gggg-gggggggggggg'),
  ('s0000037-0000-0000-0000-000000000037', 'Michael Phillips', 25, 'michael.phillips@email.com, 555-0137', 'gggggggg-gggg-gggg-gggg-gggggggggggg'),
  ('s0000038-0000-0000-0000-000000000038', 'Sarah Campbell', 29, 'sarah.campbell@email.com, 555-0138', 'gggggggg-gggg-gggg-gggg-gggggggggggg'),
  ('s0000039-0000-0000-0000-000000000039', 'Robert Parker', 35, 'robert.parker@email.com, 555-0139', 'gggggggg-gggg-gggg-gggg-gggggggggggg'),
  ('s0000040-0000-0000-0000-000000000040', 'Amanda Evans', 27, 'amanda.evans@email.com, 555-0140', 'gggggggg-gggg-gggg-gggg-gggggggggggg');
