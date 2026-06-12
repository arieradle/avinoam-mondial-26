import { getFlag, formatMatchDate } from '../utils'

function NextMatch({ matches }) {
  const upcoming = [...matches]
    .filter(m => m.status === 'upcoming')
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))

  if (upcoming.length === 0) {
    return <div className="match-card"><p>No upcoming matches</p></div>
  }

  const next = upcoming[0]
  const diff = new Date(`${next.date}T${next.time}`) - new Date()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  let countdown = ''
  if (days > 0) countdown += `${days}d `
  if (hours > 0) countdown += `${hours}h `
  countdown += `${mins}m`

  return (
    <div className="match-card">
      <div className="match-info">
        <strong>{next.homeTeam}</strong> vs <strong>{next.awayTeam}</strong>
      </div>
      <div style={{ fontSize: '2rem', margin: '15px 0' }}>
        {getFlag(next.homeTeam)} vs {getFlag(next.awayTeam)}
      </div>
      <div className="match-info">
        📅 {formatMatchDate(next.date)} &nbsp; ⏰ {next.time}
      </div>
      {diff > 0 && <div className="countdown">⏳ {countdown}</div>}
    </div>
  )
}

export default function FavoritesTab({ favorites, matches }) {
  return (
    <div className="tab-pane">
      <section className="section">
        <h2>⭐ MY FAVORITE TEAMS</h2>
        <div className="teams-grid">
          {favorites.map(team => (
            <div key={team} className="team-card">
              <div className="team-flag">{getFlag(team)}</div>
              <div>{team}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>🔔 NEXT MATCH</h2>
        <NextMatch matches={matches} />
      </section>
    </div>
  )
}
