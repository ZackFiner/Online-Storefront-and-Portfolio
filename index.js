const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const {mongoosedb} = require('./db');
const itemRouter = require('./routes/item-router');
const reviewRouter = require('./routes/review-router');
const userRouter = require('./routes/user-router');
const authRouter = require('./routes/auth-router');
const mediaRouter = require('./routes/media-router');
const init_func = require('./boot');

const app = express();
const apiPort = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin:'http://localhost:8000', credentials:true}));
app.use(bodyParser.json());
app.use(cookieParser());

init_func(); // initialize server
mongoosedb.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req,res) => {
    res.send('Hello World!');
});

app.use('/api', itemRouter);
app.use('/api', reviewRouter);
app.use('/api/users', userRouter);
app.use('/api/authenticate', authRouter);
app.use('/api/media', mediaRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));