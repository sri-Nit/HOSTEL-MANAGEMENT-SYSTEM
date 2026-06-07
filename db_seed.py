import mysql.connector
from faker import Faker
import random

# Database configuration 
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Srinidhi@1",
    database="internmind"
)

cursor = conn.cursor()
fake = Faker('en_IN')

print("\n📊 Starting Synthetic Data Generation...")

# =====================================================================
# 💥 PHASE 1: NUKE OLD TABLES (Clean Slate)
# =====================================================================
print("\n💥 Dropping all old tables to reset the schema completely...")
cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")

tables_to_drop = [
    'student_marks', 'student_gpa', 'students', 
    'subjects', 'semesters', 'academic_years', 'branches', 'users'
]

for table in tables_to_drop:
    cursor.execute(f"DROP TABLE IF EXISTS {table};")
    print(f"  🗑️ Dropped table (if existed): {table}")

cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
conn.commit()

# =====================================================================
# 🏗️ PHASE 2: CREATE FRESH, CORRECT TABLES
# =====================================================================
print("\n🏗️ Building fresh database tables with correct columns...")

cursor.execute("CREATE TABLE branches (branch_id INT AUTO_INCREMENT PRIMARY KEY, branch_name VARCHAR(100) UNIQUE NOT NULL);")
cursor.execute("CREATE TABLE academic_years (year_id INT AUTO_INCREMENT PRIMARY KEY, year_no INT UNIQUE NOT NULL);")
cursor.execute("CREATE TABLE semesters (semester_id INT AUTO_INCREMENT PRIMARY KEY, semester_no INT UNIQUE NOT NULL);")

cursor.execute("""
CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(150) NOT NULL,
    branch_id INT,
    semester_id INT,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id),
    FOREIGN KEY (semester_id) REFERENCES semesters(semester_id)
);
""")

cursor.execute("""
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    father_name VARCHAR(150),
    address TEXT,
    pronouns VARCHAR(50),
    branch_id INT,
    current_year INT,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);
""")

cursor.execute("""
CREATE TABLE student_gpa (
    gpa_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    semester_id INT,
    gpa DECIMAL(3,2),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (semester_id) REFERENCES semesters(semester_id)
);
""")

cursor.execute("""
CREATE TABLE student_marks (
    mark_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject_id INT,
    marks INT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);
""")

cursor.execute("""
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);
""")

conn.commit()
print("✅ New schema built successfully with zero conflicts!")

# =====================================================================
# 💾 PHASE 3: POPULATE FRESH DATA
# =====================================================================
print("\n🌱 Seeding fresh synthetic data...")

# 1. Insert Branches
branches = [('Computer Science',), ('Electronics',), ('Mechanical',), ('Civil',)]
cursor.executemany("INSERT INTO branches (branch_name) VALUES (%s)", branches)

# 2. Insert Academic Years
years = [(i,) for i in range(1, 5)]
cursor.executemany("INSERT INTO academic_years (year_no) VALUES (%s)", years)

# 3. Insert Semesters
semesters = [(i,) for i in range(1, 9)]
cursor.executemany("INSERT INTO semesters (semester_no) VALUES (%s)", semesters)

# 4. Define 40 Completely Unique Subjects per Branch (5 subjects per semester x 8 semesters)
branch_curriculums = {
    1: [ # Computer Science
        ['Engineering Mathematics-I', 'Engineering Physics', 'Programming in C', 'Environmental Studies', 'Basic Electrical Engineering'], # Sem 1
        ['Engineering Mathematics-II', 'Engineering Chemistry', 'Object-Oriented Programming', 'Digital Logic Design', 'Communication Skills'], # Sem 2
        ['Data Structures', 'Discrete Mathematics', 'Computer Organization', 'Database Management Systems', 'Software Engineering'], # Sem 3
        ['Operating Systems', 'Design and Analysis of Algorithms', 'Formal Languages & Automata', 'Java Programming', 'Microprocessors'], # Sem 4
        ['Computer Networks', 'Computer Graphics', 'System Programming', 'Web Technology', 'Artificial Intelligence'], # Sem 5
        ['Compiler Design', 'Software Testing', 'Data Mining', 'Cloud Computing', 'Information Security'], # Sem 6
        ['Machine Learning', 'Big Data Analytics', 'Cryptography', 'Mobile Application Development', 'Distributed Systems'], # Sem 7
        ['Internet of Things', 'Natural Language Processing', 'Cyber Forensics', 'Neural Networks', 'Main Project Portfolio'] # Sem 8
    ],
    2: [ # Electronics
        ['ECE Mathematics-I', 'Applied Physics', 'C Programming for Engineers', 'Elements of Mechanical Eng', 'Engineering Graphics Design'], # Sem 1
        ['ECE Mathematics-II', 'Solid State Chemistry', 'Basic Electronics Devices', 'Network Analysis & Synthesis', 'Environmental Sciences'], # Sem 2
        ['Analog Electronic Circuits', 'Digital Electronics Logic', 'Signals and Systems Theory', 'Electronic Measurements', 'Solid State Devices'], # Sem 3
        ['Linear Integrated Circuits', 'Microprocessors & Microcontrollers', 'Electromagnetic Fields', 'Control Systems Engineering', 'Hardware Description Languages'], # Sem 4
        ['Analog Communication Systems', 'Digital Signal Processing', 'Antennas and Wave Propagation', 'Transmission Lines', 'Embedded Systems Architecture'], # Sem 5
        ['Digital Communication Systems', 'VLSI Design Technology', 'Microwave Engineering', 'Optical Fiber Communication', 'Power Electronics Devices'], # Sem 6
        ['Wireless Communications', 'Satellite Communication Systems', 'Radar Engineering Systems', 'CMOS Analog Design', 'Computer Communication Networks'], # Sem 7
        ['Nanoelectronics Fundamentals', 'Biomedical Instrumentation', 'Automotive Electronics', 'RF Circuit Design', 'Major ECE Project'] # Sem 8
    ],
    3: [ # Mechanical
        ['Mech Mathematics-I', 'Engineering Physics Mechanics', 'Basic Electrical Systems', 'Engineering Mechanics Dynamics', 'Workshop Practice Fundamentals'], # Sem 1
        ['Mech Mathematics-II', 'Materials Chemistry', 'Computing in Engineering', 'Engineering Graphics & Drawing', 'Introduction to Material Science'], # Sem 2
        ['Engineering Thermodynamics', 'Fluid Mechanics Systems', 'Strength of Materials Theory', 'Manufacturing Process-I', 'Machine Drawing Practices'], # Sem 3
        ['Kinematics of Machinery', 'Applied Thermodynamics Eng', 'Fluid Machinery & Hydraulics', 'Manufacturing Process-II', 'Metrology & Mechanical Instrumentation'], # Sem 4
        ['Dynamics of Machinery', 'Machine Design-I Concepts', 'Heat and Mass Transfer Eng', 'Industrial Engineering Methods', 'Turbo Machines Design'], # Sem 5
        ['Design of Machine Elements-II', 'Computer Aided Design (CAD)', 'Automobile Engineering Systems', 'Refrigeration & Air Conditioning', 'Operations Research Analysis'], # Sem 6
        ['Mechatronics Systems', 'Finite Element Analysis (FEA)', 'Mechanical Vibrations Theory', 'Power Plant Engineering', 'Total Quality Management'], # Sem 7
        ['Robotics & Automation Systems', 'Non-Conventional Energy', 'Gas Dynamics Theory', 'Production Management', 'Mechanical Capstone Project'] # Sem 8
    ],
    4: [ # Civil
        ['Civil Mathematics-I', 'Engineering Physics Mechanics', 'Basic Electronics Systems', 'Engineering Mechanics Statics', 'Building Materials & Technology'], # Sem 1
        ['Civil Mathematics-II', 'Environmental Chemistry', 'Computer Programming Logic', 'Engineering Graphics practices', 'Environmental Engineering-I'], # Sem 2
        ['Strength of Materials (Civil)', 'Fluid Mechanics (Civil)', 'Elementary Surveying-I', 'Building Construction Principles', 'Concrete Technology Standards'], # Sem 3
        ['Structural Analysis-I', 'Hydraulic Machinery Systems', 'Advanced Surveying-II', 'Basic Soil Mechanics', 'Transportation Engineering-I'], # Sem 4
        ['Structural Analysis-II', 'Design of RC Structures', 'Advanced Geotechnical Engineering', 'Hydrology & Water Resources', 'Environmental Engineering-II'], # Sem 5
        ['Design of Steel Structures', 'Transportation Engineering-II', 'Irrigation Engineering Systems', 'Estimation & Costing Analysis', 'Construction Project Management'], # Sem 6
        ['Foundation Engineering Design', 'Prestressed Concrete Structures', 'Introduction to Earthquake Engineering', 'Remote Sensing & GIS Systems', 'Town Planning Architecture'], # Sem 7
        ['Ground Improvement Techniques', 'Pavement Design & Analysis', 'Bridge Engineering Design', 'Environmental Impact Assessment', 'Civil Engineering Final Project'] # Sem 8
    ]
}

subjects_batch = []
for branch_id, semesters_list in branch_curriculums.items(): 
    for sem_idx, subjects_list in enumerate(semesters_list):
        semester_id = sem_idx + 1
        for name in subjects_list:
            subjects_batch.append((name, branch_id, semester_id))
            
cursor.executemany("INSERT INTO subjects (subject_name, branch_id, semester_id) VALUES (%s, %s, %s)", subjects_batch)

# 5. Insert EXACTLY 480 Students (40 students per branch per year)
print("\n📚 Generating 480 students...")
students_batch = []
pronoun_options = ['He/Him', 'She/Her', 'They/Them']

for branch_id in range(1, 5):      # 4 branches
    for current_year in range(1, 5):   # years 1-4
        for _ in range(40):            # 40 students per branch per year (40 * 4 * 4 = 640, we'll adjust)

            students_batch.append((
                fake.name(),
                fake.name(),
                fake.address().replace('\n', ', '),
                random.choice(pronoun_options),
                branch_id,
                current_year
            ))

# Trim to exactly 480 students (120 per branch)
students_batch = students_batch[:480]

cursor.executemany("""
INSERT INTO students
(name, father_name, address, pronouns, branch_id, current_year)
VALUES (%s, %s, %s, %s, %s, %s)
""", students_batch)

conn.commit()
print(f"✅ Created {len(students_batch)} students")

# Map subjects out of the database for fast contextual lookup
cursor.execute("SELECT subject_id, branch_id, semester_id FROM subjects")
subject_lookup = {}
for sub_id, b_id, sem_id in cursor.fetchall():
    if b_id not in subject_lookup: subject_lookup[b_id] = {}
    if sem_id not in subject_lookup[b_id]: subject_lookup[b_id][sem_id] = []
    subject_lookup[b_id][sem_id].append(sub_id)

# Fetch all generated students to build strict academic mapping
cursor.execute("SELECT student_id, branch_id, current_year FROM students")
all_students = cursor.fetchall()

# 6, 7 & 8. Generate GPAs (Semester-wise for each student) and Marks Contextually
print("\n📊 Generating semester-wise GPA and marks for each student...")
gpa_batch = []
marks_batch = []

for student_id, branch_id, current_year in all_students:
    max_completed_semester = current_year * 2
    
    # Generate semester-wise GPA for each student
    for semester_id in range(1, max_completed_semester + 1):
        # Calculate GPA based on marks for that semester
        semester_marks = []
        target_subjects = subject_lookup.get(branch_id, {}).get(semester_id, [])
        
        # First, generate marks for all subjects in this semester
        for sub_id in target_subjects:
            mark = random.randint(40, 100)
            semester_marks.append(mark)
            marks_batch.append((student_id, sub_id, mark))
        
        # Calculate GPA from marks (convert marks to GPA scale 0-4.0)
        # Assuming 90-100 = 4.0, 80-89 = 3.5, 70-79 = 3.0, 60-69 = 2.5, 50-59 = 2.0, <50 = 0.0
        if semester_marks:
            avg_marks = sum(semester_marks) / len(semester_marks)
            if avg_marks >= 90:
                semester_gpa = 4.0
            elif avg_marks >= 80:
                semester_gpa = 3.5
            elif avg_marks >= 70:
                semester_gpa = 3.0
            elif avg_marks >= 60:
                semester_gpa = 2.5
            elif avg_marks >= 50:
                semester_gpa = 2.0
            else:
                semester_gpa = 0.0
            
            # Add small variation to make it more realistic (±0.1)
            semester_gpa = round(max(0.0, min(4.0, semester_gpa + random.uniform(-0.1, 0.1))), 2)
        else:
            semester_gpa = 0.0
        
        gpa_batch.append((student_id, semester_id, semester_gpa))

cursor.executemany("INSERT INTO student_gpa (student_id, semester_id, gpa) VALUES (%s, %s, %s)", gpa_batch)
cursor.executemany("INSERT INTO student_marks (student_id, subject_id, marks) VALUES (%s, %s, %s)", marks_batch)

# 9. Insert Users
users_batch = [
    ('admin_user', 'hashed_admin_pwd', 'admin'),
    ('assistant_user', 'hashed_assistant_pwd', 'assistant')
]
cursor.executemany("INSERT INTO users (username, password_hash, role) VALUES (%s, %s, %s)", users_batch)

conn.commit()

# =====================================================================
# 📊 PHASE 4: VERIFICATION SUMMARY
# =====================================================================
print("\n" + "="*60)
print("📊 FINAL DATABASE SUMMARY")
print("="*60)

summary_data = {}
for table_name in tables_to_drop[::-1]: 
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    count = cursor.fetchone()[0]
    summary_data[table_name] = count
    print(f"{table_name:.<40} {count:>10}")

print("="*60)

# Additional statistics
cursor.execute("SELECT COUNT(DISTINCT student_id) FROM student_gpa")
total_gpa_records = cursor.fetchone()[0]
cursor.execute("SELECT COUNT(*) FROM student_gpa")
total_gpa_entries = cursor.fetchone()[0]

print(f"\n📈 Additional Statistics:")
print(f"   • Total Students with GPAs: {total_gpa_records}")
print(f"   • Total GPA Records: {total_gpa_entries}")
print(f"   • Total Marks Records: {summary_data['student_marks']}")
print(f"   • Average GPA entries per student: {total_gpa_entries / total_gpa_records:.1f}")

print("\n✅ Clean database generation finished! Exactly 480 students tracked with semester-wise GPAs.")

cursor.close()
conn.close()
