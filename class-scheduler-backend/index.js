const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ── MongoDB Atlas Connection ──────────────────────────────────────────────────
const uri = "mongodb+srv://classScheduler:ddzmO5FTNCJyRilH@cluster0.gv2lthx.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// ── Helper: Add 15 minutes to "HH:MM" ────────────────────────────────────────
function addFifteenMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + 15;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

// ── Main Function ─────────────────────────────────────────────────────────────
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Connected Successfully!");

    // ── Collections ───────────────────────────────────────────────────────────
    const db = client.db("class-scheduler");
    const slotsCollection = db.collection("slots");
    const bookingsCollection = db.collection("bookings");

    // ── ROOT ROUTE ────────────────────────────────────────────────────────────
    app.get('/', (req, res) => {
      res.send('Class Scheduler API is running');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // SLOT ROUTES
    // ─────────────────────────────────────────────────────────────────────────

    // GET all slots
    app.get('/api/slots', async (req, res) => {
      try {
        const slots = await slotsCollection
          .find()
          .sort({ date: 1, startTime: 1 })
          .toArray();
        res.json(slots);
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch slots' });
      }
    });

    // POST create a new slot
    app.post('/api/slots', async (req, res) => {
      try {
        const { teacherName, date, startTime } = req.body;

        // Validate fields
        if (!teacherName || !date || !startTime) {
          return res.status(400).json({ error: 'All fields are required.' });
        }

        // RULE 1 — No past slots
        const slotDateTime = new Date(`${date}T${startTime}:00`);
        if (slotDateTime <= new Date()) {
          return res.status(400).json({ error: 'Cannot add a slot in the past.' });
        }

        // Calculate end time
        const endTime = addFifteenMinutes(startTime);

        // RULE 2 — No overlapping slots
        const slotsOnSameDay = await slotsCollection.find({ date }).toArray();
        const hasOverlap = slotsOnSameDay.some(existing => {
          return startTime < existing.endTime && endTime > existing.startTime;
        });

        if (hasOverlap) {
          return res.status(400).json({ error: 'This slot overlaps with an existing slot.' });
        }

        // Save slot
        const slot = {
          teacherName,
          date,
          startTime,
          endTime,
          status: 'available',
          createdAt: new Date()
        };

        const result = await slotsCollection.insertOne(slot);
        res.status(201).json({ ...slot, _id: result.insertedId });

      } catch (err) {
        res.status(500).json({ error: 'Server error' });
      }
    });

    // DELETE a slot
    app.delete('/api/slots/:id', async (req, res) => {
      try {
        const { id } = req.params;
        await slotsCollection.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: 'Slot deleted successfully' });
      } catch (err) {
        res.status(500).json({ error: 'Failed to delete slot' });
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // BOOKING ROUTES
    // ─────────────────────────────────────────────────────────────────────────

    // GET all bookings
    app.get('/api/bookings', async (req, res) => {
      try {
        const bookings = await bookingsCollection.find().toArray();
        res.json(bookings);
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
      }
    });

    // POST book a slot
    app.post('/api/bookings', async (req, res) => {
      try {
        const { slotId, studentName } = req.body;

        // Find the slot
        const slot = await slotsCollection.findOne({ _id: new ObjectId(slotId) });
        if (!slot) {
          return res.status(404).json({ error: 'Slot not found.' });
        }

        // Check if already booked
        if (slot.status === 'booked') {
          return res.status(400).json({ error: 'This slot is already booked.' });
        }

        // Update slot status to booked
        await slotsCollection.updateOne(
          { _id: new ObjectId(slotId) },
          { $set: { status: 'booked' } }
        );

        // Create booking record
        const booking = {
          slotId: new ObjectId(slotId),
          studentName,
          slotDate: slot.date,
          slotStartTime: slot.startTime,
          slotEndTime: slot.endTime,
          bookedAt: new Date()
        };

        const result = await bookingsCollection.insertOne(booking);
        res.status(201).json({
          message: 'Slot booked successfully!',
          booking: { ...booking, _id: result.insertedId }
        });

      } catch (err) {
        res.status(500).json({ error: 'Server error' });
      }
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

run();

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});