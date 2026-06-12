import { getFlag, formatMatchDate } from '../utils'

function NextMatch({ matches }) {
  const upcoming = [...matches]
    .filter(m => m.status === 'upcoming')
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))

  if (upcoming.length === 0) {
    return (
      <div className="next-match-card">
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>
          No upcoming matches scheduled
        </p>
      </div>
    )
  }

  const next = upcoming[0]
  const diff = new Date(`${next.date}T${next.time}`) - new Date()
  const days  = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins  = Math.floor((diff % 3600000)  / 60000)

  const countdown =
    diff <= 0 ? 'Starting soon' :
    days  > 0 ? `${days}d ${hours}h` :
    hours > 0 ? `${hours}h ${mins}m` :
                `${mins}m`

  return (
    <div className="next-match-card">
      <div className="next-match-teams">
        <div className="next-team">
          <div className="next-flag">{getFlag(next.homeTeam)}</div>
          <div className="next-team-name">{next.homeTeam}</div>
        </div>

        <div className="vs-block">
          <span className="vs-text">VS</span>
          {diff > 0 && <span className="countdown-pill">⏳ {countdown}</span>}
        </div>

        <div className="next-team">
          <div className="next-flag">{getFlag(next.awayTeam)}</div>
          <div className="next-team-name">{next.awayTeam}</div>
        </div>
      </div>

      <div className="next-match-meta">
        <span>📅 {formatMatchDate(next.date)}</span>
        <span>⏰ {next.time}</span>
        {next.group && <span>🏟 Group {next.group}</span>}
      </div>
    </div>
  )
}

export default function FavoritesTab({ favorites, matches }) {
  return (
    <div className="tab-pane">
      <section className="section">
        <div className="section-title">⭐ My Teams</div>
        <div className="teams-grid">
          {favorites.map(team => (
            <div key={team} className="team-card">
              <div className="team-flag">{getFlag(team)}</div>
              <div className="team-card-name">{team}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">🔔 Next Match</div>
        <NextMatch matches={matches} />
      </section>
    </div>
  )
}
