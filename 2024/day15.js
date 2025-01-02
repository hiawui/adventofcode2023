import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  const [mapInput, moveInpput] = input
    .split(/\n{2,}/)
    .filter((l) => l.length > 0)
  const map = []
  const robot = [-1, -1]
  mapInput
    .split('\n')
    .filter((l) => l.length > 0)
    .forEach((line) => {
      const row = []
      for (const c of line) {
        if (c === '@') {
          robot[0] = map.length
          robot[1] = row.length
        }
        row.push(c)
      }
      map.push(row)
    })
  const move = []
  moveInpput
    .split('\n')
    .filter((l) => l.length > 0)
    .forEach((line) => {
      for (const c of line) {
        move.push(c)
      }
    })
  return [map, robot, move]
}

const parseInput2 = (input) => {
  const [mapInput, moveInpput] = input
    .split(/\n{2,}/)
    .filter((l) => l.length > 0)
  const map = []
  const robot = [-1, -1]
  mapInput
    .split('\n')
    .filter((l) => l.length > 0)
    .forEach((line) => {
      const row = []
      for (const c of line) {
        if (c === '#') {
          row.push('#')
          row.push('#')
        } else if (c === 'O') {
          row.push('[')
          row.push(']')
        } else if (c === '.') {
          row.push('.')
          row.push('.')
        } else if (c === '@') {
          robot[0] = map.length
          robot[1] = row.length
          row.push(c)
          row.push('.')
        }
      }
      map.push(row)
    })
  const move = []
  moveInpput
    .split('\n')
    .filter((l) => l.length > 0)
    .forEach((line) => {
      for (const c of line) {
        move.push(c)
      }
    })
  return [map, robot, move]
}

const directions = {
  '>': [0, 1],
  v: [1, 0],
  '<': [0, -1],
  '^': [-1, 0],
}

const getGrid = (map, [r, c]) => {
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

const applyMove = (map, pos, move) => {
  const grid = getGrid(map, pos)
  if (grid === null || grid === '#') {
    return false
  }
  if (grid === '.') {
    return true
  }
  const [dr, dc] = directions[move]
  const [r, c] = pos
  const [nr, nc] = [r + dr, c + dc]
  if (applyMove(map, [nr, nc], move)) {
    map[nr][nc] = grid
    map[r][c] = '.'
    return true
  }
  return false
}

const applyMove2 = (map, r, cmap, move) => {
  const ncmap = {}
  for (const c of Object.values(cmap)) {
    const grid = getGrid(map, [r, c])
    if (grid === null || grid === '#') {
      return false
    }
    if (grid === '.') {
      continue
    }
    ncmap[c] = c
    if (move === '^' || move === 'v') {
      if (grid === '[') {
        ncmap[c + 1] = c + 1
      } else if (grid === ']') {
        ncmap[c - 1] = c - 1
      }
    }
  }
  if (Object.keys(ncmap).length === 0) {
    return true
  }
  const [dr, dc] = directions[move]
  if (
    applyMove2(
      map,
      r + dr,
      Object.values(ncmap).map((c) => c + dc),
      move
    )
  ) {
    Object.values(ncmap).forEach((nc) => {
      map[r + dr][nc + dc] = map[r][nc]
      map[r][nc] = '.'
    })
    return true
  }
  return false
}

runWithInput(
  // part 1
  async (input) => {
    const [map, robot, move] = parseInput(input)
    move.forEach((m) => {
      if (applyMove(map, robot, m)) {
        const [dr, dc] = directions[m]
        robot[0] += dr
        robot[1] += dc
      }
    })
    let result = 0
    for (let i = 0; i < map.length; ++i) {
      const row = map[i]
      for (let j = 0; j < row.length; ++j) {
        if (row[j] === 'O') {
          result += i * 100 + j
        }
      }
    }
    return result
  },
  // part 2
  async (input) => {
    const [map, robot, move] = parseInput2(input)
    move.forEach((m) => {
      const [r, c] = robot
      if (applyMove2(map, r, { [c]: c }, m)) {
        const [dr, dc] = directions[m]
        robot[0] += dr
        robot[1] += dc
      }
      //   console.log(`\n${m}\n${map.map((r) => r.join('')).join('\n')}`)
    })
    let result = 0
    for (let i = 0; i < map.length; ++i) {
      const row = map[i]
      for (let j = 0; j < row.length; ++j) {
        if (row[j] === '[') {
          result += i * 100 + j
        }
      }
    }
    return result
  },
  2024,
  15
)
