import { useI18n } from '../i18n/context'
import { localizeDepartment, localizeStatus } from '../i18n/translations'
import type { Patient } from '../types/patient'
import { calculateAge, formatDate } from '../utils/format'

interface PatientTableProps {
  patients: Patient[]
  onEdit: (patient: Patient) => void
  onDelete: (patient: Patient) => void
}

function statusClass(status: Patient['status']): string {
  switch (status) {
    case 'Bekliyor':
      return 'badge badge--waiting'
    case 'Muayenede':
      return 'badge badge--active'
    case 'Tamamlandı':
      return 'badge badge--done'
    case 'İptal':
      return 'badge badge--cancelled'
    default:
      return 'badge'
  }
}

export function PatientTable({ patients, onEdit, onDelete }: PatientTableProps) {
  const { t, lang } = useI18n()

  if (patients.length === 0) {
    return (
      <div className="empty">
        <p>{t('emptyTitle')}</p>
        <span>{t('emptyHint')}</span>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>{t('colPatient')}</th>
            <th>{t('colAge')}</th>
            <th>{t('colDepartment')}</th>
            <th>{t('colDiagnosis')}</th>
            <th>{t('colAppointment')}</th>
            <th>{t('colPriority')}</th>
            <th>{t('colStatus')}</th>
            <th className="table__actions-col">{t('colActions')}</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            const age = calculateAge(patient.birthDate)
            const diagnosis =
              lang === 'en' ? patient.diagnosis_en : patient.diagnosis_tr
            return (
              <tr key={patient.id}>
                <td data-label={t('colPatient')}>
                  <div className="cell-name">
                    <span className="cell-name__main">{patient.fullName}</span>
                    <span className="cell-name__sub">{patient.bloodType}</span>
                  </div>
                </td>
                <td data-label={t('colAge')}>{age ?? '—'}</td>
                <td data-label={t('colDepartment')}>
                  {localizeDepartment(patient.department, lang)}
                </td>
                <td data-label={t('colDiagnosis')}>{diagnosis}</td>
                <td data-label={t('colAppointment')}>
                  {formatDate(patient.appointmentDate, lang)}
                </td>
                <td data-label={t('colPriority')}>
                  <span
                    className={
                      patient.priority === 'acil'
                        ? 'badge badge--urgent'
                        : 'badge badge--normal'
                    }
                  >
                    {patient.priority === 'acil'
                      ? lang === 'en'
                        ? 'Urgent'
                        : 'Acil'
                      : 'Normal'}
                  </span>
                </td>
                <td data-label={t('colStatus')}>
                  <span className={statusClass(patient.status)}>
                    {localizeStatus(patient.status, lang)}
                  </span>
                </td>
                <td className="table__actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => onEdit(patient)}
                  >
                    {t('edit')}
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger-ghost"
                    onClick={() => onDelete(patient)}
                  >
                    {t('delete')}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
