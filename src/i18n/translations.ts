export type Lang = 'tr' | 'en'

export const translations = {
  tr: {
    appTitle: 'Hasta Takip Sistemi',
    loading: 'Hasta kayıtları yükleniyor...',
    retry: 'Tekrar Dene',
    recordCount: '{n} kayıt',

    // Toolbar
    search: 'Arama',
    searchPlaceholder: 'Hasta adı ara...',
    departmentFilter: 'Bölüm (Filtre)',
    allDepartments: 'Tüm bölümler',
    sort: 'Sıralama',
    addPatient: '+ Yeni Hasta',
    sortNameAsc: 'İsim (A → Z)',
    sortNameDesc: 'İsim (Z → A)',
    sortAppointmentAsc: 'Randevu (Yakın → Uzak)',
    sortAppointmentDesc: 'Randevu (Uzak → Yakın)',

    // Table
    colPatient: 'Hasta',
    colAge: 'Yaş',
    colDepartment: 'Bölüm',
    colDiagnosis: 'Tanı',
    colAppointment: 'Randevu',
    colPriority: 'Öncelik',
    colStatus: 'Durum',
    colActions: 'İşlemler',
    edit: 'Düzenle',
    delete: 'Sil',
    emptyTitle: 'Kayıt bulunamadı.',
    emptyHint: 'Arama veya filtre kriterlerini değiştirmeyi deneyin.',

    // Pagination
    prev: '← Önceki',
    next: 'Sonraki →',
    pageInfo: 'Sayfa {page} / {total}',

    // Form
    formAddTitle: 'Yeni Hasta Ekle',
    formEditTitle: 'Hasta Düzenle',
    fullName: 'Ad Soyad',
    birthDate: 'Doğum Tarihi',
    appointmentDate: 'Randevu Tarihi',
    department: 'Bölüm',
    bloodType: 'Kan Grubu',
    status: 'Durum',
    priority: 'Öncelik',
    score: 'Skor (1-5)',
    diagnosis: 'Tanı',
    tags: 'Etiketler (virgülle ayırın)',
    tagsPlaceholder: 'kronik, alerji, migren',
    note: 'Not',
    insured: 'Sigortalı',
    followUp: 'Takip Hastası',
    vaccinated: 'Aşılı',
    cancel: 'Vazgeç',
    save: 'Değişiklikleri Kaydet',
    create: 'Hasta Ekle',
    close: 'Kapat',

    // Validation
    errFullName: 'Ad Soyad zorunludur.',
    errBirthRequired: 'Doğum tarihi zorunludur.',
    errBirthFuture: 'Doğum tarihi bugünden sonra olamaz.',
    errAppointmentRequired: 'Randevu tarihi zorunludur.',
    errAppointmentPast: 'Randevu tarihi bugünden önce olamaz.',

    // Misc
    confirmDelete: '{name} adlı hastayı silmek istediğinize emin misiniz?',
    required: '*',
  },
  en: {
    appTitle: 'Patient Tracking System',
    loading: 'Loading patient records...',
    retry: 'Try Again',
    recordCount: '{n} records',

    search: 'Search',
    searchPlaceholder: 'Search patient name...',
    departmentFilter: 'Department (Filter)',
    allDepartments: 'All departments',
    sort: 'Sort',
    addPatient: '+ New Patient',
    sortNameAsc: 'Name (A → Z)',
    sortNameDesc: 'Name (Z → A)',
    sortAppointmentAsc: 'Appointment (Soonest → Latest)',
    sortAppointmentDesc: 'Appointment (Latest → Soonest)',

    colPatient: 'Patient',
    colAge: 'Age',
    colDepartment: 'Department',
    colDiagnosis: 'Diagnosis',
    colAppointment: 'Appointment',
    colPriority: 'Priority',
    colStatus: 'Status',
    colActions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    emptyTitle: 'No records found.',
    emptyHint: 'Try changing the search or filter criteria.',

    prev: '← Previous',
    next: 'Next →',
    pageInfo: 'Page {page} / {total}',

    formAddTitle: 'Add New Patient',
    formEditTitle: 'Edit Patient',
    fullName: 'Full Name',
    birthDate: 'Birth Date',
    appointmentDate: 'Appointment Date',
    department: 'Department',
    bloodType: 'Blood Type',
    status: 'Status',
    priority: 'Priority',
    score: 'Score (1-5)',
    diagnosis: 'Diagnosis',
    tags: 'Tags (comma separated)',
    tagsPlaceholder: 'chronic, allergy, migraine',
    note: 'Note',
    insured: 'Insured',
    followUp: 'Follow-up',
    vaccinated: 'Vaccinated',
    cancel: 'Cancel',
    save: 'Save Changes',
    create: 'Add Patient',
    close: 'Close',

    errFullName: 'Full name is required.',
    errBirthRequired: 'Birth date is required.',
    errBirthFuture: 'Birth date cannot be in the future.',
    errAppointmentRequired: 'Appointment date is required.',
    errAppointmentPast: 'Appointment date cannot be in the past.',

    confirmDelete: 'Are you sure you want to delete {name}?',
    required: '*',
  },
} as const

export type TranslationKey = keyof (typeof translations)['tr']

// Veride saklanan değerler Türkçedir; ekranda dile göre çevrilir, depolama Türkçe kalır.
const DEPARTMENT_LABELS: Record<Lang, Record<string, string>> = {
  tr: {},
  en: {
    Nöroloji: 'Neurology',
    Dahiliye: 'Internal Medicine',
    Pediatri: 'Pediatrics',
    Kardiyoloji: 'Cardiology',
    Ortopedi: 'Orthopedics',
  },
}

const STATUS_LABELS: Record<Lang, Record<string, string>> = {
  tr: {},
  en: {
    Bekliyor: 'Waiting',
    Muayenede: 'In Examination',
    Tamamlandı: 'Completed',
    İptal: 'Cancelled',
  },
}

const PRIORITY_LABELS: Record<Lang, Record<string, string>> = {
  tr: { acil: 'Acil', normal: 'Normal' },
  en: { acil: 'Urgent', normal: 'Normal' },
}

export function localizeDepartment(value: string, lang: Lang): string {
  return DEPARTMENT_LABELS[lang][value] ?? value
}

export function localizeStatus(value: string, lang: Lang): string {
  return STATUS_LABELS[lang][value] ?? value
}

export function localizePriority(value: string, lang: Lang): string {
  return PRIORITY_LABELS[lang][value] ?? value
}
