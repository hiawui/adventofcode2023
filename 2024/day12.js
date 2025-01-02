import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  const map = {}
  let rowNo = 0
  let colNo = 0
  input
    .split('\n')
    .filter((l) => l.length > 0)
    .forEach((line) => {
      colNo = 0
      for (const c of line) {
        map[`${rowNo},${colNo}`] = {
          type: c,
          pos: [rowNo, colNo],
        }
        colNo++
      }
      rowNo++
    })
  return map
}

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

const searchRegion = (map, type, region, pos) => {
  const [r, c] = pos
  const key = `${r},${c}`
  if (key in region) {
    return 0
  }
  const grid = map[key]
  if (!grid || grid.type !== type) {
    return 1
  }
  region[key] = grid
  let count = 0
  for (const [dr, dc] of directions) {
    count += searchRegion(map, type, region, [r + dr, c + dc])
  }
  return count
}

const testPos = (region, pos) => {
  const [r, c] = pos
  const up = `${r - 1},${c}` in region
  const upRight = `${r - 1},${c + 1}` in region
  const right = `${r},${c + 1}` in region
  const rightDown = `${r + 1},${c + 1}` in region
  const down = `${r + 1},${c}` in region
  const downLeft = `${r + 1},${c - 1}` in region
  const left = `${r},${c - 1}` in region
  const leftUp = `${r - 1},${c - 1}` in region
  let count = 0
  if (!up && !right) {
    count++
  }
  if (up && right && !upRight) {
    count++
  }
  if (!right && !down) {
    count++
  }
  if (right && down && !rightDown) {
    count++
  }
  if (!down && !left) {
    count++
  }
  if (down && left && !downLeft) {
    count++
  }
  if (!left && !up) {
    count++
  }
  if (left && up && !leftUp) {
    count++
  }
  return count
}

const countSides = (region) => {
  let count = 0
  for (const grid of Object.values(region)) {
    count += testPos(region, grid.pos)
  }
  return count
}

runWithInput(
  // part 1
  async (input) => {
    const map = parseInput(input)
    let result = 0
    while (true) {
      const values = Object.values(map)
      if (values.length === 0) {
        break
      }
      const grid = values[0]
      const region = {}
      const fc = searchRegion(map, grid.type, region, grid.pos)
      result += fc * Object.keys(region).length
      for (const k in region) {
        delete map[k]
      }
    }
    return result
  },
  // part 2
  async (input) => {
    const map = parseInput(input)
    let result = 0
    while (true) {
      const values = Object.values(map)
      if (values.length === 0) {
        break
      }
      const grid = values[0]
      const region = {}
      searchRegion(map, grid.type, region, grid.pos)
      const rc = Object.keys(region).length
      const sc = countSides(region)
      result += rc * sc
      for (const k in region) {
        delete map[k]
      }
    }
    return result
  },
  2024,
  12
)
