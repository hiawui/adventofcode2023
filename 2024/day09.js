import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  const map = []
  let id = 0
  let isFile = false
  for (const c of input) {
    isFile = !isFile
    const v = isFile ? id++ : '.'
    const cnt = Number(c)
    for (let i = 0; i < cnt; ++i) {
      map.push(v)
    }
  }
  return map
}

const compact1 = (map) => {
  let i = 0
  let j = map.length - 1
  while (i < j) {
    for (; i < j && map[i] !== '.'; ++i);
    for (; i < j && map[j] === '.'; --j);
    if (i >= j) {
      break
    }
    map[i] = map[j]
    map[j] = '.'
  }
}

const compact2 = (map) => {
  let i = [0, 0]
  let j = [map.length - 1, map.length - 1]
  while (i[1] < j[0]) {
    for (; j[1] > i[1] && map[j[1]] === '.'; --j[1]);
    for (j[0] = j[1]; j[0] > i[1] && map[j[0] - 1] === map[j[1]]; --j[0]);

    while (i[1] < j[0]) {
      for (; i[0] < j[0] && map[i[0]] !== '.'; ++i[0]);
      for (i[1] = i[0]; i[1] < j[0] && map[i[1] + 1] === '.'; ++i[1]);
      if (i[1] >= j[0]) {
        break
      }
      if (i[1] - i[0] >= j[1] - j[0]) {
        for (let k = 0; k <= j[1] - j[0]; ++k) {
          map[i[0] + k] = map[j[0] + k]
          map[j[0] + k] = '.'
        }
        break
      } else {
        i[0] = i[1] = i[1] + 1
      }
    }
    j[0] = j[1] = j[0] - 1
    i = [0, 0]
  }
}

runWithInput(
  // part 1
  async (input) => {
    const map = parseInput(input)
    compact1(map)
    let result = 0
    for (let i = 0; i < map.length; ++i) {
      if (map[i] === '.') {
        break
      }
      result += i * map[i]
    }
    return result
  },
  // part 2
  async (input) => {
    const map = parseInput(input)
    compact2(map)
    let result = 0
    for (let i = 0; i < map.length; ++i) {
      if (map[i] === '.') {
        continue
      }
      result += i * map[i]
    }
    return result
  },
  2024,
  9
)
