import { useI18n } from '../i18n/context'
import { localizeDepartment } from '../i18n/translations'
import type { TranslationKey } from '../i18n/translations'
import { DEPARTMENT_OPTIONS } from '../types/patient'

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'appointment-asc'
  | 'appointment-desc'

interface ToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  departmentFilter: string
  onDepartmentChange: (value: string) => void
  sort: SortOption
  onSortChange: (value: SortOption) => void
  onAdd: () => void
  resultCount: number
}

const SORT_KEYS: Record<SortOption, TranslationKey> = {
  'name-asc': 'sortNameAsc',
  'name-desc': 'sortNameDesc',
  'appointment-asc': 'sortAppointmentAsc',
  'appointment-desc': 'sortAppointmentDesc',
}

export function Toolbar({
  search,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  sort,
  onSortChange,
  onAdd,
  resultCount,
}: ToolbarProps) {
  const { t, lang } = useI18n()

  return (
    <div className="toolbar">
      <div className="toolbar__field toolbar__search">
        <label htmlFor="search">{t('search')}</label>
        <input
          id="search"
          type="search"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="toolbar__field">
        <label htmlFor="department">{t('departmentFilter')}</label>
        <select
          id="department"
          value={departmentFilter}
          onChange={(e) => onDepartmentChange(e.target.value)}
        >
          <option value="">{t('allDepartments')}</option>
          {DEPARTMENT_OPTIONS.map((dep) => (
            <option key={dep} value={dep}>
              {localizeDepartment(dep, lang)}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar__field">
        <label htmlFor="sort">{t('sort')}</label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          {(Object.keys(SORT_KEYS) as SortOption[]).map((key) => (
            <option key={key} value={key}>
              {t(SORT_KEYS[key])}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar__spacer">
        <span className="toolbar__count">
          {t('recordCount', { n: resultCount })}
        </span>
        <button type="button" className="btn btn--primary" onClick={onAdd}>
          {t('addPatient')}
        </button>
      </div>
    </div>
  )
}
