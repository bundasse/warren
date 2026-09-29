<script setup>
/**
 * 비밀번호 확인 모달.
 *
 * 비밀번호 검증은 부모가 담당한다.
 * 부모는 `v-model:open`으로 열고 닫고, `@confirm`에서 받은 값으로 검증한 뒤
 * 실패하면 `error` prop에 메시지를 넣어 보여준다.
 */
import { ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '비밀번호 확인' },
  message: { type: String, default: '이 글을 수정하거나 삭제하려면 비밀번호를 입력하세요.' },
  error: { type: String, default: '' },
  confirmText: { type: String, default: '확인' },
})

const emit = defineEmits(['update:open', 'confirm'])

const password = ref('')
const inputEl = ref(null)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      password.value = ''
      // 모달이 렌더된 뒤 입력칸에 포커스를 준다.
      requestAnimationFrame(() => inputEl.value?.focus())
    }
  },
)

function close() {
  emit('update:open', false)
}

function submit() {
  emit('confirm', password.value)
}
</script>

<template>
  <div v-if="open" class="modalOverlay" @click.self="close">
    <div class="modalBox" role="dialog" aria-modal="true">
      <h4 class="modalTitle">
        <i class="bx bx-lock"></i>
        {{ title }}
      </h4>
      <p class="modalMessage">{{ message }}</p>
      <input
        ref="inputEl"
        v-model="password"
        type="password"
        class="modalInput"
        placeholder="비밀번호"
        @keyup.enter="submit"
      />
      <p v-if="error" class="modalError">{{ error }}</p>
      <div class="modalButtons">
        <button type="button" class="btnGhost" @click="close">취소</button>
        <button type="button" class="btnPrimary" @click="submit">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modalBox {
  width: min(360px, calc(100% - 32px));
  background: white;
  border: 1px solid black;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modalTitle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
}

.modalMessage {
  font-size: 13px;
  color: #555;
}

.modalInput {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #bbb;
  outline: none;
}

.modalInput:focus {
  border-color: var(--bg-color);
}

.modalError {
  font-size: 12px;
  color: crimson;
}

.modalButtons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btnGhost,
.btnPrimary {
  padding: 6px 14px;
  border: 1px solid black;
  cursor: pointer;
}

.btnGhost {
  background: white;
  color: black;
}

.btnPrimary {
  background: var(--bg-color);
  border-color: var(--bg-color);
  color: gold;
  font-weight: 500;
}
</style>
