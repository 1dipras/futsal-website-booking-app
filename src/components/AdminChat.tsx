import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  from: 'user' | 'admin'
  text: string
  time: number
}

const ADMIN_CONTACTS = [
  {
    id: 'wa',
    platform: 'WhatsApp',
    icon: '📱',
    value: '+62 812-3456-7890',
    href: 'https://wa.me/6281276597403',
    color: '#25D366',
    bg: 'rgba(37,211,102,0.08)',
    border: 'rgba(37,211,102,0.25)',
    label: 'Chat via WhatsApp',
  },
  {
    id: 'phone',
    platform: 'Telepon',
    icon: '📞',
    value: '+62 82284222724',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.25)',
    label: 'Hubungi via Telepon',
  },
  {
    id: 'email',
    platform: 'Email',
    icon: '✉️',
    value: 'admin@futsalzone.id',
    href: 'mailto:admin@futsalzone.id',
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.08)',
    border: 'rgba(244,114,182,0.25)',
    label: 'Kirim Email',
  },
  {
    id: 'ig',
    platform: 'Instagram',
    icon: '📸',
    value: '@futsalzone_id',
    href: 'https://instagram.com/futsalzone_id',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.25)',
    label: 'Follow & DM kami',
  },
]

const QUICK_QUESTIONS = [
  'Berapa harga sewa per jam?',
  'Lapangan mana yang tersedia sekarang?',
  'Bagaimana cara membatalkan booking?',
  'Ada promo atau diskon tidak?',
  'Jam buka sampai jam berapa?',
  'Apakah bisa booking untuk turnamen?',
]

const ADMIN_AUTO_REPLIES: Record<string, string> = {
  'berapa harga sewa per jam': 'Harga sewa lapangan kami mulai dari Rp 120.000/jam untuk lapangan outdoor hingga Rp 250.000/jam untuk Lapangan VIP. Cek halaman Lapangan untuk detail lengkap! ⚽',
  'lapangan mana yang tersedia sekarang': 'Silakan cek halaman LAPANGAN untuk melihat status real-time setiap lapangan. Status diperbarui otomatis setiap detik! 🟢',
  'bagaimana cara membatalkan booking': 'Untuk pembatalan booking, silakan hubungi kami via WhatsApp di +62 812-3456-7890 minimal 2 jam sebelum jadwal bermain. Kebijakan refund berlaku 50% untuk pembatalan H-1. 📋',
  'ada promo atau diskon tidak': 'Ya! Kami punya promo menarik:\n• Booking 3x berturut-turut dapat diskon 10%\n• Harga spesial untuk member bulanan\n• Diskon 15% untuk booking weekday pagi (07:00–10:00)\n\nHubungi admin untuk info lebih lanjut! 🎉',
  'jam buka sampai jam berapa': 'FutsalZone buka setiap hari:\n🕖 Senin–Jumat: 07:00–23:00\n🕖 Sabtu–Minggu: 06:00–24:00\n\nBooking terakhir 1 jam sebelum tutup. ⏰',
  'apakah bisa booking untuk turnamen': 'Tentu bisa! Kami menyediakan paket turnamen dengan fasilitas:\n• Sewa lapangan penuh (4–8 jam)\n• Tribun penonton\n• Sound system\n• Spanduk & banner\n\nHubungi admin untuk penawaran khusus! 🏆',
}

function getAutoReply(text: string): string {
  const lower = text.toLowerCase()
  for (const [key, reply] of Object.entries(ADMIN_AUTO_REPLIES)) {
    if (lower.includes(key.split(' ')[0]) && lower.includes(key.split(' ')[1] ?? '')) {
      return reply
    }
  }
  return 'Terima kasih sudah menghubungi FutsalZone! 😊 Admin kami akan segera membalas dalam beberapa menit. Untuk respons lebih cepat, bisa langsung hubungi via WhatsApp di +62 812-3456-7890.'
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export default function AdminChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      from: 'admin',
      text: 'Halo! Selamat datang di FutsalZone 👋\n\nSaya Admin FutsalZone, siap membantu Anda seputar pemesanan lapangan, informasi fasilitas, dan pertanyaan lainnya.\n\nAda yang bisa kami bantu?',
      time: Date.now() - 60000,
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'contact'>('chat')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: 'u' + Date.now(), from: 'user', text: text.trim(), time: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      const reply = getAutoReply(text)
      const adminMsg: Message = { id: 'a' + Date.now(), from: 'admin', text: reply, time: Date.now() }
      setMessages(prev => [...prev, adminMsg])
      setIsTyping(false)
    }, 1200 + Math.random() * 800)
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-3xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          CHAT & KONTAK ADMIN
        </h2>
        <span className="text-xs px-2 py-1 rounded flex items-center gap-1.5" style={{ backgroundColor: 'rgba(74,222,128,0.1)', color: 'var(--primary)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: 'var(--primary)' }} />
          Admin Online
        </span>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 340px' }}>
        {/* Main chat/contact panel */}
        <div
          className="rounded-2xl overflow-hidden flex flex-col"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', height: 580 }}
        >
          {/* Tab header */}
          <div className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
            {(['chat', 'contact'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-3.5 text-sm font-bold tracking-wider transition-all"
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  color: activeTab === tab ? 'var(--primary)' : 'var(--muted-foreground)',
                  borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                  backgroundColor: 'transparent',
                }}
              >
                {tab === 'chat' ? '💬 CHAT LANGSUNG' : '📋 KONTAK ADMIN'}
              </button>
            ))}
          </div>

          {activeTab === 'chat' ? (
            <>
              {/* Admin info bar */}
              <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: 'var(--secondary)', borderBottom: '1px solid var(--border)' }}>
                <div className="relative">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    A
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={{ backgroundColor: '#4ade80', borderColor: 'var(--secondary)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Admin FutsalZone</p>
                  <p className="text-xs" style={{ color: 'var(--primary)' }}>● Online sekarang</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-opacity hover:opacity-80"
                    style={{ backgroundColor: '#25D366', color: '#fff', fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    📱 WhatsApp
                  </a>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.from === 'admin' && (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-auto flex-shrink-0"
                        style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'Barlow Condensed, sans-serif' }}
                      >
                        A
                      </div>
                    )}
                    <div style={{ maxWidth: '72%' }}>
                      <div
                        className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                        style={{
                          backgroundColor: msg.from === 'user' ? 'var(--primary)' : 'var(--secondary)',
                          color: msg.from === 'user' ? 'var(--primary-foreground)' : 'var(--foreground)',
                          borderBottomRightRadius: msg.from === 'user' ? 4 : undefined,
                          borderBottomLeftRadius: msg.from === 'admin' ? 4 : undefined,
                        }}
                      >
                        {msg.text}
                      </div>
                      <p className="text-xs mt-1 px-1" style={{ color: 'var(--muted-foreground)', textAlign: msg.from === 'user' ? 'right' : 'left' }}>
                        {formatTime(msg.time)}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-end gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'Barlow Condensed, sans-serif' }}
                    >
                      A
                    </div>
                    <div
                      className="px-4 py-3 rounded-2xl flex items-center gap-1"
                      style={{ backgroundColor: 'var(--secondary)', borderBottomLeftRadius: 4 }}
                    >
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="w-2 h-2 rounded-full inline-block"
                          style={{
                            backgroundColor: 'var(--muted-foreground)',
                            animation: `bounce 1s infinite ${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick questions */}
              <div className="px-4 py-2 flex gap-2 overflow-x-auto" style={{ borderTop: '1px solid var(--border)' }}>
                {QUICK_QUESTIONS.slice(0, 3).map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                    style={{ backgroundColor: 'var(--secondary)', color: 'var(--muted-foreground)', border: '1px solid var(--border)', whiteSpace: 'nowrap' }}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-4 py-3 flex gap-2" style={{ borderTop: '1px solid var(--border)' }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                  placeholder="Ketik pesan..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity"
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    backgroundColor: input.trim() ? 'var(--primary)' : 'var(--secondary)',
                    color: input.trim() ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  KIRIM
                </button>
              </div>
            </>
          ) : (
            /* Contact tab */
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Hubungi admin FutsalZone melalui platform pilihan Anda. Kami siap membantu 07:00–23:00 setiap hari.
              </p>

              {ADMIN_CONTACTS.map(c => (
                <a
                  key={c.id}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, textDecoration: 'none' }}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted-foreground)' }}>{c.platform}</p>
                    <p className="text-sm font-semibold" style={{ color: c.color }}>{c.value}</p>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-lg"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif', backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}` }}
                  >
                    {c.label} →
                  </span>
                </a>
              ))}

              <div
                className="rounded-xl px-5 py-4 mt-2"
                style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)' }}
              >
                <p className="text-xs font-bold mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>
                  JAM OPERASIONAL
                </p>
                <div className="flex flex-col gap-1.5">
                  {[
                    { day: 'Senin – Jumat', hours: '07:00 – 23:00' },
                    { day: 'Sabtu – Minggu', hours: '06:00 – 24:00' },
                    { day: 'Hari Libur Nasional', hours: '08:00 – 22:00' },
                  ].map(row => (
                    <div key={row.day} className="flex justify-between text-sm">
                      <span style={{ color: 'var(--muted-foreground)' }}>{row.day}</span>
                      <span className="font-medium" style={{ color: 'var(--primary)' }}>{row.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl px-5 py-4"
                style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)' }}
              >
                <p className="text-xs font-bold mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>
                  ALAMAT
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
                  Jl. Olahraga Raya No. 88, Komplek Sport Center,<br />
                  Kelurahan Maju Bersama, Kecamatan Sejahtera<br />
                  <span style={{ color: 'var(--muted-foreground)' }}>Kota Bandung, Jawa Barat 40123</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick questions & FAQ */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm font-bold mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>
              PERTANYAAN CEPAT
            </p>
            <div className="flex flex-col gap-2">
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => { setActiveTab('chat'); setTimeout(() => sendMessage(q), 100) }}
                  className="text-left text-sm px-3.5 py-2.5 rounded-lg transition-all hover:border-green-400/40"
                  style={{
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm font-bold mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>
              RESPONS TERCEPAT
            </p>
            <div className="flex flex-col gap-2">
              {ADMIN_CONTACTS.slice(0, 2).map(c => (
                <a
                  key={c.id}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all hover:opacity-80"
                  style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, textDecoration: 'none' }}
                >
                  <span>{c.icon}</span>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.platform}</p>
                    <p className="text-xs font-semibold" style={{ color: c.color }}>{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </section>
  )
}
