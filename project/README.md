# TaskFlow - ADHD-Friendly Task Management

A beautiful, modern web application designed specifically for ADHD brains to transform daily tasks into a fun, rewarding experience.

## ✨ Features

- **ADHD-Optimized Design**: Built specifically for neurodivergent minds
- **Beautiful UI**: Modern gradient design with smooth animations
- **Task Management**: Create, organize, and complete tasks with celebration animations
- **Pre-planned Collections**: Ready-made task sets for common scenarios
- **Progress Tracking**: Visual progress charts and achievement system
- **Decision Wheel**: Spin wheel to help choose tasks when overwhelmed
- **Dark/Light Mode**: Comfortable viewing in any lighting
- **Responsive Design**: Works perfectly on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd taskflow
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:3000`

## 🛠️ Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## 📱 Features Overview

### Home Dashboard
- Daily progress tracking with motivational messages
- Quick task overview with completion status
- ADHD-friendly tools (Spin Wheel, Focus Mode)
- Daily ADHD tips and encouragement

### Task Management
- Create tasks with emojis, priorities, and categories
- Pre-planned task collections for common scenarios
- Spin wheel for decision-making when overwhelmed
- Celebration animations for completed tasks

### Progress Tracking
- Weekly completion charts
- Achievement system with unlockable badges
- Streak tracking and statistics
- Motivational progress insights

### Settings
- Dark/light mode toggle
- ADHD-specific feature toggles
- Notification preferences
- Profile customization

## 🎨 Design Philosophy

TaskFlow is designed with ADHD brains in mind:

- **Visual Hierarchy**: Clear, uncluttered interface
- **Positive Reinforcement**: Celebration animations and encouraging messages
- **Decision Support**: Spin wheel and pre-planned collections reduce overwhelm
- **Gentle Reminders**: Motivating notifications, not nagging
- **Progress Visualization**: Clear charts and statistics for motivation

## 🧠 ADHD-Friendly Features

- **Spin Wheel**: Random task selection when feeling overwhelmed
- **Pre-planned Collections**: Ready-made task sets (Focus Mode, Sunday Reset, etc.)
- **Celebration Animations**: Dopamine-boosting completion rewards
- **Gentle Reminders**: Understanding, motivational notifications
- **Visual Progress**: Charts and streaks for motivation
- **Break Reminders**: Customizable rest period notifications

## 🔧 Technology Stack

- **React 18** - Modern UI library
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Lucide React** - Beautiful, consistent icons

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main app layout
│   ├── Navigation.tsx  # Bottom navigation
│   ├── AddTaskModal.tsx
│   └── CelebrationModal.tsx
├── pages/              # Main application pages
│   ├── Home.tsx        # Dashboard
│   ├── Tasks.tsx       # Task management
│   ├── Progress.tsx    # Progress tracking
│   ├── Settings.tsx    # App settings
│   └── Onboarding.tsx  # First-time user flow
├── contexts/           # React contexts
│   └── ThemeContext.tsx
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## 🎯 Deployment

TaskFlow can be deployed to any static hosting service:

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Vercel
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### GitHub Pages
```bash
npm run build
# Push dist/ contents to gh-pages branch
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License.

## 💡 ADHD Tips

TaskFlow includes built-in ADHD success strategies:

- Start with the smallest task to build momentum
- Use the spin wheel when feeling overwhelmed
- Set gentle reminders, not strict deadlines
- Celebrate every completed task, no matter how small
- Take regular breaks to maintain focus
- Use visual progress tracking for motivation

---

**"Different brains, amazing results" ✨**

Built with ❤️ for neurodivergent minds.