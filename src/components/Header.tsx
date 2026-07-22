interface HeaderProps {
  activeSection: 'fields' | 'transactions' | 'chat' | 'dashboard'
  onNavigate: (s: 'fields' | 'transactions' | 'chat' | 'dashboard') => void
  userSession?: { name: string; email: string } | null
  onDashboardClick?: () => void
}

const NAV_ITEMS: { key: 'fields' | 'transactions' | 'chat'; label: string }[] = [
  { key: 'fields', label: 'LAPANGAN' },
  { key: 'transactions', label: 'TRANSAKSI' },
  { key: 'chat', label: 'CHAT ADMIN' },
]

export default function Header({ activeSection, onNavigate, userSession, onDashboardClick }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ backgroundColor: 'rgba(8,12,8,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'Barlow Condensed, sans-serif' }}
        >
          FS
        </div>
        <span className="text-xl font-bold tracking-wide" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--foreground)' }}>
          FUTSAL<span style={{ color: 'var(--primary)' }}>ZONE</span>
        </span>
      </div>

      <nav className="flex items-center gap-1">
        {userSession && (
          <button
            onClick={onDashboardClick}
            className="px-4 py-2 rounded text-sm font-medium transition-all flex items-center gap-1.5"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              letterSpacing: '0.05em',
              fontSize: '0.9rem',
              backgroundColor: activeSection === 'dashboard' ? 'var(--primary)' : 'transparent',
              color: activeSection === 'dashboard' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
            }}
          >
            📊 DASHBOARD
          </button>
        )}
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className="px-4 py-2 rounded text-sm font-medium transition-all flex items-center gap-1.5"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              letterSpacing: '0.05em',
              fontSize: '0.9rem',
              backgroundColor: activeSection === item.key ? 'var(--primary)' : 'transparent',
              color: activeSection === item.key ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
            }}
          >
            {item.key === 'chat' && (
              <span className="text-xs">💬</span>
            )}
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}