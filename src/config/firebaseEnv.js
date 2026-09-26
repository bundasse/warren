/**
 * Firebase 환경변수 읽기 전용 모듈.
 *
 * 이 파일은 Firebase SDK를 import하지 않는다.
 * 덕분에 mock 개발 모드에서는 Firebase 번들이 함께 로드되지 않는다.
 *
 * 주의: Vite는 `import.meta.env.VITE_*`를 **정적 문자열로만** 치환한다.
 * 따라서 동적 접근(`import.meta.env[key]`)은 사용하지 않는다.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

/** `.env`의 `VITE_USE_MOCK` 원본 값 ('true' | 'false' | undefined) */
export const useMockEnvFlag = import.meta.env.VITE_USE_MOCK

/** 더미 값 판별에 쓰는 자리표시자 */
const PLACEHOLDER = '1234'

function isFilled(value) {
  return Boolean(value) && value !== PLACEHOLDER
}

/**
 * 실제 사용할 수 있는 Firebase 설정이 채워져 있는지 확인한다.
 * 값이 비어 있거나 더미 값('1234')이면 `false`.
 */
export function isFirebaseConfigured() {
  return (
    isFilled(firebaseConfig.apiKey) &&
    isFilled(firebaseConfig.authDomain) &&
    isFilled(firebaseConfig.projectId) &&
    isFilled(firebaseConfig.appId)
  )
}
