import { useState, useEffect } from 'react';
import { getSlots, createSlot } from '../api';

export default function TeacherDashboard({ teacherName, onBack }) {
  const [slots, setSlots]       = useState([]);
  const [date, setDate]         = useState('');
  const [startTime, setStartTime] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const fetchSlots = async () => {
    const res = await getSlots();
    setSlots(res.data);
  };

  useEffect(() => { fetchSlots(); }, []);

  const handleAddSlot = async () => {
    setError('');
    setSuccess('');

    if (!date || !startTime) {
      setError('Please select a date and time.');
      return;
    }

    try {
      await createSlot({ teacherName, date, startTime });
      setSuccess('Slot added successfully!');
      setDate('');
      setStartTime('');
      fetchSlots();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 16px' }}>
      <button onClick={onBack}>← Back</button>
      <h2>Teacher Dashboard</h2>
      <p>{teacherName}</p>
      <p>Total Slots: {slots.length}</p>
      <hr />
      <h3>Add New Slot</h3>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <button
          onClick={handleAddSlot}
          style={{ background: '#6366f1', color: 'white', padding: '8px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
        >
          Add Slot
        </button>
      </div>
      {error   && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <hr />
      <h3>All Slots</h3>
      {slots.length === 0 ? (
        <p>No slots yet.</p>
      ) : (
        slots.map((slot) => (
          <div
            key={slot._id}
            style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px 16px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>{slot.date} | {slot.startTime} – {slot.endTime}</span>
            <span style={{ background: slot.status === 'booked' ? '#ef4444' : '#10b981', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '14px' }}>
              {slot.status === 'booked' ? 'Booked' : 'Available'}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
