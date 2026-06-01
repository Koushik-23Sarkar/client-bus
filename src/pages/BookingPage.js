import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Spinner from '../components/Spinner';

// ── Promo codes ──────────────────────────────────────────────────────────────
const PROMO_CODES = {
  BUSGO20:   { type: 'percent',  value: 20,  label: '20% off on first booking' },
  WEEKEND15: { type: 'cashback', value: 150, label: '₹150 cashback on weekends' },
  FEST100:   { type: 'flat',     value: 100, label: '₹100 off on bookings above ₹500' },
  STUDENT15: { type: 'percent',  value: 15,  label: '15% student discount' },
};

function calcDiscount(promo, baseTotal) {
  if (!promo) return 0;
  const p = PROMO_CODES[promo];
  if (!p) return 0;
  if (p.type === 'percent') return Math.round(baseTotal * p.value / 100);
  if (p.type === 'flat')    return baseTotal >= 500 ? p.value : 0;
  if (p.type === 'cashback') return Math.min(p.value, baseTotal);
  return 0;
}

// ── Razorpay loader ───────────────────────────────────────────────────────────
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BookingPage() {
  const { routeId } = useParams();
  const navigate    = useNavigate();

  const [route,      setRoute]      = useState(null);
  const [selected,   setSelected]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  // promo
  const [promoInput,  setPromoInput]  = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMsg,    setPromoMsg]    = useState('');
  const [promoOk,     setPromoOk]     = useState(false);

  useEffect(() => {
    API.get('/routes/' + routeId)
      .then(({ data }) => setRoute(data))
      .catch(() => setError('Route not found'))
      .finally(() => setLoading(false));
  }, [routeId]);

  // ── Seat toggle ──
  const toggle = (n) => {
    if (route.bookedSeats.includes(n)) return;
    setSelected(p => p.includes(n) ? p.filter(s => s !== n) : [...p, n]);
  };

  // ── Promo apply ──
  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) { setPromoMsg('Enter a promo code'); setPromoOk(false); return; }
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoMsg('✓ ' + PROMO_CODES[code].label);
      setPromoOk(true);
    } else {
      setAppliedPromo(null);
      setPromoMsg('Invalid promo code');
      setPromoOk(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoMsg('');
    setPromoOk(false);
  };

  // ── Pricing ──
  const baseTotal    = selected.length * (route?.price || 0);
  const discount     = calcDiscount(appliedPromo, baseTotal);
  const finalTotal   = Math.max(0, baseTotal - discount);

  // ── Copy promo code (from offer cards on home page) ──
  // const copyCode = (code) => {
  //   navigator.clipboard.writeText(code).catch(() => {});
  //   setPromoInput(code);
  // };

  // ── Razorpay payment ──
  const initiatePayment = async () => {
    if (!selected.length) { setError('Please select at least one seat'); return; }
    setSubmitting(true);
    setError('');

    const ok = await loadRazorpay();
    if (!ok) {
      setError('Payment gateway failed to load. Check your internet connection.');
      setSubmitting(false);
      return;
    }

    try {
      // 1. Create Razorpay order on backend
      const { data: orderData } = await API.post('/payments/create-order', {
        amount: finalTotal,
        currency: 'INR',
      });

      // 2. Open Razorpay checkout
      const options = {
        key: 'rzp_test_Sw1T6GRYrWtWC2',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'BusGo',
        description: `${route.from} → ${route.to} · Seats: ${selected.sort((a,b)=>a-b).join(', ')}`,
        order_id: orderData.id,
        handler: async (response) => {
          // 3. Verify payment on backend, then confirm booking
          try {
            const { data } = await API.post('/payments/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_signature:  response.razorpay_signature,
              routeId,
              seats:     selected,
              promoCode: appliedPromo,
              discount,
            });
            navigate('/booking-success/' + data.booking._id, {
              state: { booking: data.booking },
            });
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed');
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setError('Payment was cancelled. Try again.');
          },
        },
        prefill: {},
        theme: { color: '#FE6B00' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        setError('Payment failed: ' + resp.error.description);
        setSubmitting(false);
      });
      rzp.open();

    } catch (err) {
      setError(err.response?.data?.message || 'Could not initiate payment');
      setSubmitting(false);
    }
  };

  // ── Render ──
  if (loading) return <div style={{ paddingTop: 64 }}><Spinner /></div>;
  if (!route)  return (
    <div style={{ paddingTop: 80, textAlign: 'center', color: 'var(--error)', padding: 40 }}>{error}</div>
  );

  const seats = Array.from({ length: route.bus.totalSeats }, (_, i) => i + 1);

  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: 'var(--background)',
      paddingTop: 64,
      paddingBottom: 100,
    }}>
      <div style={{ padding: '20px var(--space-md)' }}>

        {/* ── Route Header Card ── */}
        <div style={{
          backgroundColor: 'var(--primary-container)',
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--on-primary-container)', fontSize: 20 }}>departure_board</span>
            <h2 style={{
              color: 'var(--on-primary-container)',
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'var(--font-family)',
            }}>{route.from} → {route.to}</h2>
          </div>
          <p style={{ color: 'var(--inverse-primary)', fontSize: 13, fontWeight: 500 }}>
            {route.bus.busName} · {route.bus.busType}
          </p>
          <p style={{ color: 'var(--inverse-primary)', fontSize: 13, marginTop: 2, opacity: 0.8 }}>
            {new Date(route.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → {new Date(route.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* ── Legend ── */}
        <div style={{
          display: 'flex',
          gap: 20,
          marginBottom: 16,
          padding: '12px 16px',
          backgroundColor: 'var(--surface-container-low)',
          borderRadius: 12,
        }}>
          {[
            { color: 'var(--surface-container-lowest)', border: '#86efac', label: 'Available' },
            { color: '#dbeafe', border: '#93c5fd',                         label: 'Selected'  },
            { color: '#fee2e2', border: '#fca5a5',                         label: 'Booked'    },
          ].map(({ color, border, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 18, height: 18, backgroundColor: color, border: `1.5px solid ${border}`, borderRadius: 4 }} />
              <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* ── Seat Grid ── */}
        <div style={{
          backgroundColor: 'var(--surface-container-lowest)',
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          border: '1px solid var(--outline-variant)',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-family)',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--primary)',
            marginBottom: 16,
          }}>Select Your Seat</h3>

          {/* Bus front */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, gap: 8 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: 'var(--outline-variant)' }} />
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 12px',
              backgroundColor: 'var(--surface-container)',
              borderRadius: 20,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--on-surface-variant)' }}>directions_bus</span>
              <span style={{ fontSize: 11, color: 'var(--on-surface-variant)', fontWeight: 600 }}>FRONT</span>
            </div>
            <div style={{ flex: 1, height: 1, backgroundColor: 'var(--outline-variant)' }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))',
            gap: 8,
            maxWidth: 340,
            margin: '0 auto',
          }}>
            {seats.map(n => {
              const booked = route.bookedSeats.includes(n);
              const sel    = selected.includes(n);
              return (
                <button
                  key={n}
                  onClick={() => toggle(n)}
                  style={{
                    width: 44, height: 44,
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: booked ? 'not-allowed' : 'pointer',
                    backgroundColor: booked ? '#fee2e2' : sel ? '#dbeafe' : 'var(--surface-container-lowest)',
                    border: `1.5px solid ${booked ? '#fca5a5' : sel ? '#93c5fd' : 'var(--outline-variant)'}`,
                    color: booked ? '#991b1b' : sel ? '#1d4ed8' : 'var(--on-surface-variant)',
                    transition: 'all 0.15s',
                    fontFamily: 'var(--font-family)',
                    boxShadow: sel ? '0 2px 8px rgba(29,78,216,0.2)' : 'none',
                    transform: sel ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>

          {selected.length > 0 && (
            <p style={{
              textAlign: 'center',
              marginTop: 16,
              fontSize: 13,
              color: 'var(--on-surface-variant)',
              fontWeight: 500,
            }}>
              {selected.length} seat{selected.length > 1 ? 's' : ''} selected: {selected.sort((a,b)=>a-b).join(', ')}
            </p>
          )}
        </div>

        {/* ── Promo Code ── */}
        <div style={{
          backgroundColor: 'var(--surface-container-lowest)',
          borderRadius: 16,
          padding: 20,
          border: '1px solid var(--outline-variant)',
          marginBottom: 16,
        }}>
          <h3 style={{
            fontFamily: 'var(--font-family)',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--primary)',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>local_offer</span>
            Promo Code
          </h3>

          {appliedPromo ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: 10,
              padding: '10px 14px',
            }}>
              <div>
                <span style={{ fontWeight: 700, color: '#166534', fontSize: 14, fontFamily: 'monospace' }}>{appliedPromo}</span>
                <p style={{ fontSize: 12, color: '#15803d', marginTop: 2 }}>{promoMsg}</p>
              </div>
              <button onClick={removePromo} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#dc2626', display: 'flex', alignItems: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>cancel</span>
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  value={promoInput}
                  onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoMsg(''); }}
                  placeholder="Enter promo code"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: '1.5px solid var(--outline-variant)',
                    borderRadius: 10,
                    fontSize: 14,
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    backgroundColor: 'var(--surface-bright)',
                    outline: 'none',
                    textTransform: 'uppercase',
                  }}
                  onKeyDown={e => e.key === 'Enter' && applyPromo()}
                />
                <button
                  onClick={applyPromo}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--on-primary)',
                    border: 'none',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  Apply
                </button>
              </div>
              {promoMsg && (
                <p style={{ fontSize: 12, color: promoOk ? '#15803d' : '#dc2626', fontWeight: 500, marginBottom: 8 }}>
                  {promoMsg}
                </p>
              )}
              {/* Quick-apply chips */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                {Object.keys(PROMO_CODES).map(code => (
                  <button
                    key={code}
                    onClick={() => { setPromoInput(code); setPromoMsg(''); }}
                    style={{
                      padding: '4px 10px',
                      border: '1px dashed var(--outline-variant)',
                      borderRadius: 20,
                      background: 'none',
                      fontSize: 11,
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: 'var(--on-surface-variant)',
                      cursor: 'pointer',
                    }}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Booking Summary ── */}
        <div style={{
          backgroundColor: 'var(--surface-container-lowest)',
          borderRadius: 16,
          padding: 20,
          border: '1px solid var(--outline-variant)',
          marginBottom: 16,
        }}>
          <h3 style={{
            fontFamily: 'var(--font-family)',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--primary)',
            marginBottom: 16,
          }}>Booking Summary</h3>

          {[
            { label: 'Route',          value: `${route.from} → ${route.to}` },
            { label: 'Bus',            value: `${route.bus.busName} (${route.bus.busType})` },
            { label: 'Seats',          value: selected.length ? selected.sort((a,b)=>a-b).join(', ') : '—' },
            { label: 'Price per seat', value: `₹${route.price}` },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}>
              <span style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{label}</span>
              <span style={{ color: 'var(--on-surface)', fontSize: 14, fontWeight: 600 }}>{value}</span>
            </div>
          ))}

          <div style={{ height: 1, backgroundColor: 'var(--outline-variant)', margin: '12px 0' }} />

          {/* Sub-total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>Sub-total</span>
            <span style={{ color: 'var(--on-surface)', fontSize: 14, fontWeight: 600 }}>₹{baseTotal}</span>
          </div>

          {/* Discount row — only shown when promo applied */}
          {appliedPromo && discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#15803d', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>confirmation_number</span>
                Discount ({appliedPromo})
              </span>
              <span style={{ color: '#15803d', fontSize: 14, fontWeight: 700 }}>−₹{discount}</span>
            </div>
          )}

          {appliedPromo && discount === 0 && baseTotal < 500 && PROMO_CODES[appliedPromo]?.type === 'flat' && (
            <p style={{ fontSize: 12, color: '#dc2626', marginBottom: 8 }}>
              ⚠ FEST100 requires a minimum booking of ₹500
            </p>
          )}

          <div style={{ height: 1, backgroundColor: 'var(--outline-variant)', margin: '12px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>Total</span>
            <div style={{ textAlign: 'right' }}>
              {discount > 0 && (
                <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', textDecoration: 'line-through' }}>
                  ₹{baseTotal}
                </div>
              )}
              <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--secondary-container)' }}>
                ₹{finalTotal}
              </span>
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            backgroundColor: 'var(--error-container)',
            borderRadius: 10,
            padding: '10px 14px',
            color: 'var(--on-error-container)',
            fontSize: 13,
            marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
            {error}
          </div>
        )}

        {/* ── Pay Button ── */}
        <button
          onClick={initiatePayment}
          disabled={submitting || !selected.length}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: (submitting || !selected.length) ? 'var(--outline-variant)' : 'var(--secondary-container)',
            color: (submitting || !selected.length) ? 'var(--on-surface-variant)' : 'var(--on-secondary-container)',
            border: 'none',
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 16,
            cursor: (submitting || !selected.length) ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-family)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: (!submitting && selected.length) ? '0 4px 16px rgba(254,107,0,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {submitting ? (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 20, animation: 'spin 1s linear infinite' }}>progress_activity</span>
              Processing…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>payment</span>
              Pay ₹{finalTotal} · Proceed to Pay
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 10 }}>
          🔒 Secured by Razorpay · UPI · Cards · NetBanking accepted
        </p>
      </div>
    </div>
  );
}