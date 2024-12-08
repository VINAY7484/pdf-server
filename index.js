import express from 'express';
import cors from 'cors';
import multer from "multer";
import logger from "morgan";
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import useragent from 'express-useragent';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Morgan logger for development
app.use(logger("dev"));
app.use(useragent.express());


// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);


// Set up routes
app.get('/', function (req, res) {
  res.send('Welcome to server')
})


// app.use('/api/v1', allRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(path.resolve(), "views", "build")));


  app.get("*", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "build", "index.html"));
  });
}


// Handle 404 errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Click here to visit http://localhost:${PORT}`);
});


