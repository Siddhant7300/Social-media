const express = require('express');
const dotenv = require('dotenv');
const { connectToDB } = require('./dbConnect');
const authRouter = require('./routers/authRouter');
const postsRouter = require('./routers/postrouter');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({
    credentials: true, // Corrected from 'credential' to 'credentials'
    origin: "http://localhost:3000"
}));

// Routes
app.use('/auth', authRouter);
app.use('/posts', postsRouter);

// Default route
app.get('/', (req, res) => {
    res.status(200).send('Hello world');
});

// Connect to database
connectToDB();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is listening on port number ${PORT}`);
});
