import type { Field } from '../types'

interface LandingPageProps {
  fields: Field[]
  onAuth: () => void
  onBrowse: () => void
}

export default function LandingPage({ fields, onAuth, onBrowse }: LandingPageProps) {
  const featured = fields.slice(0, 3)

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(74,222,128,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.12),_transparent_30%)] text-white">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold tracking-wider" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              FUTSAL<span className="text-[#4ade80]">ZONE</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onAuth}
              className="rounded-full px-5 py-2 text-sm font-semibold transition-colors"
              style={{ backgroundColor: 'rgba(74,222,128,0.16)', color: 'var(--primary)' }}
            >
              Masuk / Daftar
            </button>
          </div>
        </div>

        <section className="grid gap-8 py-16 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[#86efac]">Booking Lapangan Futsal Mudah</p>
            <h1 className="text-5xl font-bold leading-tight max-w-3xl" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Jelajahi lapangan terbaik, pesan secepat kilat, dan mulai pertandingan Anda hari ini.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-200/90">
              FutsalZone memudahkan tim Anda menemukan lapangan tersedia, mengelola booking, dan berkomunikasi dengan admin. Daftar sekarang untuk membangun akun dan kelola jadwal dengan nyaman.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={onBrowse}
                className="rounded-full bg-[#4ade80] px-6 py-3 text-sm font-semibold text-[#020f02] transition hover:shadow-lg"
              >
                Jelajahi Web
              </button>
              <button
                onClick={onAuth}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Login atau Buat Akun
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-sm text-slate-200/80">
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-2xl font-bold">6</p>
                <p>Lapangan tersedia</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-2xl font-bold">24/7</p>
                <p>Akses info kapan saja</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-2xl font-bold">Langsung</p>
                <p>Booking & pembayaran mudah</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6 shadow-2xl backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#86efac]">Lapangan Favorit</p>
            <div className="mt-6 space-y-4">
              {featured.map((field) => (
                <div key={field.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{field.name}</p>
                      <p className="text-xs text-slate-300/80">{field.type} • {field.surface}</p>
                    </div>
                    <p className="text-sm font-bold text-[#4ade80]">Rp {field.pricePerHour.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-300/80">
                    {field.amenities.map((amenity) => (
                      <span key={amenity} className="rounded-full border border-white/10 px-3 py-1 bg-white/5">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3 py-12">
          {[
            { title: 'Cari Lapangan', description: 'Telusuri daftar lapangan dengan status real-time dan pilih sesuai kebutuhan tim Anda.' },
            { title: 'Booking Cepat', description: 'Pilih jadwal, metode pembayaran, dan konfirmasi langsung dalam beberapa langkah.' },
            { title: 'Kelola Akun', description: 'Buat akun untuk menyimpan riwayat booking, akses dashboard, dan cek transaksi Anda.' },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
            >
              <p className="text-xl font-semibold text-white">{feature.title}</p>
              <p className="mt-3 text-sm text-slate-300/80">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#000000]/20 p-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#86efac]">Tentang FutsalZone</p>
              <h2 className="mt-4 text-3xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Platform booking futsal yang dibuat untuk pemain, tim, dan pemilik lapangan.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-200/80">
                Akses informasi lapangan, lihat jadwal, dan kelola akun Anda dari satu dashboard. Kami mempercepat pengalaman pemesanan agar Anda bisa fokus pada permainan.
              </p>
            </div>
            <div className="grid gap-3">
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="text-2xl font-bold text-[#4ade80]">Fast response</p>
                <p className="mt-2 text-sm text-slate-300/80">Chat admin langsung untuk dukungan booking dan layanan lapangan.</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="text-2xl font-bold text-[#4ade80]">Akun Aman</p>
                <p className="mt-2 text-sm text-slate-300/80">Simpan data booking dan transaksi dengan aman di dashboard pribadi Anda.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}