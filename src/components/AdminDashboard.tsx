import type { Field, Transaction, DoubleBooking, RefundRequest } from '../types'

interface AdminDashboardProps {
  fields: Field[]
  transactions: Transaction[]
  onLogout: () => void
  adminName: string
  refundRequests: RefundRequest[]
  doubleBookings: DoubleBooking[]
  onApproveRefund: (refundId: string) => void
  onRejectRefund: (refundId: string) => void
}

export default function AdminDashboard({
  fields,
  transactions,
  onLogout,
  adminName,
  refundRequests,
  doubleBookings,
  onApproveRefund,
  onRejectRefund,
}: AdminDashboardProps) {
  const totalBookings = fields.reduce((sum, field) => sum + field.bookings.length, 0)
  const totalRevenue = transactions.reduce((sum, t) => (t.status === 'success' ? sum + t.amount : sum), 0)
  const pendingTransactions = transactions.filter((t) => t.status === 'pending').length
  const pendingRefunds = refundRequests.filter((r) => r.status === 'pending').length

  const recentBookings = fields
    .flatMap((field) =>
      field.bookings.map((booking) => ({
        ...booking,
        fieldName: field.name,
        fieldId: field.id,
      }))
    )
    .sort((a, b) => b.expiresAt - a.expiresAt)
    .slice(0, 5)

  const recentTransactions = transactions.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5)

  return (
    <div style={{ backgroundColor: 'var(--background)' }} className="min-h-screen">
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-6 py-4 border-b flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(8, 12, 8, 0.92)',
          backdropFilter: 'blur(12px)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            FS
          </div>
          <div>
            <h1
              className="text-xl font-bold"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--foreground)' }}
            >
              FUTSAL<span style={{ color: 'var(--primary)' }}>ZONE</span>
            </h1>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Admin Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              {adminName}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Administrator
            </p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded text-sm font-medium transition-all"
            style={{
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              color: '#dc2626',
              border: '1px solid rgba(220, 38, 38, 0.3)',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <StatCard title="Total Lapangan" value={fields.length} icon="🏟️" />
          <StatCard title="Total Booking" value={totalBookings} icon="📅" />
          <StatCard
            title="Total Revenue"
            value={`Rp ${(totalRevenue / 1000000).toFixed(1)}M`}
            icon="💰"
          />
          <StatCard title="Pending Transaksi" value={pendingTransactions} icon="⏳" />
          <StatCard title="Pending Refund" value={pendingRefunds} icon="🔄" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h2
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: 'var(--foreground)' }}
            >
              📋 Booking Terbaru
            </h2>
            <div className="space-y-3">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-3 rounded border"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                          {booking.fieldName}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          {booking.customerName}
                        </p>
                      </div>
                      <span
                        className="text-xs font-medium px-2 py-1 rounded"
                        style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.2)',
                          color: '#22c55e',
                        }}
                      >
                        Active
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {booking.date} · {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center py-6" style={{ color: 'var(--muted-foreground)' }}>
                  Tidak ada booking
                </p>
              )}
            </div>
          </div>

          {/* Fields Status */}
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h2
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: 'var(--foreground)' }}
            >
              🏟️ Status Lapangan
            </h2>
            <div className="space-y-3">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="p-3 rounded border"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                      {field.name}
                    </p>
                    <span
                      className="text-xs font-medium px-2 py-1 rounded"
                      style={{
                        backgroundColor: field.bookings.length > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                        color: field.bookings.length > 0 ? '#22c55e' : '#6b7280',
                      }}
                    >
                      {field.bookings.length > 0 ? 'Terisi' : 'Kosong'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <p>{field.type} · {field.surface}</p>
                    <p>{field.bookings.length} booking</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div
          className="rounded-lg border p-6 mt-6"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <h2
            className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{ color: 'var(--foreground)' }}
          >
            💳 Transaksi Terbaru
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottomColor: 'var(--border)' }} className="border-b">
                  <th className="text-left py-2 px-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                    Lapangan
                  </th>
                  <th className="text-left py-2 px-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                    Customer
                  </th>
                  <th className="text-left py-2 px-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                    Amount
                  </th>
                  <th className="text-left py-2 px-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      style={{ borderBottomColor: 'var(--border)' }}
                      className="border-b hover:bg-opacity-50 transition-colors"
                    >
                      <td className="py-3 px-3" style={{ color: 'var(--foreground)' }}>
                        {transaction.fieldName}
                      </td>
                      <td className="py-3 px-3" style={{ color: 'var(--foreground)' }}>
                        {transaction.customerName}
                      </td>
                      <td className="py-3 px-3 font-medium" style={{ color: 'var(--primary)' }}>
                        Rp {(transaction.amount / 1000).toFixed(0)}K
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="text-xs font-medium px-2 py-1 rounded"
                          style={{
                            backgroundColor:
                              transaction.status === 'success'
                                ? 'rgba(34, 197, 94, 0.2)'
                                : transaction.status === 'pending'
                                  ? 'rgba(59, 130, 246, 0.2)'
                                  : 'rgba(220, 38, 38, 0.2)',
                            color:
                              transaction.status === 'success'
                                ? '#22c55e'
                                : transaction.status === 'pending'
                                  ? '#3b82f6'
                                  : '#dc2626',
                          }}
                        >
                          {transaction.status === 'success'
                            ? 'Success'
                            : transaction.status === 'pending'
                              ? 'Pending'
                              : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      Tidak ada transaksi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Refund Requests Section */}
        {refundRequests.length > 0 && (
          <div
            className="rounded-lg border p-6 mt-6"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h2
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: 'var(--foreground)' }}
            >
              💰 Permintaan Refund ({refundRequests.filter((r) => r.status === 'pending').length})
            </h2>
            <div className="space-y-3">
              {refundRequests.map((refund) => (
                <div
                  key={refund.id}
                  className="p-4 rounded border"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderLeftWidth: '4px',
                    borderLeftColor:
                      refund.status === 'pending'
                        ? '#f59e0b'
                        : refund.status === 'approved'
                          ? '#22c55e'
                          : '#6b7280',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                        {refund.customerName} - {refund.fieldName}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                        {refund.reason}
                      </p>
                    </div>
                    <span
                      className="text-sm font-medium px-3 py-1 rounded"
                      style={{
                        backgroundColor:
                          refund.status === 'pending'
                            ? 'rgba(245, 158, 11, 0.2)'
                            : refund.status === 'approved'
                              ? 'rgba(34, 197, 94, 0.2)'
                              : 'rgba(107, 114, 128, 0.2)',
                        color:
                          refund.status === 'pending'
                            ? '#f59e0b'
                            : refund.status === 'approved'
                              ? '#22c55e'
                              : '#6b7280',
                      }}
                    >
                      {refund.status === 'pending'
                        ? 'Menunggu'
                        : refund.status === 'approved'
                          ? 'Disetujui'
                          : 'Ditolak'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm">
                      <p style={{ color: 'var(--foreground)' }}>
                        Jumlah Refund:{' '}
                        <span className="font-bold text-primary" style={{ color: 'var(--primary)' }}>
                          Rp {(refund.amount / 1000).toFixed(0)}K
                        </span>
                      </p>
                    </div>
                  </div>

                  {refund.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => onApproveRefund(refund.id)}
                        className="flex-1 py-2 px-3 rounded text-sm font-medium transition-all"
                        style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.2)',
                          color: '#22c55e',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                        }}
                      >
                        ✓ Setujui
                      </button>
                      <button
                        onClick={() => onRejectRefund(refund.id)}
                        className="flex-1 py-2 px-3 rounded text-sm font-medium transition-all"
                        style={{
                          backgroundColor: 'rgba(220, 38, 38, 0.2)',
                          color: '#dc2626',
                          border: '1px solid rgba(220, 38, 38, 0.3)',
                        }}
                      >
                        ✗ Tolak
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: string
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div
      className="rounded-lg border p-4"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
          {title}
        </p>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
        {value}
      </p>
    </div>
  )
}
