'use client';
export const dynamic = 'force-static';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import { getMyHelperProfileAPI, getHelperBookingsAPI, updateBookingStatusAPI, updateHelperProfileAPI } from '../../lib/api';
import { useAuth, AuthProvider } from '../../lib/auth';

const TABS = ['dashboard', 'jobs', 'profile'];
const STATUS_BADGE = { pending: 'badge-amber', accepted: 'badge-blue', active: 'badge-green', completed: 'badge-gray', cancelled: 'badge-red', rejected: 'badge-red' };
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function HelperDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (!authLoading && user?.role !== 'helper') { router.push('/dashboard'); return; }
    if (user) loadData();
  }, [user, authLoading]);

  const loadData = async () => {
    try {
      const [profileRes, bookingRes] = await Promise.all([
        getMyHelperProfileAPI(),
        getHelperBookingsAPI(),
      ]);
      setProfile(profileRes.data.helper);
      setProfileForm({
        bio: profileRes.data.helper.bio || '',
        location: profileRes.data.helper.location || '',
        city: profileRes.data.helper.city || '',
        plans: profileRes.data.helper.plans || {},
        availability: profileRes.data.helper.availability || { days: [] },
        skills: (profileRes.data.helper.skills || []).join(', '),
      });
      setBookings(bookingRes.data.bookings);
    } catch (err) {
      toast.error('Failed to load profile');
    } finally { setLoading(false); }
  };

  const handleBookingAction = async (id, status) => {
    try {
      await updateBookingStatusAPI(id, { status });
      toast.success(`Booking ${status}!`);
      loadData();
    } catch { toast.error('Failed to update booking'); }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        ...profileForm,
        skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      await updateHelperProfileAPI(payload);
      toast.success('Profile updated!');
      loadData();
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  };

  const toggleDay = (day) => {
    const days = profileForm.availability?.days || [];
    const updated = days.includes(day) ? days.filter(d => d !== day) : [...days, day];
    setProfileForm({ ...profileForm, availability: { ...profileForm.availability, days: updated } });
  };

  if (authLoading || loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>Loading...</div>;

  const pending = bookings.filter(b => b.status === 'pending');
  const active = bookings.filter(b => b.status === 'active');
  const completed = bookings.filter(b => b.status === 'completed');
  const earnings = bookings.filter(b => ['active', 'completed'].includes(b.status)).reduce((s, b) => s + b.amount, 0);

  return (
    <div>
      <Navbar />

      {/* Portal Tabs */}
      <div style={{ background: '#e8e5df', borderBottom: '1px solid #e0ddd6', display: 'flex' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '11px 22px', border: 'none', background: tab === t ? '#fff' : 'none', color: tab === t ? '#1a3a5c' : '#6b7280', fontWeight: tab === t ? '600' : '400', fontSize: '14px', cursor: 'pointer', borderBottom: `2px solid ${tab === t ? '#1a3a5c' : 'transparent'}`, fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="page">
        <div className="container">

          {/* DASHBOARD TAB */}
          {tab === 'dashboard' && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.7rem', color: '#1a3a5c' }}>
                  Good day, {user?.name?.split(' ')[0]}!
                </h1>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Here's your activity overview</p>
              </div>

              <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
                {[
                  ['Pending Requests', pending.length],
                  ['Active Jobs', active.length],
                  ['Completed', completed.length],
                  ['Total Earnings', `₹${earnings.toLocaleString()}`],
                ].map(([l, v]) => (
                  <div key={l} className="stat-card">
                    <div className="stat-label">{l}</div>
                    <div className="stat-value">{v}</div>
                  </div>
                ))}
              </div>

              <div className="grid-2">
                {/* Pending Requests */}
                <div className="card">
                  <h3 style={{ fontWeight: '600', color: '#1a3a5c', marginBottom: '1rem' }}>Pending Requests</h3>
                  {pending.length === 0 ? (
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>No pending requests.</p>
                  ) : pending.map(b => (
                    <div key={b._id} style={{ padding: '12px 0', borderBottom: '1px solid #f0ede8' }}>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>{b.user?.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                        {b.serviceType} · {b.servicePlan} · {new Date(b.startDate).toLocaleDateString()}
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-sm btn-primary" onClick={() => handleBookingAction(b._id, 'accepted')}>Accept</button>
                        <button className="btn btn-sm btn-outline" style={{ color: '#d85a30' }} onClick={() => handleBookingAction(b._id, 'rejected')}>Decline</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active Jobs */}
                <div className="card">
                  <h3 style={{ fontWeight: '600', color: '#1a3a5c', marginBottom: '1rem' }}>Active Jobs</h3>
                  {active.length === 0 ? (
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>No active jobs currently.</p>
                  ) : active.map(b => (
                    <div key={b._id} style={{ padding: '12px 0', borderBottom: '1px solid #f0ede8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{b.user?.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{b.serviceType} · ₹{b.amount.toLocaleString()}</div>
                      </div>
                      <button className="btn btn-sm btn-outline" onClick={() => handleBookingAction(b._id, 'completed')}>Mark Done</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* JOBS TAB */}
          {tab === 'jobs' && (
            <>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.7rem', color: '#1a3a5c', marginBottom: '1.5rem' }}>My Jobs</h1>
              <div className="card">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Client</th><th>Service</th><th>Plan</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No jobs yet</td></tr>
                      ) : bookings.map(b => (
                        <tr key={b._id}>
                          <td><strong>{b.user?.name}</strong></td>
                          <td>{b.serviceType}</td>
                          <td style={{ textTransform: 'capitalize' }}>{b.servicePlan}</td>
                          <td>{new Date(b.startDate).toLocaleDateString()}</td>
                          <td>₹{b.amount.toLocaleString()}</td>
                          <td><span className={`badge ${STATUS_BADGE[b.status] || 'badge-gray'}`} style={{ textTransform: 'capitalize' }}>{b.status}</span></td>
                          <td>
                            {b.status === 'pending' && (
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button className="btn btn-sm btn-primary" onClick={() => handleBookingAction(b._id, 'accepted')}>Accept</button>
                                <button className="btn btn-sm btn-outline" onClick={() => handleBookingAction(b._id, 'rejected')}>Reject</button>
                              </div>
                            )}
                            {b.status === 'accepted' && (
                              <button className="btn btn-sm btn-outline" onClick={() => handleBookingAction(b._id, 'active')}>Start</button>
                            )}
                            {b.status === 'active' && (
                              <button className="btn btn-sm btn-outline" onClick={() => handleBookingAction(b._id, 'completed')}>Complete</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* PROFILE TAB */}
          {tab === 'profile' && profile && (
            <>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.7rem', color: '#1a3a5c', marginBottom: '1.5rem' }}>My Profile</h1>

              <div style={{ background: 'linear-gradient(135deg, #1a3a5c, #2d6a9f)', borderRadius: '14px', padding: '1.75rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e8a020', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', color: '#1a3a5c' }}>
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem' }}>{user?.name}</div>
                  <div style={{ opacity: 0.8, fontSize: '14px', marginTop: '4px' }}>{profile.serviceType} · {profile.experience} yrs exp</div>
                  <div style={{ marginTop: '8px' }}>
                    {profile.isVerified ? <span className="badge badge-green">✓ Verified</span> : <span className="badge badge-amber">Pending Verification</span>}
                  </div>
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
                <div className="card">
                  <h3 style={{ fontWeight: '600', color: '#1a3a5c', marginBottom: '1rem' }}>Availability</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '6px', marginBottom: '12px' }}>
                    {DAYS.map(d => {
                      const on = (profileForm.availability?.days || []).includes(d);
                      return (
                        <div key={d} onClick={() => toggleDay(d)}
                          style={{ borderRadius: '6px', padding: '6px 2px', textAlign: 'center', fontSize: '11px', fontWeight: '500', cursor: 'pointer', border: `1px solid ${on ? '#1d9e75' : '#e0ddd6'}`, background: on ? '#1d9e75' : '#fff', color: on ? '#fff' : '#6b7280' }}>
                          {d}
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">From</label>
                      <input className="form-input" type="time" value={profileForm.availability?.timeFrom || ''} onChange={e => setProfileForm({ ...profileForm, availability: { ...profileForm.availability, timeFrom: e.target.value } })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">To</label>
                      <input className="form-input" type="time" value={profileForm.availability?.timeTo || ''} onChange={e => setProfileForm({ ...profileForm, availability: { ...profileForm.availability, timeTo: e.target.value } })} />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 style={{ fontWeight: '600', color: '#1a3a5c', marginBottom: '1rem' }}>Pricing</h3>
                  <div className="form-group">
                    <label className="form-label">Hourly Rate (₹)</label>
                    <input className="form-input" type="number" value={profileForm.plans?.hourly || ''} onChange={e => setProfileForm({ ...profileForm, plans: { ...profileForm.plans, hourly: +e.target.value } })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Rate (₹)</label>
                    <input className="form-input" type="number" value={profileForm.plans?.monthly || ''} onChange={e => setProfileForm({ ...profileForm, plans: { ...profileForm.plans, monthly: +e.target.value } })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Yearly Rate (₹)</label>
                    <input className="form-input" type="number" value={profileForm.plans?.yearly || ''} onChange={e => setProfileForm({ ...profileForm, plans: { ...profileForm.plans, yearly: +e.target.value } })} />
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontWeight: '600', color: '#1a3a5c', marginBottom: '1rem' }}>Details</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Location / Area</label>
                    <input className="form-input" value={profileForm.location || ''} onChange={e => setProfileForm({ ...profileForm, location: e.target.value })} placeholder="e.g. Koramangala" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" value={profileForm.city || ''} onChange={e => setProfileForm({ ...profileForm, city: e.target.value })} placeholder="e.g. Bengaluru" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Skills (comma-separated)</label>
                  <input className="form-input" value={profileForm.skills || ''} onChange={e => setProfileForm({ ...profileForm, skills: e.target.value })} placeholder="Deep Cleaning, Cooking, Laundry" />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-input" rows={3} value={profileForm.bio || ''} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} placeholder="Tell households about yourself..." />
                </div>
                <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HelperPage() {
  return <AuthProvider><HelperDashboard /></AuthProvider>;
}
