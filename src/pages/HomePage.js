import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const OFFERS = [
  { id: 1, tag: 'NEW USER', tagColor: '#0d9488', bg: 'linear-gradient(135deg,#0f2c2c,#0d4a4a)', title: 'Flat 20% OFF', subtitle: 'on first booking', code: 'BUSGO20' },
  { id: 2, tag: 'WEEKEND SPECIAL', tagColor: '#6366f1', bg: 'linear-gradient(135deg,#1e1b4b,#312e81)', title: 'Cashback up to', subtitle: '₹150 on Weekends', code: 'WEEKEND15' },
  { id: 3, tag: 'FESTIVE OFFER', tagColor: '#f97316', bg: 'linear-gradient(135deg,#431407,#7c2d12)', title: '₹100 OFF', subtitle: 'on bookings above ₹500', code: 'FEST100' },
  { id: 4, tag: 'STUDENT DEAL', tagColor: '#16a34a', bg: 'linear-gradient(135deg,#052e16,#14532d)', title: '15% Discount', subtitle: 'for students', code: 'STUDENT15' },
];

const POPULAR_ROUTES = [
  { from: 'Kolkata', to: 'Siliguri', price: 350, tag: 'MOST TRAVELED', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
 {
  from: 'Kolkata',
  to: 'Darjeeling',
  price: 450,
  tag: 'SCENIC ROUTE',
  img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=80'
},
  { from: 'Siliguri', to: 'Gangtok', price: 280, tag: 'HILL STATION', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ from: '', to: '', date: '' });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeTab, setActiveTab] = useState('oneway');
  const [travelers, setTravelers] = useState({ adults: 1, children: 0 });
  const [showTravelerPicker, setShowTravelerPicker] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const totalTravelers = travelers.adults + travelers.children;
  const travelerLabel = totalTravelers === 1
    ? '1 Adult'
    : `${travelers.adults} Adult${travelers.adults > 1 ? 's' : ''}${travelers.children > 0 ? ` · ${travelers.children} Child${travelers.children > 1 ? 'ren' : ''}` : ''}`;

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.from || !form.to) { setError('Please fill From and To fields'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await API.get('/routes/search', { params: { from: form.from, to: form.to, passengers: totalTravelers } });
      setResults(data); setSearched(true);
      setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch { setError('Search failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleSwap = () => setForm(p => ({ ...p, from: p.to, to: p.from }));

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

  const handleRouteClick = (route) => {
    setForm({ from: route.from, to: route.to, date: today });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSeeAllOffers = () => navigate('/deals');
  const handleSeeAllRoutes = () => navigate('/routes');

  const formatTime = (d) => d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
  const getDuration = (dep, arr) => {
    const diff = new Date(arr) - new Date(dep);
    return `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }

        /* Full-page background — mountain image covers entire page */
        .hp {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          position: relative;
          background-color: #0a0d1a;
        }

        /* Single fixed background image that covers the whole page */
        .hp::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90');
          background-size: cover;
          background-position: center 35%;
          z-index: 0;
          animation: subtlePan 30s ease-in-out infinite alternate;
        }

        @keyframes subtlePan {
          from { transform: scale(1.02) translateX(0); }
          to { transform: scale(1.05) translateX(-1%); }
        }

        /* Subtle dark tint over the whole page so content stays readable */
        .hp::after {
          content: '';
          position: fixed;
          inset: 0;
          background: rgba(6, 8, 20, 0.42);
          z-index: 1;
        }

        /* ===================== HERO — SUNRISE MOUNTAIN BG ===================== */
        .hero {
          position: relative;
          overflow: visible;
          min-height: 580px;
          display: flex;
          flex-direction: column;
          z-index: 2;
        }

        /* Lighter hero overlay so photo is clearly visible */
        .hero-bg-img {
          display: none; /* handled by .hp::before */
        }

        /* Very light overlay just on hero for text readability */
        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(5, 8, 22, 0.48) 0%,
              rgba(10, 15, 35, 0.12) 35%,
              rgba(10, 15, 35, 0.18) 65%,
              rgba(5, 8, 22, 0.55) 100%
            );
          z-index: 0;
        }

        /* Warm golden sunrise glow at the horizon */
        .hero-bg-warmth {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 110% 55% at 50% 42%, rgba(251, 146, 60, 0.14) 0%, transparent 65%),
            radial-gradient(ellipse 80% 40% at 50% 55%, rgba(251, 191, 36, 0.08) 0%, transparent 60%);
          z-index: 1;
        }

        /* No bottom fade — let background flow into lower section */
        .hero-bg-fade { display: none; }

        .hero-inner {
          position: relative;
          z-index: 3;
          padding: 28px 20px 36px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        /* TOPBAR inside hero */
        .hero-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .hero-logo {
          font-size: 22px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.5px;
        }
        .hero-logo span { color: #f97316; }

        .hero-greeting {
          font-size: 12px;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 6px 16px;
          border-radius: 24px;
          font-weight: 500;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        /* HERO TEXT */
        .hero-text { margin-bottom: 18px; }
        .hero-text h1 {
          font-size: 33px;
          font-weight: 900;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 8px;
          letter-spacing: -0.8px;
        }
        .hero-text h1 .accent {
          color: transparent;
          -webkit-text-stroke: 1.5px #f97316;
          display: inline;
        }
        .hero-text h1 .accent-fill { color: #f97316; }
        .hero-text p {
          color: rgba(255,255,255,0.62);
          font-size: 13px;
          line-height: 1.65;
          font-weight: 400;
        }

        /* TRUST BADGES row */
        .hero-badges {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }
        .hero-badge {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.16);
          color: rgba(255,255,255,0.8);
          font-size: 11px;
          font-weight: 600;
          padding: 5px 13px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          letter-spacing: 0.2px;
        }

        /* ===== REDESIGNED SEARCH CARD ===== */
       .search-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(24px) saturate(1.8);
  -webkit-backdrop-filter: blur(24px) saturate(1.8);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 20px;
  overflow: visible;
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
  box-shadow:
    0 10px 40px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.12);
}

        /* TAB STRIP */
        .trip-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding: 6px 6px 0;
          gap: 4px;
        }
        .trip-tab {
          padding: 11px;
          text-align: center;
          font-size: 12.5px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          border: none;
          background: transparent;
          cursor: pointer;
          color: rgba(255,255,255,0.38);
          border-radius: 4px 4px 0 0;
          transition: all 0.22s ease;
          letter-spacing: 0.3px;
          position: relative;
        }
        .trip-tab.active {
          color: #fff;
          background: rgba(255,255,255,0.08);
        }
        .trip-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 10%;
          right: 10%;
          height: 2px;
          background: linear-gradient(90deg, #f97316, #fbbf24);
          border-radius: 0;
        }

        /* FORM FIELDS WRAPPER */
        .sf-fields { padding: 8px 10px 6px; display: flex; flex-direction: column; gap: 5px; }

        /* INDIVIDUAL INPUT FIELD — SQUARE */
        .sf-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 4px !important;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.22s ease;
          position: relative;
          cursor: text;
        }
        .sf-pill:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.22);
        }
        .sf-pill.focused {
          background: rgba(255,255,255,0.13);
          border-color: rgba(249, 115, 22, 0.7);
          box-shadow: 0 0 0 2px rgba(249,115,22,0.2);
        }
        /* FROM/TO pill has swap button */
        .sf-pills-route { position: relative; }
        .sf-pills-route .sf-pill-from { border-radius: 4px 4px 0px 0px !important; border-bottom-color: rgba(255,255,255,0.04); }
        .sf-pills-route .sf-pill-to   { border-radius: 0px 0px 4px 4px !important; border-top-color: rgba(255,255,255,0.04); }

        /* Swap button between FROM and TO */
        .swap-fab {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(249,115,22,0.9);
          color: white;
          border: 2px solid rgba(255,255,255,0.25);
          cursor: pointer;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 12px rgba(249,115,22,0.45);
          transition: all 0.25s ease;
          z-index: 2;
          font-family: 'Poppins', sans-serif;
        }
        .swap-fab:hover { transform: translateY(-50%) rotate(180deg); background: rgba(234,88,12,1); }

        /* Route divider line */
        .sf-route-divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 0 16px;
        }

        .sf-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 4px !important;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 13px;
        }
        .sf-pill.focused .sf-icon-wrap {
          background: rgba(249,115,22,0.2);
        }

        .sf-inner { flex: 1; min-width: 0; }
        .sf-label {
          font-size: 9.5px;
          font-weight: 800;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 2px;
        }
        .sf-pill.focused .sf-label { color: rgba(249,115,22,0.85); }
        .sf-input {
          border: none;
          outline: none;
          font-size: 14.5px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          color: #fff;
          width: 100%;
          background: transparent;
          padding: 0;
        }
        .sf-input::placeholder { color: rgba(255,255,255,0.28); font-weight: 400; font-size: 13.5px; }
        .sf-input[type="date"] { color-scheme: dark; }

        /* Date + Travelers row */
        .sf-pills-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }
        .sf-pill-date { cursor: pointer; }
        .sf-pill-traveler { cursor: pointer; }
        .sf-half-val {
          font-size: 14.5px;
          font-weight: 700;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sf-caret { font-size: 10px; color: rgba(255,255,255,0.4); margin-left: 4px; }

        /* Error */
        .search-error {
          margin: 0 10px;
          padding: 9px 14px;
          background: rgba(220,38,38,0.15);
          border: 1px solid rgba(220,38,38,0.3);
          color: #fca5a5;
          font-size: 12.5px;
          border-radius: 12px;
        }

        /* SEARCH BUTTON */
        .search-submit-btn {
          width: calc(100% - 20px);
          margin: 8px 10px 10px;
          padding: 14px;
          background: linear-gradient(110deg, #ea580c 0%, #f97316 45%, #fbbf24 100%);
          color: white;
          border: none;
          border-radius: 4px !important;
          font-size: 14.5px;
          font-weight: 800;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.22s ease;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(249,115,22,0.4), 0 1px 0 rgba(255,255,255,0.2) inset;
        }
        .search-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .search-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(249,115,22,0.55), 0 1px 0 rgba(255,255,255,0.2) inset;
        }
        .search-submit-btn:active { transform: translateY(0); }
        .search-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* STATS row below card */
        .hero-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.09);
        }
        .hero-stat { text-align: center; }
        .hero-stat-num { font-size: 20px; font-weight: 900; color: #f97316; text-shadow: 0 0 20px rgba(249,115,22,0.4); }
        .hero-stat-label { font-size: 10px; color: rgba(255,255,255,0.42); margin-top: 2px; font-weight: 500; letter-spacing: 0.3px; }

        /* TRAVELER PICKER */
        .traveler-picker {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 0;
          right: 0;
          background: rgba(18, 12, 40, 0.92);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 10px;
          padding: 18px;
          z-index: 100;
          box-shadow: 0 20px 60px rgba(0,0,0,0.65);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          min-width: 230px;
        }
        .tp-title {
          font-size: 10px;
          font-weight: 800;
          color: rgba(255,255,255,0.45);
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .tp-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .tp-row:last-of-type { border-bottom: none; }
        .tp-label { font-size: 14px; font-weight: 700; color: #fff; }
        .tp-sub { font-size: 11px; color: rgba(255,255,255,0.38); margin-top: 2px; }
        .tp-counter { display: flex; align-items: center; gap: 14px; }
        .tp-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.07);
          color: #fff;
          font-size: 18px;
          font-weight: 300;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: all 0.15s;
          font-family: 'Poppins', sans-serif;
        }
        .tp-btn:hover:not(:disabled) { background: #f97316; border-color: #f97316; }
        .tp-btn:disabled { opacity: 0.22; cursor: not-allowed; }
        .tp-count { font-size: 17px; font-weight: 800; color: #fff; min-width: 20px; text-align: center; }
        .tp-done {
          width: 100%;
          margin-top: 14px;
          padding: 10px;
          background: linear-gradient(110deg, #ea580c, #f97316);
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .tp-done:hover { opacity: 0.9; }

        /* ===================== CONTENT BELOW HERO ===================== */
        .content { padding: 24px 20px; position: relative; z-index: 2; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .section-title { font-size: 17px; font-weight: 800; color: #fff; text-shadow: 0 1px 8px rgba(0,0,0,0.4); }
        .see-all { color: #fbbf24; font-size: 13px; font-weight: 700; cursor: pointer; background: none; border: none; font-family: 'Poppins', sans-serif; padding: 4px 0; text-shadow: 0 1px 6px rgba(0,0,0,0.3); }
        .see-all:hover { text-decoration: underline; }

        /* OFFERS */
        .offers-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .offers-scroll::-webkit-scrollbar { display: none; }
        .offer-card { flex-shrink: 0; width: 190px; border-radius: 16px; padding: 18px; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.2s; border: 1px solid rgba(255,255,255,0.12); }
        .offer-card:hover { transform: translateY(-3px); }
        .offer-tag { display: inline-block; font-size: 9px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; margin-bottom: 10px; color: white; }
        .offer-title { color: white; font-size: 18px; font-weight: 800; line-height: 1.2; margin-bottom: 2px; }
        .offer-sub { color: rgba(255,255,255,0.7); font-size: 12px; margin-bottom: 14px; }
        .offer-code-row { display: flex; align-items: center; justify-content: space-between; }
        .offer-code { color: rgba(255,255,255,0.9); font-size: 11px; font-weight: 700; letter-spacing: 1px; }
        .copy-btn { width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .copy-btn:hover, .copy-btn.copied { background: rgba(255,255,255,0.3); }
        .offer-circle { position: absolute; bottom: -20px; right: -20px; width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.07); pointer-events: none; }
        .offer-circle2 { position: absolute; bottom: -40px; right: -40px; width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.04); pointer-events: none; }

        /* POPULAR ROUTES */
        .route-card-big { position: relative; border-radius: 16px; overflow: hidden; height: 175px; cursor: pointer; transition: transform 0.2s; border: 1px solid rgba(255,255,255,0.15); }
        .route-card-big:hover { transform: scale(1.015); }
        .route-card-small { height: 120px; }
        .route-cards-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
        .route-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .route-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 60%); }
        .route-info { position: absolute; bottom: 12px; left: 14px; color: white; }
        .route-info-tag { font-size: 9px; font-weight: 800; letter-spacing: 1px; color: #f97316; text-transform: uppercase; margin-bottom: 3px; }
        .route-info-title { font-size: 16px; font-weight: 800; }
        .route-info-small { font-size: 13px; font-weight: 800; }
        .route-info-price { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 2px; }
        .route-book-chip { position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.18); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; transition: background 0.2s; }
        .route-book-chip:hover { background: #f97316; }

        /* RESULTS */
        .results-section { margin-bottom: 8px; }
        .results-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
        .results-badge { background: #f97316; color: white; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .bus-result-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 16px;
          margin-bottom: 12px;
          border: 1px solid rgba(255,255,255,0.18);
          overflow: hidden;
          transition: all 0.2s;
        }
        .bus-result-card:hover { border-color: rgba(249,115,22,0.6); box-shadow: 0 6px 24px rgba(0,0,0,0.25); }
        .brc-main { padding: 16px; }
        .brc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
        .brc-operator { display: flex; align-items: center; gap: 10px; }
        .brc-op-icon { width: 38px; height: 38px; background: rgba(255,255,255,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.2); }
        .brc-op-name { font-size: 14px; font-weight: 700; color: #fff; }
        .brc-op-tags { display: flex; gap: 5px; margin-top: 3px; }
        .brc-tag { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; }
        .tag-ac { background: rgba(37,99,235,0.25); color: #93c5fd; border: 1px solid rgba(37,99,235,0.3); }
        .tag-nonac { background: rgba(234,88,12,0.25); color: #fdba74; border: 1px solid rgba(234,88,12,0.3); }
        .tag-sl { background: rgba(22,163,74,0.25); color: #86efac; border: 1px solid rgba(22,163,74,0.3); }
        .brc-price { font-size: 20px; font-weight: 800; color: #fff; }
        .brc-price-sub { font-size: 10px; color: rgba(255,255,255,0.5); }
        .brc-timing { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .brc-time { font-size: 18px; font-weight: 800; color: #fff; }
        .brc-city { font-size: 11px; color: rgba(255,255,255,0.55); }
        .brc-dur { flex: 1; text-align: center; }
        .brc-dur-line { height: 2px; background: linear-gradient(to right, rgba(255,255,255,0.15), #f97316, rgba(255,255,255,0.15)); border-radius: 2px; margin-bottom: 3px; }
        .brc-dur-text { font-size: 10px; color: rgba(255,255,255,0.5); }
        .brc-bottom { display: flex; justify-content: space-between; align-items: center; }
        .brc-seats { font-size: 12px; color: #86efac; font-weight: 700; }
        .brc-book-btn { padding: 9px 20px; background: linear-gradient(135deg,#f97316,#ef4444); color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Poppins', sans-serif; cursor: pointer; transition: all 0.2s; }
        .brc-book-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(249,115,22,0.5); }
        .brc-amenities { border-top: 1px solid rgba(255,255,255,0.1); padding: 9px 16px; background: rgba(255,255,255,0.05); display: flex; gap: 14px; flex-wrap: wrap; }
        .amenity { font-size: 11px; color: rgba(255,255,255,0.55); }

        /* WHY */
        .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .why-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 14px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.18);
          transition: border-color 0.2s;
        }
        .why-card:hover { border-color: rgba(249,115,22,0.45); }
        .why-icon { font-size: 26px; margin-bottom: 7px; }
        .why-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 3px; }
        .why-desc { font-size: 11px; color: rgba(255,255,255,0.55); line-height: 1.5; }

        /* TOAST */
        .copied-toast { position: fixed; bottom: 85px; left: 50%; transform: translateX(-50%); background: #0f1c3f; color: white; padding: 10px 20px; border-radius: 24px; font-size: 13px; font-weight: 600; z-index: 9999; box-shadow: 0 8px 24px rgba(0,0,0,0.2); animation: slideUp 0.3s ease; white-space: nowrap; }
        @keyframes slideUp { from { opacity:0; transform: translate(-50%, 20px); } to { opacity:1; transform: translate(-50%, 0); } }

        /* LOADER */
        .spin-sm { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.35); border-top: 2.5px solid white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .no-results {
          text-align: center;
          padding: 50px 20px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.18);
        }
        .no-results-icon { font-size: 52px; margin-bottom: 12px; }
        .no-results h3 { color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .no-results p { color: rgba(255,255,255,0.55); font-size: 13px; }
      `}</style>

      <div className="hp">

        {/* ===================== HERO WITH SUNRISE MOUNTAIN BG ===================== */}
        <div className="hero">
          <div className="hero-bg-img" />
          <div className="hero-bg-overlay" />
          <div className="hero-bg-warmth" />
          <div className="hero-bg-fade" />

          <div className="hero-inner">
            {/* Top bar */}
            <div className="hero-topbar">
              <div className="hero-logo">Bus<span>Go</span></div>
              <div className="hero-greeting">Hi, Swati 👋</div>
            </div>

            {/* Headline */}
            <div className="hero-text">
              <h1>Travel Smarter,<br /><span className="accent-fill">Book Faster</span></h1>
              <p>Your journey begins with a single tap.<br />Reliable buses across the country.</p>
            </div>

            {/* Trust badges */}
            <div className="hero-badges">
              <span className="hero-badge">⚡ Instant Booking</span>
              <span className="hero-badge">🛡️ 100% Secure</span>
              <span className="hero-badge">🎫 Best Prices</span>
            </div>

            {/* ===== SEARCH CARD — SQUARE ===== */}
            <div className="search-card" style={{ borderRadius: 0 }}>
              {/* Tabs */}
              <div className="trip-tabs" style={{ borderRadius: 0 }}>
                <button
                  className={`trip-tab ${activeTab === 'oneway' ? 'active' : ''}`}
                  style={{ borderRadius: 0 }}
                  onClick={() => setActiveTab('oneway')}
                >One Way</button>
                <button
                  className={`trip-tab ${activeTab === 'return' ? 'active' : ''}`}
                  style={{ borderRadius: 0 }}
                  onClick={() => setActiveTab('return')}
                >Round Trip</button>
              </div>

              <form onSubmit={handleSearch}>
                <div className="sf-fields">

                  {/* FROM + TO */}
                  <div className="sf-pills-route">
                    <div
                      className={`sf-pill sf-pill-from ${focusedField === 'from' ? 'focused' : ''}`}
                      style={{ borderRadius: 0 }}
                      onClick={() => document.getElementById('sf-from')?.focus()}
                    >
                      <div className="sf-icon-wrap" style={{ borderRadius: 0 }}>📍</div>
                      <div className="sf-inner">
                        <div className="sf-label">From</div>
                        <input
                          id="sf-from"
                          className="sf-input"
                          value={form.from}
                          onChange={e => setForm({ ...form, from: e.target.value })}
                          placeholder="Departure City"
                          onFocus={() => setFocusedField('from')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                    </div>

                    <div className="sf-route-divider" />

                    <div
                      className={`sf-pill sf-pill-to ${focusedField === 'to' ? 'focused' : ''}`}
                      style={{ borderRadius: 0 }}
                      onClick={() => document.getElementById('sf-to')?.focus()}
                    >
                      <div className="sf-icon-wrap" style={{ borderRadius: 0 }}>🏁</div>
                      <div className="sf-inner">
                        <div className="sf-label">To</div>
                        <input
                          id="sf-to"
                          className="sf-input"
                          value={form.to}
                          onChange={e => setForm({ ...form, to: e.target.value })}
                          placeholder="Destination City"
                          onFocus={() => setFocusedField('to')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                    </div>

                    <button type="button" className="swap-fab" onClick={handleSwap} aria-label="Swap cities">⇅</button>
                  </div>

                  {/* DATE + TRAVELERS */}
                  <div className="sf-pills-row">
                    <div
                      className={`sf-pill sf-pill-date ${focusedField === 'date' ? 'focused' : ''}`}
                      style={{ borderRadius: 0 }}
                    >
                      <div className="sf-icon-wrap" style={{ borderRadius: 0 }}>📅</div>
                      <div className="sf-inner">
                        <div className="sf-label">Date</div>
                        <input
                          className="sf-input"
                          type="date"
                          value={form.date}
                          min={today}
                          onChange={e => setForm({ ...form, date: e.target.value })}
                          onFocus={() => setFocusedField('date')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                    </div>

                    <div
                      className={`sf-pill sf-pill-traveler ${focusedField === 'traveler' ? 'focused' : ''}`}
                      style={{ borderRadius: 0, position: 'relative', userSelect: 'none' }}
                      onClick={() => setShowTravelerPicker(p => !p)}
                    >
                      <div className="sf-icon-wrap" style={{ borderRadius: 0 }}>👤</div>
                      <div className="sf-inner">
                        <div className="sf-label">Travelers</div>
                        <div className="sf-half-val">
                          <span>{travelerLabel}</span>
                          <span className="sf-caret">{showTravelerPicker ? '▲' : '▼'}</span>
                        </div>
                      </div>

                      {showTravelerPicker && (
                        <div className="traveler-picker" style={{ borderRadius: 0 }} onClick={e => e.stopPropagation()}>
                          <div className="tp-title">Select Travelers</div>
                          {[
                            { key: 'adults', label: 'Adults', sub: '12+ years', min: 1, max: 9 },
                            { key: 'children', label: 'Children', sub: '2–11 years', min: 0, max: 6 },
                          ].map(({ key, label, sub, min, max }) => (
                            <div className="tp-row" key={key}>
                              <div>
                                <div className="tp-label">{label}</div>
                                <div className="tp-sub">{sub}</div>
                              </div>
                              <div className="tp-counter">
                                <button type="button" className="tp-btn" disabled={travelers[key] <= min}
                                  onClick={() => setTravelers(p => ({ ...p, [key]: Math.max(min, p[key] - 1) }))}>−</button>
                                <span className="tp-count">{travelers[key]}</span>
                                <button type="button" className="tp-btn" disabled={travelers[key] >= max}
                                  onClick={() => setTravelers(p => ({ ...p, [key]: Math.min(max, p[key] + 1) }))}>+</button>
                              </div>
                            </div>
                          ))}
                          <button type="button" className="tp-done" style={{ borderRadius: 0 }} onClick={() => setShowTravelerPicker(false)}>Done ✓</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {error && <div className="search-error" style={{ borderRadius: 0 }}>⚠ {error}</div>}

                <button type="submit" className="search-submit-btn" style={{ borderRadius: 0 }} disabled={loading}>
                  {loading
                    ? <><div className="spin-sm" /> Searching buses...</>
                    : <>🔍 Search Buses →</>
                  }
                </button>
              </form>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-num">500+</div>
                <div className="hero-stat-label">Routes</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">2M+</div>
                <div className="hero-stat-label">Travelers</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">99%</div>
                <div className="hero-stat-label">On-Time Rate</div>
              </div>
            </div>
          </div>
        </div>
        {/* ===================== END HERO ===================== */}

        <div className="content">
          {/* RESULTS */}
          {searched && (
            <div className="results-section" id="results-section">
              {results.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🚌</div>
                  <h3>No buses found</h3>
                  <p>Try a different route or date</p>
                </div>
              ) : (
                <>
                  <div className="results-header">
                    <div>
                      <div className="section-title">Available Buses</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{form.from} → {form.to}</div>
                    </div>
                    <span className="results-badge">{results.length} Found</span>
                  </div>

                  {results.map(route => (
                    <div className="bus-result-card" key={route._id}>
                      <div className="brc-main">
                        <div className="brc-top">
                          <div className="brc-operator">
                            <div className="brc-op-icon">🚌</div>
                            <div>
                              <div className="brc-op-name">{route.bus?.busName}</div>
                              <div className="brc-op-tags">
                                <span className={`brc-tag ${route.bus?.busType === 'AC' ? 'tag-ac' : route.bus?.busType === 'Sleeper' ? 'tag-sl' : 'tag-nonac'}`}>
                                  {route.bus?.busType}
                                </span>
                                <span className="brc-tag tag-ac">#{route.bus?.busNumber}</span>
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="brc-price">₹{route.price}</div>
                            <div className="brc-price-sub">per seat</div>
                          </div>
                        </div>
                        <div className="brc-timing">
                          <div>
                            <div className="brc-time">{formatTime(route.departureTime)}</div>
                            <div className="brc-city">{route.from}</div>
                          </div>
                          <div className="brc-dur">
                            <div className="brc-dur-line" />
                            <div className="brc-dur-text">{getDuration(route.departureTime, route.arrivalTime)}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="brc-time">{formatTime(route.arrivalTime)}</div>
                            <div className="brc-city">{route.to}</div>
                          </div>
                        </div>
                        <div className="brc-bottom">
                          <div className="brc-seats">● {route.availableSeats} seats left</div>
                          <button className="brc-book-btn" onClick={() => navigate(`/book/${route._id}`)}>Book Now →</button>
                        </div>
                      </div>
                      <div className="brc-amenities">
                        {['✓ Live Tracking', '✓ WiFi', '✓ Charging', '✓ Water Bottle'].map(a => (
                          <span className="amenity" key={a}>{a}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* OFFERS */}
          <div style={{ marginBottom: 26 }}>
            <div className="section-header">
              <span className="section-title">Exclusive Offers</span>
              <button className="see-all" onClick={handleSeeAllOffers}>See All</button>
            </div>
            <div className="offers-scroll">
              {OFFERS.map(offer => (
                <div key={offer.id} className="offer-card" style={{ background: offer.bg }} onClick={() => handleCopyCode(offer.code)}>
                  <div className="offer-circle" /><div className="offer-circle2" />
                  <div className="offer-tag" style={{ background: offer.tagColor }}>{offer.tag}</div>
                  <div className="offer-title">{offer.title}</div>
                  <div className="offer-sub">{offer.subtitle}</div>
                  <div className="offer-code-row">
                    <div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginBottom: 1 }}>PROMO CODE</div>
                      <div className="offer-code">{offer.code}</div>
                    </div>
                    <button className={`copy-btn ${copiedCode === offer.code ? 'copied' : ''}`}
                      onClick={e => { e.stopPropagation(); handleCopyCode(offer.code); }}
                      title={copiedCode === offer.code ? 'Copied!' : 'Copy code'}>
                      {copiedCode === offer.code ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* POPULAR ROUTES */}
          <div style={{ marginBottom: 26 }}>
            <div className="section-header">
              <span className="section-title">Popular Routes</span>
              <button className="see-all" onClick={handleSeeAllRoutes}>See All</button>
            </div>
            <div className="route-card-big" onClick={() => handleRouteClick(POPULAR_ROUTES[0])}>
              <img src={POPULAR_ROUTES[0].img} alt={POPULAR_ROUTES[0].from} className="route-img" />
              <div className="route-overlay" />
              <div className="route-info">
                <div className="route-info-tag">{POPULAR_ROUTES[0].tag}</div>
                <div className="route-info-title">{POPULAR_ROUTES[0].from} to {POPULAR_ROUTES[0].to}</div>
                <div className="route-info-price">Starting from ₹{POPULAR_ROUTES[0].price}</div>
              </div>
              <div className="route-book-chip">Book Now →</div>
            </div>
            <div className="route-cards-row">
              {POPULAR_ROUTES.slice(1).map(r => (
                <div key={r.to} className="route-card-big route-card-small" onClick={() => handleRouteClick(r)}>
                  <img src={r.img} alt={r.to} className="route-img" />
                  <div className="route-overlay" />
                  <div className="route-info">
                    <div className="route-info-small">{r.from} to {r.to}</div>
                    <div className="route-info-price">From ₹{r.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHY BUSGO */}
          {!searched && (
            <div style={{ marginBottom: 24 }}>
              <div className="section-header">
                <span className="section-title">Why BusGo?</span>
              </div>
              <div className="why-grid">
                {[
                  { icon: '⚡', title: 'Instant Booking', desc: 'Confirmed in under 30 seconds' },
                  { icon: '💾', title: '100% Secure', desc: 'Payments fully encrypted' },
                  { icon: '✏️', title: 'Easy Cancel', desc: 'Free cancel up to 1hr before travel' },
                  { icon: '🎉', title: 'Best Prices', desc: 'Guaranteed lowest fares' },
                ].map(w => (
                  <div className="why-card" key={w.title}>
                    <div className="why-icon">{w.icon}</div>
                    <div className="why-title">{w.title}</div>
                    <div className="why-desc">{w.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COPY TOAST */}
        {copiedCode && (
          <div className="copied-toast">
            ✓ Code <strong style={{ margin: '0 4px' }}>{copiedCode}</strong> copied to clipboard!
          </div>
        )}
      </div>
    </>
  );
}