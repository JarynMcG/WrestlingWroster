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

// Start server
app.listen(5002, () => {
    console.log('Server running at http://localhost:5002');
});
