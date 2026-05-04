import './src/env';
import express from 'express';
import cors from 'cors';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';


import authRoutes from './src/routes/authRoutes';
import complaintRoutes from './src/routes/complaintRoutes';
import adminRoutes from './src/routes/adminRoutes';
import notificationRoutes from './src/routes/notificationRoutes';

import { errorHandler } from './src/middleware/errorHandler';
import { initSocket } from './src/services/socketService';
import { startCronJob } from './src/services/cronService';

const envPaths = [
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '../.env')
];

const envPath = envPaths.find(p => fs.existsSync(p));

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handler
app.use(errorHandler);

// Socket setup
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
  },
});

initSocket(io);

// 🚀 START SERVER مباشرة (NO MONGO)
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // 🔥 Start cron AFTER server is up
  startCronJob();
});