const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'secrets1',
    password: 'chandanchetia09',
    port: 5432,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new GoogleStrategy({
    clientID: "560768197808-mur1p64ibglu85dndtbrf7qhdioa82i6.apps.googleusercontent.com",
    clientSecret: "7OOLrGhqBgWoO1XBVBXhGO8q",
    callbackURL: "http://localhost:3000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
        
        if (result.rows.length > 0) {
            // User exists
            client.release();
            return done(null, result.rows[0]);
        } else {
            // Create new user
            const newUser = await client.query(
                'INSERT INTO users (google_id, email, name, profile_picture) VALUES ($1, $2, $3, $4) RETURNING *',
                [profile.id, profile.emails[0].value, profile.displayName, profile.photos[0].value]
            );
            client.release();
            return done(null, newUser.rows[0]);
        }
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        client.release();
        done(null, result.rows[0]);
    } catch (err) {
        done(err, null);
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

// Authentication routes
app.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const client = await pool.connect();
        
        // Check if user already exists
        const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            client.release();
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const result = await client.query(
            'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
            [email, hashedPassword, name]
        );
        
        client.release();
        req.session.userId = result.rows[0].id;
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const client = await pool.connect();
        
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        client.release();
        
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        
        req.session.userId = user.id;
        res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, profile_picture: user.profile_picture } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        req.session.userId = req.user.id;
        res.redirect('/');
    }
);

app.get('/user', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT id, email, name, profile_picture FROM users WHERE id = $1', [req.session.userId]);
        client.release();
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Create users table if it doesn't exist
async function initDatabase() {
    try {
        const client = await pool.connect();
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                name VARCHAR(255),
                google_id VARCHAR(255) UNIQUE,
                profile_picture VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        client.release();
        console.log('Database initialized');
    } catch (err) {
        console.error('Database initialization error:', err);
    }
}

initDatabase();