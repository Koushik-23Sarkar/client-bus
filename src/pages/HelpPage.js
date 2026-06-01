import { useState } from 'react';

const faqs = [
  { q: 'How do I cancel my booking?', a: 'Go to My Bookings, find the booking you want to cancel, and click the Cancel button. Cancellations made 24+ hours before departure receive a full refund.' },
  { q: 'When will I get my refund?', a: 'Refunds are processed within 5–7 business days to your original payment method after cancellation is confirmed.' },
  { q: 'Can I change my seat after booking?', a: 'Seat changes are not currently supported. You may cancel and rebook with your preferred seat, subject to availability.' },
  { q: 'What if my bus is delayed or cancelled?', a: 'In case of operator cancellation, you will receive a full refund automatically. For delays, please contact support via Chat With Us.' },
  { q: 'How do loyalty points work?', a: 'You earn 1 point for every ₹10 spent on confirmed bookings. Points unlock tier benefits like discounts, upgrades, and priority support.' },
  { q: 'Is my payment information secure?', a: 'Yes. All payments are processed via Razorpay with industry-standard encryption. BusGo never stores your card details.' },
  { q: 'Can I book for multiple passengers?', a: 'Yes! You can select multiple seats during booking. Each seat is counted as one passenger.' },
  { q: 'How do I use a promo code?', a: 'On the booking page, scroll to "Promo Code" section and enter your code. Valid codes are applied instantly to your total.' },
];

export default function HelpPage() {
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        .help { font-family: 'Poppins', sans-serif; min-height: 100vh; background: #f0f4ff; padding: 100px 20px 100px; }
        .help-container { max-width: 700px; margin: 0 auto; }
        .help-hero { background: linear-gradient(135deg, #0f1c3f, #1e3a8a); border-radius: 24px; padding: 36px 32px; text-align: center; margin-bottom: 28px; color: white; }
        .help-hero h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
        .help-hero p { opacity: 0.7; font-size: 14px; margin-bottom: 20px; }
        .search-input {
          width: 100%; padding: 14px 20px; border-radius: 14px; border: none;
          font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 500;
          outline: none; box-sizing: border-box;
        }
        .faq-section h2 { font-size: 18px; font-weight: 800; color: #0f1c3f; margin-bottom: 16px; }
        .faq-item { background: white; border-radius: 16px; margin-bottom: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; }
        .faq-question { padding: 18px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 15px; font-weight: 600; color: #0f1c3f; gap: 12px; }
        .faq-arrow { font-size: 18px; transition: transform 0.3s; flex-shrink: 0; color: #f97316; }
        .faq-arrow.open { transform: rotate(180deg); }
        .faq-answer { padding: 0 20px 18px; font-size: 14px; color: #6b7280; line-height: 1.7; font-weight: 500; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 28px; }
        .contact-card { background: white; border-radius: 18px; padding: 22px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); text-align: center; }
        .contact-icon { font-size: 32px; margin-bottom: 10px; }
        .contact-title { font-size: 15px; font-weight: 700; color: #0f1c3f; margin-bottom: 4px; }
        .contact-sub { font-size: 12px; color: #9ca3af; font-weight: 500; }
        .no-results { text-align: center; padding: 40px 20px; color: #9ca3af; font-size: 15px; }
      `}</style>
      <div className="help">
        <div className="help-container">
          <div className="help-hero">
            <h1>❓ Help & FAQ</h1>
            <p>Find answers to common questions about BusGo</p>
            <input className="search-input" placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            {filtered.length === 0 ? (
              <div className="no-results">No results found for "{search}"</div>
            ) : filtered.map((f, i) => (
              <div className="faq-item" key={i}>
                <div className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                  {f.q}
                  <span className={`faq-arrow ${open === i ? 'open' : ''}`}>▾</span>
                </div>
                {open === i && <div className="faq-answer">{f.a}</div>}
              </div>
            ))}
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <div className="contact-title">Email Support</div>
              <div className="contact-sub">support@busgo.in</div>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <div className="contact-title">Phone Support</div>
              <div className="contact-sub">1800-123-4567 (9am–9pm)</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}