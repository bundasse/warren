<script setup>
import { computed, onMounted, ref } from 'vue'
import { guestbookApi } from '@/api'
import { formatDateTime } from '@/utils/date'
import PasswordModal from '@/components/PasswordModal.vue'

const comments = ref([])
const isLoading = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')

const form = ref({ name: '', password: '', comment: '' })

const isFormValid = computed(
  () =>
    form.value.name.trim() !== '' &&
    form.value.password.trim() !== '' &&
    form.value.comment.trim() !== '',
)

async function loadComments() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    comments.value = await guestbookApi.list()
  } catch (error) {
    console.error('[guestbook] 목록 조회 실패', error)
    errorMessage.value = '방명록을 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  form.value = { name: '', password: '', comment: '' }
}

async function submitComment() {
  if (!isFormValid.value || isSaving.value) return
  isSaving.value = true
  errorMessage.value = ''
  try {
    await guestbookApi.create({
      name: form.value.name.trim(),
      password: form.value.password,
      comment: form.value.comment.trim(),
    })
    resetForm()
    await loadComments()
  } catch (error) {
    console.error('[guestbook] 등록 실패', error)
    errorMessage.value = '등록에 실패했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isSaving.value = false
  }
}

/* 삭제: 비밀번호 확인 후 진행 */
const modalOpen = ref(false)
const modalError = ref('')
const targetComment = ref(null)

function openDeleteModal(comment) {
  targetComment.value = comment
  modalError.value = ''
  modalOpen.value = true
}

async function confirmDelete(password) {
  const target = targetComment.value
  if (!target) return

  if (target.password !== password) {
    modalError.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  modalOpen.value = false
  try {
    await guestbookApi.remove(target.id)
    await loadComments()
  } catch (error) {
    console.error('[guestbook] 삭제 실패', error)
    errorMessage.value = '삭제에 실패했습니다.'
  } finally {
    targetComment.value = null
  }
}

onMounted(loadComments)
</script>

<template>
  <div class="row h-100 guestbookView">
    <section class="intro">
      <h2 class="introTitle">WARREN</h2>
      <p class="introText">
        그림과 리뷰, 그리고 이것저것을 모아두는<br />
        다스(Dasse)의 개인 공간입니다.
      </p>
      <p class="introText">방명록은 누구나 남길 수 있어요.</p>
    </section>

    <section class="guestbook">
      <h3 class="guestbookTitle">
        <i class="bx bx-message-square-dots"></i>
        방명록
        <span class="count">{{ comments.length }}</span>
      </h3>

      <div class="commentList">
        <p v-if="isLoading" class="commentEmpty">불러오는 중…</p>
        <p v-else-if="comments.length === 0" class="commentEmpty">
          아직 남겨진 글이 없습니다. 첫 글을 남겨보세요!
        </p>
        <ul v-else>
          <li v-for="comment in comments" :key="comment.id" class="commentItem">
            <div class="commentHeader">
              <span class="commentWriter">{{ comment.name }}</span>
              <span class="commentTime">{{ formatDateTime(comment.createdAt) }}</span>
              <button
                type="button"
                class="commentDelete"
                title="삭제"
                @click="openDeleteModal(comment)"
              >
                <i class="bx bx-trash"></i>
              </button>
            </div>
            <p class="commentText">{{ comment.comment }}</p>
          </li>
        </ul>
      </div>

      <form class="commentForm" @submit.prevent="submitComment">
        <div class="formRow">
          <label for="txtName">이름</label>
          <input id="txtName" v-model="form.name" type="text" maxlength="20" />
          <label for="txtPassword">비밀번호</label>
          <input id="txtPassword" v-model="form.password" type="password" maxlength="20" />
        </div>
        <label for="txtContents" class="srOnly">내용</label>
        <textarea
          id="txtContents"
          v-model="form.comment"
          rows="3"
          maxlength="300"
          placeholder="남기고 싶은 말을 적어주세요."
        ></textarea>
        <div class="formButtons">
          <p v-if="errorMessage" class="formError">{{ errorMessage }}</p>
          <button type="button" class="btnGhost" @click="resetForm">초기화</button>
          <button type="submit" class="btnPrimary" :disabled="!isFormValid || isSaving">
            {{ isSaving ? '등록 중…' : '등록' }}
          </button>
        </div>
      </form>
    </section>

    <PasswordModal
      v-model:open="modalOpen"
      title="방명록 삭제"
      message="이 글을 삭제하려면 작성 시 입력한 비밀번호를 입력하세요."
      confirm-text="삭제"
      :error="modalError"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.guestbookView {
  gap: 24px;
  height: 100%;
}

.intro {
  width: 34%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 6px;
}

.introTitle {
  font-size: 26px;
  font-weight: 700;
  color: var(--bg-color);
  letter-spacing: 1px;
}

.introText {
  font-size: 13px;
  line-height: 1.7;
  color: #444;
}

.guestbook {
  width: 62%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.guestbookTitle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
}

.guestbookTitle .count {
  font-size: 12px;
  font-weight: 400;
  color: #777;
}

.commentList {
  flex: 1;
  min-height: 120px;
  overflow-y: auto;
  border: 1px solid rgb(247, 212, 125);
  background: #fffdf6;
  padding: 8px;
}

.commentEmpty {
  font-size: 12px;
  color: #888;
  padding: 8px;
}

.commentItem + .commentItem {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed rgb(247, 212, 125);
}

.commentHeader {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.commentWriter {
  font-size: 12px;
  font-weight: 700;
}

.commentTime {
  font-size: 11px;
  color: #999;
}

.commentDelete {
  margin-left: auto;
  border: 0;
  background: none;
  color: #bbb;
  cursor: pointer;
  padding: 0 2px;
}

.commentDelete:hover {
  color: crimson;
}

.commentText {
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.commentForm {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.formRow {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.formRow label {
  flex-shrink: 0;
}

.formRow input {
  width: 100%;
  padding: 4px 6px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 12px;
}

.commentForm textarea {
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  outline: none;
  resize: vertical;
  font-size: 12px;
}

.formRow input:focus,
.commentForm textarea:focus {
  border-color: var(--bg-color);
}

.formButtons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.formError {
  margin-right: auto;
  font-size: 11px;
  color: crimson;
}

.btnGhost,
.btnPrimary {
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

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
