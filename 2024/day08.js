import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  const antennas = {} // freq -> [[r, c]]
  let rowNo = 0
  let colNo = 0
  input
    .split('\n')
    .filter((l) => l.length > 0)
    .forEach((line) => {
      colNo = 0
      for (const v of line) {
        if (v !== '.') {
          antennas[v] = antennas[v] || []
          antennas[v].push([rowNo, colNo])
        }
        colNo++
      }
      rowNo++
    })
  return [antennas, rowNo, colNo]
}

const isInMap = (node, rowCnt, colCnt) => {
  const [r, c] = node
  return r >= 0 && r < rowCnt && c >= 0 && c < colCnt
}

const findAntinodes1 = (antennasOfSameFreq, rowCnt, colCnt) => {
  const antinodes = {}
  for (let i = 0; i < antennasOfSameFreq.length - 1; i++) {
    for (let j = i + 1; j < antennasOfSameFreq.length; j++) {
      const a = antennasOfSameFreq[i]
      const b = antennasOfSameFreq[j]
      const antinodes0 = [a[0] * 2 - b[0], a[1] * 2 - b[1]]
      const antinodes1 = [b[0] * 2 - a[0], b[1] * 2 - a[1]]
      if (isInMap(antinodes0, rowCnt, colCnt)) {
        antinodes[`${antinodes0[0]},${antinodes0[1]}`] = 1
      }
      if (isInMap(antinodes1, rowCnt, colCnt)) {
        antinodes[`${antinodes1[0]},${antinodes1[1]}`] = 1
      }
    }
  }
  return antinodes
}

const findAntinodes2 = (antennasOfSameFreq, rowCnt, colCnt) => {
  const antinodes = {}
  for (let i = 0; i < antennasOfSameFreq.length - 1; i++) {
    for (let j = i + 1; j < antennasOfSameFreq.length; j++) {
      const a = antennasOfSameFreq[i]
      const b = antennasOfSameFreq[j]
      antinodes[`${a[0]},${a[1]}`] = 1
      const diff = [a[0] - b[0], a[1] - b[1]]
      const maxTryCnt = Math.max(rowCnt, colCnt)
      for (let k = 1; k < maxTryCnt; ++k) {
        const newAntinode = [a[0] + diff[0] * k, a[1] + diff[1] * k]
        if (isInMap(newAntinode, rowCnt, colCnt)) {
          antinodes[`${newAntinode[0]},${newAntinode[1]}`] = 1
        } else {
          break
        }
      }
      for (let k = 1; k < maxTryCnt; ++k) {
        const newAntinode = [a[0] - diff[0] * k, a[1] - diff[1] * k]
        if (isInMap(newAntinode, rowCnt, colCnt)) {
          antinodes[`${newAntinode[0]},${newAntinode[1]}`] = 1
        } else {
          break
        }
      }
    }
  }
  return antinodes
}

runWithInput(
  // part 1
  async (input) => {
    let result = {}
    const [antennas, rowCnt, colCnt] = parseInput(input)
    for (const antennasOfSameFreq of Object.values(antennas)) {
      for (const k of Object.keys(
        findAntinodes1(antennasOfSameFreq, rowCnt, colCnt)
      )) {
        result[k] = 1
      }
    }
    return Object.keys(result).length
  },
  // part 2
  async (input) => {
    let result = {}
    const [antennas, rowCnt, colCnt] = parseInput(input)
    for (const antennasOfSameFreq of Object.values(antennas)) {
      for (const k of Object.keys(
        findAntinodes2(antennasOfSameFreq, rowCnt, colCnt)
      )) {
        result[k] = 1
      }
    }
    return Object.keys(result).length
  },
  2024,
  8
)
