import { useState, useEffect } from 'react'
import Header from './components/Header'
import FavoritesTab from './components/FavoritesTab'
import MatchesTab from './components/MatchesTab'
import ResultsTab from './components/ResultsTab'
import StandingsTab from './components/StandingsTab'
import KnockoutTab from './components/KnockoutTab'

const TABS = [
  { id: 'favorites', label: '⭐ Favorites' },
  { id: 'matches',   label: '📅 Matches' },
  { id: 'results',   label: '📊 Results' },
  { id: 'standings', label: '🏆 Standings' },
  { id: 'knockout',  label: '🎖️ Knockout' },
]

export default function App() {
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState('favorites')
  const [currentGroup, setCurrentGroup] = useState('A')

  async function fetchData() {
    try {
      const res = await fetch(import.meta.env.BASE_URL + 'data.json')
      if (!res.ok) throw new Error('fetch failed')
      setData(await res.json())
    } catch (err) {
      console.error('Failed to load data:', err)
    }
  }

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  if (!data) return <div className="loading">Loading World Cup data...</div>

  return (
    <div className="container">
      <Header lastUpdated={data.lastUpdated} />

      <nav className="tabs-container">
        <div className="tabs-buttons">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="tabs-content">
        {activeTab === 'favorites' && (
          <FavoritesTab favorites={data.favorites} matches={data.matches} />
        )}
        {activeTab === 'matches' && (
          <MatchesTab matches={data.matches} />
        )}
        {activeTab === 'results' && (
          <ResultsTab matches={data.matches} />
        )}
        {activeTab === 'standings' && (
          <StandingsTab
            standings={data.standings}
            currentGroup={currentGroup}
            setCurrentGroup={setCurrentGroup}
          />
        )}
        {activeTab === 'knockout' && (
          <KnockoutTab knockout={data.knockout ?? []} />
        )}
      </div>

      <footer className="footer">
        <p>⏰ Results updated automatically at 6:00 AM & 2:00 PM Israel Time</p>
        <p>🏆 FIFA World Cup 2026</p>
      </footer>
    </div>
  )
}
