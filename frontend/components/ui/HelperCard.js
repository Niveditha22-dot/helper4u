'use client';
import Link from 'next/link';

const COLORS = ['#1d9e75','#2d6a9f','#d85a30','#853f0b','#533ab7','#3c3489'];

export default function HelperCard({ helper }) {
  const h = helper;
  const userName = h.user?.name || 'Helper';
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = COLORS[h._id?.charCodeAt(0) % COLORS.length] || COLORS[0];
  const stars = '★'.repeat(Math.floor(h.rating || 0)) + '☆'.repeat(5 - Math.floor(h.rating || 0));

  return (
    <Link href={`/helpers/${h._id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#2d6a9f'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0ddd6'; e.currentTarget.style.boxShadow = 'none'; }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
          {initials}
        </div>
        <div style={{ fontWeight: '600', fontSize: '15px', color: '#1a3a5c', marginBottom: '2px' }}>{userName}</div>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>{h.serviceType} · {h.city}</div>
        <div className="stars" style={{ fontSize: '13px', marginBottom: '6px' }}>
          {stars} <span style={{ color: '#6b7280', fontSize: '12px' }}>{h.rating || 0} ({h.totalReviews || 0})</span>
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {h.isVerified
            ? <span className="badge badge-green">✓ Verified</span>
            : <span className="badge badge-amber">Pending</span>}
          <span className="badge badge-blue">{h.experience} yrs exp</span>
        </div>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>
          From <strong style={{ color: '#1a1a1a' }}>₹{h.plans?.hourly}/hr</strong>
          {h.plans?.monthly && <> · ₹{h.plans.monthly.toLocaleString()}/mo</>}
        </div>
      </div>
    </Link>
  );
}
