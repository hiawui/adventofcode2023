import { runWithInput } from '../common/input.js'

const parseInpput = (input) => {
  // startpos = [r, c]
  const startpos = [-1, -1]
  // endpos = [r, c]
  const endpos = [-1, -1]
  const map = []
  input
    .split('\n')
    .filter((l) => l.length > 0)
    .forEach((line) => {
      const row = []
      for (const c of line) {
        if (c === 'S') {
          startpos[0] = map.length
          startpos[1] = row.length
        } else if (c === 'E') {
          endpos[0] = map.length
          endpos[1] = row.length
        }
        row.push(c)
      }
      map.push(row)
    })
  return [map, startpos, endpos]
}

const directions = [
  [0, 1, '>'], // east
  [-1, 0, '^'], // north
  [0, -1, '<'], // west
  [1, 0, 'v'], // south
]

const getGrid = (map, pos) => {
  const [r, c] = pos
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

const findShortest = (map, startpos) => {
  const [r, c, d] = startpos
  const startk = `${r},${c},${d}`
  const dmap = { [startk]: [r, c, d, 0] }
  let updated = { [startk]: dmap[startk] }
  do {
    const newupdated = {}
    for (const [r, c, d, v] of Object.values(updated)) {
      // move forward
      const [dr, dc] = directions[d]
      const [nr, nc] = [r + dr, c + dc]
      const grid = getGrid(map, [nr, nc])
      if (grid !== null && grid !== '#') {
        const nk = `${nr},${nc},${d}`
        const ex = dmap[nk]
        if (ex === undefined) {
          newupdated[nk] = dmap[nk] = [nr, nc, d, v + 1]
        } else if (ex[3] > v + 1) {
          ex[3] = v + 1
          newupdated[nk] = ex
        }
      }

      // turn
      for (const i of [1, 3]) {
        const nd = (d + i) % directions.length
        const nk = `${r},${c},${nd}`
        const ex = dmap[nk]
        if (ex === undefined) {
          newupdated[nk] = dmap[nk] = [r, c, nd, v + 1000]
        } else if (ex[3] > v + 1000) {
          ex[3] = v + 1000
          newupdated[nk] = ex
        }
      }
    }
    updated = newupdated
  } while (Object.keys(updated).length > 0)
  return dmap
}

runWithInput(
  // part 1
  async (input) => {
    const [map, startpos, endpos] = parseInpput(input)
    const [sr, sc] = startpos
    const dmap = findShortest(map, [sr, sc, 0])
    const [er, ec] = endpos
    let min = Number.POSITIVE_INFINITY
    for (let i = 0; i < directions.length; ++i) {
      const ex = dmap[`${er},${ec},${i}`]
      if (ex === undefined) {
        continue
      }
      min = Math.min(min, ex[3])
    }
    return min
  },
  // part 2
  async (input) => {
    const [map, startpos, endpos] = parseInpput(input)
    const [sr, sc] = startpos
    const dmap = findShortest(map, [sr, sc, 0])
    const [er, ec] = endpos
    let minList = [Number.POSITIVE_INFINITY]
    for (let i = 0; i < directions.length; ++i) {
      const info = dmap[`${er},${ec},${i}`]
      if (info === undefined) {
        continue
      }
      const exMin = minList[0]
      if (exMin > info[3]) {
        minList = [info[3], i]
      } else if (exMin === info[3]) {
        minList.push(i)
      }
    }
    const picked = { [`${er},${ec}`]: 1 }
    let spread = {}
    minList.slice(1).forEach((d) => {
      spread[`${er},${ec},${d}`] = [er, ec, d, minList[0]]
    })
    do {
      const newspread = {}
      Object.values(spread).forEach(([r, c, d, v]) => {
        // try backward
        const [dr, dc] = directions[d]
        const [nr, nc] = [r - dr, c - dc]
        const nk = `${nr},${nc},${d}`
        if (nk in dmap && dmap[nk][3] === v - 1) {
          newspread[nk] = dmap[nk]
          picked[`${nr},${nc}`] = 1
        }

        // try turn
        for (let i of [1, 3]) {
          const nd = (d + i) % directions.length
          const nk = `${r},${c},${nd}`
          if (nk in dmap && dmap[nk][3] === v - 1000) {
            newspread[nk] = dmap[nk]
          }
        }
      })
      spread = newspread
    } while (Object.keys(spread).length > 0)

    return Object.keys(picked).length
  },
  2024,
  16
)
