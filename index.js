const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const db = require('./db');
const itemRouter = require('./routes/item-router');
const reviewRouter = require('./routes/review-router');
const userRouter = require('./routes/user-router');
const authRouter = requre('./routes/auth-router');

const app = express();
const apiPort = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req,res) => {
    res.send('Hello World!');
});

app.use('/api', itemRouter);
app.use('/api', reviewRouter);
app.use('/api/users', userRouter);
app.use('/api/authenticate', authRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));