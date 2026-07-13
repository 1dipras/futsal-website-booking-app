import type { Field } from '../types'
import FieldCard from './FieldCard'

interface FieldGridProps {
  fields: Field[]
  now: number
  onBook: (field: Field) => void
}

export default function FieldGrid({ fields, now, onBook }: FieldGridProps) {
  const available = fields.filter(f => f.bookings.length === 0 || !isCurrentlyBooked(f, now))
  const booked = fields.filter(f => isCurrentlyBooked(f, now))

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-3xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          STATUS LAPANGAN
        </h2>
        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
            Tersedia ({available.length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Terboking ({booked.length})
          </span>
        </div>
      </div>

      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
      >
        {fields.map(field => (
          <FieldCard
            key={field.id}
            field={field}
            now={now}
            onBook={() => onBook(field)}
          />
        ))}
      </div>
    </section>
  )
}

function isCurrentlyBooked(field: Field, now: number): boolean {
  const nowTime = new Date(now)
  const hhmm = `${String(nowTime.getHours()).padStart(2, '0')}:${String(nowTime.getMinutes()).padStart(2, '0')}`
  return field.bookings.some(b => b.startTime <= hhmm && hhmm < b.endTime)
}
