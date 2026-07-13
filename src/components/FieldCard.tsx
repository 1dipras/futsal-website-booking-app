import { useState, useEffect } from 'react'
import type { Field, Booking } from '../types'

interface FieldCardProps {
  field: Field
  now: number
  onBook: () => void
}

function getCountdown(expiresAt: number, now: number): string {
  const diff = expiresAt - now
  if (diff <= 0) return 'Selesai'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  if (h > 0) return `${h}j ${m}m ${s}d`
  if (m > 0) return `${m}m ${s}d`
  return `${s}d`
}

function getCurrentBooking(field: Field, now: number): Booking | null {
  const nowTime = new Date(now)
  const hhmm = `${String(nowTime.getHours()).padStart(2, '0')}:${String(nowTime.getMinutes()).padStart(2, '0')}`
  return field.bookings.find(b => b.startTime <= hhmm && hhmm < b.endTime) ?? null
}

function getNextBooking(field: Field, now: number): Booking | null {
  const nowTime = new Date(now)
  const hhmm = `${String(nowTime.getHours()).padStart(2, '0')}:${String(nowTime.getMinutes()).padStart(2, '0')}`
  const upcoming = field.bookings
    .filter(b => b.startTime > hhmm)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
  return upcoming[0] ?? null
}

export default function FieldCard({ field, now, onBook }: FieldCardProps) {
  const currentBooking = getCurrentBooking(field, now)
  const nextBooking = getNextBooking(field, now)
  const isBooked = currentBooking !== null
  const [expanded, setExpanded] = useState(false)

  const statusColor = isBooked ? '#ef4444' : 'var(--primary)'
  const statusLabel = isBooked ? 'TERBOKING' : 'TERSEDIA'

  const totalSlots = 16
  const bookedSlots = field.bookings.length

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-0.5"
      style={{
        backgroundColor: 'var(--card)',
        border: `1px solid ${isBooked ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
        boxShadow: isBooked ? '0 0 20px rgba(239,68,68,0.05)' : '0 0 20px rgba(74,222,128,0.03)',
      }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden" style={{ backgroundColor: '#0a150a' }}>
        <img
          src={field.image}
          alt={field.name}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--card) 0%, transparent 60%)' }} />

        {/* Status badge */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5"
          style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            backgroundColor: isBooked ? 'rgba(239,68,68,0.15)' : 'rgba(74,222,128,0.15)',
            color: statusColor,
            border: `1px solid ${isBooked ? 'rgba(239,68,68,0.4)' : 'rgba(74,222,128,0.4)'}`,
            backdropFilter: 'blur(4px)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ backgroundColor: statusColor, animation: isBooked ? 'none' : 'pulse 2s infinite' }}
          />
          {statusLabel}
        </div>

        {/* Field type */}
        <div
          className="absolute top-3 left-3 px-2 py-1 rounded text-xs"
          style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            backgroundColor: 'rgba(8,12,8,0.7)',
            color: 'var(--muted-foreground)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {field.type.toUpperCase()} · {field.surface}
        </div>

        {/* Field name overlay */}
        <div className="absolute bottom-3 left-4">
          <h3 className="text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            {field.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-xl font-bold"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--primary)' }}
            >
              Rp {field.pricePerHour.toLocaleString('id-ID')}
            </span>
            <span className="text-xs ml-1" style={{ color: 'var(--muted-foreground)' }}>/jam</span>
          </div>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {field.capacity} pemain
          </span>
        </div>

        {/* Current booking countdown */}
        {isBooked && currentBooking && (
          <div
            className="rounded-lg px-3 py-2.5"
            style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium" style={{ color: '#ef4444' }}>Sedang digunakan</span>
              <span className="text-xs font-mono font-bold" style={{ color: '#ef4444' }}>
                ⏱ {getCountdown(currentBooking.expiresAt, now)}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {currentBooking.customerName} · {currentBooking.startTime}–{currentBooking.endTime}
            </p>
          </div>
        )}

        {/* Next booking */}
        {!isBooked && nextBooking && (
          <div
            className="rounded-lg px-3 py-2"
            style={{ backgroundColor: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)' }}
          >
            <p className="text-xs" style={{ color: '#ca8a04' }}>
              Booking berikutnya: <strong>{nextBooking.startTime}–{nextBooking.endTime}</strong>
            </p>
          </div>
        )}

        {/* Booking schedule toggle */}
        {field.bookings.length > 0 && (
          <button
            className="text-xs text-left transition-colors"
            style={{ color: 'var(--muted-foreground)' }}
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? '▴' : '▾'} {field.bookings.length} jadwal hari ini
          </button>
        )}

        {expanded && (
          <div className="flex flex-col gap-1">
            {field.bookings.map(b => {
              const nowHhmm = new Date(now).toTimeString().slice(0, 5)
              const active = b.startTime <= nowHhmm && nowHhmm < b.endTime
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded px-2.5 py-1.5 text-xs"
                  style={{
                    backgroundColor: active ? 'rgba(239,68,68,0.08)' : 'var(--secondary)',
                    color: active ? '#ef4444' : 'var(--muted-foreground)',
                  }}
                >
                  <span>{b.startTime}–{b.endTime}</span>
                  <span>{b.customerName}</span>
                  {active && (
                    <span className="font-mono font-bold text-xs">{getCountdown(b.expiresAt, now)}</span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {field.amenities.map(a => (
            <span
              key={a}
              className="text-xs px-2 py-0.5 rounded"
              style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
            >
              {a}
            </span>
          ))}
        </div>

        {/* Book button */}
        <button
          onClick={onBook}
          className="w-full py-2.5 rounded-lg text-sm font-bold tracking-wider transition-all mt-1"
          style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            backgroundColor: isBooked ? 'var(--secondary)' : 'var(--primary)',
            color: isBooked ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
            cursor: 'pointer',
          }}
        >
          {isBooked ? 'LIHAT JADWAL' : 'BOOKING SEKARANG'}
        </button>
      </div>
    </div>
  )
}
