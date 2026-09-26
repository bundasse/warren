/**
 * Firestore 백엔드.
 *
 * `src/api/index.js`가 노출하는 것과 동일한 시그니처를 구현한다.
 *   list(collection)          -> Promise<{ id, ...data }[]>
 *   create(collection, data)  -> Promise<{ id, ...data }>
 *   update(collection, id, d) -> Promise<{ id, ...data }>
 *   remove(collection, id)    -> Promise<void>
 *
 * 정렬은 서버가 아니라 클라이언트에서 처리한다.
 * (Firestore 복합 인덱스 생성 없이도 동작하도록 하기 위함)
 */
import {
  collection as firestoreCollection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc as firestoreDoc,
} from 'firebase/firestore'
import { db } from '@/firebase'

function sortByCreatedAtDesc(rows) {
  return [...rows].sort((a, b) =>
    String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')),
  )
}

export async function list(collectionName) {
  const snapshot = await getDocs(firestoreCollection(db, collectionName))
  const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
  return sortByCreatedAtDesc(rows)
}

export async function create(collectionName, data) {
  const payload = { ...data, createdAt: data.createdAt ?? new Date().toISOString() }
  const created = await addDoc(firestoreCollection(db, collectionName), payload)
  return { id: created.id, ...payload }
}

export async function update(collectionName, id, data) {
  const payload = { ...data, updatedAt: new Date().toISOString() }
  await updateDoc(firestoreDoc(db, collectionName, id), payload)
  return { id, ...payload }
}

export async function remove(collectionName, id) {
  await deleteDoc(firestoreDoc(db, collectionName, id))
}
