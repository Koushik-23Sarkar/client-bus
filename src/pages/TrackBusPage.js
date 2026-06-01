import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function TrackBusPage() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    API.get('/bookings/my')
      .then(({ data }) => {
        const active = data.filter(b => b.status === 'confirmed' || b.status === 'pending');
        setBookings(active);
        if (active.length > 0) setSelected(active[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

 useEffect(() => {
  if (!selected) return;

  const updateProgress = () => {
    const journeyDate = new Date(
      selected.journeyDate ||
      selected.date ||
      selected.createdAt
    ).getTime();

    const tripDuration = 8 * 60 * 60 * 1000; // 8 hours

    const now = Date.now();

    const percentage =
      ((now - journeyDate) / tripDuration) * 100;

    setProgress(
      Math.max(0, Math.min(100, percentage))
    );
  };

  updateProgress();

  const interval = setInterval(updateProgress, 60000);

  return () => clearInterval(interval);
}, [selected]);

  const stops = selected
    ? [selected.route?.from || selected.route?.origin || 'Origin', 'En Route', selected.route?.to || selected.route?.destination || 'Destination']
    : ['Origin', 'En Route', 'Destination'];

  const currentStop =
  progress < 33
    ? 0
    : progress < 66
    ? 1
    : 2;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        .track-page { font-family: 'Poppins', sans-serif; min-height: 100vh; background: #f0f4ff; padding: 100px 20px 100px; }
        .track-container { max-width: 800px; margin: 0 auto; }
        .track-header h1 { font-size: 26px; font-weight: 800; color: #0f1c3f; margin-bottom: 4px; }
        .track-header p { color: #9ca3af; font-size: 14px; margin-bottom: 28px; }
        .booking-selector { display: flex; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
        .booking-chip {
          padding: 10px 18px; border-radius: 12px; border: 2px solid #e5e7eb;
          background: white; font-family: 'Poppins', sans-serif; font-size: 13px;
          font-weight: 600; cursor: pointer; transition: all 0.2s; color: #6b7280;
        }
        .booking-chip.active { border-color: #f97316; color: #f97316; background: #fff7ed; }
        .track-card { background: white; border-radius: 24px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); margin-bottom: 20px; }
        .route-display { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
        .city { text-align: center; }
        .city-name { font-size: 22px; font-weight: 800; color: #0f1c3f; }
        .city-label { font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .route-line { flex: 1; height: 3px; background: #f0f4ff; margin: 0 16px; position: relative; border-radius: 3px; overflow: hidden; }
        .route-line-fill { height: 100%; background: linear-gradient(90deg, #f97316, #fb923c); border-radius: 3px; transition: width 0.3s; }
        .bus-icon { position: absolute; top: 50%; transform: translateY(-50%); font-size: 20px; transition: left 0.3s; }
        .stops-row { display: flex; justify-content: space-between; margin-bottom: 28px; position: relative; }
        .stops-row::before { content: ''; position: absolute; top: 14px; left: 14px; right: 14px; height: 2px; background: #e5e7eb; z-index: 0; }
        .stop { display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 1; }
        .stop-dot { width: 28px; height: 28px; border-radius: 50%; border: 3px solid #e5e7eb; background: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: all 0.4s; }
        .stop-dot.passed { background: #f97316; border-color: #f97316; color: white; }
        .stop-dot.current { background: #0f1c3f; border-color: #0f1c3f; color: white; box-shadow: 0 0 0 4px rgba(249,115,22,0.2); }
        .stop-label { font-size: 12px; font-weight: 600; color: #6b7280; text-align: center; max-width: 80px; }
        .stop-label.active { color: #f97316; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .info-item { background: #f8faff; border-radius: 14px; padding: 16px; }
        .info-item-label { font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-item-value { font-size: 16px; font-weight: 700; color: #0f1c3f; margin-top: 4px; }
        .empty-state { text-align: center; padding: 60px 20px; }
        .empty-icon { font-size: 56px; margin-bottom: 16px; }
        .empty-state h3 { font-size: 20px; font-weight: 700; color: #0f1c3f; margin-bottom: 8px; }
        .empty-state p { color: #9ca3af; font-size: 14px; }
        .live-badge { display: inline-flex; align-items: center; gap: 6px; background: #dcfce7; color: #16a34a; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-bottom: 20px; }
        .live-dot { width: 8px; height: 8px; background: #16a34a; border-radius: 50%; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
      `}</style>
      <div className="track-page">
        <div className="track-container">
          <div className="track-header">
            <h1>🚌 Track My Bus</h1>
            <p>Real-time location of your booked buses</p>
          </div>
          {loading ? (
            <div className="empty-state"><div className="empty-icon">⏳</div><h3>Loading...</h3></div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚌</div>
              <h3>No Active Bookings</h3>
              <p>You have no confirmed bookings to track right now.</p>
            </div>
          ) : (
            <>
              <div className="booking-selector">
                {bookings.map((b, i) => (
                  <button key={b._id} className={`booking-chip ${selected?._id === b._id ? 'active' : ''}`} onClick={() => setSelected(b)}>
                    {b.route?.from || b.route?.origin || 'Trip'} → {b.route?.to || b.route?.destination || `#${i + 1}`}
                  </button>
                ))}
              </div>
              {selected && (
                <div className="track-card">
                  <div className="live-badge"><div className="live-dot" />LIVE TRACKING</div>
                  <div className="route-display">
                    <div className="city">
                      <div className="city-name">{selected.route?.from || selected.route?.origin || '—'}</div>
                      <div className="city-label">Origin</div>
                    </div>
                    <div className="route-line">
                      <div className="route-line-fill" style={{ width: `${progress}%` }} />
                      <span className="bus-icon" style={{ left: `calc(${progress}% - 12px)` }}>🚌</span>
                    </div>
                    <div className="city">
                      <div className="city-name">{selected.route?.to || selected.route?.destination || '—'}</div>
                      <div className="city-label">Destination</div>
                    </div>
                  </div>
                  <div className="stops-row">
                    {stops.map((s, i) => (
                      <div className="stop" key={i}>
                        <div className={`stop-dot ${i < currentStop ? 'passed' : i === currentStop ? 'current' : ''}`}>{i + 1}</div>
                        <div className={`stop-label ${i === currentStop ? 'active' : ''}`}>{s}</div>
                      </div>
                    ))}
                  </div>
                  <div className="info-grid">
  <div className="info-item">
    <div className="info-item-label">Bus</div>
    <div className="info-item-value">
      {selected.route?.bus?.name || selected.route?.bus?.busName || 'N/A'}
    </div>
  </div>

  <div className="info-item">
    <div className="info-item-label">Seats</div>
    <div className="info-item-value">
      {selected.seats?.join(', ') || selected.totalSeats || '—'}
    </div>
  </div>

  <div className="info-item">
    <div className="info-item-label">Status</div>
    <div
      className="info-item-value"
      style={{ color: '#16a34a', textTransform: 'capitalize' }}
    >
      {selected.status}
    </div>
  </div>

  <div className="info-item">
    <div className="info-item-label">Amount Paid</div>
    <div className="info-item-value">
      ₹{selected.totalAmount}
    </div>
  </div>

  <div className="info-item">
    <div className="info-item-label">Journey Progress</div>
    <div className="info-item-value">
      {Math.round(progress)}%
    </div>
  </div>

  <div className="info-item">
    <div className="info-item-label">ETA</div>
    <div className="info-item-value">
      {progress >= 100
        ? 'Arrived'
        : `${Math.ceil((100 - progress) * 4.8)} mins`}
    </div>
  </div>
</div>
                     </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}