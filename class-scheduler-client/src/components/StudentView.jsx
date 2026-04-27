import { useState, useEffect } from 'react';
import { getSlots, bookSlot } from '../api';

export default function StudentView({ studentName, onBack }) {
  const [slots, setSlots]     = useState([]);
  const [message, setMessage] = useState('');

  const fetchAvailableSlots = async () => {
    const res = await getSlots();
    setSlots(res.data.filter((s) => s.status === 'available'));
  };

  useEffect(() => { fetchAvailableSlots(); }, []);

  const handleBook = async (slotId) => {
    setMessage('');
    try {
      await bookSlot({ slotId, studentName });
      setMessage('Slot booked successfully!');
      fetchAvailableSlots();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Booking failed.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 16px' }}>
      <button onClick={onBack}>← Back</button>
      <h2>Student View</h2>
      <p>{studentName}</p>
      {message && (
        <div style={{ background: '#d1fae5', border: '1px solid #10b981', borderRadius: '8px', padding: '10px' }}>
          {message}
        </div>
      )}
      <h3>Available Slots</h3>
      {slots.length === 0 ? (
        <p>No available slots at the moment.</p>
      ) : (
        slots.map((slot) => (
          <div
            key={slot._id}
            style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px 16px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>{slot.date} | {slot.startTime} – {slot.endTime}</span>
            <button
              onClick={() => handleBook(slot._id)}
              style={{ background: '#10b981', color: 'white', padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            >
              Book
            </button>
          </div>
        ))
      )}
    </div>
  );
}
