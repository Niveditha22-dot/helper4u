'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const dashLink = user?.role === 'admin' ? '/admin' : user?.role === 'helper' ? '/helper' : '/dashboard';

  return (
    <nav style={{ background: '#1a3a5c', color: '#fff', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      <Link href="/" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
        Helper<span style={{ color: '#e8a020' }}>4U</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {!user ? (
          <>
            <Link href="/helpers" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontSize: '14px', padding: '7px 16px' }}>Browse Helpers</Link>
            <Link href="/login" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontSize: '14px', padding: '7px 16px' }}>Login</Link>
            <Link href="/register" className="btn btn-accent" style={{ fontSize: '14px', padding: '7px 16px' }}>Get Started</Link>
          </>
        ) : (
          <>
            <Link href={dashLink} className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontSize: '14px', padding: '7px 16px' }}>Dashboard</Link>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e8a020', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#1a3a5c' }}>
                  {user.name?.charAt(0)}
                </div>
                <span style={{ fontSize: '14px' }}>{user.name?.split(' ')[0]}</span>
              </button>
              {open && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid #e0ddd6', borderRadius: '10px', minWidth: '160px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 200 }}>
                  <Link href={dashLink} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#1a1a1a' }} onClick={() => setOpen(false)}>Dashboard</Link>
                  <button onClick={logout} style={{ display: 'block', width: '100%', padding: '10px 16px', fontSize: '14px', color: '#d85a30', textAlign: 'left', background: 'none', border: 'none', borderTop: '1px solid #f0ede8' }}>Sign out</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
