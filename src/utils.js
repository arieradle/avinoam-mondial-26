const FLAGS = {
  // Group stage teams (using API shortName values)
  Argentina: '🇦🇷',   Spain: '🇪🇸',        USA: '🇺🇸',         Brazil: '🇧🇷',
  Germany: '🇩🇪',     France: '🇫🇷',        Portugal: '🇵🇹',    Poland: '🇵🇱',
  Mexico: '🇲🇽',      Canada: '🇨🇦',        Morocco: '🇲🇦',     England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  Netherlands: '🇳🇱', Japan: '🇯🇵',         Australia: '🇦🇺',   Italy: '🇮🇹',
  Algeria: '🇩🇿',     Austria: '🇦🇹',       Belgium: '🇧🇪',     'Bosnia-H.': '🇧🇦',
  'Cape Verde': '🇨🇻','Colombia': '🇨🇴',    'Congo DR': '🇨🇩',  Croatia: '🇭🇷',
  'Curaçao': '🇨🇼',   Czechia: '🇨🇿',       Ecuador: '🇪🇨',     Egypt: '🇪🇬',
  Ghana: '🇬🇭',       Haiti: '🇭🇹',         Iran: '🇮🇷',        Iraq: '🇮🇶',
  'Ivory Coast': '🇨🇮', Jordan: '🇯🇴',      'Korea Republic': '🇰🇷', 'New Zealand': '🇳🇿',
  Norway: '🇳🇴',      Panama: '🇵🇦',        Paraguay: '🇵🇾',    Qatar: '🇶🇦',
  'Saudi Arabia': '🇸🇦', Scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', Senegal: '🇸🇳', 'South Africa': '🇿🇦',
  Sweden: '🇸🇪',      Switzerland: '🇨🇭',   Tunisia: '🇹🇳',     Turkey: '🇹🇷',
  Ukraine: '🇺🇦',     Uruguay: '🇺🇾',       Uzbekistan: '🇺🇿',  'New Caledonia': '🇳🇨',
}

export function getFlag(team) {
  return FLAGS[team] ?? '🏳️'
}

export function getTodayDate() {
  // 'en-CA' produces YYYY-MM-DD format
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jerusalem' })
}

export function formatLastUpdated(ts) {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZone: 'Asia/Jerusalem',
  }) + ' IDT'
}

export function formatMatchDate(dateStr) {
  // dateStr is already the IDT calendar date ("YYYY-MM-DD")
  return new Date(dateStr + 'T12:00:00+03:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
    timeZone: 'Asia/Jerusalem',
  })
}
