const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000; // or another port if you prefer

// MySQL database connection
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12735050',
    password: 'G1qrVh4sHj',
    database: 'sql12735050',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to the database.');

    // Create the "wishomkar" table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS wishomkar (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `;
    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        console.log('Table "wishomkar" is ready.');
    });
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle form submission
app.post('/submit', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('Name is required.');
    }

    const query = 'INSERT INTO wishomkar (name) VALUES (?)';
    db.query(query, [name], (err) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal server error.');
        }
        res.send('Wish granted!');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
