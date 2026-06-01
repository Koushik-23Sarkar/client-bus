import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ALL_OFFERS = [
  { id: 1, tag: 'NEW USER', tagColor: '#0d9488', bg: 'linear-gradient(135deg,#0f2c2c,#0d4a4a)', title: 'Flat 20% OFF', subtitle: 'on first booking', code: 'BUSGO20', desc: 'Valid for first-time users only. Max discount ₹200.', expiry: '31 Dec 2025', category: 'New User' },
  { id: 2, tag: 'WEEKEND SPECIAL', tagColor: '#6366f1', bg: 'linear-gradient(135deg,#1e1b4b,#312e81)', title: 'Cashback up to', subtitle: '₹150 on Weekends', code: 'WEEKEND15', desc: 'Book on Sat or Sun. Cashback credited within 24hrs.', expiry: '31 Dec 2025', category: 'Weekend' },
  { id: 3, tag: 'FESTIVE OFFER', tagColor: '#f97316', bg: 'linear-gradient(135deg,#431407,#7c2d12)', title: '₹100 OFF', subtitle: 'on bookings above ₹500', code: 'FEST100', desc: 'Applicable on bookings of ₹500 or more. Limited time.', expiry: '15 Nov 2025', category: 'Festive' },
  { id: 4, tag: 'STUDENT DEAL', tagColor: '#16a34a', bg: 'linear-gradient(135deg,#052e16,#14532d)', title: '15% Discount', subtitle: 'for students', code: 'STUDENT15', desc: 'Valid student ID required at boarding. Up to ₹150 off.', expiry: '31 Mar 2026', category: 'Student' },
  { id: 5, tag: 'REFER & EARN', tagColor: '#db2777', bg: 'linear-gradient(135deg,#500724,#9d174d)', title: '₹50 Cashback', subtitle: 'for every referral', code: 'REFER50', desc: 'Share your code. Earn ₹50 when your friend books.', expiry: 'No Expiry', category: 'Referral' },
  { id: 6, tag: 'SENIOR CITIZEN', tagColor: '#7c3aed', bg: 'linear-gradient(135deg,#2e1065,#4c1d95)', title: '20% OFF', subtitle: 'for age 60 and above', code: 'SENIOR20', desc: 'Applicable for passengers aged 60+. ID proof needed.', expiry: 'No Expiry', category: 'Senior' },
  { id: 7, tag: 'EARLY BIRD', tagColor: '#b45309', bg: 'linear-gradient(135deg,#1c0a00,#451a03)', title: '₹75 OFF', subtitle: 'book 7 days in advance', code: 'EARLY75', desc: 'Book at least 7 days before travel to avail this offer.', expiry: '31 Dec 2025', category: 'Early Bird' },
  { id: 8, tag: 'NIGHT JOURNEY', tagColor: '#0369a1', bg: 'linear-gradient(135deg,#082f49,#0c4a6e)', title: 'Flat 10% OFF', subtitle: 'on overnight buses', code: 'NIGHT10', desc: 'Valid on buses departing between 9 PM and 6 AM.', expiry: '31 Dec 2025', category: 'Night' },
];

const CATEGORIES = ['All', 'New User', 'Weekend', 'Festive', 'Student', 'Referral', 'Senior', 'Early Bird', 'Night'];

export default function DealsPage() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filtered = activeCategory === 'All'
    ? ALL_OFFERS
    : ALL_OFFERS.filter(o => o.category === activeCategory);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .dp { font-family: 'Poppins', sans-serif; min-height: 100vh; background: #f5f7ff; padding-bottom: 100px; }

        .dp-header {
          background: #0f1c3f;
          padding: 20px 20px 24px;
          position: sticky; top: 64px; z-index: 10;
        }
        .dp-back { background: none; border: none; color: rgba(255,255,255,0.7); font-size: 13px; font-family: 'Poppins', sans-serif; cursor: pointer; padding: 0; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
        .dp-back:hover { color: white; }
        .dp-title { font-size: 22px; font-weight: 800; color: white; margin-bottom: 4px; }
        .dp-sub { font-size: 13px; color: rgba(255,255,255,0.55); }

        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; padding: 16px 20px 0; scrollbar-width: none; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-chip { flex-shrink: 0; padding: 7px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; font-family: 'Poppins', sans-serif; border: 1.5px solid #e5e7eb; background: white; color: #6b7280; cursor: pointer; transition: all 0.2s; }
        .cat-chip.active { background: #f97316; border-color: #f97316; color: white; }

        .deals-grid { padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; }

        .deal-card { border-radius: 16px; overflow: hidden; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .deal-card:hover { transform: translateY(-2px); }
        .deal-top { padding: 18px; position: relative; overflow: hidden; }
        .deal-circle { position: absolute; bottom: -20px; right: -20px; width: 90px; height: 90px; border-radius: 50%; background: rgba(255,255,255,0.07); pointer-events: none; }
        .deal-circle2 { position: absolute; bottom: -45px; right: -45px; width: 140px; height: 140px; border-radius: 50%; background: rgba(255,255,255,0.04); pointer-events: none; }
        .deal-tag { display: inline-block; font-size: 9px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; margin-bottom: 8px; color: white; }
        .deal-title { color: white; font-size: 20px; font-weight: 800; line-height: 1.2; margin-bottom: 2px; }
        .deal-sub { color: rgba(255,255,255,0.7); font-size: 13px; margin-bottom: 14px; }
        .deal-code-row { display: flex; align-items: center; justify-content: space-between; }
        .deal-code-box { background: rgba(255,255,255,0.12); border: 1px dashed rgba(255,255,255,0.4); border-radius: 8px; padding: 6px 12px; }
        .deal-code-label { font-size: 9px; color: rgba(255,255,255,0.45); margin-bottom: 1px; }
        .deal-code-val { font-size: 13px; font-weight: 800; color: white; letter-spacing: 1.5px; }
        .copy-btn { padding: 8px 16px; border-radius: 8px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); color: white; font-size: 12px; font-weight: 700; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 6px; }
        .copy-btn:hover, .copy-btn.copied { background: rgba(255,255,255,0.35); }

        .deal-bottom { background: white; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; }
        .deal-desc { font-size: 12px; color: #6b7280; line-height: 1.5; flex: 1; padding-right: 12px; }
        .deal-expiry { font-size: 11px; color: #9ca3af; white-space: nowrap; }
        .deal-expiry span { font-weight: 700; color: #f97316; }

        .use-btn { width: calc(100% - 36px); margin: 0 18px 14px; padding: 11px; background: #0f1c3f; color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background 0.2s; }
        .use-btn:hover { background: #1a3a6b; }

        .empty-state { text-align: center; padding: 60px 20px; }
        .empty-icon { font-size: 52px; margin-bottom: 12px; }
        .empty-title { font-size: 18px; font-weight: 700; color: #0f1c3f; margin-bottom: 4px; }
        .empty-sub { font-size: 13px; color: #9ca3af; }

        .copied-toast { position: fixed; bottom: 85px; left: 50%; transform: translateX(-50%); background: #0f1c3f; color: white; padding: 10px 20px; border-radius: 24px; font-size: 13px; font-weight: 600; z-index: 9999; box-shadow: 0 8px 24px rgba(0,0,0,0.2); animation: slideUp 0.3s ease; white-space: nowrap; }
        @keyframes slideUp { from { opacity:0; transform: translate(-50%, 20px); } to { opacity:1; transform: translate(-50%, 0); } }
      `}</style>

      <div className="dp">
        <div className="dp-header">
          <button className="dp-back" onClick={() => navigate(-1)}>← Back</button>
          <div className="dp-title">🎁 Exclusive Offers</div>
          <div className="dp-sub">{ALL_OFFERS.length} deals available for you</div>
        </div>

        {/* Category Filter */}
        <div className="cat-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Deals List */}
        <div className="deals-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎟️</div>
              <div className="empty-title">No offers in this category</div>
              <div className="empty-sub">Check back soon for new deals!</div>
            </div>
          ) : (
            filtered.map(offer => (
              <div key={offer.id} className="deal-card" onClick={() => setExpandedId(expandedId === offer.id ? null : offer.id)}>
                <div className="deal-top" style={{ background: offer.bg }}>
                  <div className="deal-circle" /><div className="deal-circle2" />
                  <div className="deal-tag" style={{ background: offer.tagColor }}>{offer.tag}</div>
                  <div className="deal-title">{offer.title}</div>
                  <div className="deal-sub">{offer.subtitle}</div>
                  <div className="deal-code-row">
                    <div className="deal-code-box">
                      <div className="deal-code-label">PROMO CODE</div>
                      <div className="deal-code-val">{offer.code}</div>
                    </div>
                    <button
                      className={`copy-btn ${copiedCode === offer.code ? 'copied' : ''}`}
                      onClick={e => { e.stopPropagation(); handleCopyCode(offer.code); }}
                    >
                      {copiedCode === offer.code ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                </div>
                <div className="deal-bottom">
                  <div className="deal-desc">{offer.desc}</div>
                  <div className="deal-expiry">Expires:<br /><span>{offer.expiry}</span></div>
                </div>
                {expandedId === offer.id && (
                  <button className="use-btn" onClick={e => { e.stopPropagation(); handleCopyCode(offer.code); navigate('/'); }}>
                    Use This Offer → Search Buses
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {copiedCode && (
        <div className="copied-toast">
          ✓ Code <strong style={{ margin: '0 4px' }}>{copiedCode}</strong> copied to clipboard!
        </div>
      )}
    </>
  );
}