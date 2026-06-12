const FLAGS = {
  Argentina: '🇦🇷', Spain: '🇪🇸', USA: '🇺🇸', Brazil: '🇧🇷',
  Germany: '🇩🇪', France: '🇫🇷', Portugal: '🇵🇹', Poland: '🇵🇱',
  Mexico: '🇲🇽', Canada: '🇨🇦', Morocco: '🇲🇦', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  Netherlands: '🇳🇱', Italy: '🇮🇹', Japan: '🇯🇵', Australia: '🇦🇺',
}

export function getFlag(team) {
  return FLAGS[team] ?? '🏳️'
}

export function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

export function formatLastUpdated(ts) {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export function formatMatchDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  })
}
