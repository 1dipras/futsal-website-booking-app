export default function HeroSection() {
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <section
      className="relative px-6 py-16 overflow-hidden"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(74,222,128,0.06) 0%, transparent 70%)',
        }}
      />
      <div className="relative max-w-5xl mx-auto grid grid-cols-1 gap-8" style={{ gridTemplateColumns: 'auto 1fr' }}>
        <div>
          <p className="text-xs font-medium tracking-widest mb-3" style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif' }}>
            BOOK YOUR FIELD TODAY
          </p>
          <h1
            className="text-6xl font-bold leading-none mb-4"
            style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '-0.01em' }}
          >
            ARENA
            <br />
            <span style={{ color: 'var(--primary)' }}>FUTSAL</span>
            <br />
            TERBAIK
          </h1>
          <p className="text-sm max-w-sm" style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>
            Pesan lapangan futsal berkualitas dengan mudah dan cepat. Cek ketersediaan lapangan secara real-time dan lakukan pembayaran langsung.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--primary)' }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>6 Lapangan Tersedia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--accent)' }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Buka 07:00–23:00</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col justify-end items-end gap-2">
          <div
            className="px-4 py-3 rounded-lg text-right"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Hari ini</p>
            <p className="text-sm font-medium capitalize">{today}</p>
          </div>
          <div className="flex gap-3">
            {[
              { label: 'Total Lapangan', value: '6' },
              { label: 'Tersedia', value: '3' },
              { label: 'Terboking', value: '3' },
            ].map(stat => (
              <div
                key={stat.label}
                className="px-4 py-3 rounded-lg text-center"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <p className="text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--primary)' }}>{stat.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
