import type { Patient } from '../types/patient'

const API_URL = 'https://v0-json-api-three.vercel.app/api/data'

export async function fetchPatients(signal?: AbortSignal): Promise<Patient[]> {
  const response = await fetch(API_URL, { signal })

  if (!response.ok) {
    throw new Error(`Hasta kayıtları alınamadı (HTTP ${response.status})`)
  }

  const data = (await response.json()) as Patient[]
  return data
}
