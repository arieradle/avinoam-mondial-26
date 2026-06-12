import { getFlag } from '../utils'

const ROUNDS = [
  { label: 'Round of 16' },
  { label: 'Quarterfinals' },
  { label: 'Semifinals' },
  { label: 'Final' },
]

function BracketMatch({ match }) {
  if (!match) {
    return (
      <div className="bracket-match empty">
        <div className="bracket-team">
          <span className="bracket-team-name">TBD</span>
          <span className="bracket-score empty">–</span>
        </div>
        <div className="bracket-team">
          <span className="bracket-team-name">TBD</span>
          <span className="bracket-score empty">–</span>
        </div>
      </div>
    )
  }

  const teams = [
    { name: match.homeTeam, score: match.homeScore },
    { name: match.awayTeam, score: match.awayScore },
  ]

  return (
    <div className="bracket-match">
      {teams.map(({ name, score }) => (
        <div key={name} className={`bracket-team${match.winner === name ? ' winner' : ''}`}>
          <span className="bracket-team-name">{getFlag(name)} {name}</span>
          <span className={`bracket-score${score === null || score === undefined ? ' empty' : ''}`}>
            {score !== null && score !== undefined ? score : '–'}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function KnockoutTab({ knockout }) {
  const hasData = knockout.some(r => r?.length > 0)

  return (
    <div className="tab-pane">
      <section className="section">
        <div className="section-title">🎖️ Knockout Bracket</div>

        <div className="bracket-container">
          <div className="bracket">
            {ROUNDS.map(({ label }, idx) => {
              const roundMatches = knockout[idx] ?? []
              return (
                <div key={label} className="round">
                  <div className="round-label">{label}</div>
                  <div className="matches-bracket">
                    {roundMatches.length > 0
                      ? roundMatches.map((m, i) => <BracketMatch key={i} match={m} />)
                      : <BracketMatch match={null} />
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {!hasData && (
          <div className="knockout-status">
            Knockout stages begin after group play completes — check back soon!
          </div>
        )}
      </section>
    </div>
  )
}
