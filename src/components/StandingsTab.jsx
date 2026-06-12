import { getFlag } from '../utils'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

export default function StandingsTab({ standings, currentGroup, setCurrentGroup }) {
  const availableGroups = GROUPS.filter(g => standings[g]?.length > 0)
  const groupData = standings[currentGroup] ?? []

  return (
    <div className="tab-pane">
      <section className="section">
        <h2>🏆 GROUP STANDINGS</h2>

        <div className="group-tabs">
          {availableGroups.map(g => (
            <button
              key={g}
              className={`group-btn${currentGroup === g ? ' active' : ''}`}
              onClick={() => setCurrentGroup(g)}
            >
              Group {g}
            </button>
          ))}
        </div>

        {groupData.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center' }}>No standings data for Group {currentGroup}</p>
        ) : (
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
              {groupData.map((team, i) => (
                <tr key={team.team}>
                  <td><strong>{i + 1}</strong></td>
                  <td><strong>{getFlag(team.team)} {team.team}</strong></td>
                  <td>{team.played}</td>
                  <td>{team.wins}</td>
                  <td>{team.draws}</td>
                  <td>{team.losses}</td>
                  <td><strong>{team.points}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
