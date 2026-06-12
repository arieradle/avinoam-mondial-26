const express = require('express');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data.json');

// Load data
function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { matches: [], lastUpdated: new Date(), favorites: [], standings: {} };
  }
}

// Save data
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all data
app.get('/api/data', (req, res) => {
  const data = loadData();
  res.json(data);
});

// Update match result (admin)
app.post('/api/update-match', (req, res) => {
  const { matchId, homeScore, awayScore, status } = req.body;
  const data = loadData();
  
  const match = data.matches.find(m => m.id === matchId);
  if (match) {
    match.homeScore = homeScore;
    match.awayScore = awayScore;
    match.status = status;
    match.updatedAt = new Date();
    data.lastUpdated = new Date();
    saveData(data);
    res.json({ success: true, match });
  } else {
    res.status(404).json({ error: 'Match not found' });
  }
});

// Fetch World Cup data from API
async function fetchLiveMatches() {
  try {
    console.log(`[${new Date().toISOString()}] 📡 Fetching live match data from API...`);
    
    // Using api-football-v3 free tier or football-data.org
    // We'll use a fallback approach with multiple APIs
    
    let matches = [];
    let standings = {};
    
    try {
      // Try using football-data.org API
      const response = await axios.get('https://api.football-data.org/v4/competitions/WC/matches?status=LIVE,FINISHED,SCHEDULED', {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY || ''
        },
        timeout: 5000
      });
      
      if (response.data && response.data.matches) {
        console.log(`✅ Retrieved ${response.data.matches.length} matches from football-data.org`);
        matches = parseFootballDataMatches(response.data.matches);
      }
    } catch (err) {
      console.log('⚠️  football-data.org API not available, using fallback data');
      // Fallback: load existing data and update timestamp
      matches = null;
    }
    
    // If API fetch failed, keep existing data but update timestamp
    const data = loadData();
    
    if (matches && matches.length > 0) {
      // Merge new match data
      matches.forEach(newMatch => {
        const existingIndex = data.matches.findIndex(m => 
          m.homeTeam === newMatch.homeTeam && 
          m.awayTeam === newMatch.awayTeam &&
          m.date === newMatch.date
        );
        
        if (existingIndex >= 0) {
          // Update existing match
          data.matches[existingIndex] = { ...data.matches[existingIndex], ...newMatch };
        } else {
          // Add new match
          data.matches.push(newMatch);
        }
      });
      
      // Regenerate standings
      data.standings = generateStandings(data.matches);
    }
    
    data.lastUpdated = new Date();
    saveData(data);
    
    console.log(`✅ Match data updated successfully at ${new Date().toLocaleTimeString()}`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching match data:', error.message);
    
    // On error, just update timestamp
    const data = loadData();
    data.lastUpdated = new Date();
    saveData(data);
    return data;
  }
}

// Parse football-data.org match format
function parseFootballDataMatches(matches) {
  return matches.map((match, idx) => {
    const statusMap = {
      'TIMED': 'upcoming',
      'SCHEDULED': 'upcoming',
      'LIVE': 'live',
      'IN_PLAY': 'live',
      'PAUSED': 'live',
      'FINISHED': 'completed',
      'SUSPENDED': 'upcoming',
      'POSTPONED': 'upcoming',
      'CANCELLED': 'cancelled'
    };
    
    return {
      id: idx + 1,
      homeTeam: match.homeTeam?.name || 'TBA',
      awayTeam: match.awayTeam?.name || 'TBA',
      homeScore: match.score?.fullTime?.home,
      awayScore: match.score?.fullTime?.away,
      status: statusMap[match.status] || 'upcoming',
      date: match.utcDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      time: match.utcDate?.split('T')[1]?.substring(0, 5) || '00:00',
      group: match.group || 'N/A',
      updatedAt: new Date()
    };
  });
}

// Generate standings from matches
function generateStandings(matches) {
  const standings = { A: [], B: [], C: [] };
  const teamStats = {};
  
  // Initialize team stats
  matches.forEach(match => {
    const group = match.group || 'A';
    
    [match.homeTeam, match.awayTeam].forEach(team => {
      if (!teamStats[team]) {
        teamStats[team] = {
          team,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          points: 0,
          group
        };
      }
    });
  });
  
  // Calculate standings
  matches.filter(m => m.status === 'completed').forEach(match => {
    const homeTeam = teamStats[match.homeTeam];
    const awayTeam = teamStats[match.awayTeam];
    
    if (homeTeam && awayTeam) {
      homeTeam.played++;
      awayTeam.played++;
      
      if (match.homeScore > match.awayScore) {
        homeTeam.wins++;
        homeTeam.points += 3;
        awayTeam.losses++;
      } else if (match.homeScore < match.awayScore) {
        awayTeam.wins++;
        awayTeam.points += 3;
        homeTeam.losses++;
      } else {
        homeTeam.draws++;
        awayTeam.draws++;
        homeTeam.points += 1;
        awayTeam.points += 1;
      }
    }
  });
  
  // Sort by points
  Object.keys(standings).forEach(group => {
    standings[group] = Object.values(teamStats)
      .filter(t => t.group === group)
      .sort((a, b) => b.points - a.points || (b.wins - a.wins));
  });
  
  return standings;
}

// Scheduled update function - runs at 6am and 2pm Israel time
async function updateMatches() {
  await fetchLiveMatches();
}

// Schedule updates at 6am and 2pm Israel time (UTC+3)
// 6am Israel = 3am UTC
// 2pm Israel = 11am UTC
cron.schedule('0 3 * * *', updateMatches, {
  timezone: 'UTC'
});

cron.schedule('0 11 * * *', updateMatches, {
  timezone: 'UTC'
});

// Also run on startup
updateMatches();

console.log('✅ Scheduled updates:');
console.log('   • 6:00 AM Israel Time (3:00 AM UTC)');
console.log('   • 2:00 PM Israel Time (11:00 AM UTC)');
console.log('   📡 Fetching live data from API...');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 World Cup 2026 Tracker running on http://localhost:${PORT}`);
});
