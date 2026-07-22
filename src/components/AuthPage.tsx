import { useState } from 'react'
import type { UserCredentials } from '../types'

interface AuthPageProps {
  onLogin: (email: string, password: string) => void
  onRegister: (credentials: UserCredentials) => void
  onClose: () => void
}

export default function AuthPage({ onLogin, onRegister, onClose }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    // 1. Validasi dasar (berlaku untuk login dan register)
    if (!email.trim() || !password.trim()) {
      setError('Email dan password harus diisi');
      return;
    }

    // 2. Jika mode daftar (register), cek kelengkapan data
    if (mode === 'register') {
      if (!name.trim()) {
        setError('Nama lengkap harus diisi');
        return;
      }
      if (password.length < 6) {
        setError('Password minimal 6 karakter');
        return;
      }
      if (password !== confirmPassword) {
        setError('Password konfirmasi tidak cocok');
        return;
      }

      // Kirim ke App.tsx
      onRegister({ name, email, password });
    } else {
      // 3. Jika mode login user, langsung eksekusi
      onLogin(email, password);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(74,222,128,0.12),_transparent_30%)] px-4 py-8"
    >
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#091009]/95 p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#86efac]">Akun Pelanggan</p>
            <h1 className="mt-3 text-3xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {mode === 'login' ? 'Masuk ke FutsalZone' : 'Buat akun baru'}
            </h1>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
          >
            Kembali
          </button>
        </div>

        <div className="flex gap-2 mb-6 rounded-full bg-white/5 p-1 text-sm text-slate-200/90">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-full px-4 py-2 transition ${mode === 'login' ? 'bg-[#4ade80] text-[#020f02]' : 'hover:bg-white/10'}`}
          >
            Masuk
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 rounded-full px-4 py-2 transition ${mode === 'register' ? 'bg-[#4ade80] text-[#020f02]' : 'hover:bg-white/10'}`}
          >
            Daftar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-200">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
                className="w-full rounded-3xl border border-white/10 bg-[#081108] px-4 py-3 text-sm text-white outline-none transition focus:border-[#4ade80]"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              className="w-full rounded-3xl border border-white/10 bg-[#081108] px-4 py-3 text-sm text-white outline-none transition focus:border-[#4ade80]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-3xl border border-white/10 bg-[#081108] px-4 py-3 text-sm text-white outline-none transition focus:border-[#4ade80]"
            />
          </div>

          {mode === 'register' && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-200">Konfirmasi Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password"
                className="w-full rounded-3xl border border-white/10 bg-[#081108] px-4 py-3 text-sm text-white outline-none transition focus:border-[#4ade80]"
              />
            </div>
          )}

          {error && (
            <p className="rounded-3xl bg-[#ef4444]/10 px-4 py-3 text-sm text-[#ef4444]">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-[#4ade80] px-5 py-3 text-sm font-semibold text-[#020f02] transition hover:shadow-lg"
          >
            {mode === 'login' ? 'Masuk Sekarang' : 'Buat Akun'}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-300/80">
          {mode === 'login'
            ? 'Belum punya akun? Daftar sekarang untuk menyimpan riwayat booking dan akses dashboard.'
            : 'Sudah punya akun? Gunakan tab Masuk untuk login.'}
        </div>
      </div>
    </div>
  )
}
