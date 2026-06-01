import { useState } from 'react';

export default function SavedPaymentsPage() {
  const [cards] = useState([
    { id: 1, type: 'UPI', detail: 'swati@upi', icon: '📱', color: '#7c3aed' },
    { id: 2, type: 'Card', detail: '**** **** **** 4242', icon: '💳', color: '#0f1c3f', network: 'VISA' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: 'UPI', detail: '' });
  const [saved, setSaved] = useState(cards);

  const handleAdd = () => {
    if (!form.detail.trim()) return;
    setSaved(p => [...p, { id: Date.now(), type: form.type, detail: form.detail, icon: form.type === 'UPI' ? '📱' : '💳', color: '#f97316' }]);
    setForm({ type: 'UPI', detail: '' });
    setShowAdd(false);
  };

  const handleRemove = (id) => {
    if (window.confirm('Remove this payment method?')) setSaved(p => p.filter(c => c.id !== id));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        .sp { font-family: 'Poppins', sans-serif; min-height: 100vh; background: #f0f4ff; padding: 100px 20px 100px; }
        .sp-container { max-width: 600px; margin: 0 auto; }
        .sp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .sp-header h1 { font-size: 26px; font-weight: 800; color: #0f1c3f; }
        .sp-header p { color: #9ca3af; font-size: 14px; margin-top: 4px; }
        .add-btn { background: #f97316; color: white; border: none; border-radius: 12px; padding: 10px 20px; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .payment-card { background: white; border-radius: 20px; padding: 20px 24px; margin-bottom: 14px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); display: flex; align-items: center; gap: 16px; }
        .pm-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
        .pm-info { flex: 1; }
        .pm-type { font-size: 13px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }
        .pm-detail { font-size: 16px; font-weight: 700; color: #0f1c3f; margin-top: 2px; }
        .pm-remove { background: #fff0f0; color: #ef4444; border: none; border-radius: 10px; padding: 8px 14px; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; }
        .add-form { background: white; border-radius: 20px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 14px; }
        .add-form h3 { font-size: 16px; font-weight: 700; color: #0f1c3f; margin-bottom: 16px; }
        .form-row { display: flex; gap: 12px; margin-bottom: 14px; }
        .form-select, .form-input {
          flex: 1; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 12px;
          font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 500; color: #0f1c3f; background: #f8faff;
          outline: none;
        }
        .form-select:focus, .form-input:focus { border-color: #f97316; }
        .form-actions { display: flex; gap: 10px; }
        .save-btn { flex: 1; background: #f97316; color: white; border: none; border-radius: 12px; padding: 12px; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; }
        .cancel-btn { flex: 1; background: #f0f4ff; color: #6b7280; border: none; border-radius: 12px; padding: 12px; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; }
        .note { background: #fff7ed; border-radius: 14px; padding: 14px 18px; font-size: 13px; color: #92400e; font-weight: 500; margin-top: 4px; }
      `}</style>
      <div className="sp">
        <div className="sp-container">
          <div className="sp-header">
            <div>
              <h1>💳 Saved Payments</h1>
              <p>Your saved UPI IDs and cards</p>
            </div>
            <button className="add-btn" onClick={() => setShowAdd(s => !s)}>+ Add New</button>
          </div>
          {showAdd && (
            <div className="add-form">
              <h3>Add Payment Method</h3>
              <div className="form-row">
                <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="UPI">UPI</option>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="NetBanking">Net Banking</option>
                </select>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  placeholder={form.type === 'UPI' ? 'yourname@upi' : form.type === 'Card' ? 'Card number' : 'Bank name'}
                  value={form.detail}
                  onChange={e => setForm({ ...form, detail: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button className="cancel-btn" onClick={() => setShowAdd(false)}>Cancel</button>
                <button className="save-btn" onClick={handleAdd}>Save</button>
              </div>
            </div>
          )}
          {saved.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>💳</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#0f1c3f' }}>No saved payment methods</div>
              <div style={{ fontSize: 14, marginTop: 6 }}>Add a UPI ID or card to pay faster next time</div>
            </div>
          ) : saved.map(c => (
            <div className="payment-card" key={c.id}>
              <div className="pm-icon" style={{ background: c.color + '18' }}>{c.icon}</div>
              <div className="pm-info">
                <div className="pm-type">{c.type}</div>
                <div className="pm-detail">{c.detail}</div>
              </div>
              <button className="pm-remove" onClick={() => handleRemove(c.id)}>Remove</button>
            </div>
          ))}
          <div className="note">🔒 Your payment details are securely stored and never shared with third parties.</div>
        </div>
      </div>
    </>
  );
}