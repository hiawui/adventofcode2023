import { runWithInput, parseInput } from '../common/input.js'

runWithInput(
  // part 1
  async (input) => {
    const target = 'XMAS'
    const matrix = {}
    let row = 0
    let col = 0
    for (const line of parseInput((l) => l, input)) {
      col = 0
      for (const c of line) {
        matrix[`${row},${col}`] = c
        col++
      }
      row++
    }
    const directions = [
      [0, 1], // right
      [1, 1], // right down
      [1, 0], // down
      [1, -1], // left down
      [0, -1], // left
      [-1, -1], // left up
      [-1, 0], // up
      [-1, 1], // right up
    ]
    let count = 0
    for (let ri = 0; ri < row; ++ri) {
      for (let ci = 0; ci < col; ++ci) {
        for (const [rd, cd] of directions) {
          let found = true
          for (let k = 0; k < target.length; ++k) {
            const rt = ri + rd * k
            const ct = ci + cd * k
            if (
              rt < 0 ||
              rt >= row ||
              ct < 0 ||
              ct >= col ||
              matrix[`${rt},${ct}`] != target[k]
            ) {
              found = false
              break
            }
          }
          if (found) {
            count++
          }
        }
      }
    }
    return count
  },
  // part 2
  async (input) => {
    const matrix = {}
    let row = 0
    let col = 0
    for (const line of parseInput((l) => l, input)) {
      col = 0
      for (const c of line) {
        matrix[`${row},${col}`] = c
        col++
      }
      row++
    }
    const directions = [
      [
        [-1, -1],
        [1, 1],
      ],
      [
        [-1, 1],
        [1, -1],
      ],
    ]
    let count = 0
    for (let ri = 0; ri < row; ++ri) {
      for (let ci = 0; ci < col; ++ci) {
        if (
          ri == 0 ||
          ri == row - 1 ||
          ci == 0 ||
          ci == col - 1 ||
          matrix[`${ri},${ci}`] != 'A'
        ) {
          continue
        }
        let matchedCnt = 0
        for (const [oa, ob] of directions) {
          const a = matrix[`${ri + oa[0]},${ci + oa[1]}`]
          const b = matrix[`${ri + ob[0]},${ci + ob[1]}`]
          if ((a == 'M' && b == 'S') || (a == 'S' && b == 'M')) {
            matchedCnt++
          } else {
            break
          }
        }
        if (matchedCnt == 2) {
          count++
        }
      }
    }
    return count
  },
  2024,
  4
)
