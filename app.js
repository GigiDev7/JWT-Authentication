const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { protectAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', protectAuth, (req, res) => res.render('smoothies'));

app.use(authRouter);
