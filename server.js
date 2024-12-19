const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from the main directory

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Update if your MySQL has a password
    database: 'fitness_tracker',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// API Routes
app.get('/api/workouts', (req, res) => {
    db.query('SELECT * FROM workouts', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.post('/api/workouts', (req, res) => {
    const { activity, calories, duration, date } = req.body;
    db.query(
        'INSERT INTO workouts (activity, calories, duration, date) VALUES (?, ?, ?, ?)',
        [activity, calories, duration, date],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Failed to add workout' });
            res.status(201).json({ message: 'Workout added successfully', id: result.insertId });
        }
    );
});

// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
