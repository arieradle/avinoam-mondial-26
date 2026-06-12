import MatchItem from './MatchItem'

export default function ResultsTab({ matches }) {
  const completed = [...matches]
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
    .slice(0, 10)

  return (
    <div className="tab-pane">
      <section className="section">
        <div className="section-title">📊 Recent Results</div>
        {completed.length === 0 ? (
          <div className="empty-state empty-results">No results yet</div>
        ) : (
          <div className="matches-list">
            {completed.map(m => <MatchItem key={m.id} match={m} />)}
          </div>
        )}
      </section>
    </div>
  )
}
