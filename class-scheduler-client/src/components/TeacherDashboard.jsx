import { useState, useEffect } from 'react';
import { getSlots, createSlot, deleteSlot, getBookings } from '../api';

const c = {
  indigo:'#4f3ff0', indigoDk:'#3628c8', indigoLt:'#ede9ff',
  emerald:'#059669', emeraldLt:'#d1fae5',
  rose:'#e11d48', roseLt:'#ffe4e6',
  ink:'#0d0d12', inkSoft:'#5a5772', inkMuted:'#9895a8',
  surface:'#ffffff', surface2:'#f7f6fb', surface3:'#f0eefa',
  border:'#e8e6f0', border2:'#d4d0e8',
};

export default function TeacherDashboard({ teacherName, onBack }) {
  const [slots, setSlots]           = useState([]);
  const [bookings, setBookings]     = useState([]);
  const [date, setDate]             = useState('');
  const [startTime, setStartTime]   = useState('');
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [adding, setAdding]         = useState(false);

  const fetchData = async () => {
    const [slotsRes, bookingsRes] = await Promise.all([getSlots(), getBookings()]);
    setSlots(slotsRes.data);
    setBookings(bookingsRes.data);
  };
  useEffect(() => { fetchData(); }, []);

  const getBookedBy = (slotId) => {
    const b = bookings.find(b => b.slotId?.toString() === slotId?.toString());
    return b ? b.studentName : null;
  };

  const handleAddSlot = async () => {
    setError(''); setSuccess('');
    if (!date || !startTime) { setError('Please select both a date and time.'); return; }
    setAdding(true);
    try {
      await createSlot({ teacherName, date, startTime });
      setSuccess('Slot created successfully!');
      setDate(''); setStartTime('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
    setAdding(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id); setError(''); setSuccess('');
    try {
      await deleteSlot(id);
      setSuccess('Slot removed.');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete slot.');
    }
    setDeletingId(null);
  };

  const booked    = slots.filter(s => s.status === 'booked').length;
  const available = slots.length - booked;

  const labelStyle = { fontSize: '11px', fontWeight: '600', color: c.inkMuted, letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: '7px' };
  const inputStyle = { width: '100%', padding: '10px 13px', fontSize: '14px', fontFamily: 'inherit', border: `1.5px solid ${c.border}`, borderRadius: '10px', outline: 'none', color: c.ink, background: c.surface };

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(160deg, ${c.surface2} 0%, #eceaff 100%)`, padding: '0 0 60px' }}>
      {/* Top nav */}
      <header style={{ background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${c.border}`, padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🎓</span>
            <span style={{ fontWeight: '600', fontSize: '15px', color: c.ink }}>Teacher Dashboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: c.inkSoft }}>{teacherName}</span>
            <button onClick={onBack} style={{ background: c.surface2, border: `1.5px solid ${c.border}`, borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: '500', color: c.inkSoft, cursor: 'pointer', fontFamily: 'inherit' }}>
              ← Back
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
          {[
            { label: 'Total Slots', value: slots.length, bg: c.surface, color: c.ink, border: c.border },
            { label: 'Available',   value: available,    bg: c.emeraldLt, color: c.emerald, border: '#a7f3d0' },
            { label: 'Booked',      value: booked,       bg: c.indigoLt,  color: c.indigo,  border: '#c4b5fd' },
          ].map(stat => (
            <div key={stat.label} style={{ background: stat.bg, border: `1.5px solid ${stat.border}`, borderRadius: '16px', padding: '18px 20px', boxShadow: '0 2px 8px rgba(13,13,18,.05)' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color, fontFamily: "'DM Serif Display', Georgia, serif" }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: stat.color, fontWeight: '500', opacity: .75, marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Add slot card */}
        <div style={{ background: c.surface, border: `1.5px solid ${c.border}`, borderRadius: '20px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(13,13,18,.05)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: c.ink, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: c.indigoLt, color: c.indigo, width: '28px', height: '28px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>+</span>
            Add New Slot
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" style={inputStyle} value={date}
                onChange={e => setDate(e.target.value)}
                onFocus={e => e.target.style.borderColor = c.indigo}
                onBlur={e => e.target.style.borderColor = c.border}
              />
            </div>
            <div>
              <label style={labelStyle}>Start Time</label>
              <input type="time" style={inputStyle} value={startTime}
                onChange={e => setStartTime(e.target.value)}
                onFocus={e => e.target.style.borderColor = c.indigo}
                onBlur={e => e.target.style.borderColor = c.border}
              />
            </div>
          </div>

          {error   && <div style={{ background: c.roseLt, border: '1.5px solid #fecdd3', borderRadius: '10px', padding: '10px 14px', color: c.rose, fontSize: '13px', fontWeight: '500', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>⚠️ {error}</div>}
          {success && <div style={{ background: c.emeraldLt, border: '1.5px solid #a7f3d0', borderRadius: '10px', padding: '10px 14px', color: c.emerald, fontSize: '13px', fontWeight: '500', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>✓ {success}</div>}

          <button onClick={handleAddSlot} disabled={adding} style={{
            background: adding ? c.border2 : `linear-gradient(135deg, ${c.indigo}, ${c.indigoDk})`,
            color: adding ? c.inkMuted : 'white', border: 'none', borderRadius: '11px',
            padding: '11px 24px', fontSize: '14px', fontWeight: '600', fontFamily: 'inherit',
            cursor: adding ? 'not-allowed' : 'pointer', boxShadow: adding ? 'none' : `0 4px 14px ${c.indigo}44`,
          }}>
            {adding ? 'Creating…' : 'Create Slot (15 min)'}
          </button>
          <p style={{ fontSize: '12px', color: c.inkMuted, marginTop: '10px' }}>Each slot is automatically set to 15 minutes.</p>
        </div>

        {/* Slots list */}
        <div style={{ background: c.surface, border: `1.5px solid ${c.border}`, borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(13,13,18,.05)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: c.ink, margin: '0 0 18px' }}>All Slots</h3>
          {slots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: c.inkMuted }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
              <p style={{ fontSize: '14px' }}>No slots yet. Create your first one above.</p>
            </div>
          ) : slots.map(slot => {
            const bookedBy = getBookedBy(slot._id);
            const isBooked = slot.status === 'booked';
            return (
              <div key={slot._id} style={{
                border: `1.5px solid ${isBooked ? '#e0d9ff' : c.border}`,
                borderRadius: '14px', padding: '14px 16px', marginBottom: '10px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                background: isBooked ? '#faf9ff' : c.surface,
                transition: 'box-shadow .15s',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(13,13,18,.07)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: isBooked ? c.indigoLt : c.emeraldLt, borderRadius: '10px', padding: '8px 10px', textAlign: 'center', minWidth: '54px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: isBooked ? c.indigo : c.emerald, letterSpacing: '0.04em' }}>
                      {slot.date.slice(5).replace('-', '/')}
                    </div>
                    <div style={{ fontSize: '12px', color: isBooked ? c.indigo : c.emerald, fontWeight: '500', marginTop: '2px' }}>
                      {slot.startTime}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: c.ink }}>{slot.startTime} – {slot.endTime}</div>
                    {bookedBy
                      ? <div style={{ fontSize: '12px', color: c.inkMuted, marginTop: '2px' }}>👤 Booked by <strong style={{ color: c.inkSoft }}>{bookedBy}</strong></div>
                      : <div style={{ fontSize: '12px', color: c.inkMuted, marginTop: '2px' }}>15 min · Open</div>
                    }
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{
                    background: isBooked ? c.indigoLt : c.emeraldLt,
                    color: isBooked ? c.indigo : c.emerald,
                    padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600',
                  }}>
                    {isBooked ? 'Booked' : 'Available'}
                  </span>
                  {!isBooked && (
                    <button onClick={() => handleDelete(slot._id)} disabled={deletingId === slot._id} style={{
                      background: 'none', border: `1.5px solid #fecdd3`, color: c.rose,
                      borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: '600',
                      cursor: deletingId === slot._id ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                      opacity: deletingId === slot._id ? .5 : 1,
                    }}>
                      {deletingId === slot._id ? '…' : '✕'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}