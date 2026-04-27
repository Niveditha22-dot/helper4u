'use client';
export const dynamic = 'force-static';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import { getAdminStatsAPI, getAllHelpersAdminAPI, verifyHelperAPI, getAllUsersAdminAPI, getComplaintsAPI, resolveComplaintAPI, getAllBookingsAPI, toggleUserStatusAPI } from '../../lib/api';
import { useAuth, AuthProvider } from '../../lib/auth';

const TABS = ['overview', 'helpers', 'bookings', 'users', 'complaints'];
const STATUS_BADGE = { pending: 'badge-amber', accepted: 'badge-blue', active: 'badge-green', completed: 'badge-gray', cancelled: 'badge-red', rejected: 'badge-red' };

function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [helpers, setHelpers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (!authLoading && user?.role !== 'admin') { router.push('/dashboard'); return; }
    if (user) loadAll();
  }, [user, authLoading]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, helpersRes, bookingsRes, usersRes, complaintsRes] = await Promise.all([
        getAdminStatsAPI(),
        getAllHelpersAdminAPI(),
        getAllBookingsAPI(),
        getAllUsersAdminAPI(),
        getComplaintsAPI(),
      ]);
      setStats(statsRes.data);
      setHelpers(helpersRes.data.helpers);
      setBookings(bookingsRes.data.bookings);
      setUsers(usersRes.data.users);
      setComplaints(complaintsRes.data.complaints);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally { setLoading(false); }
  };

  const handleVerify = async (id, status) => {
    try {
      await verifyHelperAPI(id, status);
      toast.success(`Helper ${status}!`);
      loadAll();
    } catch { toast.error('Failed to update helper'); }
  };

  const handleResolve = async (id) => {
    try {
      await resolveComplaintAPI(id, 'Resolved by admin');
      toast.success('Complaint resolved!');
      loadAll();
    } catch { toast.error('Failed to resolve complaint'); }
  };

  const handleToggleUser = async (id) => {
    try {
      await toggleUserStatusAPI(id);
      toast.success('User status updated!');
      loadAll();
    } catch { toast.error('Failed to update user'); }
  };

  if (authLoading || loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>Loading admin panel...</div>;

  const COLORS = ['#1d9e75', '#2d6a9f', '#d85a30', '#853f0b', '#533ab7', '#3c3489'];

  return (
    <div>
      <Navbar />

      {/* Portal Tabs */}
      <div style={{ background: '#e8e5df', borderBottom: '1px solid #e0ddd6', display: 'flex', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '11px 22px', border: 'none', background: tab === t ? '#fff' : 'none', color: tab === t ? '#1a3a5c' : '#6b7280', fontWeight: tab === t ? '600' : '400', fontSize: '14px', cursor: 'pointer', borderBottom: `2px solid ${tab === t ? '#1a3a5c' : 'transparent'}`, fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="page">
        <div className="container">

          {/* OVERVIEW */}
          {tab === 'overview' && stats && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.7rem', color: '#1a3a5c' }}>Platform Overview</h1>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Real-time admin dashboard — Helper4U</p>
              </div>

              <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
                {[
                  ['Total Users', stats.stats.totalUsers],
                  ['Verified Helpers', `${stats.stats.verifiedHelpers}/${stats.stats.totalHelpers}`],
                  ['Active Bookings', stats.stats.activeBookings],
                  ['Total Revenue', `₹${(stats.stats.totalRevenue / 1000).toFixed(0)}k`],
                ].map(([l, v]) => (
                  <div key={l} className="stat-card">
                    <div className="stat-label">{l}</div>
                    <div className="stat-value">{v}</div>
                  </div>
                ))}
              </div>

              <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
                {/* Bookings by service */}
                <div className="card">
                  <h3 style={{ fontWeight: '600', color: '#1a3a5c', marginBottom: '1rem' }}>Bookings by Service</h3>
                  {(stats.bookingsByService || []).map(item => {
                    const max = Math.max(...(stats.bookingsByService || []).map(i => i.count), 1);
                    return (
                      <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ width: '80px', fontSize: '13px', color: '#6b7280' }}>{item._id}</div>
                        <div style={{ flex: 1, background: '#f0ede8', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
                          <div style={{ width: `${(item.count / max) * 100}%`, height: '100%', background: '#1a3a5c', borderRadius: '4px' }} />
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', minWidth: '20px', textAlign: 'right' }}>{item.count}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Bookings by plan */}
                <div className="card">
                  <h3 style={{ fontWeight: '600', color: '#1a3a5c', marginBottom: '1rem' }}>Bookings by Plan</h3>
                  {(stats.bookingsByPlan || []).map(item => {
                    const max = Math.max(...(stats.bookingsByPlan || []).map(i => i.count), 1);
                    return (
                      <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ width: '80px', fontSize: '13px', color: '#6b7280', textTransform: 'capitalize' }}>{item._id}</div>
                        <div style={{ flex: 1, background: '#f0ede8', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
                          <div style={{ width: `${(item.count / max) * 100}%`, height: '100%', background: '#e8a020', borderRadius: '4px' }} />
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', minWidth: '20px', textAlign: 'right' }}>{item.count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Open complaints alert */}
              {stats.stats.openComplaints > 0 && (
                <div style={{ background: '#fcebeb', border: '1px solid #d85a30', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#a32d2d', fontSize: '14px' }}>⚠️ {stats.stats.openComplaints} open complaint(s) need attention</span>
                  <button className="btn btn-sm btn-danger" onClick={() => setTab('complaints')}>View Complaints</button>
                </div>
              )}
            </>
          )}

          {/* HELPERS */}
          {tab === 'helpers' && (
            <>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.7rem', color: '#1a3a5c', marginBottom: '1.5rem' }}>Helper Management</h1>
              <div className="card">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Name</th><th>Role</th><th>City</th><th>Exp</th><th>Rating</th><th>Jobs</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {helpers.map((h, i) => (
                        <tr key={h._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: COLORS[i % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', color: '#fff', flexShrink: 0 }}>
                                {h.user?.name?.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontWeight: '500' }}>{h.user?.name}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{h.user?.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{h.serviceType}</td>
                          <td>{h.city}</td>
                          <td>{h.experience} yrs</td>
                          <td>★ {h.rating || 0}</td>
                          <td>{h.totalJobs || 0}</td>
                          <td>
                            <span className={`badge ${h.isVerified ? 'badge-green' : h.verificationStatus === 'rejected' ? 'badge-red' : 'badge-amber'}`}>
                              {h.isVerified ? 'Verified' : h.verificationStatus === 'rejected' ? 'Rejected' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {!h.isVerified && h.verificationStatus !== 'rejected' && (
                                <>
                                  <button className="btn btn-sm btn-primary" onClick={() => handleVerify(h._id, 'approved')}>Verify</button>
                                  <button className="btn btn-sm btn-outline" style={{ color: '#d85a30' }} onClick={() => handleVerify(h._id, 'rejected')}>Reject</button>
                                </>
                              )}
                              {h.isVerified && <span style={{ fontSize: '12px', color: '#6b7280' }}>✓ Approved</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* BOOKINGS */}
          {tab === 'bookings' && (
            <>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.7rem', color: '#1a3a5c', marginBottom: '1.5rem' }}>All Bookings</h1>
              <div className="card">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>User</th><th>Helper</th><th>Service</th><th>Plan</th><th>Date</th><th>Amount</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b._id}>
                          <td><code style={{ fontSize: '11px', color: '#6b7280' }}>{b._id.slice(-6)}</code></td>
                          <td>{b.user?.name}</td>
                          <td>{b.helper?.user?.name}</td>
                          <td>{b.serviceType}</td>
                          <td style={{ textTransform: 'capitalize' }}>{b.servicePlan}</td>
                          <td>{new Date(b.startDate).toLocaleDateString()}</td>
                          <td>₹{b.amount.toLocaleString()}</td>
                          <td><span className={`badge ${STATUS_BADGE[b.status] || 'badge-gray'}`} style={{ textTransform: 'capitalize' }}>{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* USERS */}
          {tab === 'users' && (
            <>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.7rem', color: '#1a3a5c', marginBottom: '1.5rem' }}>User Management</h1>
              <div className="card">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Phone</th><th>Location</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}>
                          <td><strong>{u.name}</strong></td>
                          <td style={{ color: '#6b7280' }}>{u.email}</td>
                          <td>{u.phone || '—'}</td>
                          <td>{u.location || '—'}</td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td><span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Suspended'}</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline" style={{ color: u.isActive ? '#d85a30' : '#1d9e75' }} onClick={() => handleToggleUser(u._id)}>
                              {u.isActive ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* COMPLAINTS */}
          {tab === 'complaints' && (
            <>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.7rem', color: '#1a3a5c', marginBottom: '1.5rem' }}>Complaints & Disputes</h1>
              <div className="card">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Filed By</th><th>Against</th><th>Issue</th><th>Description</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {complaints.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No complaints filed</td></tr>
                      ) : complaints.map(c => (
                        <tr key={c._id}>
                          <td><strong>{c.user?.name}</strong></td>
                          <td>{c.helper?.user?.name}</td>
                          <td>{c.issue}</td>
                          <td style={{ color: '#6b7280', fontSize: '13px' }}>{c.description || '—'}</td>
                          <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${c.status === 'resolved' ? 'badge-green' : c.status === 'open' ? 'badge-red' : 'badge-amber'}`} style={{ textTransform: 'capitalize' }}>
                              {c.status}
                            </span>
                          </td>
                          <td>
                            {c.status === 'open' && (
                              <button className="btn btn-sm btn-primary" onClick={() => handleResolve(c._id)}>Resolve</button>
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
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return <AuthProvider><AdminDashboard /></AuthProvider>;
}
