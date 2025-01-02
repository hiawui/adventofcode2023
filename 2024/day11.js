import { runWithInput } from '../common/input.js'

const addNumber = (map, number, count) => {
  if (number in map) {
    map[number] += count
  } else {
    map[number] = count
  }
}

const parseInput = (input) => {
  const map = {}
  input.split(/[ ]+/).map((v) => {
    const n = Number(v)
    addNumber(map, n, 1)
  })
  return map
}

const transform = (map) => {
  const result = {}
  for (const [n, c] of Object.entries(map)) {
    const v = Number(n)
    if (n === '0') {
      addNumber(result, 1, c)
      continue
    }
    if (n.length % 2 === 0) {
      const mid = n.length / 2
      addNumber(result, Number(n.slice(0, mid)), c)
      addNumber(result, Number(n.slice(mid)), c)
      continue
    }
    addNumber(result, Number(v * 2024), c)
  }
  return result
}

runWithInput(
  // part 1
  async (input) => {
    let map = parseInput(input)
    for (let i = 0; i < 25; ++i) {
      map = transform(map)
    }
    return Object.values(map).reduce((a, b) => a + b, 0)
  },
  // part 2
  async (input) => {
    let map = parseInput(input)
    for (let i = 0; i < 75; ++i) {
      map = transform(map)
    }
    return Object.values(map).reduce((a, b) => a + b, 0)
  },
  2024,
  11
)
