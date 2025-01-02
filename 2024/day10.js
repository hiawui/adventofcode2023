import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  const map = []
  const zeros = []
  input
    .split('\n')
    .filter((l) => l.length > 0)
    .forEach((line) => {
      const row = []
      for (const c of line) {
        const v = Number(c)
        if (v === 0) {
          zeros.push([map.length, row.length])
        }
        row.push(v)
      }
      map.push(row)
    })
  return [map, zeros]
}

const findTrail = (map, pos, last, tails) => {
  const [r, c] = pos
  if (r < 0 || r >= map.length || c < 0 || c >= map[0].length) {
    return 0
  }
  const v = map[r][c]
  if (v - last != 1) {
    return 0
  }
  if (v === 9) {
    tails[`${r},${c}`] = 1
    return 1
  }
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]
  let succ = 0
  for (const [dr, dc] of directions) {
    succ += findTrail(map, [r + dr, c + dc], v, tails)
  }
  return succ
}

runWithInput(
  // part 1
  async (input) => {
    const [map, zeros] = parseInput(input)
    let result = 0
    for (const pos of zeros) {
      const tails = {}
      findTrail(map, pos, -1, tails)
      result += Object.keys(tails).length
    }
    return result
  },
  // part 2
  async (input) => {
    const [map, zeros] = parseInput(input)
    let result = 0
    for (const pos of zeros) {
      const tails = {}
      result += findTrail(map, pos, -1, tails)
    }
    return result
  },
  2024,
  10
)
