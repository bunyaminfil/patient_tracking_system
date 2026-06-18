import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchPatients } from '../api/patients'
import type { Patient } from '../types/patient'

export type PatientDraft = Omit<Patient, 'id' | 'createdAt'>

const STORAGE_KEY = 'pts.localChanges.v1'

// API'de karşılığı olmayan ekleme/düzenleme/silme işlemleri burada saklanır
// ve her açılışta API verisinin üzerine uygulanarak refresh sonrası korunur.
interface LocalChanges {
  added: Patient[]
  edited: Record<string, Patient>
  deleted: string[]
}

const EMPTY_CHANGES: LocalChanges = { added: [], edited: {}, deleted: [] }

function loadChanges(): LocalChanges {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_CHANGES
    const parsed = JSON.parse(raw) as Partial<LocalChanges>
    return {
      added: parsed.added ?? [],
      edited: parsed.edited ?? {},
      deleted: parsed.deleted ?? [],
    }
  } catch {
    return EMPTY_CHANGES
  }
}

function saveChanges(changes: LocalChanges) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(changes))
  } catch {
    // localStorage erişilemezse sessizce geç (ör. private mode)
  }
}

function createId(): string {
  return `pat-local-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function usePatients() {
  const [apiPatients, setApiPatients] = useState<Patient[]>([])
  const [changes, setChanges] = useState<LocalChanges>(() => loadChanges())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchPatients(signal)
      setApiPatients(data)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    // Mount anında veri çekme; load() içinde async olarak setState çağrılır.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(controller.signal)
    return () => controller.abort()
  }, [load])

  // Her değişiklikte localStorage'a yaz.
  useEffect(() => {
    saveChanges(changes)
  }, [changes])

  // API verisi + local değişiklikleri birleştir.
  const patients = useMemo<Patient[]>(() => {
    const deleted = new Set(changes.deleted)
    const merged = apiPatients
      .filter((p) => !deleted.has(p.id))
      .map((p) => changes.edited[p.id] ?? p)
    // Eklenenler en üstte (silinmiş olanları gösterme).
    const added = changes.added.filter((p) => !deleted.has(p.id))
    return [...added, ...merged]
  }, [apiPatients, changes])

  // Ekleme: API karşılığı yok, localStorage'da kalıcı tutulur.
  const addPatient = useCallback((draft: PatientDraft) => {
    const newPatient: Patient = {
      ...draft,
      id: createId(),
      createdAt: new Date().toISOString(),
    }
    setChanges((prev) => ({ ...prev, added: [newPatient, ...prev.added] }))
  }, [])

  // Düzenleme: local olarak saklanır (API kaydı ise override edilir).
  const updatePatient = useCallback((id: string, draft: PatientDraft) => {
    setChanges((prev) => {
      const isLocalAdded = prev.added.some((p) => p.id === id)
      if (isLocalAdded) {
        return {
          ...prev,
          added: prev.added.map((p) => (p.id === id ? { ...p, ...draft, id } : p)),
        }
      }
      const base = prev.edited[id] ?? null
      const updated: Patient = {
        ...(base ?? { id, createdAt: new Date().toISOString() }),
        ...draft,
        id,
      } as Patient
      return { ...prev, edited: { ...prev.edited, [id]: updated } }
    })
  }, [])

  // Silme: local olarak saklanır.
  const deletePatient = useCallback((id: string) => {
    setChanges((prev) => {
      const restEdited = { ...prev.edited }
      delete restEdited[id]
      const isLocalAdded = prev.added.some((p) => p.id === id)
      if (isLocalAdded) {
        return {
          ...prev,
          added: prev.added.filter((p) => p.id !== id),
          edited: restEdited,
        }
      }
      return {
        ...prev,
        edited: restEdited,
        deleted: prev.deleted.includes(id)
          ? prev.deleted
          : [...prev.deleted, id],
      }
    })
  }, [])

  return {
    patients,
    isLoading,
    error,
    reload: () => load(),
    addPatient,
    updatePatient,
    deletePatient,
  }
}
