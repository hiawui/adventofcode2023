import { runWithInput } from '../common/input.js'

const directions = [
  [-1, 0, '^'],
  [0, 1, '>'],
  [1, 0, 'v'],
  [0, -1, '<'],
]

const clearGuardPath = (map) => {
  map.forEach((row) => row.forEach((grid) => (grid.d = {})))
}

const parseInput = (input) => {
  const map = []
  const gpos = [-1, -1]
  input.split('\n').forEach((line) => {
    if (!line) {
      return
    }
    const row = []
    for (const c of line) {
      if (c === '^') {
        gpos[0] = map.length
        gpos[1] = row.length
        row.push({
          v: '.',
          d: {},
        })
      } else {
        row.push({
          v: c,
          d: {},
        })
      }
    }
    map.push(row)
  })
  return [map, gpos]
}
const getGridStatus = (map, pos) => {
  const [r, c] = pos
  const row = map[r]
  if (row === undefined) {
    return null
  }
  const v = row[c]
  if (v === undefined) {
    return null
  }
  return v
}

const markPos = (map, pos, dir) => {
  const [r, c] = pos
  const row = map[r]
  if (row === undefined) {
    return -1
  }
  const grid = row[c]
  if (grid === undefined) {
    return -1
  }
  if (dir[2] in grid.d) {
    // loop
    return 1
  }
  grid.d[dir[2]] = 1
  return 0
}

const walk = (map, startPos, startDirIdx) => {
  const gpos = [...startPos]
  let gdirIdx = startDirIdx
  markPos(map, gpos, directions[gdirIdx])
  while (true) {
    let gdir = directions[gdirIdx]
    const gnpos = [gpos[0] + gdir[0], gpos[1] + gdir[1]]
    const s = getGridStatus(map, gnpos)
    if (s === null) {
      // out of map
      return -1
    }
    if (s.v === '#') {
      gdirIdx = (gdirIdx + 1) % directions.length
      gdir = directions[gdirIdx]
      if (1 === markPos(map, gpos, directions[gdirIdx])) {
        // loop
        return 1
      }
      continue
    }
    gpos[0] = gnpos[0]
    gpos[1] = gnpos[1]
    if (1 === markPos(map, gpos, gdir)) {
      // loop
      return 1
    }
  }
}

runWithInput(
  // part 1
  async (input) => {
    const [map, gpos] = parseInput(input)
    walk(map, gpos, 0)
    let count = 0
    for (const row of map) {
      for (const g of row) {
        if (Object.keys(g.d).length > 0) {
          count++
        }
      }
    }
    return count
  },
  // part 2
  async (input) => {
    const [map, gpos] = parseInput(input)
    const newMap = JSON.parse(JSON.stringify(map))
    walk(map, gpos, 0)
    let count = 0
    for (let ri = 0; ri < map.length; ++ri) {
      for (let ci = 0; ci < map[0].length; ++ci) {
        if (ri === gpos[0] && ci === gpos[1]) {
          continue
        }
        const d = map[ri][ci].d
        if (Object.keys(d).length === 0) {
          continue
        }
        newMap[ri][ci].v = '#'
        if (1 === walk(newMap, gpos, 0)) {
          count++
        }
        newMap[ri][ci].v = '.'
        clearGuardPath(newMap)
      }
    }
    return count
  },
  2024,
  6
)
