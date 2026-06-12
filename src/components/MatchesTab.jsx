import MatchItem from './MatchItem'
import { getTodayDate } from '../utils'

export default function MatchesTab({ matches }) {
  const today = getTodayDate()
  const todayMatches = matches.filter(m => m.date === today)

  return (
    <div className="tab-pane">
      <section className="section">
        <div className="section-title">📅 Today's Matches</div>
        {todayMatches.length === 0 ? (
          <div className="empty-state empty-today">No matches today</div>
        ) : (
          <div className="matches-list">
            {todayMatches.map(m => <MatchItem key={m.id} match={m} />)}
          </div>
        )}
      </section>
    </div>
  )
}
