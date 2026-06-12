import { getFlag } from '../utils'

const GROUPS = ['A','B','C','D','E','F','G','H','I']
const MEDALS = ['🥇','🥈','🥉']

export default function StandingsTab({ standings, currentGroup, setCurrentGroup }) {
  const available = GROUPS.filter(g => standings[g]?.length > 0)
  const rows = standings[currentGroup] ?? []

  return (
    <div className="tab-pane">
      <section className="section">
        <div className="section-title">🏆 Group Standings</div>

        <div className="group-tabs">
          {available.map(g => (
            <button
              key={g}
              className={`group-btn${currentGroup === g ? ' active' : ''}`}
              onClick={() => setCurrentGroup(g)}
            >
              Group {g}
            </button>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="empty-state">No data for Group {currentGroup}</div>
        ) : (
          <div className="standings-wrap">
            <table className="standings-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>P</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((team, i) => (
                  <tr key={team.team}>
                    <td><span className="rank">{MEDALS[i] ?? i + 1}</span></td>
                    <td>
                      <div className="team-cell">
                        {getFlag(team.team)} {team.team}
                      </div>
                    </td>
                    <td>{team.played}</td>
                    <td>{team.wins}</td>
                    <td>{team.draws}</td>
                    <td>{team.losses}</td>
                    <td><span className="pts">{team.points}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
