const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const {mongoosedb} = require('./db');
const itemRouter = require('./routes/item-router');
const reviewRouter = require('./routes/review-router');
const userRouter = require('./routes/user-router');
const authRouter = require('./routes/auth-router');
const postRouter = require('./routes/post-router');
const init_func = require('./boot');
const {USER_ROLE_ID, ADMIN_ROLE_ID} = require('./boot/role_init');
const app = express();
const apiPort = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin:'http://localhost:8000', credentials:true}));
app.use(bodyParser.json());
app.use(cookieParser());


mongoosedb.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api/items', itemRouter);
app.use('/api/users', userRouter);
app.use('/api/authenticate', authRouter);
app.use('/api/frontpage', postRouter);

init_func().then(()=>{
    app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
});

