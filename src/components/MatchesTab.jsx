import MatchItem from './MatchItem'
import { getTodayDate } from '../utils'

export default function MatchesTab({ matches }) {
  const today = getTodayDate()
  const todayMatches = matches.filter(m => m.date === today)

  return (
    <div className="tab-pane">
      <section className="section">
        <h2>📅 TODAY'S MATCHES</h2>
        {todayMatches.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center' }}>No matches today</p>
        ) : (
          <div className="matches-list">
            {todayMatches.map(m => <MatchItem key={m.id} match={m} />)}
          </div>
        )}
      </section>
    </div>
  )
}
