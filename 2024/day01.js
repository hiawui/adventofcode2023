import { runWithInput, parseInput } from '../common/input.js'
import { Heap } from '../common/heap.js'

runWithInput(
  // part 1
  async (input) => {
    const hl = new Heap()
    const hr = new Heap()
    let lineCnt = 0
    for (const [left, right] of parseInput(
      (line) => line.split(/\s+/),
      input
    )) {
      hl.push(Number(left))
      hr.push(Number(right))
      lineCnt++
    }
    let result = 0
    for (let i = 0; i < lineCnt; ++i) {
      result += Math.abs(hl.pop() - hr.pop())
    }
    return result
  },
  // part 2
  async (input) => {
    const leftList = []
    const rightMap = {}
    for (const [left, right] of parseInput(
      (line) => line.split(/\s+/),
      input
    )) {
      leftList.push(left)
      rightMap[right] = (rightMap[right] || 0) + 1
    }
    let result = 0
    leftList.forEach((v) => {
      result += Number(v) * (rightMap[v] || 0)
    })
    return result
  },
  2024,
  1
)
