const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection pointing to 'Roster' DB
const mongoURI = 'mongodb+srv://jarynmcginnis:xuilu8nYo24OQuLY@cluster0.wgsfirf.mongodb.net/Roster?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {})
  .then(() => console.log("CONNECTED TO 'Roster' DATABASE SUCCESSFULLY"))
  .catch(error => console.error('COULD NOT CONNECT TO DATABASE:', error.message));

// Define schema (should match structure in collection)
const RosterSchema = new mongoose.Schema({
    Email: String,
    Name: String,
    Nicknames: [String],
    "Social Media Links": [String],
    Titles: String,
    Stables: String,
    "Named Moves": String,
    "Entrance Music": String,
    "Entrance Weight": String,
    Hometown: String,
    "Extra broadcast notes": String
}, { collection: 'rostertest' }); // ✅ Use existing collection

// points to 'rostertest' collection explicitly
const RosterInfo = mongoose.model('RosterInfo', RosterSchema);

// API endpoint to fetch data
app.get('/api/getInfo', async (req, res) => {
    try {
        const data = await RosterInfo.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Match card handling

  

const MatchCard = mongoose.model('MatchCard', {
    matches: [
      {
        matchType: String,
        participants: String,
        timeAllocated: String,
        order: Number,
        notes: String 
      }
    ],
    lastUpdated: Date
  });
  

  app.get('/api/matchcard', async (req, res) => {
    const doc = await MatchCard.findOne().sort({ lastUpdated: -1 });
    res.json(doc || { matches: [] });
  });
  
  app.post('/api/matchcard', async (req, res) => {
    const matchCard = new MatchCard({
      matches: req.body.matches,
      lastUpdated: new Date()
    });
    await matchCard.save();
    res.json({ message: 'Saved' });
  });
  

// GET the latest saved match card
app.get('/api/matchcard', async (req, res) => {
    try {
      const matchCard = await MatchCard.findOne().sort({ lastUpdated: -1 });
      res.json(matchCard || { matches: [] });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch match card.' });
    }
  });
  
  // POST a new match card
  app.post('/api/matchcard', async (req, res) => {
    try {
      const matchCard = new MatchCard({
        matches: req.body.matches,
        lastUpdated: new Date()
      });
      await matchCard.save();
      res.json({ message: 'Match card saved successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save match card.' });
    }
  });
  

  mongoose.connect(mongoURI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});