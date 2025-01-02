import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  const map = {}
  input
    .split('\n')
    .filter((l) => l.length)
    .forEach((line) => {
      const [a, b] = line.split('-')
      map[a] = map[a] || []
      map[a].push(b)
      map[b] = map[b] || []
      map[b].push(a)
    })
  return map
}

const findTriset = (map) => {
  const sets = {}
  for (const [a, nodes] of Object.entries(map)) {
    if (!a.startsWith('t')) {
      continue
    }
    for (let i = 0; i < nodes.length - 1; ++i) {
      const b = nodes[i]
      const blinks = map[b]
      for (let j = i + 1; j < nodes.length; ++j) {
        const c = nodes[j]
        if (!blinks.includes(c)) {
          continue
        }
        const k = [a, b, c].sort().join('')
        sets[k] = [a, b, c]
      }
    }
  }
  return sets
}

const isFullConnected = (map, list) => {
  for (let i = 0; i < list.length - 1; ++i) {
    const a = list[i]
    const alinks = map[a]
    for (let j = i + 1; j < list.length; ++j) {
      const b = list[j]
      if (!alinks.includes(b)) {
        return false
      }
    }
  }
  return true
}

const findFullConnected = (map) => {
  const results = {}
  for (const [k, nodes] of Object.entries(map)) {
    const list = [k, ...nodes].sort()
    do {
      const listk = list.join(',')
      if (listk in results) {
        break
      }
      let minConnCnt = list.length
      let minConnIdx = -1
      for (let i = 0; i < list.length; ++i) {
        const c = list[i]
        const clinks = map[c]
        const connCnt = list.reduce(
          (a, b) => (clinks.includes(b) ? a + 1 : a),
          1
        )
        if (connCnt < minConnCnt) {
          minConnCnt = connCnt
          minConnIdx = i
        }
      }
      if (minConnCnt === list.length) {
        results[listk] = listk
        break
      }
      results[listk] = ''
      list.splice(minConnIdx, 1)
    } while (list.length > 0)
  }
  return Object.values(results).filter((v) => v.length > 0)
}

runWithInput(
  // part 1
  async (input) => {
    const map = parseInput(input)
    const set = findTriset(map)
    return Object.keys(set).length
  },
  // part 2
  async (input) => {
    const map = parseInput(input)
    const list = findFullConnected(map)
    list.sort((a, b) => b.length - a.length)
    return list[0]
  },
  2024,
  23
)
