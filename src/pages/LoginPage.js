import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: 'var(--background)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 20px 100px',
    }}>
      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64,
          backgroundColor: 'var(--secondary-container)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--on-secondary-container)', fontSize: 32 }}>directions_bus</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-family)', fontSize: 26, fontWeight: 800, color: 'var(--secondary)', marginBottom: 4 }}>BusGo</h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>Welcome back! Sign in to continue.</p>
      </div>

      {/* Card */}
      <div style={{
        backgroundColor: 'var(--surface-container-lowest)',
        borderRadius: 20,
        padding: '32px 28px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 4px 24px rgba(0,21,57,0.08)',
        border: '1px solid var(--outline-variant)',
      }}>
        {error && (
          <div style={{
            backgroundColor: 'var(--error-container)',
            border: '1px solid rgba(186,26,26,0.2)',
            borderRadius: 10,
            padding: '10px 14px',
            color: 'var(--on-error-container)',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: 'var(--outline)',
              marginBottom: 6,
            }}>Email</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              border: '1.5px solid var(--outline-variant)',
              borderRadius: 12,
              padding: '12px 16px',
              backgroundColor: 'var(--surface-bright)',
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--outline)', fontSize: 20 }}>mail</span>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-family)',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: 'var(--outline)',
              marginBottom: 6,
            }}>Password</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              border: '1.5px solid var(--outline-variant)',
              borderRadius: 12,
              padding: '12px 16px',
              backgroundColor: 'var(--surface-bright)',
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--outline)', fontSize: 20 }}>lock</span>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-family)',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? 'var(--outline-variant)' : 'var(--secondary-container)',
              color: loading ? 'var(--on-surface-variant)' : 'var(--on-secondary-container)',
              border: 'none',
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-family)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: loading ? 'none' : '0 4px 16px rgba(254,107,0,0.25)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--on-surface-variant)', fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--secondary-container)', fontWeight: 700 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}