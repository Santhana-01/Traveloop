# 🌌 Traveloop - Smart Full-Stack Travel Planner

Traveloop is a premium, full-stack travel planning application. It features a modern **Aurora Design System**, a seamless **Smart Itinerary** builder, and a powerful **Backend Integration**.

![Aurora Theme](https://img.shields.io/badge/Theme-Aurora-38BDF8)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-8B5CF6)
![Currency](https://img.shields.io/badge/Currency-INR-34D399)

## ✨ Premium Features

### 🌌 Aurora Design System
- **Stunning Visuals**: Deep navy backgrounds with glassmorphism effects.
- **Dynamic Gradients**: Aesthetic purple-to-blue gradients throughout the app.
- **Micro-animations**: Smooth transitions and hover effects for a premium feel.

### 🗺️ Smart Itinerary Builder
- **Auto-Day Generation**: Enter your trip dates, and Traveloop automatically creates your day-by-day structure.
- **Simplified Place Logging**: Quickly add locations with timing and personal notes.
- **Interactive Timeline**: A visual connection line linking all your planned activities.
- **Edit & Reorder**: Full control over your itinerary with easy editing and removal.

### 💰 Expense Tracker (INR ₹)
- **Localized for India**: All calculations and displays are in **Indian Rupees (₹)**.
- **Estimated vs Actual**: Set an initial budget and track detailed expenses for transport, stay, food, and activities.
- **Visual Breakdown**: Detailed summaries of your total spending per trip.

### 👤 User-Centric Dashboard
- **Dynamic Stats**: Real-time updates on your total trips, cities visited, and upcoming adventures.
- **Smart Reminders**: Automatically identifies your next upcoming trip and shows the countdown.
- **Professional Profile**: Manage your details and saved locations in a clean, professional layout.

## 🛠️ Technology Stack

- **Frontend**: React (Hooks, Context API, Router v6)
- **Styling**: Vanilla CSS3 with Custom Properties (Aurora Design Tokens)
- **Backend**: Node.js & Express
- **API**: RESTful architecture with Bearer Token Authentication
- **Data**: MongoDB (via Backend API)

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (copy from `.env.example`) and add your configuration.
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Stay in or return to the root directory (`/traveloop odoo`).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```

## 📂 Project Structure

```
traveloop/
├── backend/            # Express Server, Routes, and Models
├── public/             # Static Assets
├── src/
│   ├── api/            # API Client services
│   ├── components/     # Reusable UI Components
│   ├── pages/          # Full Page Views
│   ├── styles/         # Aurora Design Tokens and CSS
│   └── App.js          # Core Routing Logic
├── package.json
└── README.md
```

## 📝 Note on Deployment
When pushing to GitHub, ensure your `.env` files are ignored (already configured in `.gitignore`). For deployment (e.g., Vercel, Heroku), remember to set your environment variables in the provider's dashboard.

---
Built with ❤️ for travelers by **Antigravity AI**.
