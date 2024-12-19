// Express, MySQL, and other dependencies
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fitness_tracker'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database');
});

app.use(cors());
app.use(bodyParser.json());

// Serve static files (like CSS, JS)
app.use(express.static(path.join(__dirname, '/')));

// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve index.html from main dir
});

// API to log workout
app.post('/api/log', (req, res) => {
    const { activity, calories, duration, date } = req.body;
    const query = 'INSERT INTO workouts (activity, calories, duration, date) VALUES (?, ?, ?, ?)';
    db.query(query, [activity, calories, duration, date], (err, result) => {
        if (err) {
            console.error('Error inserting workout:', err);
            res.status(500).send('Error logging workout');
        } else {
            res.status(200).send('Workout logged');
        }
    });
});

// API to get all workouts
app.get('/api/workouts', (req, res) => {
    db.query('SELECT * FROM workouts ORDER BY date DESC', (err, results) => {
        if (err) {
            console.error('Error fetching workouts:', err);
            res.status(500).send('Error fetching workouts');
        } else {
            res.json(results);
        }
    });
});

// API to get the best workout comparison (highest calories burned)
app.get('/api/leaderboard', (req, res) => {
    const query = `
        SELECT date, MAX(calories) AS max_calories
        FROM workouts
        GROUP BY date
        ORDER BY max_calories DESC;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching leaderboard:', err);
            res.status(500).send('Error fetching leaderboard');
        } else {
            res.json(results);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
