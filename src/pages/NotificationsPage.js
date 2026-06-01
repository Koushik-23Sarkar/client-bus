import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function NotificationsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState(() => JSON.parse(localStorage.getItem('readNotifs') || '[]'));

  useEffect(() => {
    API.get('/bookings/my')
      .then(({ data }) => setBookings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const notifications = bookings.map(b => ({
    id: b._id,
    icon: b.status === 'confirmed' ? '✅' : b.status === 'cancelled' ? '❌' : '🕐',
    color: b.status === 'confirmed' ? '#dcfce7' : b.status === 'cancelled' ? '#fee2e2' : '#fff7ed',
    iconColor: b.status === 'confirmed' ? '#16a34a' : b.status === 'cancelled' ? '#ef4444' : '#f97316',
    title: b.status === 'confirmed' ? 'Booking Confirmed' : b.status === 'cancelled' ? 'Booking Cancelled' : 'Booking Pending',
    message: `Your trip from ${b.route?.from || '—'} to ${b.route?.to || '—'} · ₹${b.totalAmount}`,
    time: new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  })).concat([
    { id: 'promo1', icon: '🎉', color: '#fef3c7', iconColor: '#d97706', title: 'Offer: BUSGO20', message: 'Use code BUSGO20 for 20% off on your first booking!', time: 'Today' },
    { id: 'promo2', icon: '⭐', color: '#ede9fe', iconColor: '#7c3aed', title: 'Loyalty Points Updated', message: 'You earned points from your last trip. Check your rewards!', time: 'This week' },
  ]);

  const markAllRead = () => {
    const ids = notifications.map(n => n.id);
    setRead(ids);
    localStorage.setItem('readNotifs', JSON.stringify(ids));
  };

  const markRead = (id) => {
    const updated = [...new Set([...read, id])];
    setRead(updated);
    localStorage.setItem('readNotifs', JSON.stringify(updated));
  };

  const unreadCount = notifications.filter(n => !read.includes(n.id)).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        .notifs { font-family: 'Poppins', sans-serif; min-height: 100vh; background: #f0f4ff; padding: 100px 20px 100px; }
        .notifs-container { max-width: 640px; margin: 0 auto; }
        .notifs-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .notifs-header h1 { font-size: 26px; font-weight: 800; color: #0f1c3f; }
        .notifs-header p { color: #9ca3af; font-size: 14px; margin-top: 4px; }
        .mark-btn { background: #f0f4ff; color: #f97316; border: none; border-radius: 10px; padding: 8px 16px; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .unread-badge { display: inline-block; background: #f97316; color: white; font-size: 11px; font-weight: 800; border-radius: 20px; padding: 2px 8px; margin-left: 8px; }
        .notif-item { background: white; border-radius: 18px; padding: 18px 20px; margin-bottom: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); display: flex; align-items: flex-start; gap: 14px; cursor: pointer; transition: box-shadow 0.2s; position: relative; }
        .notif-item:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09); }
        .notif-item.unread { border-left: 4px solid #f97316; }
        .notif-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .notif-body { flex: 1; }
        .notif-title { font-size: 15px; font-weight: 700; color: #0f1c3f; margin-bottom: 4px; }
        .notif-message { font-size: 13px; color: #6b7280; font-weight: 500; }
        .notif-time { font-size: 11px; color: #d1d5db; font-weight: 600; margin-top: 6px; }
        .notif-dot { width: 8px; height: 8px; background: #f97316; border-radius: 50%; position: absolute; top: 20px; right: 20px; }
        .empty { text-align: center; padding: 60px 20px; color: #9ca3af; }
      `}</style>
      <div className="notifs">
        <div className="notifs-container">
          <div className="notifs-header">
            <div>
              <h1>🔔 Notifications {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}</h1>
              <p>Your booking updates and offers</p>
            </div>
            {unreadCount > 0 && <button className="mark-btn" onClick={markAllRead}>Mark all read</button>}
          </div>
          {loading ? <p style={{ color: '#9ca3af' }}>Loading...</p> : notifications.length === 0 ? (
            <div className="empty"><div style={{ fontSize: 52 }}>🔔</div><p>No notifications yet</p></div>
          ) : notifications.map(n => (
            <div key={n.id} className={`notif-item ${!read.includes(n.id) ? 'unread' : ''}`} onClick={() => markRead(n.id)}>
              <div className="notif-icon" style={{ background: n.color }}>{n.icon}</div>
              <div className="notif-body">
                <div className="notif-title">{n.title}</div>
                <div className="notif-message">{n.message}</div>
                <div className="notif-time">{n.time}</div>
              </div>
              {!read.includes(n.id) && <div className="notif-dot" />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}