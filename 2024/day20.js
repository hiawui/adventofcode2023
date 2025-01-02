import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  const map = []
  const startpos = [-1, -1]
  const endpos = [-1, -1]
  input
    .split('\n')
    .filter((l) => l.length)
    .forEach((line) => {
      const row = []
      for (const c of line) {
        let ds = Number.POSITIVE_INFINITY
        let de = Number.POSITIVE_INFINITY
        if (c === 'S') {
          startpos[0] = map.length
          startpos[1] = row.length
          ds = 0
        } else if (c === 'E') {
          endpos[0] = map.length
          endpos[1] = row.length
          de = 0
        }
        row.push({
          t: c,
          p: [map.length, row.length],
          ds,
          de,
        })
      }
      map.push(row)
    })
  return [map, startpos, endpos]
}

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

const getGrid = (map, r, c) => {
  const row = map[r]
  if (row === undefined) {
    return null
  }
  const grid = row[c]
  if (grid === undefined) {
    return null
  }
  return grid
}

const findShortest = (map, pos, dprop) => {
  const [r, c] = pos
  let updated = {
    [`${r},${c}`]: [r, c],
  }
  do {
    const newUpdated = {}
    for (const [r, c] of Object.values(updated)) {
      const grid = getGrid(map, r, c)
      for (const [dr, dc] of directions) {
        const [nr, nc] = [r + dr, c + dc]
        const ngrid = getGrid(map, nr, nc)
        if (ngrid === null || ngrid.t === '#') {
          continue
        }
        if (ngrid[dprop] > grid[dprop] + 1) {
          ngrid[dprop] = grid[dprop] + 1
          newUpdated[`${nr},${nc}`] = [nr, nc]
        }
      }
    }
    updated = newUpdated
  } while (Object.keys(updated).length > 0)
}

const findCheat0 = (map, shortest, maxstep, startgrid, cheats) => {
  const [r0, c0] = startgrid.p
  for (let dr = -maxstep; dr <= maxstep; ++dr) {
    const maxdc = maxstep - Math.abs(dr)
    for (let dc = -maxdc; dc <= maxdc; ++dc) {
      const step = Math.abs(dr) + Math.abs(dc)
      if (step < 2) {
        continue
      }
      const tgrid = getGrid(map, r0 + dr, c0 + dc)
      if (tgrid === null || tgrid.t === '#') {
        continue
      }
      const saved = shortest - (startgrid.ds + step + tgrid.de)
      if (saved > 0) {
        cheats.push(saved)
      }
    }
  }
}

const findNCheat = (map, shortest, maxstep) => {
  let cheats = []
  map.forEach((row) => {
    row.forEach((grid) => {
      if (grid.t === '#') {
        return
      }
      findCheat0(map, shortest, maxstep, grid, cheats)
    })
  })
  return cheats
}

runWithInput(
  // part 1
  async (input) => {
    const [map, startpos, endpos] = parseInput(input)
    findShortest(map, startpos, 'ds')
    findShortest(map, endpos, 'de')
    const shortest = map[endpos[0]][endpos[1]].ds
    const cheats = findNCheat(map, shortest, 2)
    return cheats.filter((v) => v >= 100).length
  },
  // part 2
  async (input) => {
    const [map, startpos, endpos] = parseInput(input)
    findShortest(map, startpos, 'ds')
    findShortest(map, endpos, 'de')
    const shortest = map[endpos[0]][endpos[1]].ds
    const cheats = findNCheat(map, shortest, 20)
    return cheats.filter((v) => v >= 100).length
  },
  2024,
  20
)
