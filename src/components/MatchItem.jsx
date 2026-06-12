import { getFlag } from '../utils'

export default function MatchItem({ match }) {
  const { homeTeam, awayTeam, homeScore, awayScore, status, time } = match
  const score = homeScore !== null && homeScore !== undefined
    ? `${homeScore} - ${awayScore}`
    : '-'
  const statusLabel = status === 'completed' ? '✓' : status === 'live' ? '🔴 LIVE' : '📅'

  return (
    <div className={`match-item ${status}`}>
      <div className="match-teams-info">
        <span className="team-name">{getFlag(homeTeam)} {homeTeam}</span>
        <span className="match-score">{score}</span>
        <span className="team-name">{awayTeam} {getFlag(awayTeam)}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span className={`match-status status-${status}`}>{statusLabel}</span>
        <span className="match-time">{time}</span>
      </div>
    </div>
  )
}
