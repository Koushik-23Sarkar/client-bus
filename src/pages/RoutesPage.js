import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ALL_ROUTES = [
  { id: 1, from: 'Kolkata', to: 'Siliguri', price: 350, duration: '8h 30m', tag: 'MOST TRAVELED', distance: '569 km', buses: 12, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', category: 'Popular' },
  { id: 2, from: 'Kolkata', to: 'Darjeeling', price: 450, duration: '10h 00m', tag: 'SCENIC ROUTE', distance: '620 km', buses: 8, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', category: 'Scenic' },
  { id: 3, from: 'Siliguri', to: 'Gangtok', price: 280, duration: '4h 30m', tag: 'HILL STATION', distance: '114 km', buses: 15, img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', category: 'Hill Station' },
  { id: 4, from: 'Kolkata', to: 'Durgapur', price: 150, duration: '2h 30m', tag: 'QUICK RIDE', distance: '171 km', buses: 20, img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80', category: 'Popular' },
  { id: 5, from: 'Kolkata', to: 'Digha', price: 200, duration: '3h 00m', tag: 'BEACH GETAWAY', distance: '187 km', buses: 10, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', category: 'Beach' },
  { id: 6, from: 'Siliguri', to: 'Darjeeling', price: 180, duration: '3h 00m', tag: 'HILL STATION', distance: '78 km', buses: 18, img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80', category: 'Hill Station' },
  { id: 7, from: 'Kolkata', to: 'Bolpur', price: 120, duration: '2h 00m', tag: 'HERITAGE ROUTE', distance: '152 km', buses: 14, img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80', category: 'Heritage' },
  { id: 8, from: 'Kolkata', to: 'Bakkhali', price: 170, duration: '3h 30m', tag: 'BEACH GETAWAY', distance: '130 km', buses: 7, img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80', category: 'Beach' },
  { id: 9, from: 'Durgapur', to: 'Siliguri', price: 320, duration: '7h 00m', tag: 'POPULAR', distance: '400 km', buses: 9, img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', category: 'Popular' },
  { id: 10, from: 'Kolkata', to: 'Purulia', price: 210, duration: '4h 00m', tag: 'NATURE ESCAPE', distance: '290 km', buses: 6, img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', category: 'Scenic' },
];

const CATEGORIES = ['All', 'Popular', 'Scenic', 'Hill Station', 'Beach', 'Heritage'];

const TAG_COLORS = {
  'MOST TRAVELED': '#0d9488',
  'SCENIC ROUTE': '#6366f1',
  'HILL STATION': '#16a34a',
  'QUICK RIDE': '#f97316',
  'BEACH GETAWAY': '#0369a1',
  'HERITAGE ROUTE': '#b45309',
  'POPULAR': '#7c3aed',
  'NATURE ESCAPE': '#059669',
};

export default function RoutesPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [searchText, setSearchText] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleBook = (route) => {
    navigate('/', { state: { from: route.from, to: route.to, date: today } });
  };

  const filtered = ALL_ROUTES
    .filter(r => activeCategory === 'All' || r.category === activeCategory)
    .filter(r => {
      const q = searchText.toLowerCase();
      return !q || r.from.toLowerCase().includes(q) || r.to.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
      return b.buses - a.buses; // popular = most buses
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .rp { font-family: 'Poppins', sans-serif; min-height: 100vh; background: #f5f7ff; padding-bottom: 100px; }

        .rp-header { background: #0f1c3f; padding: 20px 20px 24px; position: sticky; top: 64px; z-index: 10; }
        .rp-back { background: none; border: none; color: rgba(255,255,255,0.7); font-size: 13px; font-family: 'Poppins', sans-serif; cursor: pointer; padding: 0; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
        .rp-back:hover { color: white; }
        .rp-title { font-size: 22px; font-weight: 800; color: white; margin-bottom: 4px; }
        .rp-sub { font-size: 13px; color: rgba(255,255,255,0.55); margin-bottom: 14px; }

        .search-bar { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; padding: 10px 14px; }
        .search-bar input { background: none; border: none; outline: none; color: white; font-size: 14px; font-family: 'Poppins', sans-serif; flex: 1; }
        .search-bar input::placeholder { color: rgba(255,255,255,0.4); }

        .controls { padding: 12px 20px; display: flex; gap: 10px; align-items: center; }
        .sort-select { padding: 8px 12px; border-radius: 8px; border: 1.5px solid #e5e7eb; background: white; font-size: 12px; font-weight: 600; font-family: 'Poppins', sans-serif; color: #0f1c3f; cursor: pointer; outline: none; }

        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; padding: 0 20px 12px; scrollbar-width: none; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-chip { flex-shrink: 0; padding: 7px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; font-family: 'Poppins', sans-serif; border: 1.5px solid #e5e7eb; background: white; color: #6b7280; cursor: pointer; transition: all 0.2s; }
        .cat-chip.active { background: #f97316; border-color: #f97316; color: white; }

        .routes-list { padding: 0 20px; display: flex; flex-direction: column; gap: 14px; }

        .route-card { background: white; border-radius: 16px; overflow: hidden; border: 1.5px solid #f0f4ff; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .route-card:hover { border-color: #f97316; box-shadow: 0 6px 24px rgba(249,115,22,0.1); transform: translateY(-2px); }

        .route-img-wrap { position: relative; height: 140px; }
        .route-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .route-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%); }
        .route-img-tag { position: absolute; top: 10px; left: 10px; font-size: 9px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; color: white; }
        .route-img-info { position: absolute; bottom: 10px; left: 12px; color: white; }
        .route-img-title { font-size: 15px; font-weight: 800; }
        .route-img-dist { font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 1px; }

        .route-body { padding: 14px 16px; }
        .route-stats { display: flex; gap: 16px; margin-bottom: 12px; }
        .route-stat { display: flex; flex-direction: column; }
        .route-stat-label { font-size: 10px; color: #9ca3af; font-weight: 600; text-transform: uppercase; margin-bottom: 2px; }
        .route-stat-val { font-size: 14px; font-weight: 800; color: #0f1c3f; }
        .route-divider { width: 1px; background: #f0f0f0; }

        .route-footer { display: flex; align-items: center; justify-content: space-between; }
        .route-price-wrap { display: flex; flex-direction: column; }
        .route-price-label { font-size: 10px; color: #9ca3af; }
        .route-price { font-size: 20px; font-weight: 800; color: #0f1c3f; }
        .route-book-btn { padding: 10px 22px; background: linear-gradient(135deg, #f97316, #ef4444); color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Poppins', sans-serif; cursor: pointer; transition: all 0.2s; }
        .route-book-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(249,115,22,0.4); }

        .buses-pill { display: inline-flex; align-items: center; gap: 4px; background: #f0fdf4; color: #16a34a; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; margin-bottom: 12px; }

        .empty-state { text-align: center; padding: 60px 20px; }
        .empty-icon { font-size: 52px; margin-bottom: 12px; }
        .empty-title { font-size: 18px; font-weight: 700; color: #0f1c3f; margin-bottom: 4px; }
        .empty-sub { font-size: 13px; color: #9ca3af; }

        .results-count { font-size: 12px; color: #9ca3af; padding: 0 20px 10px; }
        .results-count span { font-weight: 700; color: #0f1c3f; }
      `}</style>

      <div className="rp">
        <div className="rp-header">
          <button className="rp-back" onClick={() => navigate(-1)}>← Back</button>
          <div className="rp-title">🗺️ Popular Routes</div>
          <div className="rp-sub">Explore top bus routes across the region</div>
          <div className="search-bar">
            <span>🔍</span>
            <input
              placeholder="Search by city (e.g. Kolkata, Siliguri)"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            {searchText && (
              <button onClick={() => setSearchText('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 16 }}>✕</button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Sort:</span>
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        {/* Categories */}
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

        <div className="results-count">
          Showing <span>{filtered.length}</span> route{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* Routes */}
        <div className="routes-list">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚌</div>
              <div className="empty-title">No routes found</div>
              <div className="empty-sub">Try a different city or category</div>
            </div>
          ) : (
            filtered.map(route => (
              <div key={route.id} className="route-card">
                <div className="route-img-wrap">
                  <img src={route.img} alt={`${route.from} to ${route.to}`} className="route-img" />
                  <div className="route-img-overlay" />
                  <div
                    className="route-img-tag"
                    style={{ background: TAG_COLORS[route.tag] || '#f97316' }}
                  >
                    {route.tag}
                  </div>
                  <div className="route-img-info">
                    <div className="route-img-title">{route.from} → {route.to}</div>
                    <div className="route-img-dist">{route.distance}</div>
                  </div>
                </div>

                <div className="route-body">
                  <div className="buses-pill">
                    🚌 {route.buses} buses available daily
                  </div>
                  <div className="route-stats">
                    <div className="route-stat">
                      <span className="route-stat-label">Duration</span>
                      <span className="route-stat-val">⏱ {route.duration}</span>
                    </div>
                    <div className="route-divider" />
                    <div className="route-stat">
                      <span className="route-stat-label">Distance</span>
                      <span className="route-stat-val">📍 {route.distance}</span>
                    </div>
                    <div className="route-divider" />
                    <div className="route-stat">
                      <span className="route-stat-label">Type</span>
                      <span className="route-stat-val">🛣️ Express</span>
                    </div>
                  </div>
                  <div className="route-footer">
                    <div className="route-price-wrap">
                      <span className="route-price-label">Starting from</span>
                      <span className="route-price">₹{route.price}</span>
                    </div>
                    <button className="route-book-btn" onClick={() => handleBook(route)}>
                      Book Now →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}