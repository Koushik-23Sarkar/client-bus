export default function Spinner({ message = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      gap: 16,
    }}>
      <div style={{
        width: 44,
        height: 44,
        border: '4px solid var(--outline-variant)',
        borderTop: '4px solid var(--secondary-container)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{
        color: 'var(--on-surface-variant)',
        fontSize: 14,
        fontWeight: 500,
        fontFamily: 'var(--font-family)',
      }}>{message}</p>
    </div>
  );
}