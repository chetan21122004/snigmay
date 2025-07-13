-- Clear existing data (in correct order due to foreign key constraints)
DELETE FROM public.attendance;
DELETE FROM public.fee_payments;
DELETE FROM public.fee_structures;
DELETE FROM public.students;
DELETE FROM public.batches;
DELETE FROM public.centers;
DELETE FROM public.users WHERE role IN ('admin', 'coach');

-- Insert demo centers
INSERT INTO public.centers (id, name, location, description) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Main Academy', 'Downtown Sports Complex', 'Primary training facility with full-size pitches and modern equipment'),
  ('c2222222-2222-2222-2222-222222222222', 'North Campus', 'North Side Community Center', 'Community-focused facility serving the north side of the city'),
  ('c3333333-3333-3333-3333-333333333333', 'South Branch', 'South Park Sports Ground', 'Outdoor training facility with natural grass pitches'),
  ('c4444444-4444-4444-4444-444444444444', 'East Wing', 'East Side Athletic Center', 'Indoor facility specializing in youth development programs');

-- Insert demo admin user
INSERT INTO public.users (id, email, full_name, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@academy.com', 'Academy Administrator', 'admin');

-- Insert demo coach users
INSERT INTO public.users (id, email, full_name, role) VALUES
  ('22222222-2222-2222-2222-222222222222', 'john.coach@academy.com', 'John Martinez', 'coach'),
  ('33333333-3333-3333-3333-333333333333', 'sarah.coach@academy.com', 'Sarah Johnson', 'coach'),
  ('44444444-4444-4444-4444-444444444444', 'mike.coach@academy.com', 'Mike Thompson', 'coach'),
  ('55555555-5555-5555-5555-555555555555', 'lisa.coach@academy.com', 'Lisa Rodriguez', 'coach');

-- Insert demo batches with realistic names, descriptions, and center assignments
INSERT INTO public.batches (id, name, description, coach_id, center_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Under 8 Beginners', 'Introduction to football for ages 6-8, focusing on basic skills and fun', '22222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Under 10 Development', 'Skill development for ages 8-10, basic tactics and teamwork', '33333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Under 12 Competitive', 'Competitive training for ages 10-12, advanced skills and match preparation', '22222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Under 15 Elite', 'Elite training for ages 13-15, tactical awareness and physical conditioning', '44444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Under 18 Academy', 'Academy level training for ages 16-18, professional development pathway', '55555555-5555-5555-5555-555555555555', 'c4444444-4444-4444-4444-444444444444'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Girls Under 12', 'Specialized training for girls ages 10-12, skill development and confidence building', '33333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222'),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Adult Recreational', 'Recreational football for adults, fitness and fun focused', '44444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333');

-- Insert fee structures for each batch
INSERT INTO public.fee_structures (id, batch_id, amount, frequency, description) VALUES
  ('fs111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1500.00, 'monthly', 'Monthly fee for Under 8 Beginners program'),
  ('fs222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1800.00, 'monthly', 'Monthly fee for Under 10 Development program'),
  ('fs333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 2200.00, 'monthly', 'Monthly fee for Under 12 Competitive program'),
  ('fs444444-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 2800.00, 'monthly', 'Monthly fee for Under 15 Elite program'),
  ('fs555555-5555-5555-5555-555555555555', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 3200.00, 'monthly', 'Monthly fee for Under 18 Academy program'),
  ('fs666666-6666-6666-6666-666666666666', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 2000.00, 'monthly', 'Monthly fee for Girls Under 12 program'),
  ('fs777777-7777-7777-7777-777777777777', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 2500.00, 'monthly', 'Monthly fee for Adult Recreational program');

-- Insert demo students with realistic names and contact information
INSERT INTO public.students (id, name, age, contact_info, batch_id, parent_name, parent_phone, parent_email, address, emergency_contact, medical_conditions) VALUES
  -- Under 8 Beginners
  ('s0000001-0000-0000-0000-000000000001', 'Alex Thompson', 7, 'parent.alex@email.com, 555-0101', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Michael Thompson', '555-0101', 'parent.alex@email.com', '123 Oak Street, Downtown', '555-0102', 'None'),
  ('s0000002-0000-0000-0000-000000000002', 'Emma Wilson', 8, 'parent.emma@email.com, 555-0102', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jennifer Wilson', '555-0102', 'parent.emma@email.com', '456 Pine Avenue, Downtown', '555-0103', 'Mild asthma'),
  ('s0000003-0000-0000-0000-000000000003', 'Liam Davis', 6, 'parent.liam@email.com, 555-0103', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Robert Davis', '555-0103', 'parent.liam@email.com', '789 Maple Drive, Downtown', '555-0104', 'None'),
  ('s0000004-0000-0000-0000-000000000004', 'Sophia Brown', 7, 'parent.sophia@email.com, 555-0104', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Lisa Brown', '555-0104', 'parent.sophia@email.com', '321 Elm Street, Downtown', '555-0105', 'None'),
  ('s0000005-0000-0000-0000-000000000005', 'Noah Miller', 8, 'parent.noah@email.com, 555-0105', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'David Miller', '555-0105', 'parent.noah@email.com', '654 Cedar Road, Downtown', '555-0106', 'None'),
  
  -- Under 10 Development
  ('s0000006-0000-0000-0000-000000000006', 'Olivia Garcia', 9, 'parent.olivia@email.com, 555-0106', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Carlos Garcia', '555-0106', 'parent.olivia@email.com', '987 Birch Lane, North Side', '555-0107', 'None'),
  ('s0000007-0000-0000-0000-000000000007', 'William Jones', 10, 'parent.william@email.com, 555-0107', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sarah Jones', '555-0107', 'parent.william@email.com', '147 Spruce Street, North Side', '555-0108', 'None'),
  ('s0000008-0000-0000-0000-000000000008', 'Ava Martinez', 9, 'parent.ava@email.com, 555-0108', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Maria Martinez', '555-0108', 'parent.ava@email.com', '258 Willow Avenue, North Side', '555-0109', 'Food allergies'),
  ('s0000009-0000-0000-0000-000000000009', 'James Anderson', 10, 'parent.james@email.com, 555-0109', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'John Anderson', '555-0109', 'parent.james@email.com', '369 Poplar Drive, North Side', '555-0110', 'None'),
  ('s0000010-0000-0000-0000-000000000010', 'Isabella Taylor', 8, 'parent.isabella@email.com, 555-0110', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Amanda Taylor', '555-0110', 'parent.isabella@email.com', '741 Ash Road, North Side', '555-0111', 'None'),
  ('s0000011-0000-0000-0000-000000000011', 'Benjamin Thomas', 9, 'parent.benjamin@email.com, 555-0111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Mark Thomas', '555-0111', 'parent.benjamin@email.com', '852 Hickory Lane, North Side', '555-0112', 'None'),
  
  -- Under 12 Competitive
  ('s0000012-0000-0000-0000-000000000012', 'Mia Jackson', 11, 'parent.mia@email.com, 555-0112', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Michelle Jackson', '555-0112', 'parent.mia@email.com', '963 Walnut Street, Downtown', '555-0113', 'None'),
  ('s0000013-0000-0000-0000-000000000013', 'Lucas White', 12, 'parent.lucas@email.com, 555-0113', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Brian White', '555-0113', 'parent.lucas@email.com', '159 Chestnut Avenue, Downtown', '555-0114', 'None'),
  ('s0000014-0000-0000-0000-000000000014', 'Charlotte Harris', 11, 'parent.charlotte@email.com, 555-0114', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Rachel Harris', '555-0114', 'parent.charlotte@email.com', '357 Beech Drive, Downtown', '555-0115', 'None'),
  ('s0000015-0000-0000-0000-000000000015', 'Henry Martin', 12, 'parent.henry@email.com, 555-0115', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Kevin Martin', '555-0115', 'parent.henry@email.com', '468 Sycamore Road, Downtown', '555-0116', 'None'),
  ('s0000016-0000-0000-0000-000000000016', 'Amelia Clark', 10, 'parent.amelia@email.com, 555-0116', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Nicole Clark', '555-0116', 'parent.amelia@email.com', '579 Magnolia Lane, Downtown', '555-0117', 'None'),
  ('s0000017-0000-0000-0000-000000000017', 'Alexander Lewis', 11, 'parent.alexander@email.com, 555-0117', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steven Lewis', '555-0117', 'parent.alexander@email.com', '681 Dogwood Street, Downtown', '555-0118', 'None'),
  ('s0000018-0000-0000-0000-000000000018', 'Harper Robinson', 12, 'parent.harper@email.com, 555-0118', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Melissa Robinson', '555-0118', 'parent.harper@email.com', '792 Redwood Avenue, Downtown', '555-0119', 'None'),
  
  -- Under 15 Elite
  ('s0000019-0000-0000-0000-000000000019', 'Ethan Walker', 14, 'parent.ethan@email.com, 555-0119', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Christopher Walker', '555-0119', 'parent.ethan@email.com', '814 Sequoia Drive, South Park', '555-0120', 'None'),
  ('s0000020-0000-0000-0000-000000000020', 'Abigail Hall', 13, 'parent.abigail@email.com, 555-0120', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Patricia Hall', '555-0120', 'parent.abigail@email.com', '925 Cypress Road, South Park', '555-0121', 'None'),
  ('s0000021-0000-0000-0000-000000000021', 'Sebastian Allen', 15, 'parent.sebastian@email.com, 555-0121', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Daniel Allen', '555-0121', 'parent.sebastian@email.com', '136 Fir Lane, South Park', '555-0122', 'None'),
  ('s0000022-0000-0000-0000-000000000022', 'Emily Young', 14, 'parent.emily@email.com, 555-0122', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Laura Young', '555-0122', 'parent.emily@email.com', '247 Juniper Street, South Park', '555-0123', 'None'),
  ('s0000023-0000-0000-0000-000000000023', 'Owen King', 13, 'parent.owen@email.com, 555-0123', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Matthew King', '555-0123', 'parent.owen@email.com', '358 Hemlock Avenue, South Park', '555-0124', 'None'),
  ('s0000024-0000-0000-0000-000000000024', 'Madison Wright', 15, 'parent.madison@email.com, 555-0124', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Rebecca Wright', '555-0124', 'parent.madison@email.com', '469 Tamarack Drive, South Park', '555-0125', 'None'),
  
  -- Under 18 Academy
  ('s0000025-0000-0000-0000-000000000025', 'Jackson Lopez', 17, 'jackson.lopez@email.com, 555-0125', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Roberto Lopez', '555-0125', 'jackson.lopez@email.com', '570 Cottonwood Road, East Side', '555-0126', 'None'),
  ('s0000026-0000-0000-0000-000000000026', 'Avery Hill', 16, 'avery.hill@email.com, 555-0126', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Karen Hill', '555-0126', 'avery.hill@email.com', '681 Basswood Lane, East Side', '555-0127', 'None'),
  ('s0000027-0000-0000-0000-000000000027', 'Aiden Scott', 18, 'aiden.scott@email.com, 555-0127', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Thomas Scott', '555-0127', 'aiden.scott@email.com', '792 Ironwood Street, East Side', '555-0128', 'None'),
  ('s0000028-0000-0000-0000-000000000028', 'Ella Green', 17, 'ella.green@email.com, 555-0128', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Susan Green', '555-0128', 'ella.green@email.com', '813 Locust Avenue, East Side', '555-0129', 'None'),
  ('s0000029-0000-0000-0000-000000000029', 'Carter Adams', 16, 'carter.adams@email.com, 555-0129', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Paul Adams', '555-0129', 'carter.adams@email.com', '924 Mulberry Drive, East Side', '555-0130', 'None'),
  
  -- Girls Under 12
  ('s0000030-0000-0000-0000-000000000030', 'Grace Baker', 11, 'parent.grace@email.com, 555-0130', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Catherine Baker', '555-0130', 'parent.grace@email.com', '135 Persimmon Road, North Side', '555-0131', 'None'),
  ('s0000031-0000-0000-0000-000000000031', 'Chloe Gonzalez', 12, 'parent.chloe@email.com, 555-0131', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Elena Gonzalez', '555-0131', 'parent.chloe@email.com', '246 Pecan Lane, North Side', '555-0132', 'None'),
  ('s0000032-0000-0000-0000-000000000032', 'Zoe Nelson', 10, 'parent.zoe@email.com, 555-0132', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Nancy Nelson', '555-0132', 'parent.zoe@email.com', '357 Almond Street, North Side', '555-0133', 'None'),
  ('s0000033-0000-0000-0000-000000000033', 'Lily Carter', 11, 'parent.lily@email.com, 555-0133', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Donna Carter', '555-0133', 'parent.lily@email.com', '468 Hazelnut Avenue, North Side', '555-0134', 'None'),
  ('s0000034-0000-0000-0000-000000000034', 'Natalie Mitchell', 12, 'parent.natalie@email.com, 555-0134', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Janet Mitchell', '555-0134', 'parent.natalie@email.com', '579 Pistachio Drive, North Side', '555-0135', 'None'),
  
  -- Adult Recreational
  ('s0000035-0000-0000-0000-000000000035', 'David Roberts', 28, 'david.roberts@email.com, 555-0135', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 'Self', '555-0135', 'david.roberts@email.com', '680 Cashew Road, South Park', '555-0136', 'None'),
  ('s0000036-0000-0000-0000-000000000036', 'Jennifer Turner', 32, 'jennifer.turner@email.com, 555-0136', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 'Self', '555-0136', 'jennifer.turner@email.com', '791 Macadamia Lane, South Park', '555-0137', 'None'),
  ('s0000037-0000-0000-0000-000000000037', 'Michael Phillips', 25, 'michael.phillips@email.com, 555-0137', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 'Self', '555-0137', 'michael.phillips@email.com', '812 Brazil Street, South Park', '555-0138', 'None'),
  ('s0000038-0000-0000-0000-000000000038', 'Sarah Campbell', 29, 'sarah.campbell@email.com, 555-0138', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 'Self', '555-0138', 'sarah.campbell@email.com', '923 Pecan Avenue, South Park', '555-0139', 'None'),
  ('s0000039-0000-0000-0000-000000000039', 'Robert Parker', 35, 'robert.parker@email.com, 555-0139', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 'Self', '555-0139', 'robert.parker@email.com', '134 Walnut Drive, South Park', '555-0140', 'None'),
  ('s0000040-0000-0000-0000-000000000040', 'Amanda Evans', 27, 'amanda.evans@email.com, 555-0140', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 'Self', '555-0140', 'amanda.evans@email.com', '245 Chestnut Road, South Park', '555-0141', 'None');
