import { useState, useEffect } from 'react';
import API from '../api/axios';
import Spinner from '../components/Spinner';

const TAB_ICONS = {
  dashboard: 'dashboard',
  buses: 'directions_bus',
  routes: 'route',
  bookings: 'confirmation_number',
  users: 'group',
};

const inp = {
  padding: '10px 14px',
  border: '1.5px solid var(--outline-variant)',
  borderRadius: 10,
  fontSize: 14,
  outline: 'none',
  fontFamily: 'var(--font-family)',
  backgroundColor: 'var(--surface-bright)',
  color: 'var(--on-surface)',
  width: '100%',
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // FIX 1: track errors
  const [nb, setNb] = useState({ busNumber: '', busName: '', totalSeats: 40, busType: 'AC' });
  const [nr, setNr] = useState({ bus: '', from: '', to: '', departureTime: '', arrivalTime: '', price: '' });

  useEffect(() => {
    // FIX 2: added .catch() so loading never stays true on error
    API.get('/admin/dashboard')
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const loadTab = async (t) => {
    setTab(t);
    try {
      if (t === 'users' && !users.length) {
        const { data } = await API.get('/admin/users');
        setUsers(data);
      }
      if (t === 'buses' && !buses.length) {
        const { data } = await API.get('/buses');
        setBuses(data);
      }
      if (t === 'routes') {
        if (!routes.length) { const { data } = await API.get('/routes'); setRoutes(data); }
        if (!buses.length) { const { data } = await API.get('/buses'); setBuses(data); }
      }
      if (t === 'bookings' && !bookings.length) {
        const { data } = await API.get('/bookings/all');
        setBookings(data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load data');
    }
  };

  const addBus = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/buses', { ...nb, totalSeats: Number(nb.totalSeats) });
      setBuses(p => [data.bus, ...p]);
      setNb({ busNumber: '', busName: '', totalSeats: 40, busType: 'AC' });
      alert('Bus added!');
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const addRoute = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/routes', {
        ...nr,
        price: Number(nr.price),
      });
      setRoutes(p => [data.route, ...p]);
      setNr({ bus: '', from: '', to: '', departureTime: '', arrivalTime: '', price: '' }); // FIX 3: reset form after add
      alert('Route added!');
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const toggleUser = async (id) => {
    try {
      const { data } = await API.patch('/admin/users/' + id + '/toggle');
      setUsers(p => p.map(u => u._id === id ? data.user : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  const deleteRoute = async (id) => {
    if (!window.confirm('Delete this route? This cannot be undone.')) return;
    try {
      await API.delete('/routes/' + id);
      setRoutes(p => p.filter(r => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete route');
    }
  };

  // FIX 4: show error state instead of being blank
  if (loading) return <div style={{ paddingTop: 64 }}><Spinner /></div>;
  if (error) return (
    <div style={{ paddingTop: 100, textAlign: 'center', fontFamily: 'var(--font-family)' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
      <h2 style={{ color: 'var(--error)', marginBottom: 8 }}>Failed to load dashboard</h2>
      <p style={{ color: 'var(--on-surface-variant)', marginBottom: 24 }}>{error}</p>
      <button
        onClick={() => { setError(null); setLoading(true); API.get('/admin/dashboard').then(({ data }) => setData(data)).catch((err) => setError(err.response?.data?.message || 'Failed')).finally(() => setLoading(false)); }}
        style={{ padding: '10px 24px', backgroundColor: 'var(--secondary-container)', color: 'var(--on-secondary-container)', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-family)' }}
      >
        Try Again
      </button>
    </div>
  );

  const s = data?.stats;

  const statCards = s ? [
    { label: 'Users', value: s.totalUsers, icon: 'group', color: 'var(--primary-container)', textColor: 'var(--on-primary-container)' },
    { label: 'Buses', value: s.totalBuses, icon: 'directions_bus', color: '#dcfce7', textColor: '#166534' },
    { label: 'Routes', value: s.totalRoutes, icon: 'route', color: '#f3e8ff', textColor: '#7e22ce' },
    { label: 'Bookings', value: s.totalBookings, icon: 'confirmation_number', color: '#fff7ed', textColor: '#c2410c' },
    { label: 'Confirmed', value: s.confirmedBookings, icon: 'check_circle', color: '#dcfce7', textColor: '#166534' },
    { label: 'Pending', value: s.pendingBookings, icon: 'schedule', color: '#fef9c3', textColor: '#854d0e' },
    { label: 'Cancelled', value: s.cancelledBookings, icon: 'cancel', color: '#fee2e2', textColor: '#991b1b' },
    { label: 'Revenue', value: `₹${s.totalRevenue}`, icon: 'payments', color: 'var(--surface-container)', textColor: 'var(--secondary)' },
  ] : [];

  const thStyle = {
    padding: '10px 14px',
    textAlign: 'left',
    color: 'var(--on-surface-variant)',
    fontWeight: 700,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderBottom: '1px solid var(--outline-variant)',
    fontFamily: 'var(--font-family)',
    backgroundColor: 'var(--surface-container-low)',
  };
  const tdStyle = { padding: '12px 14px', fontSize: 14, color: 'var(--on-surface)', borderBottom: '1px solid var(--surface-container-low)' };

  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: 'var(--background)',
      paddingTop: 64,
      paddingBottom: 100,
    }}>
      <div style={{ padding: '20px var(--space-md)', maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{
            fontFamily: 'var(--font-family)',
            fontSize: 22,
            fontWeight: 800,
            color: 'var(--primary)',
          }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 14, marginTop: 4 }}>Manage your bus service</p>
        </div>

        {/* Tab Bar */}
        <div style={{
          display: 'flex',
          gap: 4,
          overflowX: 'auto',
          marginBottom: 24,
          backgroundColor: 'var(--surface-container-low)',
          padding: 4,
          borderRadius: 14,
        }} className="hide-scrollbar">
          {Object.keys(TAB_ICONS).map(t => (
            <button
              key={t}
              onClick={() => loadTab(t)}
              style={{
                padding: '8px 14px',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                fontWeight: tab === t ? 700 : 500,
                color: tab === t ? 'var(--on-secondary-container)' : 'var(--on-surface-variant)',
                backgroundColor: tab === t ? 'var(--secondary-container)' : 'transparent',
                textTransform: 'capitalize',
                fontSize: 13,
                fontFamily: 'var(--font-family)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s',
                flex: 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{TAB_ICONS[t]}</span>
              {t}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {tab === 'dashboard' && s && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 12,
              marginBottom: 28,
            }}>
              {statCards.map(({ label, value, icon, color, textColor }) => (
                <div key={label} style={{
                  backgroundColor: color,
                  borderRadius: 14,
                  padding: '16px',
                  border: '1px solid rgba(0,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span className="material-symbols-outlined" style={{ color: textColor, fontSize: 18 }}>{icon}</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: textColor, fontFamily: 'var(--font-family)' }}>{value}</div>
                  <div style={{ color: textColor, fontSize: 12, marginTop: 2, opacity: 0.75, fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: 'var(--font-family)', fontWeight: 700, color: 'var(--primary)', marginBottom: 14, fontSize: 16 }}>Recent Bookings</h3>
            {/* FIX 5: show empty state when no bookings */}
            {data.recentBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-family)', border: '1px solid var(--outline-variant)', borderRadius: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>inbox</span>
                No bookings yet
              </div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid var(--outline-variant)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 500 }}>
                  <thead>
                    <tr>
                      {['Ticket', 'User', 'Route', 'Amount', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentBookings.map(b => (
                      <tr key={b._id}>
                        <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 12 }}>{b.ticketId}</td>
                        <td style={tdStyle}>{b.user?.name}</td>
                        <td style={tdStyle}>{b.route?.from} → {b.route?.to}</td>
                        <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--secondary)' }}>₹{b.totalPrice}</td>
                        <td style={tdStyle}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                            backgroundColor: b.status === 'confirmed' ? '#dcfce7' : b.status === 'cancelled' ? '#fee2e2' : '#fef9c3',
                            color: b.status === 'confirmed' ? '#166534' : b.status === 'cancelled' ? '#991b1b' : '#854d0e',
                          }}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Buses Tab */}
        {tab === 'buses' && (
          <div>
            <div style={{ backgroundColor: 'var(--surface-container-lowest)', borderRadius: 16, padding: 20, border: '1px solid var(--outline-variant)', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-family)', fontWeight: 700, color: 'var(--primary)', marginBottom: 16, fontSize: 16 }}>Add New Bus</h3>
              <form onSubmit={addBus} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                <input placeholder="Bus Number" value={nb.busNumber} onChange={e => setNb({ ...nb, busNumber: e.target.value })} required style={inp} />
                <input placeholder="Bus Name" value={nb.busName} onChange={e => setNb({ ...nb, busName: e.target.value })} required style={inp} />
                <input type="number" placeholder="Total Seats" value={nb.totalSeats} onChange={e => setNb({ ...nb, totalSeats: e.target.value })} style={inp} />
                <select value={nb.busType} onChange={e => setNb({ ...nb, busType: e.target.value })} style={inp}>
                  {['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper', 'Luxury'].map(t => <option key={t}>{t}</option>)}
                </select>
                <button type="submit" style={{
                  padding: '10px 20px', backgroundColor: 'var(--secondary-container)', color: 'var(--on-secondary-container)',
                  border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14,
                  fontFamily: 'var(--font-family)', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span> Add Bus
                </button>
              </form>
            </div>
            {/* FIX 6: empty state for buses table */}
            {buses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-family)', border: '1px solid var(--outline-variant)', borderRadius: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>directions_bus</span>
                No buses added yet. Add your first bus above.
              </div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid var(--outline-variant)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead><tr>{['Bus Number', 'Name', 'Type', 'Seats'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                  <tbody>{buses.map(b => (
                    <tr key={b._id}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{b.busNumber}</td>
                      <td style={tdStyle}>{b.busName}</td>
                      <td style={tdStyle}><span style={{ padding: '2px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700, backgroundColor: 'var(--surface-container)', color: 'var(--on-surface-variant)' }}>{b.busType}</span></td>
                      <td style={tdStyle}>{b.totalSeats}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Routes Tab */}
        {tab === 'routes' && (
          <div>
            <div style={{ backgroundColor: 'var(--surface-container-lowest)', borderRadius: 16, padding: 20, border: '1px solid var(--outline-variant)', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-family)', fontWeight: 700, color: 'var(--primary)', marginBottom: 16, fontSize: 16 }}>Add New Route</h3>
              {/* FIX 7: warn if no buses exist yet */}
              {buses.length === 0 && (
                <div style={{ marginBottom: 12, padding: '10px 14px', backgroundColor: '#fef9c3', borderRadius: 10, color: '#854d0e', fontSize: 13, fontFamily: 'var(--font-family)', fontWeight: 600 }}>
                  ⚠️ You need to add a bus first before creating a route.
                </div>
              )}
              <form onSubmit={addRoute} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
                <select value={nr.bus} onChange={e => setNr({ ...nr, bus: e.target.value })} required style={inp}>
                  <option value="">Select Bus</option>
                  {buses.map(b => <option key={b._id} value={b._id}>{b.busName} ({b.busNumber})</option>)}
                </select>
                <input placeholder="From" value={nr.from} onChange={e => setNr({ ...nr, from: e.target.value })} required style={inp} />
                <input placeholder="To" value={nr.to} onChange={e => setNr({ ...nr, to: e.target.value })} required style={inp} />
                <input type="time" value={nr.departureTime} onChange={e => setNr({ ...nr, departureTime: e.target.value })} required style={inp} />
                <input type="time" value={nr.arrivalTime} onChange={e => setNr({ ...nr, arrivalTime: e.target.value })} required style={inp} />
                <input type="number" placeholder="Price (₹)" value={nr.price} onChange={e => setNr({ ...nr, price: e.target.value })} required style={inp} />
                <button type="submit" style={{
                  padding: '10px 20px', backgroundColor: 'var(--secondary-container)', color: 'var(--on-secondary-container)',
                  border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14,
                  fontFamily: 'var(--font-family)', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span> Add Route
                </button>
              </form>
            </div>
            {routes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-family)', border: '1px solid var(--outline-variant)', borderRadius: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>route</span>
                No routes added yet. Add your first route above.
              </div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid var(--outline-variant)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead><tr>{['From', 'To', 'Departure', 'Arrival', 'Price', 'Bus', 'Seats', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                  <tbody>{routes.map(r => (
                    <tr key={r._id}>
                      <td style={tdStyle}>{r.from}</td>
                      <td style={tdStyle}>{r.to}</td>
                      <td style={tdStyle}>{r.departureTime || '—'}</td>
                      <td style={tdStyle}>{r.arrivalTime || '—'}</td>
                      <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--secondary)' }}>₹{r.price}</td>
                      <td style={tdStyle}>{r.bus?.busName}</td>
                      {/* FIX 8: show available seats so admin can see capacity */}
                      <td style={tdStyle}>{r.availableSeats} / {r.bus?.totalSeats}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => deleteRoute(r._id)}
                          style={{
                            padding: '5px 12px',
                            backgroundColor: 'var(--error-container)',
                            color: 'var(--on-error-container)',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-family)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-family)', fontWeight: 700, color: 'var(--primary)', marginBottom: 16, fontSize: 16 }}>All Bookings ({bookings.length})</h3>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-family)', border: '1px solid var(--outline-variant)', borderRadius: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>confirmation_number</span>
                No bookings yet
              </div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid var(--outline-variant)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead><tr>{['Ticket', 'User', 'Route', 'Seats', 'Amount', 'Status', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                  <tbody>{bookings.map(b => (
                    <tr key={b._id}>
                      <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 12 }}>{b.ticketId}</td>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600 }}>{b.user?.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{b.user?.email}</div>
                      </td>
                      <td style={tdStyle}>{b.route?.from} → {b.route?.to}</td>
                      <td style={tdStyle}>{b.seats?.join(', ')}</td>
                      <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--secondary)' }}>₹{b.totalPrice}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                          backgroundColor: b.status === 'confirmed' ? '#dcfce7' : b.status === 'cancelled' ? '#fee2e2' : '#fef9c3',
                          color: b.status === 'confirmed' ? '#166534' : b.status === 'cancelled' ? '#991b1b' : '#854d0e',
                        }}>{b.status}</span>
                      </td>
                      {/* FIX 9: Admin can confirm pending bookings */}
                      <td style={tdStyle}>
                        {b.status === 'pending' && (
                          <button
                            onClick={async () => {
                              try {
                                await API.patch('/admin/bookings/' + b._id + '/status', { status: 'confirmed' });
                                setBookings(p => p.map(bk => bk._id === b._id ? { ...bk, status: 'confirmed' } : bk));
                              } catch (err) {
                                alert(err.response?.data?.message || 'Failed');
                              }
                            }}
                            style={{
                              padding: '5px 12px', backgroundColor: '#dcfce7', color: '#166534',
                              border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
                              cursor: 'pointer', fontFamily: 'var(--font-family)',
                            }}
                          >
                            Confirm
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-family)', fontWeight: 700, color: 'var(--primary)', marginBottom: 16, fontSize: 16 }}>All Users ({users.length})</h3>
            {users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-family)', border: '1px solid var(--outline-variant)', borderRadius: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>group</span>
                No users found
              </div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid var(--outline-variant)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead><tr>{['Name', 'Email', 'Phone', 'Role', 'Status', 'Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
                  <tbody>{users.map(u => (
                    <tr key={u._id}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{u.name}</td>
                      <td style={{ ...tdStyle, fontSize: 13 }}>{u.email}</td>
                      {/* FIX 10: show phone number */}
                      <td style={{ ...tdStyle, fontSize: 13 }}>{u.phone || '—'}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '2px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                          backgroundColor: u.role === 'admin' ? 'var(--primary-container)' : 'var(--surface-container)',
                          color: u.role === 'admin' ? 'var(--on-primary-container)' : 'var(--on-surface-variant)',
                        }}>{u.role}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '2px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                          backgroundColor: u.isActive ? '#dcfce7' : '#fee2e2',
                          color: u.isActive ? '#166534' : '#991b1b',
                        }}>{u.isActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td style={tdStyle}>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => toggleUser(u._id)}
                            style={{
                              padding: '5px 12px',
                              backgroundColor: u.isActive ? 'var(--error-container)' : '#dcfce7',
                              color: u.isActive ? 'var(--on-error-container)' : '#166534',
                              border: 'none',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: 'var(--font-family)',
                            }}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}