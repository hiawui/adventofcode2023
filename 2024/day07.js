import { runWithInput, parseInput } from '../common/input.js'

const mul = (a, b) => a * b
const add = (a, b) => a + b
const concat = (a, b) => BigInt(`${a}${b}`)

const tryEquation = (target, numbers, i, prev, oprs) => {
  if (prev > target) {
    return false
  }
  if (i >= numbers.length) {
    return target === prev
  }
  for (const opr of oprs) {
    if (tryEquation(target, numbers, i + 1, opr(prev, numbers[i]), oprs)) {
      return true
    }
  }
  return false
}

runWithInput(
  // part 1
  async (input) => {
    let result = BigInt(0)
    for (const [target, ...numbers] of parseInput(
      (l) => l.split(/[:, ]+/).map((n) => BigInt(n)),
      input
    )) {
      if (tryEquation(target, numbers, 1, numbers[0], [add, mul])) {
        result += target
      }
    }
    return result
  },
  // part 2
  async (input) => {
    let result = BigInt(0)
    for (const [target, ...numbers] of parseInput(
      (l) => l.split(/[:, ]+/).map((n) => BigInt(n)),
      input
    )) {
      if (tryEquation(target, numbers, 1, numbers[0], [add, mul, concat])) {
        result += target
      }
    }
    return result
  },
  2024,
  7
)
