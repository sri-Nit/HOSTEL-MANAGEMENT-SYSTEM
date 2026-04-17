import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './src/routes/authRoutes';
import complaintRoutes from './src/routes/complaintRoutes';
import adminRoutes from './src/routes/adminRoutes';
import notificationRoutes from './src/routes/notificationRoutes'; // Import notification routes
import { errorHandler } from './src/middleware/errorHandler';
import { initSocket } from './src/services/socketService';
import { startCronJob } from './src/services/cronService';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Allow all origins for development, restrict in production
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize Socket.io service
initSocket(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' directory

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes); // Use notification routes

// Error handling middleware
app.use(errorHandler);

// Start cron job for escalation
startCronJob();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));