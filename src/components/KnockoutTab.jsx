import { getFlag } from '../utils'

const ROUNDS = [
  { id: 'r16',   label: 'Round of 16' },
  { id: 'qf',    label: 'Quarterfinals' },
  { id: 'sf',    label: 'Semifinals' },
  { id: 'final', label: 'Final' },
]

function BracketMatch({ match }) {
  if (!match) {
    return (
      <div className="bracket-match empty">
        <div className="bracket-team"><span>TBD</span></div>
      </div>
    )
  }

  return (
    <div className={`bracket-match${match.winner ? ' played' : ''}`}>
      {[
        { name: match.homeTeam, score: match.homeScore },
        { name: match.awayTeam, score: match.awayScore },
      ].map(({ name, score }) => (
        <div key={name} className={`bracket-team${match.winner === name ? ' winner' : ''}`}>
          <span className="bracket-team-name">{getFlag(name)} {name}</span>
          <span className={`bracket-score${score === null || score === undefined ? ' empty' : ''}`}>
            {score !== null && score !== undefined ? score : '-'}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function KnockoutTab({ knockout }) {
  const hasData = knockout.some(round => round?.length > 0)

  return (
    <div className="tab-pane">
      <section className="section">
        <h2>🎖️ KNOCKOUT STAGES</h2>

        <div className="bracket-container">
          <div className="bracket">
            {ROUNDS.map(({ id, label }, idx) => {
              const roundMatches = knockout[idx] ?? []
              return (
                <div key={id} className="round">
                  <h3>{label}</h3>
                  <div className="matches-bracket">
                    {roundMatches.length > 0
                      ? roundMatches.map((match, i) => <BracketMatch key={i} match={match} />)
                      : <BracketMatch match={null} />
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {!hasData && (
          <p className="knockout-status">
            🕐 Knockout stages begin after group play completes
          </p>
        )}
      </section>
    </div>
  )
}
