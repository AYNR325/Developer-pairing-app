# 🚀 DevHub - Developer Collaboration Platform

<div align="center">

**A full-stack web application that connects developers for collaborative sprint-based projects with AI-powered matching, real-time communication, and comprehensive project management tools.**

[Features](#-key-features) • [Installation](#-installation--setup) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [Features Explained](#-features-explained-in-detail)
- [API Documentation](#-api-documentation)
- [Authentication & Security](#-authentication--security)
- [Real-time Features](#-real-time-features)
- [AI Matching System](#-ai-matching-system)
- [Sprint Management](#-sprint-management)
- [Responsive Design](#-responsive-design)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**DevHub** is a comprehensive developer collaboration platform designed to help developers find teammates, collaborate on projects, and manage sprint-based development workflows. The platform combines AI-powered matching algorithms, real-time communication, and robust project management tools to create an all-in-one solution for developer networking and collaboration.

### What Problem Does It Solve?

- **Finding Teammates**: Developers struggle to find compatible teammates for projects
- **Project Management**: Need a structured way to manage collaborative development sprints
- **Communication**: Real-time communication tools for team coordination
- **Skill Matching**: AI helps match developers based on skills, experience, and preferences

### Target Users

- Individual developers looking for project collaborators
- Teams managing sprint-based development projects
- Developers seeking networking opportunities
- Project managers organizing development sprints

---

## ✨ Key Features

### 🔐 Authentication & User Management
- **Secure Registration & Login**: JWT-based authentication system
- **Complete Profile Setup**: Multi-step profile creation with skills, experience, and availability
- **User Profiles**: Detailed profile pages showcasing developer information
- **Session Management**: Automatic session expiration handling and redirects

### 🤖 AI-Powered Developer Matching
- **Smart Recommendations**: AI analyzes user profiles to suggest compatible developers
- **Compatibility Scoring**: Percentage-based match scores with detailed reasoning
- **Skill-Based Filtering**: Filter developers by experience, languages, and availability
- **Connection Management**: Send, accept, and manage connection requests

### 🏃 Sprint Management System
- **Create Sprints**: Set up time-bound development sprints with detailed descriptions
- **Join Sprints**: Browse and join available sprints with AI recommendations
- **Sprint Lifecycle**: Automatic sprint closure when end date passes
- **Status Tracking**: Active, ended, and all sprint filters
- **Sprint Summary**: Comprehensive post-sprint summary pages

### 📋 Kanban Board (Task Management)
- **Drag & Drop**: Intuitive task management with react-beautiful-dnd
- **Task Statuses**: To Do, In Progress, and Done columns
- **Task Details**: Detailed task popups with assignment and description
- **Member Assignment**: Assign tasks to sprint team members
- **Real-time Updates**: Task status changes reflect immediately

### 💬 Real-time Communication
- **Sprint Chat**: Real-time group chat for sprint teams using WebSocket
- **Direct Messaging**: One-on-one messaging between connected developers
- **Message Persistence**: All messages saved to database
- **Online Status**: Real-time online/offline status indicators
- **WhatsApp-like Mobile UI**: Optimized mobile chat experience

### 👥 Network & Connections
- **My Network**: View all connections and manage relationships
- **Connection Requests**: Send, receive, accept, and reject connection requests
- **Pending Requests**: Track sent and received connection requests
- **Quick Actions**: Message connections directly from network page

### 🎨 Modern UI/UX
- **Dark Mode**: Beautiful dark theme throughout the application
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Gradient Design**: Modern gradient-based UI elements
- **Smooth Animations**: Transitions and hover effects
- **Consistent Card Layouts**: Uniform card designs with fixed button positions

### 🔒 Route Protection
- **Protected Routes**: Authentication required for all main features
- **Public Routes**: Login/Register redirect authenticated users
- **Automatic Redirects**: Session expiration handling
- **404 Page**: User-friendly error page for invalid routes

---

## 🛠 Tech Stack

### Frontend
- **React 18.3.1**: Modern React with functional components and hooks
- **React Router DOM 7.5.2**: Client-side routing and navigation
- **Tailwind CSS 4.1.4**: Utility-first CSS framework for styling
- **Axios 1.9.0**: HTTP client for API requests
- **Socket.io-client 4.8.1**: Real-time WebSocket communication
- **React Beautiful DnD 13.1.1**: Drag and drop for Kanban board
- **React Hook Form 7.59.0**: Form handling and validation
- **React Toastify 11.0.5**: Toast notifications
- **Vite 6.3.1**: Fast build tool and development server

### Backend
- **Node.js**: JavaScript runtime environment
- **Express 5.1.0**: Web application framework
- **MongoDB 8.14.0**: NoSQL database with Mongoose ODM
- **Socket.io 4.8.1**: Real-time bidirectional communication
- **JWT (jsonwebtoken 9.0.2)**: Authentication tokens
- **Bcryptjs 3.0.2**: Password hashing
- **Google Generative AI 0.21.0**: AI-powered matching using Gemini API
- **CORS 2.8.5**: Cross-origin resource sharing
- **Dotenv 16.5.0**: Environment variable management

### Database
- **MongoDB**: Document-based database
- **Mongoose**: MongoDB object modeling

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn package manager
- Google Gemini API key (for AI matching feature)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd dev-pair-2.0
```

### Step 2: Backend Setup

```bash
cd dev-backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to `dev-backend/.env`:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/devhub
# Or use MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/devhub
CLIENT_SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

```bash
# Start the backend server
node server.js
# or
npm start
```

The backend server will run on `http://localhost:3000`

### Step 3: Frontend Setup

```bash
cd dev-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Step 4: Access the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Register a new account or login
3. Complete your profile setup
4. Start exploring the platform!

---

## 📁 Project Structure

```
dev-pair-2.0/
│
├── dev-backend/                 # Backend server
│   ├── controllers/            # Request handlers
│   │   ├── auth/               # Authentication controllers
│   │   ├── match-controller.js # Connection matching
│   │   ├── sprint-controller.js# Sprint management
│   │   ├── task-controller.js  # Task management
│   │   ├── msg-controller.js   # Sprint chat messages
│   │   └── direct-message-controller.js # Direct messages
│   │
│   ├── models/                 # Database schemas
│   │   ├── User.js            # User model
│   │   ├── Sprint.js          # Sprint model
│   │   ├── Task.js            # Task model
│   │   ├── Message.js         # Sprint chat messages
│   │   ├── DirectMessage.js   # Direct messages
│   │   ├── Conversation.js    # Conversation model
│   │   └── ConnectionRequest.js # Connection requests
│   │
│   ├── routes/                 # API routes
│   │   ├── auth/              # Authentication routes
│   │   ├── match.js           # Matching routes
│   │   ├── sprint-routes.js   # Sprint routes
│   │   ├── task-routes.js     # Task routes
│   │   ├── msg-routes.js      # Message routes
│   │   └── direct-message-routes.js # Direct message routes
│   │
│   ├── services/               # Business logic
│   │   └── ai-match-service.js # AI matching algorithm
│   │
│   ├── lib/                    # Utility libraries
│   │   ├── gemini.js          # Gemini AI integration
│   │   ├── embedding-helpers.js # Text embeddings
│   │   └── similarity.js      # Similarity calculations
│   │
│   └── server.js              # Main server file
│
└── dev-frontend/               # Frontend application
    ├── src/
    │   ├── pages/             # Page components
    │   │   ├── auth/          # Login/Register
    │   │   ├── Dashboard.jsx  # Main dashboard
    │   │   ├── Search.jsx     # Developer search
    │   │   ├── MyNetwork.jsx  # Connections
    │   │   ├── Chat.jsx       # Direct messaging
    │   │   ├── CreateSprint.jsx # Create sprints
    │   │   ├── JoinSprint.jsx # Join sprints
    │   │   ├── CompleteProfile.jsx # Profile setup
    │   │   ├── UserProfile.jsx # User profile view
    │   │   └── SprintRoom/    # Sprint pages
    │   │       ├── SprintHome.jsx    # Sprint overview
    │   │       ├── SprintBoard.jsx   # Kanban board
    │   │       ├── SprintChat.jsx     # Sprint chat
    │   │       ├── SprintTeams.jsx   # Team members
    │   │       └── SprintEndPage.jsx # Sprint summary
    │   │
    │   ├── components/        # Reusable components
    │   │   ├── ProtectedRoute.jsx # Route protection
    │   │   ├── PublicRoute.jsx    # Public route wrapper
    │   │   └── SprintRoom/        # Sprint components
    │   │
    │   ├── context/           # React context
    │   │   └── UserContext.jsx # User state management
    │   │
    │   ├── App.jsx            # Main app component
    │   └── main.jsx           # Entry point
    │
    └── package.json
```

---

## 🔍 Features Explained in Detail

### 1. AI-Powered Developer Matching

**How It Works:**
- Uses Google's Gemini AI to analyze user profiles
- Creates embeddings from user skills, experience, and preferences
- Calculates similarity scores between users
- Provides compatibility percentages with detailed reasoning

**Technical Implementation:**
- Backend service (`ai-match-service.js`) handles matching logic
- Uses text embeddings to convert user data into numerical vectors
- Cosine similarity calculates compatibility scores
- Filters out already connected users and user's own sprints

**User Experience:**
- "AI Recommended" tab in Search page shows top matches
- Each match displays compatibility percentage and reasons
- Users can see why they were matched (e.g., "Similar tech stack", "Same experience level")

### 2. Sprint Management System

**Sprint Creation:**
- Users can create sprints with title, description, tech stack
- Set start/end dates, duration, and maximum team size
- Add resources (GitHub, Figma, documentation links)
- Choose public or private visibility

**Sprint Joining:**
- Browse all available sprints
- AI-recommended sprints based on user profile
- View detailed sprint information before joining
- Send join requests with custom messages
- Track join request status (pending, accepted, rejected)

**Sprint Lifecycle:**
- Automatic closure when end date passes
- Sprint summary page shows completion statistics
- Read-only mode after sprint ends
- Filter sprints by status (active, ended, all)

### 3. Kanban Board (Task Management)

**Features:**
- Three-column layout: To Do, In Progress, Done
- Drag and drop tasks between columns
- Create new tasks in any column
- Edit and delete tasks
- Assign tasks to team members
- Task details popup with full information

**Technical Details:**
- Uses `react-beautiful-dnd` for drag and drop
- Optimistic UI updates for smooth experience
- Real-time task status synchronization
- Task assignment to multiple team members

### 4. Real-time Communication

**Sprint Chat:**
- Group chat for all sprint team members
- Real-time message delivery using WebSocket
- Message history persistence
- Online status indicators
- Read-only mode when sprint ends

**Direct Messaging:**
- One-on-one conversations between connected users
- WhatsApp-like mobile interface
- Conversation list with last message preview
- Unread message count
- Message search functionality

**WebSocket Implementation:**
- Socket.io for bidirectional communication
- Room-based messaging (each sprint is a room)
- JWT authentication for WebSocket connections
- Automatic reconnection handling

### 5. Connection & Network Management

**Connection Flow:**
1. User searches for developers or views AI recommendations
2. Sends connection request
3. Recipient receives notification
4. Recipient can accept or reject
5. Upon acceptance, both users are connected
6. Connected users can message each other

**Network Features:**
- View all connections
- See pending requests (sent and received)
- Remove connections
- Quick message button for connections
- Profile links to view detailed user information

### 6. Authentication & Route Protection

**Authentication System:**
- JWT-based token authentication
- Secure password hashing with bcrypt
- Token expiration (60 minutes)
- Automatic token refresh

**Route Protection:**
- `ProtectedRoute` component guards authenticated routes
- `PublicRoute` component redirects authenticated users from auth pages
- Automatic redirect to login on session expiration
- Axios interceptor handles 401 responses globally

**Security Features:**
- Password hashing (bcrypt)
- JWT token validation
- CORS configuration
- Input validation and sanitization

### 7. Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Optimizations:**
- Hamburger menu for navigation
- Collapsible sidebar
- Touch-friendly buttons and inputs
- WhatsApp-like chat interface
- Single-column layouts on mobile

**Tablet Optimizations:**
- 2-column grids for cards
- Optimized Kanban board (3 columns in single row)
- Responsive typography and spacing

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Body: { email, password, username }
Response: { success, message, token, user }
```

#### Login User
```
POST /api/auth/login
Body: { email, password }
Response: { success, message, token, user }
```

#### Check Authentication
```
GET /api/auth/check-auth
Headers: { Authorization: Bearer <token> }
Response: { success, user }
```

#### Get User Profile
```
GET /api/auth/user/:userId
Headers: { Authorization: Bearer <token> }
Response: { success, user }
```

### Matching & Connections

#### Get Developer Matches
```
GET /api/match?userId=<userId>&experienceYear=<year>&preferredLanguages=<langs>&availability=<avail>
Response: { success, users: [] }
```

#### Get AI Developer Matches
```
GET /api/match/ai/developers?userId=<userId>
Response: { success, matches: [{ partnerId, compatibility, reasons: [] }] }
```

#### Send Connection Request
```
POST /api/match/request
Body: { fromUserId, toUserId }
Response: { success, message }
```

#### Accept Connection Request
```
POST /api/match/request/:requestId/accept
Body: { userId }
Response: { success, message }
```

#### Get User Connections
```
GET /api/match/connections/:userId
Response: { success, connections: [] }
```

### Sprint Endpoints

#### Get All Sprints
```
GET /api/sprint
Headers: { Authorization: Bearer <token> }
Response: { sprints: [] }
```

#### Get Sprint by ID
```
GET /api/sprint/:sprintId
Headers: { Authorization: Bearer <token> }
Response: { sprint }
```

#### Create Sprint
```
POST /api/sprint
Headers: { Authorization: Bearer <token> }
Body: { title, description, techStack, startDate, endDate, duration, maxTeamSize, isPublic, resources }
Response: { success, sprint }
```

#### Join Sprint
```
PATCH /api/sprint/:sprintId/join
Headers: { Authorization: Bearer <token> }
Body: { message }
Response: { message }
```

#### Get User's Sprints
```
GET /api/sprint/user/list?scope=<created|joined>&status=<active|ended|all>
Headers: { Authorization: Bearer <token> }
Response: { sprints: [] }
```

#### Get AI Sprint Matches
```
GET /api/match/ai/sprints?userId=<userId>
Response: { success, matches: [{ sprintId, compatibility, reasons: [] }] }
```

### Task Endpoints

#### Get Sprint Tasks
```
GET /api/tasks/sprint/:sprintId
Headers: { Authorization: Bearer <token> }
Response: { tasks: [] }
```

#### Create Task
```
POST /api/tasks/
Headers: { Authorization: Bearer <token> }
Body: { sprintId, title, status, description, assignedMembers }
Response: { task }
```

#### Update Task Status
```
PATCH /api/tasks/:taskId/status
Headers: { Authorization: Bearer <token> }
Body: { status }
Response: { task }
```

#### Update Task
```
PUT /api/tasks/:taskId
Headers: { Authorization: Bearer <token> }
Body: { title, description, assignedMembers }
Response: { task }
```

#### Delete Task
```
DELETE /api/tasks/:taskId
Headers: { Authorization: Bearer <token> }
Response: { message }
```

### Message Endpoints

#### Get Sprint Messages
```
GET /api/messages/sprint/:sprintId
Headers: { Authorization: Bearer <token> }
Response: { messages: [] }
```

#### Send Direct Message
```
POST /api/direct-messages/send
Headers: { Authorization: Bearer <token> }
Body: { conversationId, senderId, recipientId, text }
Response: { success, message }
```

#### Get Conversations
```
GET /api/direct-messages/conversations
Headers: { Authorization: Bearer <token> }
Response: { conversations: [] }
```

---

## 🔐 Authentication & Security

### JWT Token System
- Tokens expire after 60 minutes
- Stored in localStorage on frontend
- Sent in Authorization header for API requests
- Automatically validated on protected routes

### Password Security
- Passwords hashed using bcrypt
- Minimum password requirements enforced
- Passwords never stored in plain text

### Route Protection
- All main features require authentication
- Automatic redirect to login on session expiration
- Public routes (login/register) redirect authenticated users
- 401 responses trigger automatic logout

### WebSocket Security
- JWT authentication required for WebSocket connections
- Users can only join sprint rooms they're members of
- Message validation before saving to database

---

## ⚡ Real-time Features

### WebSocket Architecture
- Socket.io for bidirectional communication
- Room-based messaging (each sprint = one room)
- Automatic reconnection on disconnect
- Connection status tracking

### Real-time Updates
- **Sprint Chat**: Messages appear instantly for all team members
- **Direct Messages**: One-on-one messages delivered in real-time
- **Online Status**: Green dots show who's currently online
- **Task Updates**: Task status changes reflect immediately

### Message Persistence
- All messages saved to MongoDB
- Message history loads on page refresh
- Timestamps for all messages
- Read receipts (future enhancement)

---

## 🤖 AI Matching System

### How AI Matching Works

1. **Profile Analysis**: AI analyzes user profiles including:
   - Preferred programming languages
   - Experience level and years
   - Additional skills
   - Availability
   - Location (if provided)

2. **Embedding Generation**: User data converted to numerical vectors using text embeddings

3. **Similarity Calculation**: Cosine similarity algorithm calculates compatibility scores

4. **Filtering**: System filters out:
   - Already connected users
   - User's own sprints
   - Already joined sprints

5. **Ranking**: Matches sorted by compatibility score

6. **Reasoning**: AI provides explanations for each match (e.g., "Similar tech stack", "Same experience level")

### AI Technologies Used
- **Google Gemini API**: For generating embeddings and analyzing profiles
- **Cosine Similarity**: For calculating compatibility scores
- **Text Embeddings**: Converting text data to numerical vectors

---

## 🏃 Sprint Management

### Sprint Lifecycle

1. **Creation**: User creates sprint with details
2. **Active**: Sprint is open for join requests
3. **Team Building**: Creator accepts/rejects join requests
4. **In Progress**: Team works on sprint tasks
5. **Ended**: Sprint automatically closes when end date passes
6. **Summary**: Post-sprint summary page shows results

### Sprint Features
- **Public/Private**: Control sprint visibility
- **Team Size Limits**: Set maximum team members
- **Resource Management**: Add GitHub, Figma, docs links
- **Join Requests**: Manage incoming join requests
- **Status Tracking**: Filter by active, ended, or all sprints

### Automatic Sprint Closure
- Backend automatically sets `isFinished = true` when `endDate` passes
- Frontend redirects to summary page for ended sprints
- All editing features disabled for ended sprints
- Chat becomes read-only after sprint ends

---

## 📱 Responsive Design

### Mobile (< 768px)
- Hamburger menu for navigation
- Single-column card layouts
- Touch-friendly buttons
- WhatsApp-like chat interface
- Collapsible sidebar
- Mobile-optimized forms

### Tablet (768px - 1024px)
- 2-column card grids
- Optimized Kanban board (3 columns in row)
- Responsive typography
- Tablet-friendly spacing

### Desktop (> 1024px)
- Full sidebar navigation
- 3-column card grids
- Desktop-optimized layouts
- Hover effects and animations

---

## 🚀 Future Enhancements

### Planned Features
- [ ] GitHub integration for profile validation
- [ ] Email notifications for connection requests and messages
- [ ] Sprint templates for common project types
- [ ] File sharing in chat
- [ ] Video/voice calls for team meetings
- [ ] Sprint analytics and insights
- [ ] Project portfolio showcase
- [ ] Rating and review system
- [ ] Advanced search filters
- [ ] Dark/Light theme toggle
- [ ] Mobile app (React Native)

### Technical Improvements
- [ ] Unit and integration tests
- [ ] Performance optimization
- [ ] Caching strategies
- [ ] Database indexing optimization
- [ ] Error logging and monitoring
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Load balancing for scalability

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Ayush Rokade**
- [Github](https://github.com/AYNR325)
- Email: ayushnr35@gmail.com
- [LinkedIn](https://www.linkedin.com/in/ayush-rokade-972940310)

---


