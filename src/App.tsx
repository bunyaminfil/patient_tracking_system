import { useMemo, useState } from 'react'
import './App.css'
import { PatientForm } from './components/PatientForm'
import { PatientTable } from './components/PatientTable'
import { Toolbar } from './components/Toolbar'
import type { SortOption } from './components/Toolbar'
import { usePatients } from './hooks/usePatients'
import type { PatientDraft } from './hooks/usePatients'
import type { Patient } from './types/patient'
import { useI18n } from './i18n/context'

type ModalState =
  | { mode: 'closed' }
  | { mode: 'add' }
  | { mode: 'edit'; patient: Patient }

function App() {
  const { t, lang, setLang } = useI18n()
  const {
    patients,
    isLoading,
    error,
    reload,
    addPatient,
    updatePatient,
    deletePatient,
  } = usePatients()

  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [sort, setSort] = useState<SortOption>('name-asc')
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' })
  const [page, setPage] = useState(1)

  const PAGE_SIZE = 10

  const visiblePatients = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('tr-TR')

    let result = patients.filter((p) => {
      // Arama: hasta adına göre
      const matchesSearch =
        query === '' || p.fullName.toLocaleLowerCase('tr-TR').includes(query)
      // Filtre: bölüme göre
      const matchesDepartment =
        departmentFilter === '' || p.department === departmentFilter
      return matchesSearch && matchesDepartment
    })

    // Sıralama
    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return a.fullName.localeCompare(b.fullName, 'tr-TR')
        case 'name-desc':
          return b.fullName.localeCompare(a.fullName, 'tr-TR')
        case 'appointment-asc':
          return (
            new Date(a.appointmentDate).getTime() -
            new Date(b.appointmentDate).getTime()
          )
        case 'appointment-desc':
          return (
            new Date(b.appointmentDate).getTime() -
            new Date(a.appointmentDate).getTime()
          )
        default:
          return 0
      }
    })

    return result
  }, [patients, search, departmentFilter, sort])

  const pageCount = Math.max(1, Math.ceil(visiblePatients.length / PAGE_SIZE))

  // Liste kısaldığında mevcut sayfayı render sırasında sınır içinde tut.
  const safePage = Math.min(page, pageCount)

  // Filtre/arama/sıralama değişince ilk sayfaya dön.
  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }
  function handleDepartmentChange(value: string) {
    setDepartmentFilter(value)
    setPage(1)
  }
  function handleSortChange(value: SortOption) {
    setSort(value)
    setPage(1)
  }

  const pagedPatients = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return visiblePatients.slice(start, start + PAGE_SIZE)
  }, [visiblePatients, safePage])

  function handleSubmit(draft: PatientDraft) {
    if (modal.mode === 'edit') {
      updatePatient(modal.patient.id, draft)
    } else if (modal.mode === 'add') {
      addPatient(draft)
    }
    setModal({ mode: 'closed' })
  }

  function handleDelete(patient: Patient) {
    const ok = window.confirm(t('confirmDelete', { name: patient.fullName }))
    if (ok) deletePatient(patient.id)
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>{t('appTitle')}</h1>
        </div>
        <div className="lang-switch" role="group" aria-label="Language">
          <button
            type="button"
            className={lang === 'tr' ? 'lang-switch__btn is-active' : 'lang-switch__btn'}
            onClick={() => setLang('tr')}
          >
            TR
          </button>
          <button
            type="button"
            className={lang === 'en' ? 'lang-switch__btn is-active' : 'lang-switch__btn'}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>
      </header>

      <main className="app__main">
        <Toolbar
          search={search}
          onSearchChange={handleSearchChange}
          departmentFilter={departmentFilter}
          onDepartmentChange={handleDepartmentChange}
          sort={sort}
          onSortChange={handleSortChange}
          onAdd={() => setModal({ mode: 'add' })}
          resultCount={visiblePatients.length}
        />

        {isLoading && (
          <div className="state state--loading">
            <span className="spinner" />
            {t('loading')}
          </div>
        )}

        {error && !isLoading && (
          <div className="state state--error">
            <p>{error}</p>
            <button type="button" className="btn btn--primary" onClick={reload}>
              {t('retry')}
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <PatientTable
              patients={pagedPatients}
              onEdit={(patient) => setModal({ mode: 'edit', patient })}
              onDelete={handleDelete}
            />

            {visiblePatients.length > 0 && (
              <div className="pagination">
                <span className="pagination__info">
                  {(safePage - 1) * PAGE_SIZE + 1}–
                  {Math.min(safePage * PAGE_SIZE, visiblePatients.length)} /{' '}
                  {visiblePatients.length}
                </span>
                <div className="pagination__controls">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setPage(Math.max(1, safePage - 1))}
                    disabled={safePage === 1}
                  >
                    {t('prev')}
                  </button>
                  <span className="pagination__page">
                    {t('pageInfo', { page: safePage, total: pageCount })}
                  </span>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setPage(Math.min(pageCount, safePage + 1))}
                    disabled={safePage === pageCount}
                  >
                    {t('next')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {modal.mode !== 'closed' && (
        <PatientForm
          initial={modal.mode === 'edit' ? modal.patient : null}
          onSubmit={handleSubmit}
          onClose={() => setModal({ mode: 'closed' })}
        />
      )}
    </div>
  )
}

export default App
