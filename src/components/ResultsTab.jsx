import MatchItem from './MatchItem'

export default function ResultsTab({ matches }) {
  const completed = [...matches]
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
    .slice(0, 10)

  return (
    <div className="tab-pane">
      <section className="section">
        <h2>📊 RECENT RESULTS</h2>
        {completed.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center' }}>No results yet</p>
        ) : (
          <div className="matches-list">
            {completed.map(m => <MatchItem key={m.id} match={m} />)}
          </div>
        )}
      </section>
    </div>
  )
}
