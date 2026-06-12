#!/usr/bin/env node
// Fetches WC 2026 live data from football-data.org and writes public/data.json
// Runs in GitHub Actions before the Vite build step.

const https = require('https')
const fs    = require('fs')
const path  = require('path')

const API_KEY   = process.env.FOOTBALL_DATA_API_KEY || ''
const DATA_FILE = path.join(__dirname, '..', 'public', 'data.json')

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'X-Auth-Token': API_KEY } }, res => {
      let body = ''
      res.on('data', d => body += d)
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${body}`))
        resolve(JSON.parse(body))
      })
    }).on('error', reject)
  })
}

const STATUS_MAP = {
  TIMED: 'upcoming', SCHEDULED: 'upcoming',
  LIVE: 'live', IN_PLAY: 'live', PAUSED: 'live',
  FINISHED: 'completed',
  SUSPENDED: 'upcoming', POSTPONED: 'upcoming', CANCELLED: 'cancelled',
}

function toIDT(utcIso) {
  // shift UTC to Israel Summer Time (UTC+3) and read back as ISO string
  const d = new Date(new Date(utcIso).getTime() + 3 * 60 * 60 * 1000)
  return d.toISOString()
}

function parseMatch(m, idx) {
  const idt = toIDT(m.utcDate)
  return {
    id: m.id ?? idx + 1,
    homeTeam: m.homeTeam?.shortName || m.homeTeam?.name || 'TBA',
    awayTeam: m.awayTeam?.shortName || m.awayTeam?.name || 'TBA',
    homeScore: m.score?.fullTime?.home ?? null,
    awayScore: m.score?.fullTime?.away ?? null,
    status: STATUS_MAP[m.status] || 'upcoming',
    date: idt.split('T')[0],
    time: idt.split('T')[1].substring(0, 5),
    group: (m.group || '').replace('GROUP_', ''),
    stage: m.stage || 'GROUP_STAGE',
    matchday: m.matchday,
    venue: m.venue || null,
  }
}

function generateStandings(matches) {
  const stats = {}
  for (const m of matches) {
    const g = m.group
    if (!g) continue
    for (const team of [m.homeTeam, m.awayTeam]) {
      if (!stats[team]) stats[team] = { team, group: g, played: 0, wins: 0, draws: 0, losses: 0, points: 0, gf: 0, ga: 0 }
    }
  }
  for (const m of matches.filter(m => m.status === 'completed')) {
    const h = stats[m.homeTeam], a = stats[m.awayTeam]
    if (!h || !a || m.homeScore === null) continue
    h.played++; a.played++
    h.gf += m.homeScore; h.ga += m.awayScore
    a.gf += m.awayScore; a.ga += m.homeScore
    if (m.homeScore > m.awayScore)      { h.wins++; h.points += 3; a.losses++ }
    else if (m.homeScore < m.awayScore) { a.wins++; a.points += 3; h.losses++ }
    else                                { h.draws++; a.draws++; h.points++; a.points++ }
  }
  const groups = {}
  for (const s of Object.values(stats)) {
    if (!groups[s.group]) groups[s.group] = []
    groups[s.group].push(s)
  }
  for (const g of Object.keys(groups)) {
    groups[g].sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf)
  }
  return groups
}

async function main() {
  console.log('Fetching WC 2026 data from football-data.org...')

  const existing = fs.existsSync(DATA_FILE)
    ? JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    : { favorites: ['Argentina', 'Spain', 'USA'], knockout: [[], [], [], []] }

  const data = await get('https://api.football-data.org/v4/competitions/WC/matches')
  const matches = data.matches.map(parseMatch)
  console.log(`Fetched ${matches.length} matches`)

  const output = {
    lastUpdated: new Date().toISOString(),
    favorites: existing.favorites || ['Argentina', 'Spain', 'USA'],
    matches,
    standings: generateStandings(matches),
    knockout: existing.knockout || [[], [], [], []],
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(output, null, 2))
  console.log(`Written to ${DATA_FILE}`)
  console.log(`  Completed: ${matches.filter(m => m.status === 'completed').length}`)
  console.log(`  Live:      ${matches.filter(m => m.status === 'live').length}`)
  console.log(`  Upcoming:  ${matches.filter(m => m.status === 'upcoming').length}`)
}

main().catch(err => { console.error(err.message); process.exit(1) })
