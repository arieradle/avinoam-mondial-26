import { getFlag } from '../utils'

export default function MatchItem({ match }) {
  const { homeTeam, awayTeam, homeScore, awayScore, status, time } = match
  const hasScore = homeScore !== null && homeScore !== undefined

  const badge =
    status === 'live'      ? <span className="badge badge-live">● Live</span> :
    status === 'completed' ? <span className="badge badge-completed">FT</span> :
                             <span className="badge badge-upcoming">Soon</span>

  return (
    <div className={`match-item ${status}`}>
      <div className="match-team home">
        <span className="match-name">{homeTeam}</span>
        <span className="match-flag">{getFlag(homeTeam)}</span>
      </div>

      <div className="match-center">
        <div className={`match-scoreline${hasScore ? '' : ' pending'}`}>
          {hasScore ? `${homeScore} – ${awayScore}` : '–'}
        </div>
        <div className="match-meta">
          {badge}
          <span className="match-time-label">{time} IDT</span>
        </div>
      </div>

      <div className="match-team away">
        <span className="match-flag">{getFlag(awayTeam)}</span>
        <span className="match-name">{awayTeam}</span>
      </div>
    </div>
  )
}
