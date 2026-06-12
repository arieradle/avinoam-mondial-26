# 🌍 World Cup 2026 Tracker for Kids

A colorful, kid-friendly website to track FIFA World Cup 2026 results with **automatic updates at 6:00 AM and 2:00 PM Israel Time**.

## 🎯 Features

✅ **Favorite Teams Spotlight** - Track Argentina, Spain, and USA  
✅ **Live Match Scores** - See results as they happen  
✅ **Match Schedule** - View upcoming matches with countdowns  
✅ **Group Standings** - Team rankings and points  
✅ **Automatic Updates** - Results refresh at 6 AM and 2 PM Israel Time  
✅ **Mobile Friendly** - Works on phones, tablets, and desktops  
✅ **Colorful UI** - Kid-friendly design with emojis and bright colors  

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd avinoam-mondial-26
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📅 Automatic Live Updates

The website **automatically fetches live World Cup 2026 data** from the internet at:
- **6:00 AM Israel Time** (3:00 AM UTC)
- **2:00 PM Israel Time** (11:00 AM UTC)

**How it works:**
- ✅ Fetches live match data from sports APIs
- ✅ Automatically updates scores and match statuses
- ✅ Recalculates group standings in real-time
- ✅ Runs on server startup and on schedule
- ✅ Falls back gracefully if API is unavailable

The update times are configured in `server.js` using `node-cron`.

## 📊 Project Structure

```
avinoam-mondial-26/
├── server.js              # Express server with scheduled tasks
├── package.json           # Dependencies
├── data.json              # Match data and standings
├── public/
│   ├── index.html         # Main HTML page
│   ├── styles.css         # Styling
│   └── script.js          # Frontend logic
└── README.md
```

## 🛠️ How to Update Results

### Option 1: Automatic API Updates (Recommended!)
The server automatically fetches live data from the internet at 6 AM and 2 PM Israel Time. No action needed!

**To use the full football-data.org API:**
1. Get a free API key from [football-data.org](https://www.football-data.org/)
2. Create a `.env` file (copy from `.env.example`)
3. Add your API key: `FOOTBALL_DATA_API_KEY=your_key_here`
4. Restart the server

### Option 2: Manual Admin Panel
Visit `/admin` to manually update match scores anytime.

### Option 3: Direct API Call
Make a POST request to update a match:

```bash
curl -X POST http://localhost:3000/api/update-match \
  -H "Content-Type: application/json" \
  -d '{
    "matchId": 1,
    "homeScore": 2,
    "awayScore": 1,
    "status": "completed"
  }'
```

### Option 4: Direct File Edit
Edit `data.json` directly and the website will reflect changes on next refresh.

## 📱 Pages & Sections

- **Header** - Title and last update timestamp
- **My Favorite Teams** - Quick view of Argentina, Spain, USA
- **Next Match** - Shows upcoming match with countdown timer
- **Today's Matches** - All matches scheduled for today
- **Recent Results** - Last 5 completed matches
- **Group Standings** - Select Group A, B, or C to see rankings
- **Footer** - Update schedule info

## 🎨 Customization

### Change Favorite Teams
Edit `data.json`:
```json
"favorites": ["Argentina", "Spain", "USA"]
```

### Change Update Times
Edit `server.js` and modify the cron schedules:
```javascript
// Change 6 AM update time
cron.schedule('0 3 * * *', updateMatches);

// Change 2 PM update time
cron.schedule('0 11 * * *', updateMatches);
```

### Add/Edit Teams
Update `data.json` with more teams, matches, and standings data.

## 🌐 Deployment

To deploy online:

1. **Heroku:** Use `Procfile` (you may need to create one)
2. **Railway:** Connect GitHub repo and deploy
3. **Vercel + Backend:** Host frontend on Vercel, backend on Railway/Heroku

## 🔄 Development

For development with auto-restart on changes:

```bash
npm run dev
```

(Requires `nodemon` - included in devDependencies)

## 📝 License

This project is open source and available for personal use.

## 🎯 Future Enhancements

- 🔔 Browser notifications for match updates
- 📸 Team photos and player stats
- ⚽ Live score API integration
- 💾 Save user preferences
- 🌙 Dark mode

---

**Enjoy tracking World Cup 2026! ⚽🌍**
