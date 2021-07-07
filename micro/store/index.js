const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const {mongoosedb} = require('./db');
const itemRouter = require('./routes/item-router');

const app = express();
const apiPort = 3001;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin:'http://localhost:8000', credentials:true}));
app.use(bodyParser.json());
app.use(cookieParser());


mongoosedb.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/', itemRouter);
app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));

