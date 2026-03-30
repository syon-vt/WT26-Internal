# GDG Internal Leaderboard & Similarity Form

A highly interactive, real-time participant tracking and calculation application built for live events. This platform allows users to take a similarity quiz, matches them with top candidates using custom Euclidean distance algorithms, and globally syncs results across a Live Admin Dashboard and Global Leaderboard.

## Tech Stack

- **Frontend Configuration:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Backend Architecture:** [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions) (`/api`)
- **Real-Time Database:** [Vercel KV (Redis)](https://vercel.com/storage/kv)
- **Deployment & Routing:** Optimized natively for Vercel Cloud Serverless deployments (Zero-Downtime Polling)

<br/>

## Repository Architecture

This codebase strictly utilizes a **Container-Presenter design pattern** to protect backend database hooks from frontend UI style collisions.

```text
GDG-Internal
 |-- api/                    # Vercel Serverless Backend Routes
 |   |-- leaderboard.js      # Global matches logic (Redis Set operations)
 |   |-- live.js             # Admin real-time tracking operations
 |-- src/
 |   |-- components/         # The "UI Brawn" - 100% logic-free HTML/CSS views
 |   |   |-- AdminDashboard.jsx  # Live participant progress tracker & Reset Controls
 |   |   |-- Leaderboard.jsx     # Recursive expandable user grid
 |   |   |-- NameEntry.jsx       # Introductory splash screen
 |   |   |-- QuizForm.jsx        # Dynamic quiz engine and radio grids
 |   |   |-- ResultCard.jsx      # Final presentation and target calculation
 |   |-- hooks/              # The "Backend Bridge"
 |   |   |-- useVercelDatabase.js # Core polling timeouts & abstract fetch requests
 |   |-- App.jsx             # The "Logic Brain" - Global state & dynamic router
 |   |-- constants.js        # Hardcoded system logic (Quiz questions & target matrix)
 |   |-- index.css / App.css # Main style definitions 
 |-- vercel.json             # Vercel CDN Rewrite map for React SPA Router
```
