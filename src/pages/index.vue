<script setup lang="ts">
import { changePos, init, isOK } from '~/util'

defineOptions({
  name: 'IndexPage',
})

const passed = ref(false)
const level = ref(3)
const initArr = ref(init(level.value))

watchEffect(() => {
  passed.value = false
  initArr.value = init(level.value)
})

function newGame() {
  passed.value = false
  initArr.value = init(level.value)
}

function handleClick(id: number) {
  const targetItem = initArr.value.find(item => item.id === id)
  if (targetItem) {
    const { up, down, left, right } = targetItem
    let res = null
    if (up)
      res = changePos(initArr.value, 'up', level.value)

    if (down)
      res = changePos(initArr.value, 'down', level.value)

    if (left)
      res = changePos(initArr.value, 'left', level.value)

    if (right)
      res = changePos(initArr.value, 'right', level.value)

    if (res && res.length > 0) {
      initArr.value = res
      if (isOK(res))
        passed.value = true
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', ({ code }) => {
    let res = null
    switch (code) {
      case 'ArrowUp':
        res = changePos(initArr.value, 'up', level.value)
        break
      case 'ArrowDown':
        res = changePos(initArr.value, 'down', level.value)
        break
      case 'ArrowLeft':
        res = changePos(initArr.value, 'left', level.value)
        break
      case 'ArrowRight':
        res = changePos(initArr.value, 'right', level.value)
        break
    }
    if (res && res.length > 0) {
      initArr.value = res
      if (isOK(res))
        passed.value = true
    }
  })
})
</script>

<template>
  <div>
    <p>
      数字华容道
    </p>

    <div py-3 />

    <div>
      <button
        class="m-3 text-sm btn"
        @click="newGame"
      >
        New Game
      </button>
      <button
        class="m-3 text-sm btn"
        @click="() => level = 3"
      >
        Easy
      </button>
      <button
        class="m-3 text-sm btn"
        @click="() => level = 5"
      >
        Medium
      </button>
      <button
        class="m-3 text-sm btn"
        @click="() => level = 7"
      >
        Hard
      </button>
      <button
        class="m-3 text-sm btn"
        @click="() => level = 9"
      >
        Hell
      </button>
    </div>

    <div py-4 />

    <div
      v-for="row, x in level"
      :key="x"
      flex="~"
      ma w-max items-center justify-center
    >
      <div
        v-for="col, y in level"
        :key="y"
        flex="~"
        ma w-max items-center justify-center
      >
        <button
          flex="~"

          min-h-8 min-w-8 items-center justify-center m="1px"
          border="0.5 gray-400/10"
          @click="handleClick(initArr[(row - 1) * level + (col - 1)].id)"
        >
          {{ initArr[(row - 1) * level + (col - 1)].id === 0 ? '' : initArr[(row - 1) * level + (col - 1)].id }}
        </button>
      </div>
    </div>

    <div py-4 />

    <Confetti :passed="passed" />
  </div>
</template>
