import { runWithInput } from '../common/input.js'

const boards = [
  {
    name: 'number',
    map: [
      ['7', '8', '9'],
      ['4', '5', '6'],
      ['1', '2', '3'],
      [undefined, '0', 'A'],
    ],
    reverse: {},
  },
  {
    name: 'dir',
    map: [
      [undefined, '^', 'A'],
      ['<', 'v', '>'],
    ],
    reverse: {},
  },
]

boards.forEach((board) => {
  board.map.forEach((row, r) => {
    row.forEach((b, c) => {
      if (b === undefined) {
        return
      }
      board.reverse[b] = [r, c]
    })
  })
})

const directions = [
  [0, 1, '>'],
  [1, 0, 'v'],
  [0, -1, '<'],
  [-1, 0, '^'],
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

const findActionOnboard = (boardi, startpos, endpos) => {
  const map = boards[boardi].map
  const [sr, sc] = startpos
  const [er, ec] = endpos
  if (getGrid(map, sr, sc) === null || getGrid(map, er, ec) === null) {
    return []
  }
  if (sr === er && sc === ec) {
    return [['A']]
  }
  const paths = []
  const dr0 = er > sr ? 1 : er < sr ? -1 : 0
  const dc0 = ec > sc ? 1 : ec < sc ? -1 : 0
  for (const [dr, dc, s] of directions) {
    if ((Math.abs(dr) > 0 && dr === dr0) || (Math.abs(dc) > 0 && dc === dc0)) {
      findActionOnboard(boardi, [sr + dr, sc + dc], endpos).forEach((path) => {
        paths.push([s, ...path])
      })
    }
  }
  return paths
}

const dircache = {}
const findDirboardActions = (fr, to, depth) => {
  const k = `${fr},${to},${depth}`
  const res = dircache[k]
  if (res != undefined) {
    return res
  }
  const reverse = boards[1].reverse
  const paths = findActionOnboard(1, reverse[fr], reverse[to])
  if (depth === 0) {
    const res = paths.reduce(
      (a, b) => Math.min(a, b.length),
      Number.POSITIVE_INFINITY
    )
    dircache[k] = res
    return res
  }
  let min = Number.POSITIVE_INFINITY
  paths.forEach((path) => {
    const len = findDirboardSeqActions(path, depth - 1)
    min = Math.min(min, len)
  })
  dircache[k] = min
  return min
}

const findDirboardSeqActions = (seq, depth) => {
  const btns = ['A', ...seq]
  let len = 0
  for (let i = 0; i < btns.length - 1; ++i) {
    const fr = btns[i]
    const to = btns[i + 1]
    len += findDirboardActions(fr, to, depth)
  }
  return len
}

const findNumberboardActions = (seq, depth) => {
  const reverse = boards[0].reverse
  const btns = ['A', ...seq]
  let result = 0
  for (let i = 0; i < btns.length - 1; ++i) {
    const fr = btns[i]
    const to = btns[i + 1]
    let min = Number.POSITIVE_INFINITY
    findActionOnboard(0, reverse[fr], reverse[to]).forEach((path) => {
      const len = findDirboardSeqActions(path, depth)
      min = Math.min(min, len)
    })
    result += min
  }
  return result
}

const parseInput = (input) => {
  return input.split('\n').filter((v) => v.length > 0)
}

runWithInput(
  // part 1
  async (input) => {
    let result = 0
    parseInput(input).forEach((seq) => {
      const min = findNumberboardActions(seq, 1)
      result += Number(seq.slice(0, 3)) * min
    })
    return result
  },
  // part 2
  async (input) => {
    let result = 0
    parseInput(input).forEach((seq) => {
      const min = findNumberboardActions(seq, 24)
      result += Number(seq.slice(0, 3)) * min
    })
    return result
  },
  2024,
  21
)
