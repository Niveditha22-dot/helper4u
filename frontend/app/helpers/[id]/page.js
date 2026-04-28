'use client';
export const dynamic = 'force-static';
export async function generateStaticParams() {
  return [];
}
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Navbar from '../../../components/layout/Navbar';
import BookingModal from '../../../components/ui/BookingModal';
import { getHelperByIdAPI, getHelperReviewsAPI } from '../../../lib/api';
import { useAuth, AuthProvider } from '../../../lib/auth';

const COLORS = ['#1d9e75', '#2d6a9f', '#d85a30', '#853f0b', '#533ab7', '#3c3489'];

function HelperDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [helper, setHelper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBook, setShowBook] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [helperRes, reviewRes] = await Promise.all([
          getHelperByIdAPI(id),
          getHelperReviewsAPI(id),
        ]);
        setHelper(helperRes.data.helper);
        setReviews(reviewRes.data.reviews);
      } catch {
        toast.error('Helper not found');
        router.push('/helpers');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>Loading...</div>;
  if (!helper) return null;

  const name = helper.user?.name || 'Helper';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = COLORS[helper._id?.charCodeAt(0) % COLORS.length] || COLORS[0];
  const stars = n => '★'.repeat(Math.floor(n)) + '☆'.repeat(5 - Math.floor(n));

  const handleBook = () => {
    if (!user) { toast.error('Please login to book'); router.push('/login'); return; }
    if (user.role !== 'user') { toast.error('Only household accounts can book'); return; }
    setShowBook(true);
  };

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link href="/helpers" style={{ color: '#6b7280', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '1.5rem' }}>
            ← Back to helpers
          </Link>

          {/* Hero card */}
          <div style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)', borderRadius: '14px', padding: '2rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>{initials}</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.8rem', marginBottom: '4px' }}>{name}</h1>
              <p style={{ opacity: 0.8, marginBottom: '8px' }}>{helper.serviceType} · {helper.city} · {helper.experience} years experience</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: '#f5c842', fontSize: '14px' }}>{stars(helper.rating || 0)}</span>
                <span style={{ opacity: 0.8, fontSize: '13px' }}>{helper.rating || 0} ({helper.totalReviews || 0} reviews)</span>
                {helper.isVerified
                  ? <span className="badge badge-green">✓ Verified</span>
                  : <span className="badge badge-amber">Pending Verification</span>}
              </div>
            </div>
            <button className="btn btn-accent" onClick={handleBook} style={{ alignSelf: 'flex-start' }}>Book Now</button>
          </div>

          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            {/* Pricing */}
            <div className="card">
              <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1a3a5c' }}>Service Plans</h3>
              {helper.plans?.hourly && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0ede8' }}>
                  <span style={{ fontSize: '14px' }}>⏱ Hourly</span>
                  <strong>₹{helper.plans.hourly}/hr</strong>
                </div>
              )}
              {helper.plans?.monthly && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0ede8' }}>
                  <span style={{ fontSize: '14px' }}>📅 Monthly</span>
                  <strong>₹{helper.plans.monthly.toLocaleString()}/mo</strong>
                </div>
              )}
              {helper.plans?.yearly && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span style={{ fontSize: '14px' }}>🎯 Yearly</span>
                  <strong>₹{helper.plans.yearly.toLocaleString()}/yr</strong>
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="card">
              <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1a3a5c' }}>Availability</h3>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {(helper.availability?.days || []).map(d => (
                  <span key={d} className="badge badge-green" style={{ fontSize: '12px', padding: '4px 10px' }}>{d}</span>
                ))}
              </div>
              {helper.availability?.timeFrom && (
                <p style={{ fontSize: '13px', color: '#6b7280' }}>
                  {helper.availability.timeFrom} – {helper.availability.timeTo}
                </p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1a3a5c' }}>Skills & Services</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: helper.bio ? '1rem' : 0 }}>
              {(helper.skills || []).map(s => (
                <span key={s} className="badge badge-blue" style={{ fontSize: '13px', padding: '5px 14px' }}>{s}</span>
              ))}
            </div>
            {helper.bio && <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.7', marginTop: '12px' }}>{helper.bio}</p>}
          </div>

          {/* Reviews */}
          <div className="card">
            <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1a3a5c' }}>Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '14px' }}>No reviews yet.</p>
            ) : (
              reviews.map(r => (
                <div key={r._id} style={{ padding: '12px 0', borderBottom: '1px solid #f0ede8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '14px' }}>{r.user?.name}</strong>
                    <span style={{ color: '#e8a020', fontSize: '13px' }}>{stars(r.rating)}</span>
                  </div>
                  {r.comment && <p style={{ fontSize: '13px', color: '#6b7280' }}>{r.comment}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showBook && <BookingModal helper={helper} onClose={() => setShowBook(false)} onSuccess={() => router.push('/dashboard')} />}
    </div>
  );
}

export default function HelperDetailPage() {
  return <AuthProvider><HelperDetail /></AuthProvider>;
}
