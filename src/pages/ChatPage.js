import { useState, useEffect, useRef } from 'react';

const BOT_RESPONSES = {
  cancel: "To cancel a booking, go to **My Bookings**, find your trip, and click **Cancel**. Refunds take 5–7 business days.",
  refund: "Refunds are processed within 5–7 business days to your original payment method after cancellation is approved.",
  book: "To book a bus, go to the **Home** page, enter your From/To locations, and click Search. Select a bus and choose your seats!",
  payment: "We accept UPI, credit/debit cards, and net banking via Razorpay. All transactions are 100% secure.",
  promo: "Use code **BUSGO20** for 20% off your first booking, or **STUDENT15** for a 15% student discount!",
  loyalty: "Earn 1 loyalty point per ₹10 spent. Reach 500 pts for Silver tier, 2000 for Gold, 5000 for Platinum — each with better perks!",
  track: "Visit **Track My Bus** in the sidebar to see live tracking of your current active bookings.",
  hello: "Hello! 👋 I'm BusGo Assistant. How can I help you today? You can ask about bookings, cancellations, refunds, or offers!",
  hi: "Hi there! 👋 How can I assist you with your BusGo journey today?",
  default: "I'm not sure about that, but our support team can help! Email us at support@busgo.in or call 1800-123-4567 (9am–9pm).",
};

function getBotReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('hello') || m.includes('hey')) return BOT_RESPONSES.hello;
  if (m.includes('hi')) return BOT_RESPONSES.hi;
  if (m.includes('cancel')) return BOT_RESPONSES.cancel;
  if (m.includes('refund')) return BOT_RESPONSES.refund;
  if (m.includes('book')) return BOT_RESPONSES.book;
  if (m.includes('pay') || m.includes('upi') || m.includes('card')) return BOT_RESPONSES.payment;
  if (m.includes('promo') || m.includes('discount') || m.includes('code') || m.includes('offer')) return BOT_RESPONSES.promo;
  if (m.includes('loyal') || m.includes('point') || m.includes('reward')) return BOT_RESPONSES.loyalty;
  if (m.includes('track') || m.includes('location') || m.includes('where')) return BOT_RESPONSES.track;
  return BOT_RESPONSES.default;
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: "Hello! 👋 I'm your BusGo Assistant. How can I help you today?\n\nYou can ask me about:\n• Booking & cancellations\n• Refunds & payments\n• Promo codes & offers\n• Loyalty rewards\n• Tracking your bus", time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: input, time: new Date() };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(p => [...p, { id: Date.now() + 1, from: 'bot', text: getBotReply(userMsg.text), time: new Date() }]);
    }, 1000 + Math.random() * 500);
  };

  const quickReplies = ['Cancel booking', 'Refund status', 'Promo codes', 'Loyalty points', 'Track my bus'];

  const fmt = (t) => new Date(t).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const renderText = (text) => text.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part.split('\n').map((line, j, arr) =>
      j < arr.length - 1 ? [line, <br key={j} />] : line
    )
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        .chat-page { font-family: 'Poppins', sans-serif; min-height: 100vh; background: #f0f4ff; display: flex; flex-direction: column; }
        .chat-topbar { background: linear-gradient(135deg, #0f1c3f, #1e3a8a); padding: 20px 24px; display: flex; align-items: center; gap: 14px; }
        .bot-avatar { width: 44px; height: 44px; background: #f97316; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .bot-info h2 { color: white; font-size: 16px; font-weight: 700; margin: 0; }
        .bot-status { color: #86efac; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 5px; }
        .online-dot { width: 7px; height: 7px; background: #86efac; border-radius: 50%; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .chat-messages { flex: 1; padding: 20px 16px; overflow-y: auto; min-height: calc(100vh - 220px); max-height: calc(100vh - 220px); }
        .msg-row { display: flex; margin-bottom: 14px; }
        .msg-row.user { justify-content: flex-end; }
        .msg-bubble { max-width: 75%; padding: 12px 16px; border-radius: 18px; font-size: 14px; font-weight: 500; line-height: 1.6; }
        .msg-bubble.bot { background: white; color: #0f1c3f; border-bottom-left-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .msg-bubble.user { background: #f97316; color: white; border-bottom-right-radius: 4px; }
        .msg-time { font-size: 10px; margin-top: 4px; opacity: 0.5; text-align: right; }
        .typing-bubble { background: white; padding: 14px 18px; border-radius: 18px; border-bottom-left-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); display: flex; gap: 4px; align-items: center; }
        .typing-dot { width: 7px; height: 7px; background: #d1d5db; border-radius: 50%; animation: bounce 1.2s infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        .quick-replies { display: flex; gap: 8px; padding: 10px 16px; overflow-x: auto; }
        .quick-replies::-webkit-scrollbar { display: none; }
        .qr-btn { background: white; border: 2px solid #f97316; color: #f97316; border-radius: 20px; padding: 7px 14px; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .qr-btn:hover { background: #f97316; color: white; }
        .chat-input-row { display: flex; gap: 10px; padding: 14px 16px; background: white; border-top: 1px solid #f0f4ff; }
        .chat-input { flex: 1; border: 2px solid #e5e7eb; border-radius: 14px; padding: 12px 16px; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 500; outline: none; color: #0f1c3f; }
        .chat-input:focus { border-color: #f97316; }
        .send-btn { background: #f97316; color: white; border: none; border-radius: 14px; padding: 12px 18px; font-family: 'Poppins', sans-serif; font-size: 18px; cursor: pointer; transition: opacity 0.2s; }
        .send-btn:hover { opacity: 0.85; }
      `}</style>
      <div className="chat-page">
        <div className="chat-topbar">
          <div className="bot-avatar">🤖</div>
          <div className="bot-info">
            <h2>BusGo Assistant</h2>
            <div className="bot-status"><div className="online-dot" /> Online — typically replies instantly</div>
          </div>
        </div>
        <div className="chat-messages">
          {messages.map(m => (
            <div className={`msg-row ${m.from}`} key={m.id}>
              <div className={`msg-bubble ${m.from}`}>
                {renderText(m.text)}
                <div className="msg-time">{fmt(m.time)}</div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="msg-row">
              <div className="typing-bubble">
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="quick-replies">
          {quickReplies.map(q => (
            <button key={q} className="qr-btn" onClick={() => { setInput(q); setTimeout(send, 50); }}>{q}</button>
          ))}
        </div>
        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button className="send-btn" onClick={send}>➤</button>
        </div>
      </div>
    </>
  );
}