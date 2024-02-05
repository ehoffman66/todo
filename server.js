const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
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
    picture: String // Add this line
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
                picture: profile.photos[0].value // Add this line
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

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    // Successful authentication, redirect to your client application.
    res.redirect('http://localhost:3001'); // Replace with your client URL
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

// Route to handle user logout
app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

const todoSchema = new Schema({
    userId: Schema.Types.ObjectId,
    text: String,
    category: String,
    completed: { type: Boolean, default: false },
    dueDate: Date,
    labels: [String]
});

const Todo = mongoose.model('Todo', todoSchema);

app.post('/api/todos', async (req, res) => {
    if (!req.user) {
        return res.status(401).send();
    }

    const { text, category, dueDate, labels } = req.body;

    const todo = new Todo({
        userId: req.user.id,
        text,
        category,
        dueDate,
        labels,
        completed: false
    });

    try {
        await todo.save();
        res.send(todo);
    } catch (err) {
        res.status(500).send(err);
    }
});