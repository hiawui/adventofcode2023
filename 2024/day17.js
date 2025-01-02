import { runWithInput } from '../common/input.js'

const getComboOperand = (registers, operand) => {
  const opr = Number(operand)
  if (opr >= 0 && opr <= 3) {
    return operand
  }
  if (opr === 4) {
    return registers[0]
  }
  if (opr === 5) {
    return registers[1]
  }
  if (opr === 6) {
    return registers[2]
  }
  if (opr === 7) {
    throw new Error(`invalid operand: ${operand}`)
  }
}

const runinst = (registers, program, ip, outputs) => {
  if (ip + 1 >= program.length) {
    return program.length
  }
  const oprcode = Number(program[ip])
  const operand = program[ip + 1]
  if (oprcode === 0) {
    // adv
    registers[0] = registers[0] >> getComboOperand(registers, operand)
  } else if (oprcode === 1) {
    // bxl
    registers[1] = registers[1] ^ operand
  } else if (oprcode === 2) {
    // bst
    registers[1] = getComboOperand(registers, operand) % 8n
  } else if (oprcode === 3) {
    // jnz
    return registers[0] === 0n ? ip + 2 : Number(operand)
  } else if (oprcode === 4) {
    // bxc
    registers[1] = registers[1] ^ registers[2]
  } else if (oprcode === 5) {
    // out
    outputs.push(getComboOperand(registers, operand) % 8n)
  } else if (oprcode === 6) {
    // bdv
    registers[1] = registers[0] >> getComboOperand(registers, operand)
  } else if (oprcode === 7) {
    // cdv
    registers[2] = registers[0] >> getComboOperand(registers, operand)
  } else {
    throw new Error(`invalid oprcode: ${oprcode}`)
  }
  return ip + 2
}

const parseInpput = (input, registers, program) => {
  input
    .split('\n')
    .filter((l) => l.length > 0)
    .forEach((line) => {
      if (line.startsWith('Register ')) {
        registers[line[9].charCodeAt(0) - 'A'.charCodeAt(0)] = BigInt(
          line.slice(12)
        )
      } else if (line.startsWith('Program:')) {
        line
          .slice(9)
          .split(',')
          .forEach((v) => program.push(BigInt(v)))
      }
    })
}

const hack = (a) => {
  let b = 0n
  let c = 0n
  b = a % 8n
  b = b ^ 5n
  c = a >> b
  b = b ^ 6n
  b = b ^ c
  return b % 8n
}

const findA = (a, program, outputs) => {
  if (program.length === outputs.length) {
    return a
  }
  a <<= 3n
  for (let i = 0n; i < 8n; ++i) {
    const output = hack(a + i)
    if (output === program[program.length - 1 - outputs.length]) {
      const na = findA(a + i, program, [output, ...outputs])
      if (na !== null) {
        return na
      }
    }
  }
  return null
}

runWithInput(
  // part 1
  async (input) => {
    const registers = []
    const program = []
    const outputs = []
    parseInpput(input, registers, program)
    let ip = 0
    while (ip < program.length) {
      ip = runinst(registers, program, ip, outputs)
    }
    return outputs.join(',')
  },
  // part 2
  async (input) => {
    const registers = []
    const program = []
    parseInpput(input, registers, program)
    const a = findA(0n, program, [])
    return a
  },
  2024,
  17
)
