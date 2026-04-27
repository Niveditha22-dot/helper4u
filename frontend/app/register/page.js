'use client';
export const dynamic = 'force-static';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { registerAPI } from '../../lib/api';
import { useAuth, AuthProvider } from '../../lib/auth';

function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', phone: '', location: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await registerAPI(form);
      login(data.user, data.token);
      toast.success('Account created successfully!');
      if (data.user.role === 'helper') router.push('/helper');
      else router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f1eb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.8rem', color: '#1a3a5c', display: 'block', textAlign: 'center', marginBottom: '4px' }}>
          Helper<span style={{ color: '#e8a020' }}>4U</span>
        </Link>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginBottom: '1.5rem' }}>Create your account</p>

        {/* Role selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
          {[['user', '🏠 Household'], ['helper', '👤 Helper']].map(([r, l]) => (
            <button key={r} onClick={() => setForm({ ...form, role: r })}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${form.role === r ? '#1a3a5c' : '#e0ddd6'}`, background: form.role === r ? '#1a3a5c' : '#fff', color: form.role === r ? '#fff' : '#6b7280', fontSize: '14px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              {l}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile number" />
          </div>
          <div className="form-group">
            <label className="form-label">Location / City</label>
            <input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Bengaluru" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '1rem' }}>
          Already have an account? <Link href="/login" style={{ color: '#2d6a9f' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <AuthProvider><RegisterForm /></AuthProvider>;
}
