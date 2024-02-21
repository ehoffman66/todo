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
    origin: process.env.REACT_APP_BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.SESSION_SECURE === 'true',
        httpOnly: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 48,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URI, {
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
    cardColor: { type: String, default: 'defaultColor' },
    hideCompleted: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.REACT_APP_SERVER_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, cb) => {
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
                picture: profile.photos[0].value,
                createdAt: Date.now()
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

    res.redirect(process.env.REACT_APP_BASE_URL);
});

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { cardColor } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.cardColor = cardColor;

        await user.save();

        res.send(user);
    } catch (err) {
        console.error('Failed to update user:', err);
        res.status(500).send(err);
    }
});

app.put('/api/users/:id/hideCompleted', async (req, res) => {
    const { id } = req.params;
    const { hideCompleted } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.hideCompleted = hideCompleted;

        await user.save();

        res.send(user);
    } catch (err) {
        console.error('Failed to update user:', err);
        res.status(500).send(err);
    }
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
    labels: [String],
    completedAt: Date,
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
        const userId = req.user.id;
        const tasks = await Task.find({ userId: userId });
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
        if (completed) {
            task.completedAt = new Date();
        } else {
            task.completedAt = null;
        }

        await task.save();

        res.send(task);
    } catch (err) {
        console.error('Failed to update task:', err);
        res.status(500).send(err);
    }
});