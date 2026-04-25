🏨 Hostel Complaint Management System (HCMS)

A full-stack web application that enables hostel residents to report maintenance issues and track their resolution through a structured workflow involving guards, service personnel, and administrators.

👤 Student
Register and login securely (JWT-based authentication)
Submit complaints with category, description, location, and images
Track complaint status in real-time
View complaint history and details
Receive notifications on status updates
🛡️ Guard
View submitted complaints
Approve or reject complaints
Forward approved complaints to service personnel
🧑‍🔧 Service Personnel
View assigned complaints
Update status (In Progress → Resolved)
Add resolution notes or images
🧑‍⚖️ Admin
Monitor all complaints
View escalated complaints
Manage users (students, guards, workers)
View analytics and reports
Configure system settings (e.g., escalation time)
🔄 Complaint Workflow
Student → Submit Complaint
        ↓
Guard → Approve / Reject
        ↓
Worker → In Progress → Resolved
        ↓
System → Escalates if not resolved in time
🛠️ Tech Stack
Frontend
React (Vite)
Tailwind CSS
Axios
Backend
Node.js
Express.js
Database
MongoDB (Mongoose)
Other Tools
JWT (Authentication)
bcrypt (Password hashing)
Socket.io (Real-time notifications)
Multer (File uploads)
node-cron (Scheduled tasks)
📁 Project Structure
/backend
  /models
  /routes
  /controllers
  /middleware
  server.js

/frontend
  /src
    /components
    /pages
    /services
  index.html
⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/hcms.git
cd hcms
2. Backend Setup
cd backend
npm install

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

Run backend:

npm run dev
3. Frontend Setup
cd frontend
npm install
npm run dev
🔐 Security Features
JWT-based authentication
Password hashing using bcrypt
Role-based access control
Protected API routes
📊 Non-Functional Features
Responsive UI (mobile-friendly)
Fast API response times
Real-time updates using WebSockets
Error handling and validation
🎯 Future Enhancements
Email notifications
Feedback/rating system
AI-based complaint categorization
Mobile app version



Author
Sreenidhi


This project is developed for academic purposes.