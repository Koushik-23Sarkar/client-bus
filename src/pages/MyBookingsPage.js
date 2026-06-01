import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/bookings/my')
      .then(({ data }) => setBookings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      await API.patch(`/bookings/${id}/cancel`);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const formatTime = (d) => d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        .mybookings { font-family: 'Poppins', sans-serif; min-height: 100vh; background: #f0f4ff; padding: 100px 24px 100px; }
        .mb-container { max-width: 860px; margin: 0 auto; }
        .mb-header { margin-bottom: 28px; }
        .mb-header h1 { font-size: 28px; font-weight: 800; color: #0f1c3f; margin-bottom: 6px; }
        .mb-header p { color: #9ca3af; font-size: 14px; }
        .filter-tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
        .filter-tab {
          padding: 8px 20px; border-radius: 10px; border: 2px solid #e5e7eb;
          background: white; font-family: 'Poppins', sans-serif; font-size: 13px;
          font-weight: 600; cursor: pointer; transition: all 0.2s; color: #6b7280;
        }
        .filter-tab.active { border-color: #f97316; color: #f97316; background: #fff7ed; }
        .filter-tab:hover { border-color: #f97316; color: #f97316; }

        .booking-card {
          background: white; border-radius: 20px; margin-bottom: 20px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06); border: 1px solid #f0f4ff;
          overflow: hidden; transition: all 0.2s;
        }
        .booking-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .bc-top {
          padding: 20px 24px; display: flex; justify-content: space-between;
          align-items: flex-start; flex-wrap: wrap; gap: 16px;
        }
        .bc-left { flex: 1; }
        .bc-status {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 14px; border-radius: 20px; font-size: 12px;
          font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
          margin-bottom: 14px;
        }
        .status-confirmed { background: #f0fdf4; color: #15803d; }
        .status-pending { background: #fff7ed; color: #c2410c; }
        .status-cancelled { background: #fef2f2; color: #dc2626; }
        .bc-route { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .bc-city { font-size: 22px; font-weight: 800; color: #0f1c3f; }
        .bc-arrow {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
        }
        .bc-arrow .arr-line {
          width: 40px; height: 2px;
          background: linear-gradient(to right, #e5e7eb, #f97316);
        }
        .bc-arrow .arr-head { font-size: 14px; color: #f97316; margin-left: 28px; margin-top: -8px; }
        .bc-meta { display: flex; gap: 20px; flex-wrap: wrap; }
        .bc-meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #6b7280; }
        .bc-meta-item strong { color: #0f1c3f; }

        .bc-right { text-align: right; }
        .bc-ticket {
          font-size: 11px; color: #9ca3af; font-family: monospace;
          background: #f8fafc; padding: 4px 10px; border-radius: 6px;
          margin-bottom: 12px; display: inline-block;
        }
        .bc-price { font-size: 26px; font-weight: 800; color: #0f1c3f; margin-bottom: 12px; }
        .bc-price span { font-size: 14px; color: #9ca3af; font-weight: 500; }
        .bc-actions { display: flex; gap: 8px; justify-content: flex-end; }
        .btn-view {
          padding: 9px 18px; background: #eff6ff; color: #2563eb;
          border: 1.5px solid #bfdbfe; border-radius: 10px; font-size: 13px;
          font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif;
          transition: all 0.2s;
        }
        .btn-view:hover { background: #dbeafe; }
        .btn-cancel {
          padding: 9px 18px; background: #fef2f2; color: #dc2626;
          border: 1.5px solid #fecaca; border-radius: 10px; font-size: 13px;
          font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif;
          transition: all 0.2s;
        }
        .btn-cancel:hover { background: #fee2e2; }
        .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

        .bc-bottom {
          border-top: 1px solid #f8fafc; padding: 12px 24px;
          background: #fafbff; display: flex; gap: 8px; align-items: center;
          flex-wrap: wrap;
        }
        .bc-seat-chip {
          background: #eff6ff; color: #2563eb; border-radius: 8px;
          padding: 3px 12px; font-size: 12px; font-weight: 700;
        }
        .bc-bus-info { font-size: 12px; color: #9ca3af; margin-left: auto; }

        .empty-state {
          text-align: center; padding: 80px 24px;
          background: white; border-radius: 20px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }
        .empty-icon { font-size: 64px; margin-bottom: 16px; }
        .empty-state h3 { color: #0f1c3f; font-size: 22px; font-weight: 700; margin-bottom: 8px; }
        .empty-state p { color: #9ca3af; margin-bottom: 24px; }
        .btn-search {
          padding: 12px 32px; background: linear-gradient(135deg, #f97316, #ef4444);
          color: white; border: none; border-radius: 12px; font-size: 15px;
          font-weight: 700; cursor: pointer; font-family: 'Poppins', sans-serif;
          box-shadow: 0 6px 16px rgba(249,115,22,0.35); transition: all 0.2s;
        }
        .btn-search:hover { transform: translateY(-2px); }

        .spinner {
          width: 44px; height: 44px; border: 4px solid #f0f4ff;
          border-top: 4px solid #f97316; border-radius: 50%;
          animation: spin 0.7s linear infinite; margin: 60px auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="mybookings">
        <div className="mb-container">
          <div className="mb-header">
            <h1>🎫 My Bookings</h1>
            <p>View and manage all your bus tickets</p>
          </div>

          <div className="filter-tabs">
            {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'all' ? ` (${bookings.length})` : ` (${bookings.filter(b => b.status === f).length})`}
              </button>
            ))}
          </div>

          {loading && (
            <div>
              <div className="spinner" />
              <p style={{ textAlign: 'center', color: '#9ca3af' }}>Loading your bookings...</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <h3>No bookings found</h3>
              <p>{filter === 'all' ? "You haven't booked any tickets yet" : `No ${filter} bookings`}</p>
              {filter === 'all' && (
                <button className="btn-search" onClick={() => navigate('/')}>
                  Search Buses →
                </button>
              )}
            </div>
          )}

          {filtered.map(booking => {
            const route = booking.route;
            return (
              <div className="booking-card" key={booking._id}>
                <div className="bc-top">
                  <div className="bc-left">
                    <div className={`bc-status status-${booking.status}`}>
                      {booking.status === 'confirmed' ? '✓ ' : booking.status === 'pending' ? '⏳ ' : '✗ '}
                      {booking.status}
                    </div>
                    <div className="bc-route">
                      <span className="bc-city">{route?.from}</span>
                      <div className="bc-arrow">
                        <div className="arr-line"></div>
                        <div className="arr-head">▶</div>
                      </div>
                      <span className="bc-city">{route?.to}</span>
                    </div>
                    <div className="bc-meta">
                      <span className="bc-meta-item">📅 <strong>{formatDate(route?.date)}</strong></span>
                      <span className="bc-meta-item">🕐 <strong>{formatTime(route?.departureTime)}</strong></span>
                      <span className="bc-meta-item">🚌 <strong>{route?.bus?.busName}</strong></span>
                    </div>
                  </div>

                  <div className="bc-right">
                    <div className="bc-ticket">{booking.ticketId}</div>
                    <div className="bc-price">₹{booking.totalPrice} <span>total</span></div>
                    <div className="bc-actions">
                      <button className="btn-view" onClick={() => navigate(`/booking-success/${booking._id}`)}>
                        View Ticket
                      </button>
                      {booking.status !== 'cancelled' && (
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancelling === booking._id}
                        >
                          {cancelling === booking._id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bc-bottom">
                  <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>Seats:</span>
                  {booking.seats?.sort((a, b) => a - b).map(s => (
                    <span className="bc-seat-chip" key={s}>{s}</span>
                  ))}
                  <span className="bc-bus-info">{route?.bus?.busType} &bull; #{route?.bus?.busNumber}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}