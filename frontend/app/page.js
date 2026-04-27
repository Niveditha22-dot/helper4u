'use client';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import { AuthProvider } from '../lib/auth';

export default function Home() {
  return (
    <AuthProvider>
      <Navbar />
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)', color: '#fff', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(232,160,32,0.2)', color: '#f5c842', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', display: 'inline-block', marginBottom: '1.5rem' }}>
            Trusted · Verified · Reliable
          </div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: '1.2', marginBottom: '1rem' }}>
            Find Trusted Domestic Help Near You
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: '0.85', marginBottom: '2.5rem', lineHeight: '1.7' }}>
            Helper4U connects households with verified maids, nannies, and babysitters. Flexible plans, transparent pricing, peace of mind.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/helpers" className="btn btn-accent btn-lg">Browse Helpers</Link>
            <Link href="/register" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>Register as Helper</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#fff', padding: '2.5rem 1.5rem', borderBottom: '1px solid #e0ddd6' }}>
        <div className="container">
          <div className="grid-4">
            {[['500+','Verified Helpers'],['2,000+','Happy Households'],['4.8★','Avg Rating'],['3 Cities','& growing']].map(([v,l])=>(
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1a3a5c', fontFamily: 'DM Serif Display, serif' }}>{v}</div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2rem', color: '#1a3a5c', textAlign: 'center', marginBottom: '2.5rem' }}>Our Services</h2>
          <div className="grid-3">
            {[
              { icon: '🧹', title: 'Maid', desc: 'Experienced house maids for daily cleaning, cooking, laundry and more.', from: '₹150/hr' },
              { icon: '👶', title: 'Nanny', desc: 'Qualified nannies providing full-time childcare and development support.', from: '₹190/hr' },
              { icon: '🍼', title: 'Babysitter', desc: 'Trusted babysitters for flexible, short-term child supervision.', from: '₹120/hr' },
            ].map(s => (
              <div key={s.title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.3rem', color: '#1a3a5c', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', marginBottom: '16px' }}>{s.desc}</p>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>From <strong style={{ color: '#1a3a5c' }}>{s.from}</strong></div>
                <Link href={`/helpers?serviceType=${s.title}`} className="btn btn-outline" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>View {s.title}s</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section style={{ background: '#f4f1eb', padding: '4rem 1.5rem' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2rem', color: '#1a3a5c', textAlign: 'center', marginBottom: '2.5rem' }}>Flexible Plans</h2>
          <div className="grid-3">
            {[
              { name: 'Hourly', price: 'Pay per hour', desc: 'Perfect for one-time or occasional needs. Book as little as 1 hour.', color: '#e6f1fb', border: '#185fa5' },
              { name: 'Monthly', price: 'Fixed monthly rate', desc: 'Best for regular help. Get a dedicated helper every day or week.', color: '#e1f5ee', border: '#0f6e56', featured: true },
              { name: 'Yearly', price: 'Best value', desc: 'Save up to 20% on monthly rates with our annual subscription plan.', color: '#faeeda', border: '#854f0b' },
            ].map(p => (
              <div key={p.name} className="card" style={{ border: p.featured ? `2px solid ${p.border}` : '1px solid #e0ddd6', position: 'relative' }}>
                {p.featured && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#1d9e75', color: '#fff', padding: '3px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '500' }}>Most Popular</div>}
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' }}>
                  {p.name === 'Hourly' ? '⏱' : p.name === 'Monthly' ? '📅' : '🎯'}
                </div>
                <h3 style={{ fontWeight: '600', fontSize: '16px', color: '#1a3a5c', marginBottom: '4px' }}>{p.name}</h3>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>{p.price}</div>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1a3a5c', color: '#fff', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2rem', marginBottom: '1rem' }}>Ready to get started?</h2>
        <p style={{ opacity: '0.8', marginBottom: '2rem', fontSize: '15px' }}>Join thousands of households who trust Helper4U</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn btn-accent btn-lg">Create Account</Link>
          <Link href="/helpers" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}>Browse Helpers</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f2440', color: 'rgba(255,255,255,0.6)', padding: '2rem 1.5rem', textAlign: 'center', fontSize: '13px' }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>
          Helper<span style={{ color: '#e8a020' }}>4U</span>
        </div>
        <p>© 2026 Helper4U — Trusted Domestic Service Management Platform</p>
      </footer>
    </AuthProvider>
  );
}
