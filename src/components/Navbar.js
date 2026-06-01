import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); setDrawerOpen(false); };

  const navItems = [
    { path: '/', icon: 'search', label: 'Search' },
    { path: '/my-bookings', icon: 'confirmation_number', label: 'My Bookings', requireAuth: true },
    { path: isAdmin ? '/admin' : '/login', icon: 'person', label: isAdmin ? 'Admin' : 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  const drawerLinks = [
    {
      section: 'Main',
      items: [
        { path: '/', icon: 'home', label: 'Home' },
        { path: '/', icon: 'search', label: 'Search Buses' },
        { path: '/my-bookings', icon: 'confirmation_number', label: 'My Bookings', badge: '2' },
        { path: '/track', icon: 'location_on', label: 'Track My Bus' },
      ],
    },
    {
      section: 'Offers',
      items: [
        { path: '/deals', icon: 'local_offer', label: 'Deals & Coupons', badgeNew: true },
        { path: '/rewards', icon: 'star', label: 'Loyalty Rewards' },
      ],
    },
    {
      section: 'Account',
      items: [
        { path: isAdmin ? '/admin' : '/login', icon: 'person', label: isAdmin ? 'Admin Panel' : 'My Profile' },
        { path: '/payments', icon: 'credit_card', label: 'Saved Payments' },
        { path: '/notifications', icon: 'notifications', label: 'Notifications' },
      ],
    },
    {
      section: 'Support',
      items: [
        { path: '/help', icon: 'help', label: 'Help & FAQ' },
        { path: '/chat', icon: 'chat_bubble', label: 'Chat With Us' },
      ],
    },
  ];

  return (
    <>
      {/* Overlay */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 100,
            transition: 'opacity 0.25s',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 280,
        height: '100vh',
        background: 'var(--surface)',
        zIndex: 101,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Drawer Header */}
        <div style={{ padding: '20px 16px 16px', background: '#1a1f4b' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#E85D14', letterSpacing: '-0.5px' }}>
            Bus<span style={{ color: 'white' }}>Go</span>
          </h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>Your journey, simplified</p>
        </div>

        {/* User Pill */}
        {isLoggedIn && (
          <div style={{
            margin: '12px 14px',
            background: 'var(--surface-container-lowest)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 10,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#E85D14',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 1 }}>{user?.email}</div>
            </div>
          </div>
        )}

        {/* Nav Sections */}
        {drawerLinks.map((section) => (
          <div key={section.section} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 4 }}>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--on-surface-variant)',
              padding: '10px 16px 4px',
            }}>
              {section.section}
            </div>
            {section.items.map((item) => (
              <Link
                key={item.path + item.label}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 16px',
                  background: isActive(item.path) ? 'var(--secondary-container)' : 'transparent',
                  color: isActive(item.path) ? 'var(--on-secondary-container)' : 'var(--on-surface-variant)',
                  textDecoration: 'none',
                  transition: 'background 0.12s',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20, width: 24, textAlign: 'center' }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: 14, flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: '#E85D14', color: 'white',
                    fontSize: 10, fontWeight: 600,
                    padding: '2px 7px', borderRadius: 20,
                  }}>{item.badge}</span>
                )}
                {item.badgeNew && (
                  <span style={{
                    background: '#ecfdf5', color: '#059669',
                    fontSize: 10, fontWeight: 600,
                    padding: '2px 7px', borderRadius: 20,
                  }}>New</span>
                )}
              </Link>
            ))}
          </div>
        ))}

        {/* Logout */}
        {isLoggedIn && (
          <div style={{ padding: '8px 0' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 16px', width: '100%',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#dc2626',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, width: 24 }}>logout</span>
              <span style={{ fontSize: 14 }}>Log out</span>
            </button>
          </div>
        )}
      </div>

      {/* Top App Bar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 var(--space-md)',
        height: 64,
        width: '100%',
        position: 'fixed',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--surface)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setDrawerOpen(true)}
            style={{ background: 'none', border: 'none', padding: 4, color: 'var(--primary)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{
              fontFamily: 'var(--font-family)',
              fontSize: 22,
              fontWeight: 800,
              color: 'var(--secondary)',
              letterSpacing: '-0.5px',
            }}>BusGo</h1>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isLoggedIn && (
            <span style={{ color: 'var(--on-surface-variant)', fontSize: 13, fontWeight: 500 }}>
              Hi, {user?.name?.split(' ')[0]}
            </span>
          )}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          ) : (
            <Link to="/login">
              <button style={{ background: 'none', border: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 24px 12px',
        backgroundColor: 'var(--surface-container-lowest)',
        boxShadow: '0 -1px 8px rgba(0,0,0,0.08)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 20px',
                borderRadius: 9999,
                backgroundColor: active ? 'var(--secondary-container)' : 'transparent',
                color: active ? 'var(--on-secondary-container)' : 'var(--on-surface-variant)',
                transition: 'all 0.2s ease',
                gap: 2,
                minWidth: 80,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.3 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
