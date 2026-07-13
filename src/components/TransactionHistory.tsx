import type { Transaction } from '../types'

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-3xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          RIWAYAT TRANSAKSI
        </h2>
        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
          {transactions.length} transaksi
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🏟️</p>
          <p className="text-xl font-bold mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--muted-foreground)' }}>
            Belum ada transaksi
          </p>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Booking lapangan untuk memulai
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {transactions.map(tx => (
            <div
              key={tx.id}
              className="rounded-xl p-5 flex items-center gap-5"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}
              >
                ⚽
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="font-bold text-base" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {tx.fieldName}
                  </p>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: tx.status === 'success' ? 'rgba(74,222,128,0.1)' : 'rgba(234,179,8,0.1)',
                      color: tx.status === 'success' ? 'var(--primary)' : '#ca8a04',
                    }}
                  >
                    {tx.status === 'success' ? 'LUNAS' : 'PENDING'}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {tx.customerName} · {tx.startTime}–{tx.endTime} · {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-xs mt-0.5 capitalize" style={{ color: 'var(--muted-foreground)' }}>
                  via {tx.paymentMethod}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--primary)' }}>
                  Rp {tx.amount.toLocaleString('id-ID')}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                  {new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
