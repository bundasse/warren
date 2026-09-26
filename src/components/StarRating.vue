<script setup>
/**
 * 별점 입력/표시 공용 컴포넌트.
 *
 * 기존 ReviewComponent.vue / ReviewWriteComponent.vue에 중복돼 있던
 * 별점 로직을 하나로 합친 것이다.
 *
 * - `v-model`로 1~5 값을 주고받는다.
 * - 읽기 전용은 `readonly`.
 * - 같은 별을 다시 누르면 0(미선택)으로 되돌린다.
 */
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  readonly: { type: Boolean, default: false },
  size: { type: String, default: '28px' },
})

const emit = defineEmits(['update:modelValue'])

function selectStar(num) {
  if (props.readonly) return
  emit('update:modelValue', props.modelValue === num ? 0 : num)
}
</script>

<template>
  <ul class="reviewStar" :style="{ '--star-size': size }">
    <li v-for="num in 5" :key="num">
      <button
        type="button"
        class="star"
        :class="{ filled: num <= modelValue }"
        :disabled="readonly"
        :aria-label="`${num}점`"
        @click="selectStar(num)"
      >
        ★
      </button>
    </li>
  </ul>
</template>

<style scoped>
.reviewStar {
  display: flex;
  gap: 4px;
}

.reviewStar .star {
  font-size: var(--star-size, 28px);
  line-height: 1;
  padding: 0;
  border: 0;
  background: none;
  color: lightgray;
  cursor: pointer;
}

.reviewStar .star.filled {
  color: goldenrod;
}

.reviewStar .star:disabled {
  cursor: default;
}
</style>
