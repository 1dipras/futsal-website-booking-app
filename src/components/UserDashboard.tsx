import type { Field, Transaction, UserSession } from '../types'

interface UserDashboardProps {
  userSession: UserSession
  fields: Field[]
  transactions: Transaction[]
  onBrowse: () => void
  onLogout: () => void
}

export default function UserDashboard({ userSession, fields, transactions, onBrowse, onLogout }: UserDashboardProps) {
  const myBookings = fields
    .flatMap((field) =>
      field.bookings
        .filter((booking) => booking.customerName === userSession.name)
        .map((booking) => ({
          ...booking,
          fieldName: field.name,
        })),
    )
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))

  const myTransactions = transactions
    .filter((tx) => tx.customerName === userSession.name)
    .slice(0, 4)

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(74,222,128,0.12),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.08),_transparent_25%)] px-6 py-10 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-[#0b170b]/90 p-8 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#86efac]">Dashboard Akun</p>
              <h1 className="mt-3 text-4xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Halo, {userSession.name} 👋
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200/80">
                Kelola booking, akses riwayat transaksi, dan lanjutkan pencarian lapangan favorit Anda.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onBrowse}
                className="rounded-full bg-[#4ade80] px-5 py-3 text-sm font-semibold text-[#020f02] transition hover:shadow-lg"
              >
                Jelajahi Lapangan
              </button>
              <button
                onClick={onLogout}
                className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-[#0b170b]/90 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[#86efac]">Booking Aktif</p>
            <p className="mt-5 text-4xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {myBookings.length}
            </p>
            <p className="mt-3 text-sm text-slate-300/80">Jumlah booking kamu yang sudah tercatat di sistem.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[#0b170b]/90 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[#86efac]">Riwayat Transaksi</p>
            <p className="mt-5 text-4xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {myTransactions.length}
            </p>
            <p className="mt-3 text-sm text-slate-300/80">Transaksi terbaru untuk akunmu.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[#0b170b]/90 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[#86efac]">Email</p>
            <p className="mt-5 text-2xl font-semibold">{userSession.email}</p>
            <p className="mt-3 text-sm text-slate-300/80">Akun dibuat pada {new Date(userSession.loginTime).toLocaleDateString('id-ID')}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-[#0b170b]/90 p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-[#86efac]">Booking Terbaru</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">{myBookings.length} entri</span>
            </div>
            {myBookings.length === 0 ? (
              <p className="text-sm text-slate-300/80">Belum ada booking. Mulai pesan lapangan sekarang.</p>
            ) : (
              <div className="space-y-4">
                {myBookings.slice(0, 4).map((booking) => (
                  <div key={booking.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold">{booking.fieldName}</p>
                    <p className="mt-1 text-xs text-slate-300/80">{booking.date} · {booking.startTime}–{booking.endTime}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#0b170b]/90 p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-[#86efac]">Transaksi Terbaru</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">{myTransactions.length}</span>
            </div>
            {myTransactions.length === 0 ? (
              <p className="text-sm text-slate-300/80">Belum ada transaksi. Ayo booking lapangan untuk melihat riwayat.</p>
            ) : (
              <div className="space-y-4">
                {myTransactions.map((tx) => (
                  <div key={tx.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold">{tx.fieldName}</p>
                    <p className="mt-1 text-xs text-slate-300/80">Rp {tx.amount.toLocaleString('id-ID')} · {tx.status === 'success' ? 'Lunas' : 'Pending'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
