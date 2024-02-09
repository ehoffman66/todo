const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const cors = require('cors');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3001', // Client URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    firstName: String,
    lastName: String,
    email: String,
    picture: String,
    createdAt: { type: Date, default: Date.now },
    lastLoginAt: Date,
});

const User = mongoose.model('User', userSchema);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, cb) => {
    console.log('Google profile:', profile);
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
        console.log('User already exists:', existingUser);
        cb(null, existingUser);
    } else {
        try {
            const user = new User({
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                picture: profile.photos[0].value, // Add this line
                createdAt: Date.now() // Add this line
            });
            const savedUser = await user.save();
            console.log('User saved:', savedUser);
            cb(null, savedUser);
        } catch (err) {
            console.log('Error saving user:', err);
            cb(err);
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google'), async (req, res) => {
    // Successful authentication, update lastLoginAt and save the user document.
    req.user.lastLoginAt = Date.now();
    await req.user.save();

    res.redirect('http://localhost:3001');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Route to check if the user is logged in
app.get('/api/current_user', (req, res) => {
    if (req.user) {
        res.send(req.user);
    } else {
        res.status(401).send();
    }
});

app.post('/api/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to log out');
        }

        res.clearCookie('sessionID');
        res.send('Logged out');
    });
});

const taskSchema = new Schema({
    userId: Schema.Types.ObjectId,
    text: String,
    category: String,
    completed: { type: Boolean, default: false },
    dueDate: Date,
    labels: [String]
});

const Task = mongoose.model('Task', taskSchema);

app.post('/api/tasks', async (req, res) => {
    console.log(req.body);

    if (!req.user) {
        return res.status(401).send();
    }

    const { text, category, dueDate, labels } = req.body;

    const task = new Task({
        userId: req.user.id,
        text,
        category,
        dueDate,
        labels,
        completed: false
    });

    try {
        await task.save();
        res.send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/api/tasks', async (req, res) => {
    if (!req.user) {
        return res.status(401).send();
    }

    try {
        console.log('User ID Fetch:', req.user.id);
        const userId = req.user.id;
        const tasks = await Task.find({ userId: userId });
        console.log('Tasks:', tasks);
        res.send(tasks);
    } catch (err) {
        console.error('Failed to fetch tasks:', err);
        res.status(500).send(err);
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Task.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send('Task not found');
        }
        res.send('Task deleted');
    } catch (err) {
        console.error('Failed to delete task:', err);
        res.status(500).send(err.toString());
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    if (!req.user) {
        return res.status(401).send();
    }

    const { completed, text, category, dueDate } = req.body;

    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

        if (!task) {
            return res.status(404).send();
        }

        if (completed !== undefined) {
            task.completed = completed;
        }
        if (text !== undefined) {
            task.text = text;
        }
        if (category !== undefined) {
            task.category = category;
        }
        if (dueDate !== undefined) {
            task.dueDate = new Date(dueDate);
        }

        await task.save();

        res.send(task);
    } catch (err) {
        console.error('Failed to update task:', err);
        res.status(500).send(err);
    }
});