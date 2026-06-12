import { formatLastUpdated } from '../utils'

export default function Header({ lastUpdated }) {
  return (
    <header className="header">
      <div className="header-badge">⚽ Live Tournament</div>
      <h1>WORLD CUP <span>2026</span></h1>
      <p className="subtitle">Track every match, every goal, every moment</p>
      <div className="last-updated">
        Updated {lastUpdated ? formatLastUpdated(lastUpdated) : '…'}
      </div>
    </header>
  )
}
