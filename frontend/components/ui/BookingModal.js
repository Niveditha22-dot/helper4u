'use client';
import { useState } from 'react';
import { createBookingAPI } from '../../lib/api';
import toast from 'react-hot-toast';

export default function BookingModal({ helper, onClose, onSuccess }) {
  const [plan, setPlan] = useState('monthly');
  const [hours, setHours] = useState(4);
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);

  const amount = plan === 'hourly'
    ? (helper.plans?.hourly || 0) * hours
    : plan === 'monthly'
      ? (helper.plans?.monthly || 0)
      : (helper.plans?.yearly || helper.plans?.monthly * 11 || 0);

  const submit = async () => {
    if (!startDate) return toast.error('Please select a start date');
    setLoading(true);
    try {
      await createBookingAPI({
        helperId: helper._id,
        servicePlan: plan,
        serviceType: helper.serviceType,
        startDate,
        hoursPerDay: plan === 'hourly' ? hours : undefined,
        amount,
      });
      toast.success('Booking created! Awaiting helper acceptance.');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: '100%', maxWidth: '460px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem', color: '#1a3a5c', marginBottom: '1.25rem' }}>
          Book {helper.user?.name}
        </h2>
        <div className="form-group">
          <label className="form-label">Service Plan</label>
          <select className="form-input" value={plan} onChange={e => setPlan(e.target.value)}>
            {helper.plans?.hourly && <option value="hourly">Hourly — ₹{helper.plans.hourly}/hr</option>}
            {helper.plans?.monthly && <option value="monthly">Monthly — ₹{helper.plans.monthly.toLocaleString()}/mo</option>}
            {helper.plans?.yearly && <option value="yearly">Yearly — ₹{(helper.plans.yearly || helper.plans.monthly * 11).toLocaleString()}/yr</option>}
          </select>
        </div>
        {plan === 'hourly' && (
          <div className="form-group">
            <label className="form-label">Hours per day</label>
            <input className="form-input" type="number" min={1} max={8} value={hours} onChange={e => setHours(+e.target.value)} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input className="form-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
        </div>
        <div className="card-sm" style={{ background: '#f4f1eb', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
            <span>Plan</span><strong style={{ textTransform: 'capitalize' }}>{plan}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span>Total Amount</span><strong style={{ color: '#1a3a5c', fontSize: '16px' }}>₹{amount.toLocaleString()}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-accent" onClick={submit} disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
