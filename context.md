Here’s a detailed, clear, and actionable prompt you can use to guide yourself (or your team) for designing and building this basic Football Academy Attendance Management System using Next.js + Supabase:

⚡ Prompt to Design Football Academy Attendance Management System (Next.js + Supabase)

👉 Goal:
Design and develop a basic web-based attendance management system for a football academy, supporting admin and coach roles. The system will manage batches, coaches, students, and attendance records.

🟢 User Roles & Permissions

✅ Admin

Can create, update, delete batches.

Can assign or change coaches for batches.

Can add, edit, and remove students.

Can add, edit, and remove coaches.

Can view attendance records for all batches and students.

✅ Coach

Can view assigned batches.

Can take attendance batch-wise (mark students present/absent).

Can view attendance records of their batches.

Can add new students (optionally pending admin approval).

🟢 Core Functionalities

1️⃣ Authentication

User login (via Supabase Auth — email/password).

Users have a role (admin or coach) stored in the users table.

2️⃣ Batch Management (Admin)

Create, update, delete batch.

Assign coach to batch.

View batch list.

3️⃣ Coach Management (Admin)

Create, update, delete coach profiles.

View coach list.

4️⃣ Student Management (Admin + Coach)

Add student to batch (name, age, contact info).

Edit or remove student.

View list of students batch-wise.

5️⃣ Attendance Management

Coach selects batch → sees student list → marks present/absent → submits.

Admin can view attendance records by:

Batch

Date

Student

🟢 Frontend Pages

✅ Login page
✅ Admin dashboard

Batches list / create / edit / delete

Coaches list / add / edit / delete

Students list / add / edit / delete

Attendance reports (filters: batch, date, student)

✅ Coach dashboard

View assigned batches

Mark attendance

View attendance history

🟢 Flow

1️⃣ User logs in → role determines dashboard
2️⃣ Admin manages batches/coaches/students
3️⃣ Coach marks attendance per session
4️⃣ Admin monitors reports

🟢 Design Guidelines

Keep UI simple (Next.js pages with basic forms/tables).

Use Supabase APIs for DB operations.

Apply Row Level Security so coaches see only their data.

No unnecessary complexity (no parent login, no advanced analytics at this stage).

🟢 Deliverables

✅ Wireframes / mockups:

Login page

Admin dashboard pages

Coach dashboard pages

✅ Page flow design / navigation map

✅ API endpoints (Supabase auto-generated)

✅ ER diagram for database design (optional visual aid)

📝 Sample Prompt to Give to Your Team / Yourself

"Design a basic football academy attendance management system using Next.js + Supabase. Include the following:

Authentication for admin and coach using Supabase Auth.

Admin dashboard to create/manage batches, assign coaches, manage students, view attendance reports.

Coach dashboard to mark batch-wise attendance and view attendance history.

Supabase tables for users, batches, students, and attendance, with appropriate relationships.

Minimal clean UI: use basic forms and tables for management. No complex styling needed initially.

Ensure role-based dashboard and visibility (admin sees all; coach sees assigned batches only).

Do not implement parent login or notifications at this stage."

If you'd like, I can:
✅ Generate wireframes for all key pages
✅ Create a navigation flow diagram
✅ Draft API interaction plan (which Supabase functions you'll call)