require('express-async-errors');
require('dotenv').config();

const express = require('express');
const http = require('http');
const path = require('path');
const fileUploader = require('express-fileupload');
const { rateLimit } = require('express-rate-limit');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

const origin = 'https://aura-a2kd.onrender.com';
// const origin = 'http://localhost:3000'

// Express app and server initialization
const app = express();
const server = http.createServer(app);

// Trust proxy
app.set('trust proxy', 1);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Helmet setup
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      imgSrc: ["'self'", "data:", "https://ik.imagekit.io"],
    },
  })
);

// CORS setup
app.use(
  cors({
    origin: [origin, 'https://ik.imagekit.io'],
    credentials: true,
  })
);

// Middleware setup
app.use(compression());
app.use(fileUploader({ useTempFiles: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE));
app.use(morgan('tiny'));

// Serve Vite frontend (dist folder) 
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// API routes
const AuthRouter = require('./routes/authRoute');
const AnalysisRoute = require('./routes/analysisRoute');
const UserRoute = require('./routes/userRoute');
const FileUploadRoute = require('./routes/uploadFileRoute');

app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/analysis', AnalysisRoute);
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/upload', FileUploadRoute);

// Catch-all route to serve index.html for frontend routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});


// Error handling
const ErrorMiddleware = require('./middlewares/errorMiddleware');
const NotFoundMiddleware = require('./middlewares/notFoundRoute');
app.use(NotFoundMiddleware);
app.use(ErrorMiddleware);

// MongoDB setup
const client = new MongoClient(process.env.MONGO_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    connectTimeoutMS: 10000,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });

const port = process.env.PORT || 5000;

const startApp = async () => {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');

    server.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB via MongoClient:', error);
  }
};

startApp().catch(console.dir);
