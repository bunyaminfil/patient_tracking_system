import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'
import { localizeDepartment, localizePriority } from '../i18n/translations'
import type { PatientDraft } from '../hooks/usePatients'
import type { Patient } from '../types/patient'
import {
  BLOOD_TYPE_OPTIONS,
  DEPARTMENT_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from '../types/patient'
import { localizeStatus } from '../i18n/translations'

interface PatientFormProps {
  initial?: Patient | null
  onSubmit: (draft: PatientDraft) => void
  onClose: () => void
}

function emptyDraft(): PatientDraft {
  return {
    fullName: '',
    birthDate: '',
    appointmentDate: '',
    department: DEPARTMENT_OPTIONS[0],
    status: 'Bekliyor',
    priority: 'normal',
    bloodType: BLOOD_TYPE_OPTIONS[0],
    score: 1,
    note_tr: '',
    note_en: '',
    diagnosis_tr: '',
    diagnosis_en: '',
    isInsured: false,
    isFollowUp: false,
    isVaccinated: false,
    tags: [],
    notes: null,
  }
}

function toDraft(patient: Patient): PatientDraft {
  const rest = { ...patient } as Partial<Patient>
  delete rest.id
  delete rest.createdAt
  return rest as PatientDraft
}

// API tarihleri "YYYY-MM-DDT00:00:00" formatında geliyor; input[type=date] için kırpıyoruz.
function toDateInput(value: string): string {
  if (!value) return ''
  return value.slice(0, 10)
}

// Yerel saat dilimine göre bugünün YYYY-MM-DD değeri.
function todayInput(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

export function PatientForm({ initial, onSubmit, onClose }: PatientFormProps) {
  const { t, lang } = useI18n()
  const [draft, setDraft] = useState<PatientDraft>(
    initial ? toDraft(initial) : emptyDraft(),
  )
  const [tagsInput, setTagsInput] = useState(
    initial ? initial.tags.join(', ') : '',
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const today = todayInput()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function update<K extends keyof PatientDraft>(key: K, value: PatientDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!draft.fullName.trim()) next.fullName = t('errFullName')
    if (!draft.birthDate) {
      next.birthDate = t('errBirthRequired')
    } else if (toDateInput(draft.birthDate) > today) {
      next.birthDate = t('errBirthFuture')
    }
    if (!draft.appointmentDate) {
      next.appointmentDate = t('errAppointmentRequired')
    } else if (toDateInput(draft.appointmentDate) < today) {
      next.appointmentDate = t('errAppointmentPast')
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
    onSubmit({ ...draft, tags })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2>{initial ? t('formEditTitle') : t('formAddTitle')}</h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label={t('close')}
          >
            ×
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form__grid">
            <div className="form__field form__field--full">
              <label htmlFor="fullName">
                {t('fullName')} {t('required')}
              </label>
              <input
                id="fullName"
                value={draft.fullName}
                onChange={(e) => update('fullName', e.target.value)}
              />
              {errors.fullName && (
                <span className="form__error">{errors.fullName}</span>
              )}
            </div>

            <div className="form__field">
              <label htmlFor="birthDate">
                {t('birthDate')} {t('required')}
              </label>
              <input
                id="birthDate"
                type="date"
                max={today}
                value={toDateInput(draft.birthDate)}
                onChange={(e) => update('birthDate', e.target.value)}
              />
              {errors.birthDate && (
                <span className="form__error">{errors.birthDate}</span>
              )}
            </div>

            <div className="form__field">
              <label htmlFor="appointmentDate">
                {t('appointmentDate')} {t('required')}
              </label>
              <input
                id="appointmentDate"
                type="date"
                min={today}
                value={toDateInput(draft.appointmentDate)}
                onChange={(e) => update('appointmentDate', e.target.value)}
              />
              {errors.appointmentDate && (
                <span className="form__error">{errors.appointmentDate}</span>
              )}
            </div>

            <div className="form__field">
              <label htmlFor="department">{t('department')}</label>
              <select
                id="department"
                value={draft.department}
                onChange={(e) => update('department', e.target.value)}
              >
                {DEPARTMENT_OPTIONS.map((dep) => (
                  <option key={dep} value={dep}>
                    {localizeDepartment(dep, lang)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__field">
              <label htmlFor="bloodType">{t('bloodType')}</label>
              <select
                id="bloodType"
                value={draft.bloodType}
                onChange={(e) => update('bloodType', e.target.value)}
              >
                {BLOOD_TYPE_OPTIONS.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__field">
              <label htmlFor="status">{t('status')}</label>
              <select
                id="status"
                value={draft.status}
                onChange={(e) =>
                  update('status', e.target.value as PatientDraft['status'])
                }
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {localizeStatus(s, lang)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__field">
              <label htmlFor="priority">{t('priority')}</label>
              <select
                id="priority"
                value={draft.priority}
                onChange={(e) =>
                  update('priority', e.target.value as PatientDraft['priority'])
                }
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {localizePriority(p, lang)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__field">
              <label htmlFor="score">{t('score')}</label>
              <input
                id="score"
                type="number"
                min={1}
                max={5}
                value={draft.score}
                onChange={(e) => update('score', Number(e.target.value))}
              />
            </div>

            <div className="form__field">
              <label htmlFor="diagnosis">{t('diagnosis')}</label>
              <input
                id="diagnosis"
                value={lang === 'en' ? draft.diagnosis_en : draft.diagnosis_tr}
                onChange={(e) =>
                  update(
                    lang === 'en' ? 'diagnosis_en' : 'diagnosis_tr',
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="form__field form__field--full">
              <label htmlFor="tags">{t('tags')}</label>
              <input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder={t('tagsPlaceholder')}
              />
            </div>

            <div className="form__field form__field--full">
              <label htmlFor="note">{t('note')}</label>
              <textarea
                id="note"
                rows={2}
                value={lang === 'en' ? draft.note_en : draft.note_tr}
                onChange={(e) =>
                  update(lang === 'en' ? 'note_en' : 'note_tr', e.target.value)
                }
              />
            </div>

            <div className="form__checks form__field--full">
              <label className="check">
                <input
                  type="checkbox"
                  checked={draft.isInsured}
                  onChange={(e) => update('isInsured', e.target.checked)}
                />
                {t('insured')}
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={draft.isFollowUp}
                  onChange={(e) => update('isFollowUp', e.target.checked)}
                />
                {t('followUp')}
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={draft.isVaccinated}
                  onChange={(e) => update('isVaccinated', e.target.checked)}
                />
                {t('vaccinated')}
              </label>
            </div>
          </div>

          <div className="form__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn--primary">
              {initial ? t('save') : t('create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
