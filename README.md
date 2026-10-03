# PeerGrade

**Learn by Teaching. Prove by Grading.**

PeerGrade is a full-stack skill credibility platform where users don't just claim skills — they prove them through teaching, peer assessments, and structured evaluation. The platform pairs learners and teachers for live sessions, generates AI-powered assignments, and computes credibility scores based on real performance data.

**Live Demo:** [peergrade.vercel.app](https://peergrade.vercel.app)

---

## Overview

Traditional skill verification relies on self-reported claims and certificates that reflect completion rather than capability. PeerGrade addresses this by building credibility through measurable interactions:

- Users list skills they can teach and skills they want to learn
- The platform matches complementary learners and teachers
- After a live session, learners complete AI-generated assignments
- Teachers grade submissions and both parties exchange feedback
- A credibility score is computed from assignment performance, feedback ratings, and session consistency

The result is a data-backed skill profile that reflects demonstrated ability rather than self-assessment.

---

## Key Features

- **User Registration and Authentication** — Email/password auth with session persistence via `sessionStorage` for tab isolation
- **Skill Management** — Add, view, and delete teaching and learning skills with category and proficiency level
- **Teacher Discovery** — Browse and filter available teachers by category, level, and search terms
- **Session Requests** — Send, accept, reject, and negotiate peer learning requests with in-app messaging
- **Session Modes** — Single (one teaches, one learns) and Mutual (both teach each other) session types
- **Live Video Sessions** — Jitsi Meet integration for peer-to-peer video calls
- **AI-Generated Assignments** — Google Gemini generates skill-specific assessment questions after sessions
- **Assignment Grading** — Teachers review and score learner submissions per question
- **Feedback System** — Mutual ratings and comments after session completion
- **Skill Scores** — Weighted scoring: 60% assignment performance, 30% feedback rating, 10% session consistency
- **Credibility Score** — Composite score (0–100) from top skill scores, teaching feedback, and consistency bonus
- **Credibility Dashboard** — Visual breakdown of scores, rating distributions, session history, and upcoming sessions
- **Protected Routes** — Route guards that redirect unauthenticated users to login

---

## System Architecture

```
┌──────────────────────────────┐
│     Frontend (Vercel)        │
│     React + TypeScript       │
│     Vite + Tailwind CSS      │
│     ShadCN UI Components     │
└──────────────┬───────────────┘
               │ REST API (fetch)
               │ x-user-id header
               ▼
┌──────────────────────────────┐
│     Backend (Render)         │
│     Node.js + Express.js     │
│     REST API                 │
└──────────┬─────────┬─────────┘
           │         │
           ▼         ▼
┌──────────────┐ ┌──────────────┐
│  Firestore   │ │  Gemini AI   │
│  (Database)  │ │  (Questions) │
└──────────────┘ └──────────────┘
```

**Frontend** communicates with the backend via `fetch` calls using the `VITE_API_URL` environment variable. Authentication is handled through a custom `x-user-id` header with user IDs stored in `sessionStorage`.

**Backend** is a stateless Express.js API that performs all business logic and data operations against Firebase Firestore. Google Gemini generates dynamic assessment questions.

---

## How It Works

1. **Register** — User creates an account with name, email, password, and role (teach/learn/both)
2. **Add Skills** — User lists skills they can teach and skills they want to learn, with category and level
3. **Discover Teachers** — Browse available teachers, filter by category/level/keyword
4. **Send Request** — Request a session with a teacher for a specific skill, with an optional message
5. **Negotiate** — Teacher can accept/reject; both parties can exchange messages to coordinate
6. **Confirm Session** — Choose single or mutual mode and confirm to create the session
7. **Schedule & Join** — Set a date/time, then join a Jitsi video call for the live session
8. **Complete Session** — Mark the session as done; an assignment is auto-generated using Gemini AI
9. **Submit Assignment** — Learner answers the AI-generated questions
10. **Grade & Feedback** — Teacher grades the submission; both parties leave ratings and comments
11. **Score Update** — Skill scores and credibility scores are recomputed automatically

---

## Project Structure

```
peergrade/
├── src/                          # Frontend source (React + TypeScript)
│   ├── App.tsx                   # Route definitions
│   ├── main.tsx                  # App entry point
│   ├── index.css                 # Global styles
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # ShadCN UI primitives
│   │   ├── DashboardLayout.tsx   # Sidebar navigation layout
│   │   ├── ProtectedRoute.tsx    # Auth route guard
│   │   ├── AddSkillModal.tsx     # Skill creation dialog
│   │   ├── RequestSkillModal.tsx # Session request dialog
│   │   ├── FeedbackModal.tsx     # Rating/feedback dialog
│   │   ├── GradeModal.tsx        # Assignment grading dialog
│   │   └── ...                   # Cards, badges, stats
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication state management
│   ├── hooks/
│   │   ├── useUserStats.ts       # Dashboard statistics hook
│   │   └── use-mobile.tsx        # Responsive breakpoint hook
│   ├── lib/
│   │   ├── api.ts                # All backend API calls (single source)
│   │   └── utils.ts              # Utility functions
│   └── pages/
│       ├── Landing.tsx           # Public landing page
│       ├── Login.tsx             # Login form
│       ├── Signup.tsx            # Registration form
│       ├── Dashboard.tsx         # Main dashboard with stats
│       ├── MySkills.tsx          # Manage teaching/learning skills
│       ├── Discover.tsx          # Browse and request teachers
│       ├── Requests.tsx          # View incoming/outgoing requests
│       ├── RequestDetail.tsx     # Request negotiation and messaging
│       ├── Sessions.tsx          # Scheduled and completed sessions
│       ├── Assignments.tsx       # View and complete assignments
│       ├── Profile.tsx           # Credibility dashboard and profile
│       └── NotFound.tsx          # 404 page
├── backend/                      # Backend source (Node.js + Express)
│   ├── src/
│   │   ├── index.js              # Express server entry point
│   │   ├── config/
│   │   │   ├── env.js            # Environment configuration
│   │   │   └── firebase.js       # Firebase Admin SDK initialization
│   │   ├── routes/               # Express route definitions
│   │   │   ├── index.js          # Route mounting + health check
│   │   │   ├── auth.js           # /api/auth/*
│   │   │   ├── users.js          # /api/users/*
│   │   │   ├── skills.js         # /api/skills/*
│   │   │   ├── teachers.js       # /api/teachers/*
│   │   │   ├── requests.js       # /api/requests/*
│   │   │   ├── sessions.js       # /api/sessions/*
│   │   │   ├── assignments.js    # /api/assignments/*
│   │   │   └── skillScores.js    # /api/skill-scores/*
│   │   ├── controllers/          # Route handlers
│   │   ├── services/             # Business logic
│   │   │   ├── authService.js         # Registration, login, bcrypt
│   │   │   ├── skillService.js        # Skill CRUD
│   │   │   ├── teacherService.js      # Teacher aggregation
│   │   │   ├── requestService.js      # Session request lifecycle
│   │   │   ├── messageService.js      # In-request messaging
│   │   │   ├── sessionService.js      # Session management + Jitsi
│   │   │   ├── assignmentService.js   # Assignment creation + grading
│   │   │   ├── geminiService.js       # AI question generation
│   │   │   ├── feedbackService.js     # Session feedback
│   │   │   ├── skillScoreService.js   # Weighted skill scoring
│   │   │   ├── credibilityService.js  # Composite credibility score
│   │   │   ├── userService.js         # User profile operations
│   │   │   └── userSkillsService.js   # User-skill queries
│   │   ├── middleware/
│   │   │   ├── auth.js           # x-user-id header extraction
│   │   │   └── errorHandler.js   # Global error handling
│   │   └── utils/
│   │       └── jwt.js            # JWT token utilities
│   ├── .env.example              # Environment variable template
│   ├── firebase.json             # Firebase project config
│   └── firestore.indexes.json    # Firestore composite index definitions
├── public/                       # Static assets
├── .env.production               # Production API URL for Vite build
├── vercel.json                   # Vercel SPA routing config
├── vite.config.ts                # Vite build configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Frontend dependencies
└── .gitignore
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login with email and password |
| GET | `/api/auth/me` | Get current user profile |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get own profile |
| PUT | `/api/users/me` | Update own profile |
| GET | `/api/users/me/credibility` | Get credibility score and stats |
| GET | `/api/users/me/stats` | Get dashboard statistics |
| GET | `/api/users/me/skills` | Get user's skills |
| GET | `/api/users/:id` | Get a public user profile |

### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | Get own teaching and learning skills |
| POST | `/api/skills` | Add a new skill |
| GET | `/api/skills/:id` | Get a specific skill |
| DELETE | `/api/skills/:id` | Remove a skill |
| GET | `/api/skills/all-teaching` | Get all teaching skills across users |

### Teachers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teachers` | Browse teachers (filter by category/level/search) |
| GET | `/api/teachers/:id` | Get teacher details |

### Session Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/requests` | Get incoming and outgoing requests |
| POST | `/api/requests` | Send a session request |
| GET | `/api/requests/:id` | Get request details |
| PUT | `/api/requests/:id/accept` | Accept a request |
| POST | `/api/requests/:id/confirm` | Confirm with mode selection |
| PUT | `/api/requests/:id/reject` | Reject a request |
| DELETE | `/api/requests/:id` | Cancel a request |
| GET | `/api/requests/:id/messages` | Get messages for a request |
| POST | `/api/requests/:id/messages` | Send a message |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions` | Get all sessions (scheduled/completed) |
| GET | `/api/sessions/:id` | Get session details |
| PUT | `/api/sessions/:id/schedule` | Set session date/time |
| GET | `/api/sessions/:id/join` | Join a Jitsi video session |
| POST | `/api/sessions/:id/complete` | Mark session as completed |
| GET | `/api/sessions/:id/feedback` | Get session feedback |
| POST | `/api/sessions/:id/feedback` | Submit feedback |

### Assignments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assignments` | Get all assignments |
| GET | `/api/assignments/:id` | Get assignment details |
| GET | `/api/assignments/session/:sessionId` | Get assignments for a session |
| POST | `/api/assignments/:id/submit` | Submit assignment answers |
| POST | `/api/assignments/:id/grade` | Grade an assignment (teacher) |

### Skill Scores
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skill-scores` | Get skill scores for current user |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health check |

---

## Credibility Scoring

### Skill Score (per skill, 0–100)

Each skill the user learns is scored using a weighted formula:

| Component | Weight | Source |
|-----------|--------|--------|
| Assignment Performance | 60% | Average grade on graded assignments (normalized 0–100) |
| Feedback Rating | 30% | Average peer feedback rating (normalized 0–100) |
| Session Consistency | 10% | `min(session_count × 10, 100)` |

### Overall Credibility Score (per user, 0–100)

The user's overall credibility aggregates across skills:

| Component | Calculation |
|-----------|-------------|
| Skill Component | Average of top 3 skill scores |
| Teaching Component | Average teaching feedback rating (normalized 0–100) |
| Base Score | `(skill_component + teaching_component) / 2` |
| Consistency Bonus | +2 (≥5 sessions), +5 (≥15), +10 (≥30) |
| **Final Score** | `clamp(base_score + bonus, 0, 100)` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite 5 |
| Styling | Tailwind CSS 3, ShadCN UI (Radix primitives) |
| Routing | React Router v6 |
| State | React Context API, React Query |
| Backend | Node.js, Express.js |
| Database | Firebase Firestore (NoSQL) |
| Auth | Custom (bcrypt + session ID), Firebase Admin SDK |
| AI | Google Gemini 1.5 Flash (assignment generation) |
| Video | Jitsi Meet (peer-to-peer) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Installation

### Prerequisites

- Node.js 18+
- npm
- A Firebase project with Firestore enabled
- (Optional) Google Gemini API key for AI-generated assignments

### 1. Clone the repository

```bash
git clone https://github.com/bhanu-teja1977/peergrade.git
cd peergrade
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Configure environment variables

**Frontend** — Create `.env` in the project root:
```
VITE_API_URL=http://localhost:5000
```

**Backend** — Create `backend/.env` using the template:
```bash
cp backend/.env.example backend/.env
```

Then fill in your Firebase service account credentials, JWT secret, and optionally a Gemini API key. See `backend/.env.example` for all required variables.

---

## Running the Project

### Start the backend

```bash
cd backend
npm start
```

The API server starts at `http://localhost:5000`. Verify with:
```
GET http://localhost:5000/api/health
```

### Start the frontend (separate terminal)

```bash
npm run dev
```

The frontend starts at `http://localhost:5173`.

---

## Deployment

The project is deployed with:
- **Frontend** on [Vercel](https://vercel.com) — auto-deploys from `main` branch
- **Backend** on [Render](https://render.com) — auto-deploys from `main` branch

### Environment variables required

**Vercel:**
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Your Render backend URL |

**Render:**
| Variable | Value |
|----------|-------|
| All Firebase credentials | From `.env.example` |
| `JWT_SECRET` | A strong random string |
| `FRONTEND_URL` | Your Vercel frontend URL |
| `NODE_ENV` | `production` |
| `GEMINI_API_KEY` | (Optional) Google AI API key |

---

## Future Improvements

- Skill verification badges from third-party assessments
- Employer-facing view for verified skill profiles
- Advanced matching algorithm based on availability and location
- Session recording and playback
- Analytics dashboard with learning progress trends
- Role-based access control for institutions
- Mobile-responsive improvements

---

## License

This project is licensed under the MIT License.
