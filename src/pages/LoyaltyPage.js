import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function LoyaltyPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/bookings/my')
      .then(({ data }) => setBookings(data.filter(b => b.status === 'confirmed')))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = bookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
  const points = Math.floor(totalSpent / 10);
  const tier = points >= 5000 ? 'Platinum' : points >= 2000 ? 'Gold' : points >= 500 ? 'Silver' : 'Bronze';
  const tierColors = { Bronze: ['#cd7f32', '#8B4513'], Silver: ['#c0c0c0', '#708090'], Gold: ['#FFD700', '#B8860B'], Platinum: ['#e5e4e2', '#6c6c6c'] };
  const tierEmoji = { Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎' };
  const nextTierPoints = points < 500 ? 500 : points < 2000 ? 2000 : points < 5000 ? 5000 : 10000;
  const progressPct = Math.min(100, Math.round((points / nextTierPoints) * 100));

  const perks = {
    Bronze: ['5% discount on 5th booking', 'Priority customer support', 'Birthday bonus points'],
    Silver: ['10% discount on every booking', 'Free seat upgrade (once/month)', 'Early access to deals'],
    Gold: ['15% discount on every booking', 'Free cancellation anytime', 'Lounge access at major stops', 'Dedicated support line'],
    Platinum: ['20% discount on every booking', 'Free cancellations & changes', 'Premium seat always', 'Exclusive member offers', 'Personal travel concierge'],
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        .loyalty { font-family: 'Poppins', sans-serif; min-height: 100vh; background: #f0f4ff; padding: 100px 20px 100px; }
        .loy-container { max-width: 720px; margin: 0 auto; }
        .loy-header h1 { font-size: 26px; font-weight: 800; color: #0f1c3f; margin-bottom: 4px; }
        .loy-header p { color: #9ca3af; font-size: 14px; margin-bottom: 24px; }
        .tier-card {
          border-radius: 24px; padding: 32px; margin-bottom: 20px;
          background: linear-gradient(135deg, #0f1c3f, #1e3a8a);
          color: white; box-shadow: 0 8px 32px rgba(15,28,63,0.3);
        }
        .tier-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .tier-badge { font-size: 42px; }
        .tier-name { font-size: 13px; font-weight: 700; opacity: 0.7; letter-spacing: 2px; text-transform: uppercase; }
        .tier-title { font-size: 28px; font-weight: 800; }
        .points-display { text-align: right; }
        .points-num { font-size: 40px; font-weight: 800; color: #fbbf24; }
        .points-label { font-size: 12px; opacity: 0.7; font-weight: 600; }
        .progress-section { margin-bottom: 8px; }
        .progress-label { display: flex; justify-content: space-between; font-size: 12px; opacity: 0.7; margin-bottom: 8px; }
        .progress-bar { height: 8px; background: rgba(255,255,255,0.2); border-radius: 8px; overflow: hidden; }
        .progress-fill { height: 100%; background: #fbbf24; border-radius: 8px; transition: width 1s ease; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
        .stat-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); text-align: center; }
        .stat-num { font-size: 28px; font-weight: 800; color: #f97316; }
        .stat-label { font-size: 12px; color: #9ca3af; font-weight: 600; margin-top: 4px; }
        .perks-card { background: white; border-radius: 20px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); margin-bottom: 20px; }
        .perks-title { font-size: 16px; font-weight: 700; color: #0f1c3f; margin-bottom: 16px; }
        .perk-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f4ff; }
        .perk-item:last-child { border-bottom: none; }
        .perk-check { width: 24px; height: 24px; background: #fff7ed; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
        .perk-text { font-size: 14px; font-weight: 500; color: #374151; }
        .tiers-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
        .tier-item { background: white; border-radius: 14px; padding: 16px 10px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .tier-emoji { font-size: 24px; margin-bottom: 6px; }
        .tier-item-name { font-size: 12px; font-weight: 700; color: #0f1c3f; }
        .tier-item-pts { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .current-tier { border: 2px solid #f97316; }
      `}</style>
      <div className="loyalty">
        <div className="loy-container">
          <div className="loy-header">
            <h1>⭐ Loyalty Rewards</h1>
            <p>Earn points on every booking and unlock exclusive perks</p>
          </div>
          {loading ? <p style={{ color: '#9ca3af' }}>Loading...</p> : (
            <>
              <div className="tier-card">
                <div className="tier-top">
                  <div>
                    <div className="tier-name">Current Tier</div>
                    <div className="tier-title">{tierEmoji[tier]} {tier}</div>
                  </div>
                  <div className="points-display">
                    <div className="points-num">{points.toLocaleString()}</div>
                    <div className="points-label">Total Points</div>
                  </div>
                </div>
                <div className="progress-section">
                  <div className="progress-label">
                    <span>{points} pts</span>
                    <span>{nextTierPoints} pts to next tier</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-num">{bookings.length}</div>
                  <div className="stat-label">Trips Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">₹{totalSpent.toLocaleString()}</div>
                  <div className="stat-label">Total Spent</div>
                </div>
              </div>
              <div className="perks-card">
                <div className="perks-title">Your {tier} Perks</div>
                {perks[tier].map((p, i) => (
                  <div className="perk-item" key={i}>
                    <div className="perk-check">✓</div>
                    <div className="perk-text">{p}</div>
                  </div>
                ))}
              </div>
              <div className="tiers-row">
                {['Bronze', 'Silver', 'Gold', 'Platinum'].map(t => (
                  <div className={`tier-item ${t === tier ? 'current-tier' : ''}`} key={t}>
                    <div className="tier-emoji">{tierEmoji[t]}</div>
                    <div className="tier-item-name">{t}</div>
                    <div className="tier-item-pts">{t === 'Bronze' ? '0+' : t === 'Silver' ? '500+' : t === 'Gold' ? '2000+' : '5000+'} pts</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}