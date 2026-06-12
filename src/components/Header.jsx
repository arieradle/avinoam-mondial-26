import { formatLastUpdated } from '../utils'

export default function Header({ lastUpdated }) {
  return (
    <header className="header">
      <h1>🌍 WORLD CUP 2026 TRACKER</h1>
      <p className="subtitle">Follow Your Favorite Teams!</p>
      <div className="last-updated">
        Last updated: <span>{lastUpdated ? formatLastUpdated(lastUpdated) : 'Loading...'}</span>
      </div>
    </header>
  )
}
