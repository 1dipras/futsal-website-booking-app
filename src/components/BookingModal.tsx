import { useState } from 'react'
import type { Field, Booking } from '../types'

interface BookingModalProps {
  field: Field
  onClose: () => void
  onConfirm: (booking: Booking, paymentMethod: string, totalPrice: number) => void
}

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00',
]

const PAYMENT_METHODS = [
  { id: 'transfer', label: 'Transfer Bank', icon: '🏦' },
  { id: 'qris', label: 'QRIS', icon: '📱' },
  { id: 'cash', label: 'Tunai', icon: '💵' },
  { id: 'ovo', label: 'OVO', icon: '🟣' },
  { id: 'gopay', label: 'GoPay', icon: '🟢' },
]

function getEndTime(start: string, duration: number): string {
  const [h, m] = start.split(':').map(Number)
  const totalMin = h * 60 + m + duration * 60
  const eh = Math.floor(totalMin / 60) % 24
  const em = totalMin % 60
  return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`
}

function isSlotBooked(field: Field, slot: string, date: string, duration: number): boolean {
  const endTime = getEndTime(slot, duration)
  return field.bookings.some(b => {
    // Check if same date
    if (b.date !== date) return false
    // Check for time overlap: (start1 < end2) && (end1 > start2)
    return slot < b.endTime && endTime > b.startTime
  })
}

export default function BookingModal({ field, onClose, onConfirm }: BookingModalProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'confirm'>('form')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState('')
  const [duration, setDuration] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [error, setError] = useState('')

  const endTime = startTime ? getEndTime(startTime, duration) : ''
  const totalPrice = field.pricePerHour * duration

  const handleFormNext = () => {
    if (!name.trim()) { setError('Nama wajib diisi'); return }
    if (!phone.trim()) { setError('No. HP wajib diisi'); return }
    if (!startTime) { setError('Pilih waktu mulai'); return }
    if (isSlotBooked(field, startTime, date, duration)) { setError('Slot ini sudah terboking'); return }
    setError('')
    setStep('payment')
  }

  const handlePaymentNext = () => {
    if (!paymentMethod) { setError('Pilih metode pembayaran'); return }
    setError('')
    setStep('confirm')
  }

  const handleConfirm = () => {
    const booking: Booking = {
      id: 'b' + Date.now(),
      fieldId: field.id,
      date,
      startTime,
      endTime,
      customerName: name,
      expiresAt: Date.now() + duration * 3600 * 1000,
    }
    onConfirm(booking, paymentMethod, totalPrice)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {step === 'form' && 'BOOKING LAPANGAN'}
              {step === 'payment' && 'PEMBAYARAN'}
              {step === 'confirm' && 'KONFIRMASI'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{field.name} · {field.type}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
            style={{ backgroundColor: 'var(--secondary)', color: 'var(--muted-foreground)' }}
          >
            ✕
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex px-6 py-3 gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
          {['form', 'payment', 'confirm'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  backgroundColor: step === s ? 'var(--primary)' : (
                    ['form', 'payment', 'confirm'].indexOf(step) > i ? 'var(--primary)' : 'var(--secondary)'
                  ),
                  color: step === s ? 'var(--primary-foreground)' : (
                    ['form', 'payment', 'confirm'].indexOf(step) > i ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
                  ),
                }}
              >
                {['form', 'payment', 'confirm'].indexOf(step) > i ? '✓' : i + 1}
              </div>
              {i < 2 && <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)', width: 20 }} />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">
          {step === 'form' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>No. HP</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="08xx-xxxx-xxxx"
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Tanggal</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)', colorScheme: 'dark' }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Waktu Mulai</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {TIME_SLOTS.map(slot => {
                    const booked = isSlotBooked(field, slot, date, duration)
                    const selected = startTime === slot
                    return (
                      <button
                        key={slot}
                        disabled={booked}
                        onClick={() => setStartTime(slot)}
                        className="py-2 rounded text-xs font-medium transition-all"
                        style={{
                          fontFamily: 'Barlow Condensed, sans-serif',
                          backgroundColor: selected ? 'var(--primary)' : booked ? 'rgba(239,68,68,0.1)' : 'var(--secondary)',
                          color: selected ? 'var(--primary-foreground)' : booked ? '#ef4444' : 'var(--secondary-foreground)',
                          cursor: booked ? 'not-allowed' : 'pointer',
                          border: booked ? '1px solid rgba(239,68,68,0.2)' : '1px solid transparent',
                          opacity: booked ? 0.6 : 1,
                        }}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <span className="mr-3">
                    <span className="inline-block w-2 h-2 rounded mr-1" style={{ backgroundColor: 'var(--primary)' }} />
                    Dipilih
                  </span>
                  <span>
                    <span className="inline-block w-2 h-2 rounded mr-1 bg-red-500/40" />
                    Terboking
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Durasi</label>
                <div className="flex gap-2">
                  {[1, 1.5, 2, 3].map(d => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className="flex-1 py-2 rounded text-xs font-bold transition-all"
                      style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        backgroundColor: duration === d ? 'var(--primary)' : 'var(--secondary)',
                        color: duration === d ? 'var(--primary-foreground)' : 'var(--secondary-foreground)',
                      }}
                    >
                      {d}j
                    </button>
                  ))}
                </div>
              </div>

              {startTime && (
                <div
                  className="rounded-lg px-4 py-3 flex justify-between items-center"
                  style={{ backgroundColor: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)' }}
                >
                  <div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Waktu booking</p>
                    <p className="font-bold text-sm" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      {startTime} – {endTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Total</p>
                    <p className="font-bold text-lg" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--primary)' }}>
                      Rp {totalPrice.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'payment' && (
            <>
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)' }}
              >
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Ringkasan Booking</p>
                <p className="font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{field.name} · {startTime}–{endTime}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{name} · {date}</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Metode Pembayaran</label>
                {PAYMENT_METHODS.map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: paymentMethod === pm.id ? 'rgba(74,222,128,0.1)' : 'var(--secondary)',
                      border: paymentMethod === pm.id ? '1px solid rgba(74,222,128,0.4)' : '1px solid var(--border)',
                      color: paymentMethod === pm.id ? 'var(--primary)' : 'var(--foreground)',
                    }}
                  >
                    <span className="text-base">{pm.icon}</span>
                    {pm.label}
                    {paymentMethod === pm.id && (
                      <span className="ml-auto text-xs" style={{ color: 'var(--primary)' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>

              <div
                className="rounded-lg px-4 py-3 flex justify-between items-center"
                style={{ backgroundColor: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)' }}
              >
                <span className="text-sm font-medium">Total Pembayaran</span>
                <span className="text-xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--primary)' }}>
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </>
          )}

          {step === 'confirm' && (
            <>
              <div className="text-center py-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(74,222,128,0.1)', border: '2px solid rgba(74,222,128,0.3)' }}
                >
                  ✅
                </div>
                <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--primary)' }}>
                  KONFIRMASI BOOKING
                </h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Periksa detail sebelum melanjutkan</p>
              </div>

              <div
                className="rounded-xl divide-y"
                style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', borderColor: 'var(--border)' }}
              >
                {[
                  { label: 'Lapangan', value: `${field.name} (${field.type})` },
                  { label: 'Nama', value: name },
                  { label: 'No. HP', value: phone },
                  { label: 'Tanggal', value: new Date(date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                  { label: 'Waktu', value: `${startTime} – ${endTime} (${duration}j)` },
                  { label: 'Pembayaran', value: PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label ?? '' },
                  { label: 'Total', value: `Rp ${totalPrice.toLocaleString('id-ID')}`, highlight: true },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center px-4 py-3">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{row.label}</span>
                    <span
                      className="text-sm font-medium text-right max-w-52"
                      style={{ color: row.highlight ? 'var(--primary)' : 'var(--foreground)', fontFamily: row.highlight ? 'Barlow Condensed, sans-serif' : undefined, fontSize: row.highlight ? '1.1rem' : undefined }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {error && (
            <p className="text-xs px-3 py-2 rounded" style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => step === 'form' ? onClose() : setStep(step === 'payment' ? 'form' : 'payment')}
            className="flex-1 py-3 rounded-lg text-sm font-bold"
            style={{ fontFamily: 'Barlow Condensed, sans-serif', backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
          >
            {step === 'form' ? 'BATAL' : 'KEMBALI'}
          </button>
          <button
            onClick={step === 'form' ? handleFormNext : step === 'payment' ? handlePaymentNext : handleConfirm}
            className="flex-1 py-3 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
            style={{ fontFamily: 'Barlow Condensed, sans-serif', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            {step === 'confirm' ? 'BAYAR SEKARANG' : 'LANJUT'}
          </button>
        </div>
      </div>
    </div>
  )
}
