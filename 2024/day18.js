import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  const bytes = []
  input
    .split('\n')
    .filter((l) => l.length > 0)
    .forEach((line) => {
      bytes.push(line.split(','))
    })
  return bytes
}

const createmap = (width, height) => {
  const map = []
  for (let r = 0; r < height; ++r) {
    const row = []
    for (let c = 0; c < width; ++c) {
      row.push({
        t: '.',
        d: Number.POSITIVE_INFINITY,
      })
    }
    map.push(row)
  }
  return map
}

const applyBytes = (map, bytes, cnt) => {
  for (let i = 0; i < cnt && i < bytes.length; ++i) {
    const [x, y] = bytes[i]
    map[y][x].t = '#'
  }
}

const getGrid = (map, x, y) => {
  const row = map[y]
  if (row === undefined) {
    return null
  }
  const grid = row[x]
  if (grid === undefined) {
    return null
  }
  return grid
}

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

const findShortest = (map) => {
  map[0][0].d = 0
  let updated = { [`0,0`]: [0, 0] }
  do {
    const newupdated = {}
    for (const [x, y] of Object.values(updated)) {
      const grid = getGrid(map, x, y)
      for (const [dx, dy] of directions) {
        const [nx, ny] = [x + dx, y + dy]
        const ngrid = getGrid(map, nx, ny)
        if (ngrid === null || ngrid.t === '#') {
          continue
        }
        if (ngrid.d > grid.d + 1) {
          ngrid.d = grid.d + 1
          newupdated[`${nx},${ny}`] = [nx, ny]
        }
      }
    }
    updated = newupdated
  } while (Object.keys(updated).length > 0)
  const height = map.length
  const width = map[0].length
  return map[height - 1][width - 1].d
}

runWithInput(
  // part 1
  async (input) => {
    const width = 71
    const height = 71
    const cnt = 1024
    const bytes = parseInput(input)
    const map = createmap(width, height)
    applyBytes(map, bytes, cnt)
    return findShortest(map)
  },
  // part 2
  async (input) => {
    const width = 71
    const height = 71
    const bytes = parseInput(input)
    for (let i = 1024; i < bytes.length; ++i) {
      const map = createmap(width, height)
      applyBytes(map, bytes, i + 1)
      const d = findShortest(map)
      if (d < Number.POSITIVE_INFINITY) {
        continue
      }
      return bytes[i].join(',')
    }
    return null
  },
  2024,
  18
)
