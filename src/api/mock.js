/**
 * 개발용 mock 백엔드.
 *
 * Firebase 키를 채우기 전(`VITE_USE_MOCK=true` 또는 키 미설정)에 사용한다.
 * `localStorage`에 저장하므로 새로고침해도 데이터가 유지되고,
 * 브라우저 저장소를 지우면 초기화된다.
 *
 * `src/api/firestore.js`와 동일한 시그니처를 구현한다.
 *   list(collection)          -> Promise<{ id, ...data }[]>
 *   create(collection, data)  -> Promise<{ id, ...data }>
 *   update(collection, id, d) -> Promise<{ id, ...data }>
 *   remove(collection, id)    -> Promise<void>
 */
const STORAGE_PREFIX = 'warren:mock:'

function storageKey(collectionName) {
  return `${STORAGE_PREFIX}${collectionName}`
}

function readRows(collectionName) {
  try {
    const raw = window.localStorage.getItem(storageKey(collectionName))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn(`[mock] ${collectionName} 데이터를 읽지 못했습니다.`, error)
    return []
  }
}

function writeRows(collectionName, rows) {
  try {
    window.localStorage.setItem(storageKey(collectionName), JSON.stringify(rows))
  } catch (error) {
    console.warn(`[mock] ${collectionName} 데이터를 저장하지 못했습니다.`, error)
  }
}

function createId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID()
  return `mock-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function sortByCreatedAtDesc(rows) {
  return [...rows].sort((a, b) =>
    String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')),
  )
}

export async function list(collectionName) {
  return sortByCreatedAtDesc(readRows(collectionName))
}

export async function create(collectionName, data) {
  const row = { ...data, id: createId(), createdAt: data.createdAt ?? new Date().toISOString() }
  writeRows(collectionName, [...readRows(collectionName), row])
  return row
}

export async function update(collectionName, id, data) {
  const rows = readRows(collectionName)
  const index = rows.findIndex((row) => row.id === id)
  if (index === -1) {
    throw new Error(`[mock] ${collectionName}에서 id=${id} 문서를 찾지 못했습니다.`)
  }
  const updated = { ...rows[index], ...data, id, updatedAt: new Date().toISOString() }
  rows[index] = updated
  writeRows(collectionName, rows)
  return updated
}

export async function remove(collectionName, id) {
  const rows = readRows(collectionName)
  writeRows(
    collectionName,
    rows.filter((row) => row.id !== id),
  )
}

/** 개발 중 데이터를 비울 때 사용한다. (콘솔에서 호출) */
export function clear(collectionName) {
  if (collectionName) {
    window.localStorage.removeItem(storageKey(collectionName))
    return
  }
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(STORAGE_PREFIX))
    .forEach((key) => window.localStorage.removeItem(key))
}
