import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name: form.name, email: form.email, phone: form.phone, password: form.password });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', icon: 'person', placeholder: 'Your full name', required: true },
    { key: 'email', label: 'Email', type: 'email', icon: 'mail', placeholder: 'you@example.com', required: true },
    { key: 'phone', label: 'Phone (optional)', type: 'tel', icon: 'phone', placeholder: '+91 98765 43210', required: false },
    { key: 'password', label: 'Password', type: 'password', icon: 'lock', placeholder: '••••••••', required: true },
    { key: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: 'lock_reset', placeholder: '••••••••', required: true },
  ];

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
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
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
        <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>Create your account to get started</p>
      </div>

      {/* Card */}
      <div style={{
        backgroundColor: 'var(--surface-container-lowest)',
        borderRadius: 20,
        padding: '32px 28px',
        width: '100%',
        maxWidth: 440,
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
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map((field, i) => (
            <div key={field.key} style={{ marginBottom: i === fields.length - 1 ? 24 : 14 }}>
              <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                color: 'var(--outline)',
                marginBottom: 6,
              }}>{field.label}</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                border: '1.5px solid var(--outline-variant)',
                borderRadius: 12,
                padding: '12px 16px',
                backgroundColor: 'var(--surface-bright)',
              }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--outline)', fontSize: 20 }}>{field.icon}</span>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  required={field.required}
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
          ))}

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
            {loading ? 'Creating Account...' : 'Create Account'}
            {!loading && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--on-surface-variant)', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--secondary-container)', fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}