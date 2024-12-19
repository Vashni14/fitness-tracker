const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fitness_tracker',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected');
});

// API Routes
app.post('/api/log', (req, res) => {
    const { activity, calories, duration } = req.body;
    const sql = 'INSERT INTO workouts (activity, calories, duration) VALUES (?, ?, ?)';
    db.query(sql, [activity, calories, duration], (err) => {
        if (err) throw err;
        res.sendStatus(201);
    });
});

app.get('/api/workouts', (req, res) => {
    const sql = 'SELECT * FROM workouts';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
