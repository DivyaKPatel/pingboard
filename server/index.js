const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const standupRoutes = require('./routes/standups');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/standups', standupRoutes);

// ---- Socket.IO real-time logic ----
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a workspace room
  socket.on('join_workspace', (workspaceId) => {
    socket.join(workspaceId);
    console.log(`Socket ${socket.id} joined workspace ${workspaceId}`);
  });

  // User updates their status
  socket.on('update_status', (data) => {
    // Broadcast to everyone else in the workspace
    io.to(data.workspaceId).emit('status_updated', data);
  });

  // User posts standup
  socket.on('post_standup', (data) => {
    io.to(data.workspaceId).emit('standup_posted', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
