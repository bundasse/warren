<script setup>
/**
 * 낙서(Pic) 작성/수정 폼.
 *
 * - `editing`이 null이면 새 글 작성, 값이 있으면 해당 글 수정.
 * - 수정 시에는 작성할 때 넣은 비밀번호가 일치해야 저장된다.
 */
import { computed, ref, watch } from 'vue'
import { picApi } from '@/api'

const props = defineProps({ editing: { type: Object, default: null } })
const emit = defineEmits(['saved', 'cancel'])

const form = ref({ name: '', password: '', imageUrl: '', comment: '' })
const isSaving = ref(false)
const errorMessage = ref('')
const imageError = ref(false)

const isEditing = computed(() => Boolean(props.editing))
const isFormValid = computed(
  () =>
    form.value.name.trim() !== '' &&
    form.value.password.trim() !== '' &&
    form.value.comment.trim() !== '',
)

function resetForm() {
  form.value = { name: '', password: '', imageUrl: '', comment: '' }
  imageError.value = false
}

watch(
  () => props.editing,
  (item) => {
    errorMessage.value = ''
    imageError.value = false
    form.value = item
      ? {
          name: item.name ?? '',
          password: '',
          imageUrl: item.imageUrl ?? '',
          comment: item.comment ?? '',
        }
      : { name: '', password: '', imageUrl: '', comment: '' }
  },
  { immediate: true },
)

async function saveCommand() {
  if (!isFormValid.value || isSaving.value) return
  isSaving.value = true
  errorMessage.value = ''

  const payload = {
    name: form.value.name.trim(),
    imageUrl: form.value.imageUrl.trim(),
    comment: form.value.comment.trim(),
  }

  try {
    if (isEditing.value) {
      if (props.editing.password !== form.value.password) {
        errorMessage.value = '비밀번호가 일치하지 않습니다.'
        return
      }
      await picApi.update(props.editing.id, { ...payload, password: props.editing.password })
    } else {
      await picApi.create({ ...payload, password: form.value.password })
    }
    resetForm()
    emit('saved')
  } catch (error) {
    console.error('[pic] 저장 실패', error)
    errorMessage.value = '저장에 실패했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="writeWrapper">
    <h3 class="writeTitle">
      <i class="bx bx-image-add"></i>
      {{ isEditing ? '낙서 수정' : '새 낙서' }}
    </h3>

    <div class="writeBody">
      <div class="preview">
        <img
          v-if="form.imageUrl && !imageError"
          :src="form.imageUrl"
          alt="미리보기"
          @error="imageError = true"
        />
        <div v-else class="previewEmpty">
          <i class="bx bx-image"></i>
          <span>이미지 미리보기</span>
        </div>
      </div>

      <form class="writeForm" @submit.prevent="saveCommand">
        <div class="field">
          <label for="txtPicImage">이미지 URL</label>
          <input
            id="txtPicImage"
            v-model="form.imageUrl"
            type="text"
            placeholder="https://..."
            @input="imageError = false"
          />
        </div>
        <div class="fieldRow">
          <div class="field">
            <label for="txtPicName">이름</label>
            <input id="txtPicName" v-model="form.name" type="text" maxlength="20" />
          </div>
          <div class="field">
            <label for="txtPicPassword">비밀번호</label>
            <input id="txtPicPassword" v-model="form.password" type="password" maxlength="20" />
          </div>
        </div>
        <div class="field">
          <label for="txtPicComments">코멘트</label>
          <textarea id="txtPicComments" v-model="form.comment" rows="4" maxlength="500"></textarea>
        </div>

        <p v-if="errorMessage" class="formError">{{ errorMessage }}</p>

        <div class="buttons">
          <button type="button" class="btnGhost" @click="emit('cancel')">
            <i class="bx bx-x"></i>
            취소
          </button>
          <button type="submit" class="btnPrimary" :disabled="!isFormValid || isSaving">
            {{ isSaving ? '저장 중…' : '저장' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.writeWrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.writeTitle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
}

.writeBody {
  display: flex;
  gap: 20px;
}

.preview {
  width: 220px;
  flex-shrink: 0;
}

.preview img {
  width: 100%;
  display: block;
  border: 1px solid rgb(247, 212, 125);
}

.previewEmpty {
  height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border: 1px dashed rgb(247, 212, 125);
  color: #aaa;
  font-size: 12px;
}

.previewEmpty i {
  font-size: 28px;
}

.writeForm {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.fieldRow {
  display: flex;
  gap: 10px;
}

.fieldRow .field {
  flex: 1;
}

.field label {
  font-size: 12px;
}

.field input,
.field textarea {
  padding: 5px 7px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 12px;
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  border-color: var(--bg-color);
}

.formError {
  font-size: 11px;
  color: crimson;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btnGhost,
.btnPrimary {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border: 1px solid black;
  font-size: 12px;
  cursor: pointer;
}

.btnGhost {
  background: white;
}

.btnPrimary {
  background: var(--bg-color);
  border-color: var(--bg-color);
  color: gold;
  font-weight: 500;
}

.btnPrimary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
