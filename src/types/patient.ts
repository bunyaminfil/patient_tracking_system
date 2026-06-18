export type PatientStatus =
  | 'Bekliyor'
  | 'Muayenede'
  | 'Tamamlandı'
  | 'İptal'

export type PatientPriority = 'normal' | 'acil'

export type Department =
  | 'Nöroloji'
  | 'Dahiliye'
  | 'Pediatri'
  | 'Kardiyoloji'
  | 'Ortopedi'

export interface Patient {
  id: string
  fullName: string
  birthDate: string
  appointmentDate: string
  createdAt: string
  department: string
  status: PatientStatus
  priority: PatientPriority
  bloodType: string
  score: number
  note_tr: string
  note_en: string
  diagnosis_tr: string
  diagnosis_en: string
  isInsured: boolean
  isFollowUp: boolean
  isVaccinated: boolean
  tags: string[]
  notes: string | null
}

export const STATUS_OPTIONS: PatientStatus[] = [
  'Bekliyor',
  'Muayenede',
  'Tamamlandı',
  'İptal',
]

export const PRIORITY_OPTIONS: PatientPriority[] = ['normal', 'acil']

export const DEPARTMENT_OPTIONS: Department[] = [
  'Nöroloji',
  'Dahiliye',
  'Pediatri',
  'Kardiyoloji',
  'Ortopedi',
]

export const BLOOD_TYPE_OPTIONS = [
  '0+',
  '0-',
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
]
