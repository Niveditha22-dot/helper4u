'use client';
export const dynamic = 'force-static';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import { getMyBookingsAPI, createReviewAPI } from '../../lib/api';
import { useAuth, AuthProvider } from '../../lib/auth';

const STATUS_BADGE = { pending: 'badge-amber', accepted: 'badge-blue', active: 'badge-green', completed: 'badge-gray', cancelled: 'badge-red', rejected: 'badge-red' };

function ReviewModal({ booking, onClose, onDone }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!rating) return toast.error('Please select a rating');
    setLoading(true);
    try {
      await createReviewAPI({ bookingId: booking._id, rating, comment });
      toast.success('Review submitted!');
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.3rem', color: '#1a3a5c', marginBottom: '1rem' }}>
          Review {booking.helper?.user?.name}
        </h3>
        <div className="form-group">
          <label className="form-label">Your Rating</label>
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <button key={i} onClick={() => setRating(i)}
                style={{ fontSize: '28px', background: 'none', border: 'none', color: i <= rating ? '#e8a020' : '#ddd', cursor: 'pointer', padding: '0' }}>
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Comment (optional)</label>
          <textarea className="form-input" rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-accent" onClick={submit} disabled={loading}>{loading ? 'Submitting...' : 'Submit Review'}</button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [reviewTarget, setReviewTarget] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (!authLoading && user?.role !== 'user') { router.push(`/${user.role}`); return; }
    if (user) fetchBookings();
  }, [user, authLoading]);

  const fetchBookings = async () => {
    try {
      const { data } = await getMyBookingsAPI();
      setBookings(data.bookings);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  if (authLoading || loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>Loading...</div>;

  const filtered = tab === 'all' ? bookings : bookings.filter(b => b.status === tab);
  const active = bookings.filter(b => b.status === 'active').length;
  const completed = bookings.filter(b => b.status === 'completed').length;
  const spent = bookings.filter(b => ['active', 'completed'].includes(b.status)).reduce((s, b) => s + b.amount, 0);

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="container">
          {/* Welcome */}
          <div style={{ background: 'linear-gradient(135deg, #1a3a5c, #2d6a9f)', borderRadius: '14px', padding: '1.75rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.6rem' }}>Welcome, {user?.name?.split(' ')[0]}!</h1>
              <p style={{ opacity: 0.8, marginTop: '4px', fontSize: '14px' }}>Manage your bookings and service history</p>
            </div>
            <Link href="/helpers" className="btn btn-accent">+ Book a Helper</Link>
          </div>

          {/* Stats */}
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            {[
              ['Total Bookings', bookings.length, ''],
              ['Active', active, ''],
              ['Completed', completed, ''],
              ['Total Spent', `₹${spent.toLocaleString()}`, ''],
            ].map(([l, v]) => (
              <div key={l} className="stat-card">
                <div className="stat-label">{l}</div>
                <div className="stat-value">{v}</div>
              </div>
            ))}
          </div>

          {/* Bookings */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <h2 style={{ fontWeight: '600', color: '#1a3a5c' }}>My Bookings</h2>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['all', 'active', 'pending', 'completed', 'cancelled'].map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ padding: '5px 12px', borderRadius: '20px', border: `1px solid ${tab === t ? '#1a3a5c' : '#e0ddd6'}`, background: tab === t ? '#1a3a5c' : '#fff', color: tab === t ? '#fff' : '#6b7280', fontSize: '12px', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'DM Sans, sans-serif' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
                No bookings found.
                <div style={{ marginTop: '12px' }}>
                  <Link href="/helpers" className="btn btn-primary">Browse Helpers</Link>
                </div>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Helper</th><th>Service</th><th>Plan</th><th>Date</th><th>Amount</th><th>Status</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(b => (
                      <tr key={b._id}>
                        <td><strong>{b.helper?.user?.name || '—'}</strong></td>
                        <td>{b.serviceType}</td>
                        <td style={{ textTransform: 'capitalize' }}>{b.servicePlan}</td>
                        <td>{new Date(b.startDate).toLocaleDateString()}</td>
                        <td>₹{b.amount.toLocaleString()}</td>
                        <td><span className={`badge ${STATUS_BADGE[b.status] || 'badge-gray'}`} style={{ textTransform: 'capitalize' }}>{b.status}</span></td>
                        <td>
                          {b.status === 'completed' && !b.isReviewed && (
                            <button className="btn btn-sm btn-outline" onClick={() => setReviewTarget(b)}>Review</button>
                          )}
                          {b.status === 'completed' && b.isReviewed && (
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>✓ Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {reviewTarget && (
        <ReviewModal
          booking={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onDone={() => { setReviewTarget(null); fetchBookings(); }}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return <AuthProvider><UserDashboard /></AuthProvider>;
}
