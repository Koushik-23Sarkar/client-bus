import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api/axios';
import Spinner from '../components/Spinner';

export default function BookingSuccessPage() {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!booking) {
      API.get('/bookings/' + bookingId)
        .then(({ data }) => setBooking(data))
        .catch(() => navigate('/'))
        .finally(() => setLoading(false));
    }
  }, [bookingId, booking, navigate]);

  if (loading) return <div style={{ paddingTop: 64 }}><Spinner /></div>;
  const r = booking?.route;

  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: 'var(--background)',
      paddingTop: 64,
      paddingBottom: 100,
    }}>
      <div style={{ padding: '20px var(--space-md)', maxWidth: 600, margin: '0 auto' }}>

        {/* Success Banner */}
        <div style={{
          backgroundColor: '#002f41', // tertiary-container
          borderRadius: 20,
          padding: '28px 24px',
          textAlign: 'center',
          marginBottom: 20,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -20, right: -20, width: 100, height: 100,
            backgroundColor: 'rgba(0,157,208,0.15)', borderRadius: '50%',
          }} />
          <div style={{
            width: 64, height: 64,
            backgroundColor: 'rgba(0,157,208,0.2)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--on-tertiary-container)', fontSize: 36 }}>check_circle</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-family)',
            color: 'white',
            fontSize: 22,
            fontWeight: 800,
            marginBottom: 6,
          }}>Booking Confirmed! 🎉</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
            Ticket ID: <span style={{ fontWeight: 700, color: 'var(--on-tertiary-container)', fontFamily: 'monospace' }}>{booking?.ticketId}</span>
          </p>
        </div>

        {/* Ticket Details */}
        <div style={{
          backgroundColor: 'var(--surface-container-lowest)',
          borderRadius: 20,
          border: '1px solid var(--outline-variant)',
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          {/* Ticket header */}
          <div style={{
            backgroundColor: 'var(--surface-container-low)',
            padding: '14px 20px',
            borderBottom: '1px dashed var(--outline-variant)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--secondary-container)', fontSize: 22 }}>confirmation_number</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--primary)', fontFamily: 'var(--font-family)' }}>Ticket Details</span>
          </div>

          <div style={{ padding: '20px' }}>
            {/* Route visual */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--outline)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>From</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{r?.from}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 12px' }}>
                <div style={{ width: 40, height: 1, backgroundColor: 'var(--outline-variant)' }} />
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary-container)', fontSize: 22, margin: '4px 0' }}>directions_bus</span>
                <div style={{ width: 40, height: 1, backgroundColor: 'var(--outline-variant)' }} />
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--outline)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>To</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{r?.to}</div>
              </div>
            </div>

            <div style={{ height: 1, borderTop: '1px dashed var(--outline-variant)', margin: '0 -20px', marginBottom: 20 }} />

            {/* Details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                ['Bus', r?.bus?.busName || '-'],
                ['Bus No.', r?.bus?.busNumber || '-'],
                ['Seats', booking?.seats?.join(', ') || '-'],
                ['Status', booking?.status || '-'],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: 'var(--outline)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--on-surface)' }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ height: 1, borderTop: '1px dashed var(--outline-variant)', margin: '20px -20px', marginBottom: 16 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--on-surface-variant)', fontSize: 14, fontWeight: 500 }}>Total Paid</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--secondary-container)' }}>₹{booking?.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            onClick={() => navigate('/my-bookings')}
            style={{
              padding: '13px',
              backgroundColor: 'var(--primary-container)',
              color: 'var(--on-primary-container)',
              border: 'none',
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>confirmation_number</span>
            My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '13px',
              backgroundColor: 'var(--surface-container)',
              color: 'var(--on-surface)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
            Search More
          </button>
        </div>
      </div>
    </div>
  );
}