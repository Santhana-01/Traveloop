# Quick Start Guide

## Setup Instructions

### Step 1: Install Dependencies
Open terminal in `c:\Users\hp\Downloads\traveloop odoo` and run:

```bash
npm install
```

This will install React, React Router, and other required packages.

### Step 2: Start the Application
Run:

```bash
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

### Step 3: Login
- Email: any email (e.g., demo@example.com)
- Password: any password (no real validation)
- Click "Login"

### Step 4: Create Your First Trip
1. Click "Create New Trip"
2. Fill in:
   - Trip Name: e.g., "Summer Vacation 2024"
   - Start Date: Select a date
   - End Date: Select a later date
   - Description: Optional notes
3. Click "Create Trip"

### Step 5: Add Itinerary
1. On dashboard, click "Edit" on your trip card
2. Click "+ Add Day" to add days
3. For each day, click "+ Add Activity" and fill in:
   - Activity Name
   - Time (optional)
   - Category (Activity, Dining, Transport, etc.)
   - Notes (optional)

### Step 6: Track Budget
1. Click the "Budget" tab
2. Enter amounts for:
   - Transport
   - Accommodation
   - Food & Dining
   - Activities & Entertainment
3. Click "Save Budget"
4. Total will auto-calculate

## Troubleshooting

### Port 3000 Already in Use
If port 3000 is already in use, you can use a different port:
```bash
set PORT=3001 && npm start
```

### npm command not found
Make sure Node.js and npm are installed:
```bash
node --version
npm --version
```

Download from: https://nodejs.org/

### Clearing Data
To clear all saved trips and data:
1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Find `traveloop:*` entries and delete them
4. Refresh the page

## Features Completed

✅ Login/Dashboard (UI only)
✅ Create and manage trips
✅ Add multiple days per trip
✅ Add activities with categories
✅ Track budget per trip
✅ Auto-calculate total costs
✅ All data stored in localStorage
✅ Fully responsive design
✅ Zero backend required
✅ Works offline

Enjoy planning your trips! 🌍✈️
