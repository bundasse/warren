import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from '@/config/firebaseEnv'

/**
 * Firebase 초기화.
 *
 * 설정 값은 `.env`의 `VITE_FIREBASE_*`에서 읽고(`@/config/firebaseEnv`),
 * 이 모듈에서 실제 SDK 앱을 만든다.
 *
 * 이 파일은 `@/api`가 실제 Firestore를 쓸 때만 동적 import되므로,
 * mock 개발 모드에서는 번들에 포함되지 않는다.
 * Firebase Auth는 사용하지 않으므로 초기화하지 않는다.
 */
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export default app
