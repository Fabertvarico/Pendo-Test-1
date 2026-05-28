'use client'

import { useState } from 'react'

type Page = 'dashboard' | 'booking' | 'jadwal' | 'riwayat'
type Doctor = { id: string; name: string; initials: string; spec: string; color: string; textColor: string; available: boolean }
type Appointment = { id: number; date: string; month: string; patient: string; doctor: string; time: string; type: string; duration: string; status: 'upcoming' | 'done' }

const doctors: Doctor[] = [
  { id: 'doc1', name: 'Dr. Andi Pratama', initials: 'AP', spec: 'Spesialis Penyakit Dalam', color: '#E1F5EE', textColor: '#0F6E56', available: true },
  { id: 'doc2', name: 'Dr. Maya Sari', initials: 'MS', spec: 'Dokter Umum', color: '#E6F1FB', textColor: '#185FA5', available: true },
  { id: 'doc3', name: 'Dr. Reza Hermawan', initials: 'RH', spec: 'Spesialis Anak', color: '#FAEEDA', textColor: '#854F0B', available: false },
  { id: 'doc4', name: 'Dr. Liana Putri', initials: 'LP', spec: 'Spesialis Jantung', color: '#FBEAF0', textColor: '#72243E', available: true },
]

const appointments: Appointment[] = [
  { id: 1, date: '29', month: 'Mei', patient: 'Siti Rahayu', doctor: 'Dr. Andi Pratama', time: '09:00', type: 'Konsultasi umum', duration: '30 menit', status: 'upcoming' },
  { id: 2, date: '29', month: 'Mei', patient: 'Budi Santoso', doctor: 'Dr. Maya Sari', time: '10:30', type: 'Follow-up', duration: '20 menit', status: 'upcoming' },
  { id: 3, date: '28', month: 'Mei', patient: 'Ani Wijaya', doctor: 'Dr. Liana Putri', time: '14:00', type: 'Pemeriksaan jantung', duration: '45 menit', status: 'done' },
  { id: 4, date: '27', month: 'Mei', patient: 'Rizky Maulana', doctor: 'Dr. Andi Pratama', time: '11:00', type: 'Konsultasi rutin', duration: '30 menit', status: 'done' },
]

const timeSlots = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30']
const disabledSlots = ['09:00','10:00','11:30']

function track(feature: string, metadata?: object) {
  if (typeof window !== 'undefined' && (window as any).pendo?.track) {
    (window as any).pendo.track(feature, { timestamp: new Date().toISOString(), ...metadata })
  }
}

export default function Home() {
  const [page, setPage] = useState<Page>('dashboard')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [filterTab, setFilterTab] = useState('semua')
  const [toast, setToast] = useState<string | null>(null)
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0])
  const [doctorSearch, setDoctorSearch] = useState('')
  const [specialistFilter, setSpecialistFilter] = useState('Semua spesialis')
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [complaint, setComplaint] = useState('')
  const [visitType, setVisitType] = useState('Konsultasi pertama')
  const [riwayatSearch, setRiwayatSearch] = useState('')

  function navigate(p: Page) {
    track('nav_' + p)
    setPage(p)
    setSelectedDoctor(null)
    setSelectedTime(null)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleSelectDoctor(doc: Doctor) {
    if (!doc.available) return
    track('booking_pilih_dokter', { doctor: doc.name, specialist: doc.spec })
    setSelectedDoctor(doc)
    setSelectedTime(null)
  }

  function handleSelectTime(slot: string) {
    if (disabledSlots.includes(slot)) return
    track('booking_pilih_waktu', { time: slot, doctor: selectedDoctor?.name })
    setSelectedTime(slot)
  }

  function handleSubmitBooking() {
    track('booking_submit', {
      doctorName: selectedDoctor?.name,
      specialist: selectedDoctor?.spec,
      appointmentTime: selectedTime,
      appointmentDate: bookingDate,
      patientName: patientName,
      complaint: complaint,
      visitType: visitType,
      bookingDuration: '30 menit',
    })
    showToast(`Booking berhasil! ${selectedDoctor?.name} jam ${selectedTime}`)
    setSelectedDoctor(null)
    setSelectedTime(null)
    setPatientName('')
    setPatientPhone('')
    setComplaint('')
    setVisitType('Konsultasi pertama')
  }

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = !doctorSearch || d.name.toLowerCase().includes(doctorSearch.toLowerCase())
    const matchesFilter = specialistFilter === 'Semua spesialis' || d.spec.toLowerCase().includes(specialistFilter.toLowerCase())
    return matchesSearch && matchesFilter
  })

  const filteredRecords = [
    { icon: '🩺', title: 'Siti Rahayu — Konsultasi umum', desc: 'Diagnosa: ISPA ringan. Resep: Amoxicillin 500mg 3x1', date: '28 Mei', bg: '#E1F5EE' },
    { icon: '❤️', title: 'Ani Wijaya — Pemeriksaan jantung', desc: 'EKG normal. Tekanan darah 120/80. Lanjut kontrol 1 bulan', date: '28 Mei', bg: '#E6F1FB' },
    { icon: '💊', title: 'Budi Santoso — Follow-up diabetes', desc: 'Gula darah 145 mg/dL. Metformin dilanjutkan. Diet ketat', date: '27 Mei', bg: '#FAEEDA' },
    { icon: '👶', title: 'Rina Dewi — Imunisasi anak', desc: 'Vaksin DPT booster. Tidak ada reaksi. Jadwal next 3 bulan', date: '26 Mei', bg: '#FBEAF0' },
  ].filter(r => !riwayatSearch || r.title.toLowerCase().includes(riwayatSearch.toLowerCase()))

  const step = !selectedDoctor ? 1 : !selectedTime ? 2 : 3

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f5f5f3' }}>
      {/* NAVBAR */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e5e5e5', padding: '0 1.5rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, fontSize: 15 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1D9E75' }} />
          MediSlot
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['dashboard','booking','jadwal','riwayat'] as Page[]).map(p => (
            <button key={p} onClick={() => navigate(p)} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, color: page === p ? '#111' : '#666', cursor: 'pointer', border: 'none', background: page === p ? '#f0f0ee' : 'none', fontWeight: page === p ? 500 : 400 }}>
              {{ dashboard: '🏠 Beranda', booking: '📅 Booking', jadwal: '🗓 Jadwal', riwayat: '📋 Riwayat' }[p]}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => track('notification_bell')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, position: 'relative' }}>
            🔔
            <span style={{ position: 'absolute', top: 0, right: 0, width: 7, height: 7, borderRadius: '50%', background: '#E24B4A' }} />
          </button>
          <div onClick={() => track('profile_avatar')} style={{ width: 30, height: 30, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#185FA5', cursor: 'pointer' }}>
            DR
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem' }}>

        {/* ===== DASHBOARD ===== */}
        {page === 'dashboard' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Selamat pagi, Dr. Ridwan 👋</h1>
              <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Kamis, 29 Mei 2026</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
              {[
                { label: 'Pasien hari ini', value: '12', change: '↑ +3 dari kemarin', changeColor: '#3B6D11', id: 'stat_pasien_hari_ini' },
                { label: 'Booking pending', value: '4', change: '⏰ 2 segera', changeColor: '#A32D2D', id: 'stat_booking_pending' },
                { label: 'Slot tersisa', value: '6', change: 'dari 18 total', changeColor: '#888', id: 'stat_slot_tersisa' },
                { label: 'Rating bulan ini', value: '4.8', change: '⭐ dari 47 ulasan', changeColor: '#BA7517', id: 'stat_rating' },
              ].map(s => (
                <div key={s.id} onClick={() => track(s.id)} style={{ background: '#f0f0ee', borderRadius: 8, padding: '1rem', cursor: 'pointer' }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 500 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: s.changeColor, marginTop: 4 }}>{s.change}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Jadwal */}
              <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: 14, fontWeight: 500 }}>
                  Jadwal berikutnya
                  <button onClick={() => navigate('jadwal')} style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #e5e5e5', background: 'none', cursor: 'pointer' }}>Lihat semua</button>
                </div>
                {appointments.slice(0,3).map(a => (
                  <div key={a.id} onClick={() => track('appt_item_click', { patient: a.patient })} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f0f0ee', cursor: 'pointer' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, minWidth: 40, color: '#1D9E75' }}>{a.time}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{a.patient}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{a.type}</div>
                    </div>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: a.status === 'upcoming' ? '#E6F1FB' : '#EAF3DE', color: a.status === 'upcoming' ? '#185FA5' : '#3B6D11' }}>
                      {a.status === 'upcoming' ? 'Segera' : 'Selesai'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>Aktivitas cepat</div>
                {[
                  { icon: '📅', label: 'Buat booking baru', id: 'quick_booking', action: () => navigate('booking') },
                  { icon: '📄', label: 'Rekam medis pasien', id: 'quick_rekam_medis', action: () => track('quick_rekam_medis') },
                  { icon: '💊', label: 'Tulis resep', id: 'quick_resep', action: () => track('quick_resep') },
                  { icon: '📊', label: 'Lihat laporan', id: 'quick_laporan', action: () => track('quick_laporan') },
                ].map(q => (
                  <button key={q.id} onClick={() => { track(q.id); q.action() }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, border: '1px solid #e5e5e5', background: 'none', cursor: 'pointer', fontSize: 13, marginBottom: 6, textAlign: 'left' }}>
                    <span>{q.icon}</span> {q.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== BOOKING ===== */}
        {page === 'booking' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Buat booking baru</h1>
              <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Pilih dokter dan waktu yang tersedia</p>
            </div>

            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
              {['Pilih dokter', 'Pilih waktu', 'Konfirmasi'].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: step > i ? '#1D9E75' : step === i + 1 ? '#1D9E75' : '#aaa' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `1.5px solid ${step >= i + 1 ? '#1D9E75' : '#ccc'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, background: step > i + 1 ? '#1D9E75' : 'none', color: step > i + 1 ? 'white' : 'inherit' }}>
                      {step > i + 1 ? '✓' : i + 1}
                    </div>
                    {s}
                  </div>
                  {i < 2 && <div style={{ width: 40, height: 1, background: '#e5e5e5' }} />}
                </div>
              ))}
            </div>

            {/* Doctor list */}
            <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>Pilih dokter</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
                <input placeholder="Cari nama dokter..." value={doctorSearch} onChange={e => { const q = e.target.value; setDoctorSearch(q); const results = doctors.filter(d => { const ms = !q || d.name.toLowerCase().includes(q.toLowerCase()); const mf = specialistFilter === 'Semua spesialis' || d.spec.toLowerCase().includes(specialistFilter.toLowerCase()); return ms && mf }); track('booking_search_dokter', { searchQuery: q, resultsCount: results.length, specialistFilter: specialistFilter }) }} style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 13 }} />
                <select value={specialistFilter} onChange={e => { const val = e.target.value; setSpecialistFilter(val); const results = doctors.filter(d => { const ms = !doctorSearch || d.name.toLowerCase().includes(doctorSearch.toLowerCase()); const mf = val === 'Semua spesialis' || d.spec.toLowerCase().includes(val.toLowerCase()); return ms && mf }); track('booking_filter_spesialis', { filterValue: val, resultsCount: results.length }) }} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 13 }}>
                  <option>Semua spesialis</option>
                  <option>Umum</option>
                  <option>Penyakit dalam</option>
                  <option>Anak</option>
                  <option>Jantung</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredDoctors.map(doc => (
                  <div key={doc.id} onClick={() => handleSelectDoctor(doc)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 8, border: `1px solid ${selectedDoctor?.id === doc.id ? '#1D9E75' : '#e5e5e5'}`, background: selectedDoctor?.id === doc.id ? '#E1F5EE' : 'none', cursor: doc.available ? 'pointer' : 'not-allowed', opacity: doc.available ? 1 : 0.5 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: doc.color, color: doc.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>{doc.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{doc.spec}</div>
                    </div>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: doc.available ? '#E1F5EE' : '#FCEBEB', color: doc.available ? '#0F6E56' : '#A32D2D' }}>
                      {doc.available ? 'Tersedia' : 'Penuh'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time picker */}
            {selectedDoctor && (
              <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>
                  Pilih waktu — <span style={{ color: '#1D9E75', fontWeight: 400 }}>{selectedDoctor.name}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 6 }}>Tanggal</label>
                  <input type="date" value={bookingDate} onChange={e => { setBookingDate(e.target.value); track('booking_pilih_tanggal') }} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 13 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {timeSlots.map(slot => {
                    const disabled = disabledSlots.includes(slot)
                    const selected = selectedTime === slot
                    return (
                      <button key={slot} onClick={() => handleSelectTime(slot)} disabled={disabled} style={{ padding: 8, textAlign: 'center', borderRadius: 8, border: `1px solid ${selected ? '#1D9E75' : '#e5e5e5'}`, fontSize: 12, cursor: disabled ? 'not-allowed' : 'pointer', background: selected ? '#1D9E75' : disabled ? '#f5f5f3' : 'white', color: selected ? 'white' : disabled ? '#bbb' : '#333' }}>
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Confirm form */}
            {selectedDoctor && selectedTime && (
              <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>Detail pasien</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 6 }}>Nama lengkap</label>
                    <input placeholder="Nama pasien" value={patientName} onChange={e => { setPatientName(e.target.value); track('booking_input_nama') }} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 6 }}>No. telepon</label>
                    <input placeholder="08xx" value={patientPhone} onChange={e => { setPatientPhone(e.target.value); track('booking_input_telepon') }} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 6 }}>Keluhan utama</label>
                    <input placeholder="Tuliskan keluhan..." value={complaint} onChange={e => { setComplaint(e.target.value); track('booking_input_keluhan') }} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 6 }}>Jenis kunjungan</label>
                    <select value={visitType} onChange={e => { setVisitType(e.target.value); track('booking_jenis_kunjungan') }} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 13 }}>
                      <option>Konsultasi pertama</option>
                      <option>Follow-up</option>
                      <option>Pemeriksaan rutin</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => { track('booking_cancel'); setSelectedDoctor(null); setSelectedTime(null) }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e5e5', background: 'none', cursor: 'pointer', fontSize: 13 }}>Batal</button>
                  <button onClick={handleSubmitBooking} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1D9E75', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Konfirmasi booking</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== JADWAL ===== */}
        {page === 'jadwal' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Jadwal saya</h1>
              <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Semua appointment yang terjadwal</p>
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: '1rem' }}>
              {['semua','upcoming','selesai','dibatalkan'].map(f => (
                <button key={f} onClick={() => { setFilterTab(f); track('jadwal_filter_' + f) }} style={{ padding: '5px 12px', borderRadius: 99, fontSize: 12, cursor: 'pointer', border: `1px solid ${filterTab === f ? '#1D9E75' : '#e5e5e5'}`, background: filterTab === f ? '#1D9E75' : 'none', color: filterTab === f ? 'white' : '#666' }}>
                  {{ semua: 'Semua', upcoming: 'Akan datang', selesai: 'Selesai', dibatalkan: 'Dibatalkan' }[f]}
                </button>
              ))}
            </div>
            <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: '1.25rem' }}>
              {appointments.map(a => (
                <div key={a.id} onClick={() => track('jadwal_item_click', { patient: a.patient })} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f0f0ee', cursor: 'pointer' }}>
                  <div style={{ textAlign: 'center', minWidth: 44, fontSize: 11, color: '#888' }}>
                    <strong style={{ display: 'block', fontSize: 18, fontWeight: 500, color: '#111' }}>{a.date}</strong>
                    {a.month}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{a.patient} — {a.doctor}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{a.time} · {a.type} · {a.duration}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 99, background: a.status === 'upcoming' ? '#E6F1FB' : '#EAF3DE', color: a.status === 'upcoming' ? '#185FA5' : '#3B6D11' }}>
                      {a.status === 'upcoming' ? 'Akan datang' : 'Selesai'}
                    </span>
                    {a.status === 'upcoming' && (
                      <button onClick={e => { e.stopPropagation(); track('jadwal_cancel_btn', { appointmentId: a.id, patientName: a.patient, doctorName: a.doctor, appointmentTime: a.time, appointmentDate: `${a.date} ${a.month}`, appointmentType: a.type }) }} style={{ padding: '3px 8px', fontSize: 11, borderRadius: 6, border: '1px solid #F09595', background: 'none', color: '#A32D2D', cursor: 'pointer' }}>Batalkan</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== RIWAYAT ===== */}
        {page === 'riwayat' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Riwayat medis</h1>
              <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Rekam jejak kesehatan pasien</p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
              <input placeholder="Cari nama pasien..." value={riwayatSearch} onChange={e => { const q = e.target.value; setRiwayatSearch(q); const allRecords = [{ title: 'Siti Rahayu — Konsultasi umum' }, { title: 'Ani Wijaya — Pemeriksaan jantung' }, { title: 'Budi Santoso — Follow-up diabetes' }, { title: 'Rina Dewi — Imunisasi anak' }]; const count = allRecords.filter(r => !q || r.title.toLowerCase().includes(q.toLowerCase())).length; track('riwayat_search', { searchQuery: q, resultsCount: count }) }} style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 13 }} />
              <button onClick={() => track('riwayat_export', { exportFormat: 'csv', recordCount: filteredRecords.length, filterApplied: riwayatSearch || 'none' })} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e5e5', background: 'none', cursor: 'pointer', fontSize: 13 }}>⬇ Ekspor</button>
            </div>
            <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>
                Rekam medis terbaru
                <button onClick={() => track('riwayat_tambah', { recordCount: filteredRecords.length, filterApplied: riwayatSearch || 'none' })} style={{ padding: '5px 10px', fontSize: 12, borderRadius: 6, border: 'none', background: '#1D9E75', color: 'white', cursor: 'pointer' }}>+ Tambah</button>
              </div>
              {filteredRecords.map((r, i) => (
                <div key={i} onClick={() => track('riwayat_item_click', { title: r.title })} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < filteredRecords.length - 1 ? '1px solid #f0f0ee' : 'none', cursor: 'pointer' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>{r.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{r.desc}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>{r.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: '12px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxWidth: 280, zIndex: 100 }}>
          <span style={{ color: '#1D9E75', fontSize: 18 }}>✓</span>
          {toast}
        </div>
      )}
    </div>
  )
}