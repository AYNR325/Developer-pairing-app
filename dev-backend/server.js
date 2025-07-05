require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const app = express()
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3000
const authRouter = require('./routes/auth/auth-routes');
const matchRouter = require('./routes/match');
const sprintRouter = require('./routes/sprint-routes');
const taskRouter = require('./routes/task-routes');
const msgRouter = require('./routes/msg-routes');

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to MongoDB'))
 .catch(err => console.error(err));

// Configure CORS first
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Configure body-parser with increased limits
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/auth",authRouter);

// Add match route
app.use('/api/match', matchRouter);

// Add sprint route
app.use('/api/sprint', sprintRouter);

//add task route
app.use('/api/task',taskRouter);

//add message route
app.use('/api/message', msgRouter);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a sprint room
  socket.on('joinSprint', (sprintId) => {
    socket.join(`sprint_${sprintId}`);
    console.log(`User ${socket.id} joined sprint room: sprint_${sprintId}`);
  });

  // Handle sending a message
  socket.on('sendMessage', async (data) => {
    try {
      // Save message to database (you can reuse your sendMessage controller logic here)
      const Message = require('./models/Message');
      const Sprint = require('./models/Sprint');
      
      const message = await Message.create({
        sprint: data.sprintId,
        sender: data.senderId,
        text: data.text,
        timestamp: new Date()
      });

      // Add message to sprint's messages array
      await Sprint.findByIdAndUpdate(data.sprintId, { $push: { messages: message._id } });

      // Populate sender info
      const populatedMessage = await Message.findById(message._id).populate('sender', 'username');

      // Broadcast the message to all users in the sprint room
      io.to(`sprint_${data.sprintId}`).emit('newMessage', populatedMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
