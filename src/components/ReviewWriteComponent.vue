<script setup>
/**
 * 리뷰 작성/수정 폼.
 *
 * 리뷰는 사이트 주인이 직접 쓰는 글이라 비밀번호를 두지 않는다.
 * 한 날짜에 리뷰 하나를 원칙으로 하며, 이미 있으면 수정 모드가 된다.
 */
import { computed, ref, watch } from 'vue'
import { reviewApi } from '@/api'
import StarRating from '@/components/StarRating.vue'

const props = defineProps({
  dateKey: { type: String, required: true },
  dateLabel: { type: String, default: '' },
  editing: { type: Object, default: null },
})

const emit = defineEmits(['saved', 'cancel'])

const form = ref({ title: '', imageUrl: '', rating: 0, head: '', contents: '' })
const isSaving = ref(false)
const errorMessage = ref('')
const imageError = ref(false)

const isEditing = computed(() => Boolean(props.editing))
const isFormValid = computed(
  () => form.value.title.trim() !== '' && form.value.contents.trim() !== '',
)

function resetForm() {
  form.value = { title: '', imageUrl: '', rating: 0, head: '', contents: '' }
  imageError.value = false
}

watch(
  () => props.editing,
  (item) => {
    errorMessage.value = ''
    imageError.value = false
    form.value = item
      ? {
          title: item.title ?? '',
          imageUrl: item.imageUrl ?? '',
          rating: Number(item.rating) || 0,
          head: item.head ?? '',
          contents: item.contents ?? '',
        }
      : { title: '', imageUrl: '', rating: 0, head: '', contents: '' }
  },
  { immediate: true },
)

// 날짜만 바뀐 경우(수정 대상 없음) 폼을 비운다.
watch(
  () => props.dateKey,
  () => {
    if (!props.editing) resetForm()
  },
)

async function saveCommand() {
  if (!isFormValid.value || isSaving.value) return
  isSaving.value = true
  errorMessage.value = ''

  const payload = {
    dateKey: props.dateKey,
    title: form.value.title.trim(),
    imageUrl: form.value.imageUrl.trim(),
    rating: Number(form.value.rating) || 0,
    head: form.value.head.trim(),
    contents: form.value.contents.trim(),
  }

  try {
    if (isEditing.value) {
      await reviewApi.update(props.editing.id, payload)
    } else {
      await reviewApi.create(payload)
    }
    emit('saved')
  } catch (error) {
    console.error('[review] 저장 실패', error)
    errorMessage.value = '저장에 실패했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="reviewWrite">
    <h3 class="writeTitle">
      <i class="bx bx-edit-alt"></i>
      {{ isEditing ? '리뷰 수정' : '리뷰 작성' }}
      <span class="dateLabel">{{ dateLabel }}</span>
    </h3>

    <form class="writeForm" @submit.prevent="saveCommand">
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

        <div class="fields">
          <div class="field">
            <label for="txtReviewImage">이미지 URL</label>
            <input
              id="txtReviewImage"
              v-model="form.imageUrl"
              type="text"
              placeholder="https://..."
              @input="imageError = false"
            />
          </div>
          <div class="field">
            <label for="txtReviewTitle">제목</label>
            <input id="txtReviewTitle" v-model="form.title" type="text" maxlength="60" />
          </div>
          <div class="field">
            <span class="fieldLabel">별점</span>
            <StarRating v-model="form.rating" size="24px" />
          </div>
          <div class="field">
            <label for="txtReviewHead">한줄평</label>
            <input id="txtReviewHead" v-model="form.head" type="text" maxlength="80" />
          </div>
        </div>
      </div>

      <div class="field">
        <label for="txtReviewContents">내용</label>
        <textarea
          id="txtReviewContents"
          v-model="form.contents"
          rows="5"
          maxlength="2000"
        ></textarea>
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
</template>

<style scoped>
.reviewWrite {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.writeTitle {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
}

.writeTitle .dateLabel {
  font-size: 12px;
  font-weight: 400;
  color: #999;
}

.writeForm {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.writeBody {
  display: flex;
  gap: 16px;
}

.preview {
  width: 150px;
  flex-shrink: 0;
}

.preview img {
  width: 100%;
  display: block;
  border: 1px solid rgb(247, 212, 125);
}

.previewEmpty {
  height: 200px;
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
  font-size: 26px;
}

.fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.field label,
.fieldLabel {
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
