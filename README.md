# Roseberry – Full-Stack To-Do List Application

A complete full-stack application with JWT authentication and task management.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for mobile development)
- Expo Go app (for testing on physical devices)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd roseberry
```

### 2. Start Backend with Docker
```bash
docker compose up --build
```

This will:
- Start PostgreSQL database
- Start Express backend API
- Run database migrations
- Seed with demo data

**Services available at:**
- **API**: http://localhost:4000
- **Swagger Docs**: http://localhost:4000/docs

**Demo Credentials:**
- Email: `demo@roseberry.dev`
- Password: `password123`

### 3. Start Mobile App

#### For Web Testing:
```bash
cd mobile
npm install
npm start -- --web
```
App opens at: **http://localhost:8081**

#### For Mobile Devices:
```bash
cd mobile
npm install
npm start
```
Scan QR code with Expo Go app.

## 📱 How to Use the App

### 1. **Login/Sign Up**
- Use demo credentials: `demo@roseberry.dev` / `password123`
- Or create a new account with your email
- App validates email format and password length

### 2. **Manage Tasks**
- **Add Task**: Type in the input field and press Enter or tap +
- **Complete Task**: Tap the circle checkbox next to any task
- **Delete Task**: Tap the × button on any task
- **View Progress**: See completion percentage in the purple stats card

### 3. **Features**
- Real-time task updates
- Progress tracking
- Clean, modern interface
- Works on web, iOS, and Android

## 📱 Mobile Setup for Physical Devices

Update API URL in both `mobile/src/screens/LoginScreen.tsx` and `mobile/src/screens/TasksScreen.tsx`:

```typescript
const API_URL = 'http://192.168.1.XXX:4000';  // Replace with your IP
```

Find your IP:
- **Mac/Linux**: `ifconfig | grep "inet "`
- **Windows**: `ipconfig`

## 📦 Building APK for Android

### Prerequisites
- EAS CLI: `npm install -g eas-cli`
- Expo account: [expo.dev](https://expo.dev)

### Build APK
```bash
cd mobile
eas login
eas build:configure
eas build --profile preview --platform android
```

Download APK from the provided link after build completion.

## 📚 API Documentation

Interactive API docs: **http://localhost:4000/docs**

### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Login

### Tasks (Protected - Requires JWT)
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

## 🛠️ Tech Stack

**Backend**: Node.js + TypeScript + Express + Prisma + PostgreSQL + JWT + Swagger  
**Mobile**: React Native (Expo) + TypeScript  
**Database**: PostgreSQL 16  
**Containerization**: Docker + Docker Compose

## 📋 Features

- ✅ JWT Authentication (Sign up/Login)
- ✅ CRUD Operations for Tasks
- ✅ Loading states and error handling
- ✅ Input validation
- ✅ Modern UI/UX
- ✅ Cross-platform (iOS, Android, Web)

## 🔧 Development

### Backend Local Development
```bash
cd backend
npm install
npm run dev
```

### Mobile Local Development
```bash
cd mobile
npm install
npm start
```

### Database Management
```bash
# Connect to database
docker exec -it roseberry-db psql -U roseberry -d roseberry_db

# Reset database
docker compose down -v
docker compose up --build
```

## 🚨 Troubleshooting

**Backend not responding:**
```bash
# Check if services are running
docker compose ps

# Start services if not running
docker compose up -d
```

**Port already in use:**
```bash
lsof -ti:4000 | xargs kill -9
```

**Docker issues:**
```bash
docker compose down -v
docker compose up --build --force-recreate
```

**Mobile can't connect:**
- Use your computer's IP address (not localhost)
- Ensure both devices are on same WiFi network
- Make sure backend is running first