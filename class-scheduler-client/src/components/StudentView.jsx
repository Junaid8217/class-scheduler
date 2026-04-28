import { useState, useEffect } from 'react';
import { getSlots, bookSlot } from '../api';


// Convert "HH:MM" 24h to "h:MM AM/PM"
const to12h = (time) => {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};

const c = {
  indigo:'#4f3ff0', indigoDk:'#3628c8', indigoLt:'#ede9ff',
  emerald:'#059669', emeraldLt:'#d1fae5',
  rose:'#e11d48', roseLt:'#ffe4e6',
  ink:'#0d0d12', inkSoft:'#5a5772', inkMuted:'#9895a8',
  surface:'#ffffff', surface2:'#f7f6fb',
  border:'#e8e6f0', border2:'#d4d0e8',
};

export default function StudentView({ studentName, onBack }) {
  const [slots, setSlots]       = useState([]);
  const [message, setMessage]   = useState('');
  const [isError, setIsError]   = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const fetchAvailableSlots = async () => {
    const res = await getSlots();
    setSlots(res.data.filter(s => s.status === 'available'));
  };
  useEffect(() => { fetchAvailableSlots(); }, []);

  const handleBook = async (slotId) => {
    setMessage(''); setBookingId(slotId);
    try {
      await bookSlot({ slotId, studentName });
      setMessage('Slot booked successfully! See you there 👋');
      setIsError(false);
      fetchAvailableSlots();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Booking failed.');
      setIsError(true);
    }
    setBookingId(null);
  };

  // Group by date
  const grouped = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(160deg, ${c.surface2} 0%, #d1fae5 100%)`, paddingBottom: '60px' }}>
      {/* Top nav */}
      <header style={{ background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${c.border}`, padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>📚</span>
            <span style={{ fontWeight: '600', fontSize: '15px', color: c.ink }}>Book a Session</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: c.inkSoft }}>{studentName}</span>
            <button onClick={onBack} style={{ background: c.surface2, border: `1.5px solid ${c.border}`, borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: '500', color: c.inkSoft, cursor: 'pointer', fontFamily: 'inherit' }}>
              ← Back
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero strip */}
        <div style={{ background: `linear-gradient(135deg, ${c.emerald}, #047857)`, borderRadius: '20px', padding: '24px 28px', marginBottom: '28px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: `0 8px 32px ${c.emerald}44` }}>
          <div>
            <div style={{ fontSize: '13px', opacity: .8, marginBottom: '4px' }}>Hello, {studentName} 👋</div>
            <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '22px', fontWeight: '400' }}>Pick your session</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.18)', borderRadius: '12px', padding: '12px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: '700' }}>{slots.length}</div>
            <div style={{ fontSize: '12px', opacity: .85 }}>slots open</div>
          </div>
        </div>

        {/* Toast */}
        {message && (
          <div style={{
            background: isError ? c.roseLt : c.emeraldLt,
            border: `1.5px solid ${isError ? '#fecdd3' : '#a7f3d0'}`,
            borderRadius: '12px', padding: '12px 16px', marginBottom: '20px',
            color: isError ? c.rose : c.emerald, fontSize: '14px', fontWeight: '500',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            {isError ? '⚠️' : '✅'} {message}
          </div>
        )}

        {slots.length === 0 ? (
          <div style={{ background: c.surface, border: `1.5px solid ${c.border}`, borderRadius: '20px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(13,13,18,.05)' }}>
            <div style={{ fontSize: '40px', marginBottom: '14px' }}>📭</div>
            <p style={{ color: c.inkSoft, fontSize: '15px', fontWeight: '500' }}>No available slots right now</p>
            <p style={{ color: c.inkMuted, fontSize: '13px', marginTop: '6px' }}>Check back later — new slots may be added soon.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, daySlots]) => (
            <div key={date} style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: c.inkMuted, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '10px', paddingLeft: '4px' }}>
                {formatDate(date)}
              </div>
              <div style={{ background: c.surface, border: `1.5px solid ${c.border}`, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(13,13,18,.05)' }}>
                {daySlots.map((slot, i) => (
                  <div key={slot._id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px 20px', gap: '12px',
                    borderTop: i > 0 ? `1px solid ${c.border}` : 'none',
                    transition: 'background .15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = c.surface2}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ background: c.emeraldLt, borderRadius: '10px', padding: '8px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: c.emerald }}>{to12h(slot.startTime)}</div>
                        <div style={{ fontSize: '11px', color: c.emerald, opacity: .7 }}>15 min</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: c.ink }}>{to12h(slot.startTime)} – {to12h(slot.endTime)}</div>
                        <div style={{ fontSize: '12px', color: c.inkMuted, marginTop: '2px' }}>Available · 15 minutes</div>
                      </div>
                    </div>
                    <button onClick={() => handleBook(slot._id)} disabled={bookingId === slot._id} style={{
                      background: bookingId === slot._id ? c.border2 : `linear-gradient(135deg, ${c.emerald}, #047857)`,
                      color: bookingId === slot._id ? c.inkMuted : 'white',
                      border: 'none', borderRadius: '10px', padding: '9px 20px',
                      fontSize: '13px', fontWeight: '600', fontFamily: 'inherit',
                      cursor: bookingId === slot._id ? 'not-allowed' : 'pointer', flexShrink: 0,
                      boxShadow: bookingId === slot._id ? 'none' : `0 4px 12px ${c.emerald}44`,
                    }}>
                      {bookingId === slot._id ? 'Booking…' : 'Book'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}