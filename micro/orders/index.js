const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// because this application will be handling financial information, it should use a SQL database layer (for transactions).
//const {mongoosedb} = require('./db');
require('./db');
const orderRouter = require('./routes/order-router');
const app = express();
const apiPort = 3004;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin:'http://localhost:8000', credentials:true}));
app.use(bodyParser.json());
app.use(cookieParser());

//mongoosedb.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/', orderRouter);

require('./mq/consumers/payment-cons'); // start the payment consumer
require('./mq/consumers/inventory-cons'); // start the inventory consumer
app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));



