const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');


app.use(express.static(path.join(__dirname, 'frontend')));

app.post('/register', async (req, res) => {
    // Registration logic here
});

app.post('/login', (req, res) => {
    // Login logic here
});
// Initialize Express
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Setup session management
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Lpkoji@1920', // Your MySQL root password
    database: 'truck_management'
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Serve static files (e.g., HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, email, password, phone, number_of_trucks, total_revenue } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, email, password, phone, number_of_trucks, total_revenue) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [username, email, hashedPassword, phone, number_of_trucks, total_revenue], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server Error');
        } else {
            res.redirect('/login.html');
        }
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server Error');
        } else if (results.length === 0) {
            res.status(401).send('Invalid credentials');
        } else {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            
            if (match) {
                req.session.user = user;
                res.redirect('/dashboard');
            } else {
                res.status(401).send('Invalid credentials');
            }
        }
    });
});

// Dashboard endpoint
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html')); // Update with your dashboard path
    } else {
        res.redirect('/login.html');
    }
});

// Logout endpoint
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login.html');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});