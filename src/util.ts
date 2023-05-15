import { Cell } from '~/types';

const extend = Object.assign
const NOMOVE = {
  up: false,
  down: false,
  left: false,
  right: false,
}
const isEven = (val: number): boolean => val % 2 === 0
const isNoSolution = (arr: Cell[], level: number): boolean => {
  let count = 0
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j]["id"] < arr[i]["id"]) {
        count++
      }
    }
  }
  return isEven(level) === isEven(count)
}

const generateArr = (length: number): number[] =>
  Array.from({ length }, (_, index) => index + 1).sort(
    () => Math.random() - 0.5
  )

const generateGame = (level: number): Cell[] => {
  const length = level * level - 1
  const arr = generateArr(length)
  const res = []

  let col = 0,
    row = 0
  for (let i = 0; i < length; i++) {
    const item: Cell = {
      id: arr[i],
      col: col,
      row: row,
    }
    extend(item, NOMOVE)
    if (row === level - 1 && col === level - 2) {
      item["right"] = true
    }
    if (row === level - 2 && col === level - 1) {
      item["down"] = true
    }
    col++
    if (col === level) {
      col = 0
      row++
    }
    res[i] = item
  }
  return res
}

const isEffectaivePos = (row: number, col: number, level: number): boolean => {
  if (row < 0 || col < 0 || row > level - 1 || col > level - 1) {
    return false
  }
  return true
}

const getPos = (row: number, col: number, level: number): number => {
  if (isEffectaivePos(row, col, level)) {
    return row * level + col
  }
  return 0
}

const resetStutas = (arr: Cell[]): void => {
  arr.forEach((item) => {
    extend(item, NOMOVE)
  })
}

const resolveNewStutas = (arr: Cell[], empty: Cell, level: number): void => {
  const { row, col } = empty
  if (isEffectaivePos(row - 1, col, level)) {
    const pos = getPos(row - 1, col, level)
    arr[pos]["down"] = true
  }
  if (isEffectaivePos(row + 1, col, level)) {
    const pos = getPos(row + 1, col, level)
    arr[pos]["up"] = true
  }
  if (isEffectaivePos(row, col - 1, level)) {
    const pos = getPos(row, col - 1, level)
    arr[pos]["right"] = true
  }
  if (isEffectaivePos(row, col + 1, level)) {
    const pos = getPos(row, col + 1, level)
    arr[pos]["left"] = true
  }
}

export const changePos = (
  arr: Cell[],
  direction: "down" | "up" | "right" | "left",
  level: number
): Cell[] => {
  const targetItem = arr.find((item) => item[direction])
  if (!targetItem) return arr
  const emptyItem = arr.find((item) => item.id === 0)
  if (!emptyItem) return arr
  switch (direction) {
    case "up":
      targetItem["row"] = targetItem["row"] - 1
      emptyItem["row"] = emptyItem["row"] + 1
      break
    case "down":
      targetItem["row"] = targetItem["row"] + 1
      emptyItem["row"] = emptyItem["row"] - 1
      break
    case "left":
      targetItem["col"] = targetItem["col"] - 1
      emptyItem["col"] = emptyItem["col"] + 1
      break
    case "right":
      targetItem["col"] = targetItem["col"] + 1
      emptyItem["col"] = emptyItem["col"] - 1
      break
  }
  const targetItemPos = getPos(targetItem["row"], targetItem["col"], level)
  const emptyItemPos = getPos(emptyItem["row"], emptyItem["col"], level)

  arr[targetItemPos] = targetItem
  arr[emptyItemPos] = emptyItem

  resetStutas(arr)
  resolveNewStutas(arr, arr[emptyItemPos], level)

  return arr
}

export const isOK = (arr: Cell[]): boolean =>
  arr.every(
    (item, index) =>
      item["id"] === index + 1 || (index === arr.length - 1 && item["id"] === 0)
  )

export const init = (level: number): Cell[] => {
  let game = generateGame(level)
  while (isOK(game) || isNoSolution(game, level)) {
    game = generateGame(level)
  }
  return [
    ...game,
    extend(
      {
        id: 0,
        col: level - 1,
        row: level - 1,
      },
      NOMOVE
    ),
  ]
}
