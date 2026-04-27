'use client';
export const dynamic = 'force-static';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import HelperCard from '../../components/ui/HelperCard';
import { getHelpersAPI } from '../../lib/api';
import { AuthProvider } from '../../lib/auth';

function HelpersList() {
  const searchParams = useSearchParams();
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    serviceType: searchParams.get('serviceType') || '',
    city: '',
    plan: '',
    search: '',
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchHelpers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (filters.serviceType) params.serviceType = filters.serviceType;
      if (filters.city) params.city = filters.city;
      if (filters.plan) params.plan = filters.plan;
      const { data } = await getHelpersAPI(params);
      setHelpers(data.helpers);
      setPagination({ page: data.currentPage, pages: data.pages, total: data.total });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHelpers(); }, [filters]);

  const filtered = filters.search
    ? helpers.filter(h => h.user?.name?.toLowerCase().includes(filters.search.toLowerCase()) || h.city?.toLowerCase().includes(filters.search.toLowerCase()))
    : helpers;

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.8rem', color: '#1a3a5c' }}>Find Your Helper</h1>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              {pagination.total} verified helpers available
            </p>
          </div>

          {/* Search + Filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <input
              className="form-input"
              style={{ flex: 1, minWidth: '200px' }}
              placeholder="Search by name or city..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
            <select className="form-input" style={{ width: 'auto' }} value={filters.serviceType} onChange={e => setFilters({ ...filters, serviceType: e.target.value })}>
              <option value="">All Types</option>
              <option value="Maid">Maid</option>
              <option value="Nanny">Nanny</option>
              <option value="Babysitter">Babysitter</option>
            </select>
            <select className="form-input" style={{ width: 'auto' }} value={filters.plan} onChange={e => setFilters({ ...filters, plan: e.target.value })}>
              <option value="">All Plans</option>
              <option value="hourly">Hourly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <input
              className="form-input"
              style={{ width: '160px' }}
              placeholder="City..."
              value={filters.city}
              onChange={e => setFilters({ ...filters, city: e.target.value })}
            />
          </div>

          {/* Role filter pills */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {['', 'Maid', 'Nanny', 'Babysitter'].map(t => (
              <button key={t}
                onClick={() => setFilters({ ...filters, serviceType: t })}
                style={{ padding: '6px 16px', borderRadius: '20px', border: `1px solid ${filters.serviceType === t ? '#1a3a5c' : '#e0ddd6'}`, background: filters.serviceType === t ? '#1a3a5c' : '#fff', color: filters.serviceType === t ? '#fff' : '#6b7280', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                {t || 'All'}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Loading helpers...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
              No helpers found. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(h => <HelperCard key={h._id} helper={h} />)}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem' }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => fetchHelpers(p)}
                  style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid', borderColor: p === pagination.page ? '#1a3a5c' : '#e0ddd6', background: p === pagination.page ? '#1a3a5c' : '#fff', color: p === pagination.page ? '#fff' : '#6b7280', fontSize: '14px', cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HelpersPage() {
  return <AuthProvider><HelpersList /></AuthProvider>;
}
