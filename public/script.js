let currentGroup = 'A';

// Fetch data — tries the Express API (local dev), falls back to static data.json (GitHub Pages)
async function loadData() {
  try {
    let data;
    const apiResponse = await fetch('/api/data').catch(() => null);
    if (apiResponse && apiResponse.ok) {
      data = await apiResponse.json();
    } else {
      const staticResponse = await fetch('data.json');
      data = await staticResponse.json();
    }
    renderUI(data);
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Render entire UI
function renderUI(data) {
  renderLastUpdated(data.lastUpdated);
  renderFavoriteTeams(data.favorites);
  renderNextMatch(data.matches);
  renderTodayMatches(data.matches);
  renderRecentResults(data.matches);
  renderStandings(data.standings);
  renderKnockout(data.knockout || [[], [], [], []]);
}

// Format date time
function formatDateTime(dateStr, timeStr) {
  const date = new Date(dateStr + 'T' + timeStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get flag emoji for country
function getCountryFlag(teamName) {
  const flags = {
    'Argentina': '🇦🇷',
    'Spain': '🇪🇸',
    'USA': '🇺🇸',
    'Brazil': '🇧🇷',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Portugal': '🇵🇹',
    'Poland': '🇵🇱',
    'Mexico': '🇲🇽',
    'Canada': '🇨🇦'
  };
  return flags[teamName] || '🏳️';
}

// Render last updated time
function renderLastUpdated(lastUpdated) {
  const date = new Date(lastUpdated);
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  document.getElementById('lastUpdated').textContent = timeStr;
}

// Render favorite teams
function renderFavoriteTeams(favorites) {
  const container = document.getElementById('favoriteTeams');
  container.innerHTML = favorites.map(team => `
    <div class="team-card">
      <div class="team-flag">${getCountryFlag(team)}</div>
      <div>${team}</div>
    </div>
  `).join('');
}

// Get today's date as YYYY-MM-DD
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Render next match
function renderNextMatch(matches) {
  const upcomingMatches = matches.filter(m => m.status === 'upcoming').sort((a, b) => {
    return new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time);
  });

  if (upcomingMatches.length === 0) {
    document.getElementById('nextMatch').innerHTML = '<p style="color: #666;">No upcoming matches</p>';
    return;
  }

  const nextMatch = upcomingMatches[0];
  const matchDate = new Date(nextMatch.date + 'T' + nextMatch.time);
  const now = new Date();
  const diff = matchDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let countdownStr = '';
  if (days > 0) countdownStr += `${days} day${days > 1 ? 's' : ''} `;
  if (hours > 0) countdownStr += `${hours} hour${hours > 1 ? 's' : ''} `;
  if (minutes >= 0) countdownStr += `${minutes} min${minutes !== 1 ? 's' : ''}`;

  document.getElementById('nextMatch').innerHTML = `
    <div class="match-info">
      <strong>${nextMatch.homeTeam}</strong> vs <strong>${nextMatch.awayTeam}</strong>
    </div>
    <div style="font-size: 2rem; margin: 15px 0;">
      ${getCountryFlag(nextMatch.homeTeam)} vs ${getCountryFlag(nextMatch.awayTeam)}
    </div>
    <div class="match-info">
      📅 ${new Date(nextMatch.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
      ⏰ ${nextMatch.time}
    </div>
    <div class="countdown">⏳ ${countdownStr}</div>
  `;
}

// Render today's matches
function renderTodayMatches(matches) {
  const todayDate = getTodayDate();
  const todayMatches = matches.filter(m => m.date === todayDate);

  const container = document.getElementById('todayMatches');
  if (todayMatches.length === 0) {
    container.innerHTML = '<p style="color: #999; text-align: center;">No matches today</p>';
    return;
  }

  container.innerHTML = todayMatches.map(match => renderMatchItem(match)).join('');
}

// Render recent results
function renderRecentResults(matches) {
  const completedMatches = matches
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
    .slice(0, 5);

  const container = document.getElementById('recentResults');
  if (completedMatches.length === 0) {
    container.innerHTML = '<p style="color: #999; text-align: center;">No results yet</p>';
    return;
  }

  container.innerHTML = completedMatches.map(match => renderMatchItem(match)).join('');
}

// Render single match item
function renderMatchItem(match) {
  const statusClass = `status-${match.status}`;
  const statusText = match.status === 'completed' ? '✓' : match.status === 'live' ? '🔴 LIVE' : '📅';

  const scoreStr = match.homeScore !== null ? `${match.homeScore} - ${match.awayScore}` : '-';

  return `
    <div class="match-item ${match.status}">
      <div class="match-teams-info">
        <span class="team-name">${getCountryFlag(match.homeTeam)} ${match.homeTeam}</span>
        <span class="match-score">${scoreStr}</span>
        <span class="team-name">${match.awayTeam} ${getCountryFlag(match.awayTeam)}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="match-status ${statusClass}">${statusText}</span>
        <span class="match-time">${match.time}</span>
      </div>
    </div>
  `;
}

// Render standings
function renderStandings(standings) {
  const groupData = standings[currentGroup] || [];

  const tbody = document.getElementById('standingsBody');
  tbody.innerHTML = groupData.map((team, index) => `
    <tr>
      <td><strong>${index + 1}</strong></td>
      <td><strong>${getCountryFlag(team.team)} ${team.team}</strong></td>
      <td>${team.played}</td>
      <td>${team.wins}</td>
      <td>${team.draws}</td>
      <td>${team.losses}</td>
      <td><strong>${team.points}</strong></td>
    </tr>
  `).join('');
}

// Render knockout bracket
function renderKnockout(knockout) {
  const rounds = ['round-16', 'quarterfinals', 'semifinals', 'final'];
  
  rounds.forEach((roundId, idx) => {
    const roundContainer = document.getElementById(roundId);
    const roundData = knockout[idx] || [];
    
    if (roundData.length === 0) {
      roundContainer.innerHTML = '<div class="bracket-match empty"><div class="bracket-team"><span>TBD</span></div></div>';
    } else {
      roundContainer.innerHTML = roundData.map(match => `
        <div class="bracket-match ${match.winner ? 'played' : ''}">
          <div class="bracket-team ${match.winner === match.homeTeam ? 'winner' : ''}">
            <span class="bracket-team-name">${getCountryFlag(match.homeTeam)} ${match.homeTeam}</span>
            <span class="bracket-score ${match.homeScore === null ? 'empty' : ''}">${match.homeScore !== null ? match.homeScore : '-'}</span>
          </div>
          <div class="bracket-team ${match.winner === match.awayTeam ? 'winner' : ''}">
            <span class="bracket-team-name">${getCountryFlag(match.awayTeam)} ${match.awayTeam}</span>
            <span class="bracket-score ${match.awayScore === null ? 'empty' : ''}">${match.awayScore !== null ? match.awayScore : '-'}</span>
          </div>
        </div>
      `).join('');
    }
  });
}

// Handle tab clicks
document.addEventListener('DOMContentLoaded', () => {
  // Tab navigation
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab;
      
      // Remove active from all tabs and panes
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      
      // Add active to clicked tab and corresponding pane
      e.target.classList.add('active');
      document.getElementById(tabName + '-tab').classList.add('active');
    });
  });

  // Group tabs in standings
  const groupBtns = document.querySelectorAll('.group-btn');
  groupBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      groupBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentGroup = e.target.dataset.group;
      const data = await loadData();
      renderStandings(data.standings);
    });
  });

  // Load data on page load
  loadData();

  // Refresh data every 5 minutes
  setInterval(loadData, 5 * 60 * 1000);
});
