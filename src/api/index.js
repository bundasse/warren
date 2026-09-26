/**
 * 데이터 접근 계층 (단일 진입점).
 *
 * 뷰는 이 파일만 import하고, 뒤에서 mock / Firestore 중 무엇이 쓰이는지는 신경 쓰지 않는다.
 * 백엔드 선택 규칙:
 *   1) `.env`의 `VITE_USE_MOCK === 'true'`  -> mock
 *   2) `.env`의 `VITE_USE_MOCK === 'false'` -> Firestore
 *   3) 미설정 -> Firebase 키가 채워져 있으면 Firestore, 아니면 mock
 *
 * Firestore 백엔드는 실제로 필요할 때(=`USE_MOCK`이 아닐 때) 동적 import 한다.
 * 덕분에 mock 개발 모드에서는 Firebase SDK가 번들에 포함되지 않는다.
 */
import * as mockBackend from './mock'
import { isFirebaseConfigured, useMockEnvFlag } from '@/config/firebaseEnv'

export const COLLECTIONS = {
  GUESTBOOK: 'guestbook',
  PIC: 'pic',
  REVIEW: 'review',
  BANNER: 'banner',
}

function resolveUseMock() {
  if (useMockEnvFlag === 'true') return true
  if (useMockEnvFlag === 'false') return false
  return !isFirebaseConfigured()
}

/** 현재 mock 백엔드를 쓰고 있는지 여부 */
export const USE_MOCK = resolveUseMock()

let backendPromise = null

/** 백엔드 모듈을 지연 로딩한다. (첫 호출 시 한 번만) */
function getBackend() {
  if (!backendPromise) {
    backendPromise = USE_MOCK ? Promise.resolve(mockBackend) : import('./firestore')
  }
  return backendPromise
}

if (USE_MOCK) {
  console.info(
    '[warren] 개발용 mock 백엔드(localStorage)로 동작 중입니다. ' +
      '실제 Firestore 연동: .env의 VITE_USE_MOCK=false 설정 + VITE_FIREBASE_* 값 입력',
  )
}

/** 컬렉션 하나에 대한 CRUD 묶음을 만든다. */
function createCollectionApi(name) {
  return {
    name,
    list: async () => (await getBackend()).list(name),
    create: async (data) => (await getBackend()).create(name, data),
    update: async (id, data) => (await getBackend()).update(name, id, data),
    remove: async (id) => (await getBackend()).remove(name, id),
  }
}

export const guestbookApi = createCollectionApi(COLLECTIONS.GUESTBOOK)
export const picApi = createCollectionApi(COLLECTIONS.PIC)
export const reviewApi = createCollectionApi(COLLECTIONS.REVIEW)
export const bannerApi = createCollectionApi(COLLECTIONS.BANNER)

/** 개발용: mock 데이터를 비운다. (mock 모드에서만 동작) */
export async function clearMockData(collectionName) {
  if (USE_MOCK) (await getBackend()).clear(collectionName)
}
