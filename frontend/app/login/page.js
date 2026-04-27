'use client';
export const dynamic = 'force-static';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { loginAPI } from '../../lib/api';
import { useAuth, AuthProvider } from '../../lib/auth';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginAPI(form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      if (data.user.role === 'admin') router.push('/admin');
      else if (data.user.role === 'helper') router.push('/helper');
      else router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'user') setForm({ email: 'arjun@email.com', password: 'user123' });
    if (role === 'helper') setForm({ email: 'priya@email.com', password: 'helper123' });
    if (role === 'admin') setForm({ email: 'admin@helper4u.com', password: 'admin123' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f1eb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <Link href="/" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.8rem', color: '#1a3a5c', display: 'block', textAlign: 'center', marginBottom: '4px' }}>
          Helper<span style={{ color: '#e8a020' }}>4U</span>
        </Link>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginBottom: '1.5rem' }}>Sign in to your account</p>

        <div style={{ background: '#f4f1eb', borderRadius: '8px', padding: '10px', marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>Demo accounts:</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['user', 'helper', 'admin'].map(r => (
              <button key={r} onClick={() => fillDemo(r)} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #e0ddd6', background: '#fff', fontSize: '12px', cursor: 'pointer', textTransform: 'capitalize' }}>{r}</button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '1rem' }}>
          Don't have an account? <Link href="/register" style={{ color: '#2d6a9f' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <AuthProvider><LoginForm /></AuthProvider>;
}
