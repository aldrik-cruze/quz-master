# Quiz Master 🎯

A modern, full-stack quiz application with user authentication and admin panel. Test your programming knowledge across 11 different topics with 220+ questions!

## ✨ Features

- 🎯 **11 Quiz Topics**: HTML, CSS, JavaScript, PHP, Node.js, React, C, C++, Python, Java, MySQL
- 👤 **User Authentication**: Secure login/register system with JWT
- 👻 **Guest Mode**: Try quizzes without creating an account
- 🎲 **Smart Randomization**: 20 unique, non-repeating questions per quiz
- 📊 **Admin Panel**: Complete management system for users and questions
- 📈 **Progress Tracking**: View quiz history and scores
- 🎨 **Modern UI**: Responsive design with gradient backgrounds and smooth animations
- 📱 **Mobile Optimized**: Full support for Android 9-17 and iOS devices
- 🔍 **Answer Review**: Detailed breakdown of correct/incorrect answers
- 🔒 **Secure**: Password hashing, JWT authentication, SQL injection protection

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database
```bash
npm run seed
```
This creates the database and adds 220 questions (20 per topic).

### 3. Start Server
```bash
npm start
```

### 4. Open Browser
Navigate to: **http://localhost:3000**

## 🔑 Default Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change the admin password after first login!**

## 📋 Project Structure

```
quiz-website/
├── server/
│   ├── config/         # Database configuration
│   ├── models/         # User, Topic, Question, QuizAttempt models
│   ├── routes/         # API routes (auth, quiz, admin)
│   ├── middleware/     # JWT authentication middleware
│   ├── utils/          # Seed script with 220 questions
│   └── server.js       # Express server
├── public/
│   ├── css/
│   │   ├── style.css   # Main styles
│   │   ├── quiz.css    # Quiz-specific styles
│   │   └── admin.css   # Admin panel styles
│   ├── js/
│   │   ├── api.js      # API helper functions
│   │   ├── auth.js     # Authentication logic
│   │   ├── quiz.js     # Quiz functionality
│   │   └── admin.js    # Admin panel logic
│   ├── admin/          # Admin panel pages
│   │   ├── dashboard.html
│   │   ├── users.html
│   │   └── questions.html
│   ├── index.html      # Landing page
│   ├── login.html      # Login page
│   ├── register.html   # Registration page
│   ├── dashboard.html  # Topic selection
│   ├── quiz.html       # Quiz interface
│   └── results.html    # Results display
├── database.sqlite     # SQLite database (created on seed)
├── package.json
├── .env               # Environment variables
└── README.md
```

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3 (Modern gradients, glassmorphism, animations)
- Vanilla JavaScript (ES6+)
- No frameworks - pure, lightweight code

**Backend:**
- Node.js & Express.js
- SQLite database
- JWT for authentication
- Bcrypt for password hashing

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/guest` | Create guest session |
| GET | `/api/auth/verify` | Verify JWT token |

### Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quiz/topics` | Get all topics |
| POST | `/api/quiz/start` | Start new quiz (requires auth) |
| POST | `/api/quiz/submit` | Submit quiz answers (requires auth) |
| GET | `/api/quiz/history` | Get user quiz history (requires auth) |
| GET | `/api/quiz/attempt/:id` | Get quiz attempt details (requires auth) |

### Admin (Protected - Requires Admin Role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/statistics` | Get dashboard statistics |
| GET | `/api/admin/users` | Get all users with stats |
| PUT | `/api/admin/users/:id/status` | Enable/disable user account |
| GET | `/api/admin/questions` | Get all questions |
| POST | `/api/admin/questions` | Add new question |
| PUT | `/api/admin/questions/:id` | Update question |
| DELETE | `/api/admin/questions/:id` | Delete question |
| GET | `/api/admin/attempts` | Get all quiz attempts |

## 🎨 Features Breakdown

### User Features
- ✅ Register/Login with validation
- ✅ Guest mode (no registration required)
- ✅ Choose from 11 programming topics
- ✅ Take 20-question randomized quizzes
- ✅ Real-time score calculation
- ✅ Beautiful results page with animations
- ✅ **Detailed answer review with correct solutions**
- ✅ View quiz history
- ✅ Responsive design (mobile-friendly)

### Admin Features
- ✅ Dashboard with statistics
- ✅ User management (view all users, enable/disable accounts)
- ✅ View user statistics (quizzes taken, average score)
- ✅ Question management (add, edit, delete)
- ✅ Filter questions by topic
- ✅ View all quiz attempts
- ✅ Monitor platform activity

### UI/UX Features
- ✅ Modern gradient backgrounds
- ✅ Glassmorphism effects
- ✅ Smooth transitions and animations
- ✅ Progress indicators
- ✅ Circular score display
- ✅ Color-coded results
- ✅ Floating card animations on landing page
- ✅ Responsive grid layouts
- ✅ Mobile-optimized interface

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Protected admin routes
- SQL injection prevention (parameterized queries)
- Input validation
- XSS protection
- CORS configuration
- Session management

## 📊 Database Schema

### Users
- id, username, email, password (hashed), role (user/admin), is_active, created_at

### Topics
- id, name, description, icon, created_at

### Questions
- id, topic_id, question_text, option_a/b/c/d, correct_answer, difficulty, created_at

### Quiz_Attempts
- id, user_id, topic_id, score, total_questions, started_at, completed_at, session_id

### Quiz_Responses
- id, attempt_id, question_id, user_answer, is_correct, answered_at

## 🎯 How to Use

### As a Regular User
1. Visit http://localhost:3000
2. Click "Sign Up" or "Try as Guest"
3. Select a topic from the dashboard
4. Answer 20 questions
5. View your results
6. Check your history

### As an Admin
1. Login with admin credentials
2. Access admin panel from dashboard
3. View statistics and manage users
4. Add/edit/delete questions
5. Monitor quiz attempts

## 🌟 Quiz Topics

| Icon | Topic | Questions | Difficulty Range |
|------|-------|-----------|------------------|
| 📄 | HTML | 20 | Easy - Hard |
| 🎨 | CSS | 20 | Easy - Hard |
| ⚡ | JavaScript | 20 | Easy - Hard |
| 🐘 | PHP | 20 | Easy - Hard |
| 🟢 | Node.js | 20 | Easy - Hard |
| ⚛️ | React | 20 | Easy - Hard |
| ©️ | C | 20 | Easy - Hard |
| ➕ | C++ | 20 | Easy - Hard |
| 🐍 | Python | 20 | Easy - Hard |
| ☕ | Java | 20 | Easy - Hard |
| 🗄️ | MySQL | 20 | Easy - Hard |

**Total: 220 Questions**

## 🔧 Configuration

Edit `.env` file to configure:

```env
PORT=3000                    # Server port
JWT_SECRET=your_secret_key   # Change this!
DB_PATH=./database.sqlite    # Database location
NODE_ENV=development         # Environment
```

## 📝 License

ISC

---

**Built with ❤️ for learning and education**
