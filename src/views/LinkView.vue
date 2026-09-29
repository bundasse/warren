<script setup>
import { onMounted, ref } from 'vue'
import { bannerApi } from '@/api'
import PasswordModal from '@/components/PasswordModal.vue'

/** 관리자 모드 진입 비밀번호 (사이트 주인용) */
const ADMIN_PASSWORD = 'dasse'

const banners = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const copyMessage = ref('')
const brokenImages = ref({})

const isAdmin = ref(false)
const showAddForm = ref(false)
const form = ref({ imageUrl: '', linkUrl: '' })

async function loadBanners() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    banners.value = await bannerApi.list()
  } catch (error) {
    console.error('[link] 목록 조회 실패', error)
    errorMessage.value = '배너 목록을 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

function markImageBroken(id) {
  brokenImages.value = { ...brokenImages.value, [id]: true }
}

const adminModalOpen = ref(false)
const adminModalError = ref('')

function openAdminModal() {
  adminModalError.value = ''
  adminModalOpen.value = true
}

function confirmAdmin(password) {
  if (password !== ADMIN_PASSWORD) {
    adminModalError.value = '비밀번호가 일치하지 않습니다.'
    return
  }
  adminModalOpen.value = false
  isAdmin.value = true
}

function exitAdmin() {
  isAdmin.value = false
  showAddForm.value = false
  form.value = { imageUrl: '', linkUrl: '' }
}

async function addBanner() {
  if (form.value.imageUrl.trim() === '') {
    errorMessage.value = '이미지 URL을 입력하세요.'
    return
  }
  errorMessage.value = ''
  try {
    await bannerApi.create({
      imageUrl: form.value.imageUrl.trim(),
      linkUrl: form.value.linkUrl.trim(),
    })
    form.value = { imageUrl: '', linkUrl: '' }
    showAddForm.value = false
    await loadBanners()
  } catch (error) {
    console.error('[link] 추가 실패', error)
    errorMessage.value = '배너 추가에 실패했습니다.'
  }
}

async function removeBanner(banner) {
  if (!window.confirm('이 배너를 삭제할까요?')) return
  try {
    await bannerApi.remove(banner.id)
    await loadBanners()
  } catch (error) {
    console.error('[link] 삭제 실패', error)
    errorMessage.value = '배너 삭제에 실패했습니다.'
  }
}

function imageCode(banner) {
  const img = `<img src="${banner.imageUrl}" alt="banner">`
  return banner.linkUrl ? `<a href="${banner.linkUrl}" target="_blank">${img}</a>` : img
}

async function copyText(text, label) {
  if (!text) {
    copyMessage.value = '복사할 값이 없습니다.'
    return
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    copyMessage.value = `${label}이(가) 클립보드에 복사되었습니다.`
  } catch (error) {
    console.error('[link] 복사 실패', error)
    copyMessage.value = '복사에 실패했습니다.'
  }
  window.setTimeout(() => {
    copyMessage.value = ''
  }, 2000)
}

onMounted(loadBanners)
</script>

<template>
  <div class="linkView">
    <div class="viewHeader">
      <h3 class="viewTitle">
        <i class="bx bx-link"></i>
        링크 배너
        <span class="count">{{ banners.length }}</span>
      </h3>
      <div class="headerButtons">
        <template v-if="isAdmin">
          <button type="button" class="btnGhost" @click="showAddForm = !showAddForm">
            <i class="bx bx-plus"></i>
            추가
          </button>
          <button type="button" class="btnGhost" @click="exitAdmin">
            <i class="bx bx-x-circle"></i>
            종료
          </button>
        </template>
        <button v-else type="button" class="btnGhost" @click="openAdminModal">
          <i class="bx bx-lock-open-alt"></i>
          관리자
        </button>
      </div>
    </div>

    <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
    <p v-if="copyMessage" class="message">{{ copyMessage }}</p>

    <form v-if="isAdmin && showAddForm" class="addForm" @submit.prevent="addBanner">
      <input v-model="form.imageUrl" type="text" placeholder="이미지 URL" />
      <input v-model="form.linkUrl" type="text" placeholder="링크 URL (선택)" />
      <button type="submit" class="btnPrimary">추가</button>
    </form>

    <div class="bannerArea">
      <p v-if="isLoading" class="message">불러오는 중…</p>
      <p v-else-if="banners.length === 0" class="message">등록된 배너가 없습니다.</p>
      <ul v-else class="bannerList">
        <li v-for="banner in banners" :key="banner.id" class="bannerItem">
          <a
            class="bannerThumb"
            :href="banner.linkUrl || undefined"
            :target="banner.linkUrl ? '_blank' : undefined"
            rel="noopener"
          >
            <img
              v-if="!brokenImages[banner.id]"
              :src="banner.imageUrl"
              alt="배너"
              @error="markImageBroken(banner.id)"
            />
            <span v-else class="thumbEmpty"><i class="bx bx-image-alt"></i></span>
          </a>
          <div class="bannerFooter">
            <button
              type="button"
              title="이미지 URL 복사"
              @click="copyText(banner.imageUrl, '이미지 URL')"
            >
              <i class="bx bx-clipboard"></i>
            </button>
            <button
              type="button"
              title="HTML 코드 복사"
              @click="copyText(imageCode(banner), 'HTML 코드')"
            >
              <i class="bx bx-code-alt"></i>
            </button>
            <button
              v-if="isAdmin"
              type="button"
              class="deleteButton"
              title="삭제"
              @click="removeBanner(banner)"
            >
              <i class="bx bx-trash"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>

    <PasswordModal
      v-model:open="adminModalOpen"
      title="관리자 모드"
      message="배너를 관리하려면 비밀번호를 입력하세요."
      confirm-text="확인"
      :error="adminModalError"
      @confirm="confirmAdmin"
    />
  </div>
</template>

<style scoped>
.linkView {
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
  flex-wrap: wrap;
  gap: 8px;
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

.headerButtons {
  display: flex;
  gap: 8px;
}

.message {
  font-size: 12px;
  color: #777;
}

.message.error {
  color: crimson;
}

.addForm {
  display: flex;
  gap: 6px;
}

.addForm input {
  flex: 1;
  padding: 5px 7px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 12px;
}

.addForm input:focus {
  border-color: var(--bg-color);
}

.bannerArea {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.bannerList {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.bannerItem {
  border: 1px solid rgb(247, 212, 125);
  background: #fffdf6;
  display: flex;
  flex-direction: column;
}

.bannerThumb {
  display: block;
  border-bottom: 1px solid rgb(247, 212, 125);
}

.bannerThumb img {
  width: 100%;
  height: 72px;
  object-fit: cover;
  display: block;
}

.thumbEmpty {
  height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #bbb;
  font-size: 20px;
}

.bannerFooter {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
}

.bannerFooter button {
  border: 0;
  background: none;
  color: #999;
  cursor: pointer;
  padding: 0 3px;
  font-size: 14px;
}

.bannerFooter button:hover {
  color: var(--bg-color);
}

.bannerFooter .deleteButton {
  margin-left: auto;
}

.bannerFooter .deleteButton:hover {
  color: crimson;
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
</style>
