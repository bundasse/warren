/**
 * 관리자(사이트 주인) 인증.
 *
 * 비밀번호는 `.env`의 `VITE_ADMIN_PASSWORD`에서 읽는다.
 *   .env  ->  VITE_ADMIN_PASSWORD='...'
 *
 * ⚠️ 이 값은 클라이언트 번들에 포함된다. 접근을 '막는' 수단이 아니라
 *    실수 방지용 수준이며, 공개 서비스로 운영할 때는 서버 검증(Cloud Functions 등)이 필요하다.
 */
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? ''

if (!ADMIN_PASSWORD) {
  console.warn(
    '[admin] VITE_ADMIN_PASSWORD가 설정되지 않았습니다. `.env`를 확인하세요. (.env.example 참고)',
  )
}

/** 입력한 비밀번호가 관리자 비밀번호와 일치하는지 확인한다. */
export function verifyAdminPassword(input) {
  return ADMIN_PASSWORD !== '' && input === ADMIN_PASSWORD
}
