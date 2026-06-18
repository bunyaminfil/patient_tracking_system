# Hasta Takip Sistemi (Patient Tracking System)

React 19 + TypeScript + Vite ile geliştirilmiş hasta takip uygulaması.

## Özellikler

- **Listeleme**: Hasta kayıtları API'den `GET` ile çekilir ve tablo halinde gösterilir.
- **Ekleme**: Yeni hasta eklenebilir. Ekleme işleminin API karşılığı yoktur; kayıt yalnızca local state üzerinde tutulur (listenin başına eklenir).
- **Düzenleme**: Mevcut kayıtlar düzenlenebilir (local state).
- **Silme**: Kayıtlar onay sonrası silinebilir (local state).
- **Arama**: Hasta adına göre canlı arama.
- **Filtreleme**: Bölüme (department) göre filtreleme.
- **Sıralama**: İsim (A→Z / Z→A) ve randevu tarihine (yakın/uzak) göre sıralama.
- **Pagination**: Sayfa başına 10 kayıt.
- **İki dil (TR/EN)**: Tüm arayüz ile bölüm/durum/öncelik etiketleri ve tanı/not alanları dile göre gösterilir. Dil tercihi `localStorage`'da saklanır.
- **Tarih doğrulama**: Doğum tarihi gelecekte, randevu tarihi geçmişte olamaz.

## Veri Kaynağı

```
GET https://v0-json-api-three.vercel.app/api/data
```

## Mimari

```
src/
├── api/patients.ts          # API çağrısı (fetch)
├── hooks/usePatients.ts     # Veri yükleme + local CRUD (localStorage kalıcı)
├── i18n/
│   ├── translations.ts      # TR/EN sözlükleri ve etiket çevirileri
│   ├── context.ts           # I18nContext + useI18n hook
│   └── I18nProvider.tsx     # Dil sağlayıcı (localStorage)
├── components/
│   ├── Toolbar.tsx          # Arama, filtre, sıralama, ekleme butonu
│   ├── PatientTable.tsx     # Hasta listesi tablosu
│   └── PatientForm.tsx      # Ekleme/düzenleme modalı
├── types/patient.ts         # Patient tipi ve sabitler
├── utils/format.ts          # Tarih ve yaş formatlama
└── App.tsx                  # Arama/filtre/sıralama/pagination orkestrasyonu
```

## Çalıştırma

```bash
npm install
npm run dev      # geliştirme sunucusu
npm run build    # production build
npm run lint     # eslint
```
