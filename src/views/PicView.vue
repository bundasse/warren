<script setup>
import { onMounted, ref } from 'vue'
import { picApi } from '@/api'
import { formatDateTime } from '@/utils/date'
import PicWriteComponent from '@/components/PicWriteComponent.vue'
import PasswordModal from '@/components/PasswordModal.vue'

const pics = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const brokenImages = ref({})

/** 'list' | 'write' */
const mode = ref('list')
const editingItem = ref(null)

async function loadPics() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    pics.value = await picApi.list()
  } catch (error) {
    console.error('[pic] 목록 조회 실패', error)
    errorMessage.value = '낙서 목록을 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

function openWrite() {
  editingItem.value = null
  mode.value = 'write'
}

function openEdit(item) {
  editingItem.value = item
  mode.value = 'write'
}

function closeWrite() {
  editingItem.value = null
  mode.value = 'list'
}

async function onSaved() {
  closeWrite()
  await loadPics()
}

function markImageBroken(id) {
  brokenImages.value = { ...brokenImages.value, [id]: true }
}

/* 삭제: 비밀번호 확인 후 진행 */
const modalOpen = ref(false)
const modalError = ref('')
const targetPic = ref(null)

function openDeleteModal(item) {
  targetPic.value = item
  modalError.value = ''
  modalOpen.value = true
}

async function confirmDelete(password) {
  const target = targetPic.value
  if (!target) return

  if (target.password !== password) {
    modalError.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  modalOpen.value = false
  try {
    await picApi.remove(target.id)
    await loadPics()
  } catch (error) {
    console.error('[pic] 삭제 실패', error)
    errorMessage.value = '삭제에 실패했습니다.'
  } finally {
    targetPic.value = null
  }
}

onMounted(loadPics)
</script>

<template>
  <div class="picView">
    <div class="viewHeader">
      <h3 class="viewTitle">
        <i class="bx bx-palette"></i>
        낙서
        <span class="count">{{ pics.length }}</span>
      </h3>
      <button v-if="mode === 'list'" type="button" class="btnPrimary" @click="openWrite">
        <i class="bx bx-plus"></i>
        새 낙서
      </button>
    </div>

    <p v-if="errorMessage" class="errorMessage">{{ errorMessage }}</p>

    <PicWriteComponent
      v-if="mode === 'write'"
      :editing="editingItem"
      @saved="onSaved"
      @cancel="closeWrite"
    />

    <div v-else class="picList">
      <p v-if="isLoading" class="listMessage">불러오는 중…</p>
      <p v-else-if="pics.length === 0" class="listMessage">
        아직 낙서가 없습니다. 새 낙서로 첫 그림을 올려보세요!
      </p>
      <ul v-else>
        <li v-for="item in pics" :key="item.id" class="picNote">
          <div class="picThumb">
            <img
              v-if="item.imageUrl && !brokenImages[item.id]"
              :src="item.imageUrl"
              :alt="`${item.name}의 낙서`"
              @error="markImageBroken(item.id)"
            />
            <div v-else class="picThumbEmpty">
              <i class="bx bx-image-alt"></i>
            </div>
          </div>

          <div class="picNoteTextArea">
            <div class="picNoteProfile">
              <div class="names">
                <span class="name">{{ item.name }}</span>
                <span class="writeTime">{{ formatDateTime(item.createdAt) }}</span>
              </div>
              <div class="buttons">
                <button type="button" title="수정" @click="openEdit(item)">
                  <i class="bx bx-edit"></i>
                </button>
                <button type="button" title="삭제" @click="openDeleteModal(item)">
                  <i class="bx bx-trash"></i>
                </button>
              </div>
            </div>
            <p class="picComment">{{ item.comment }}</p>
          </div>
        </li>
      </ul>
    </div>

    <PasswordModal
      v-model:open="modalOpen"
      title="낙서 삭제"
      message="이 낙서를 삭제하려면 작성 시 입력한 비밀번호를 입력하세요."
      confirm-text="삭제"
      :error="modalError"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.picView {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  min-height: 0;
}

.viewHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.viewTitle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
}

.viewTitle .count {
  font-size: 12px;
  font-weight: 400;
  color: #777;
}

.errorMessage {
  font-size: 12px;
  color: crimson;
}

.picList {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.listMessage {
  font-size: 12px;
  color: #888;
  padding: 8px 0;
}

.picNote {
  display: flex;
  gap: 12px;
  padding: 10px;
  border: 1px solid rgb(247, 212, 125);
  background: #fffdf6;
}

.picNote + .picNote {
  margin-top: 8px;
}

.picThumb {
  width: 150px;
  flex-shrink: 0;
}

.picThumb img {
  width: 100%;
  display: block;
  object-fit: cover;
}

.picThumbEmpty {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed rgb(247, 212, 125);
  color: #bbb;
  font-size: 22px;
}

.picNoteTextArea {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.picNoteProfile {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 8px;
}

.picNoteProfile .names {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.picNoteProfile .name {
  font-size: 12px;
  font-weight: 700;
}

.picNoteProfile .writeTime {
  font-size: 11px;
  color: #999;
}

.picNoteProfile .buttons {
  display: flex;
  gap: 4px;
}

.picNoteProfile .buttons button {
  border: 0;
  background: none;
  color: #999;
  cursor: pointer;
  padding: 0 2px;
}

.picNoteProfile .buttons button:hover {
  color: var(--bg-color);
}

.picComment {
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.btnPrimary {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border: 1px solid var(--bg-color);
  background: var(--bg-color);
  color: gold;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}
</style>
