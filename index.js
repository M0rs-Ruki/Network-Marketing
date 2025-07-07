
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import { log } from 'console';
import dotenv from 'dotenv';
import connectDB from './db/connect.db.js'


import bankRoutes from './routes/bank.routes.js';
import loginRoutes from './routes/login.routes.js';
import registerRoutes from './routes/register.routes.js';
import dashboardRoutes from './routes/deshboard.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import contactRoutes from './routes/contact.routes.js';
import logoutRoutes from './routes/logout.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import purchaseRoutes from './routes/purchase.routes.js';
import coursesRoutes from './routes/courses.routes.js';





dotenv.config({ path: './.env' });
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// connectDB(); // when you connect MongoDB Atlas then uncommand this and command the mongoose.connect in the user.models.js 

app.get('/', (req, res) => {
  res.render('index');
});

app.use((req, res, next) => {
  const referrerCode = req.query.ref;
  if (referrerCode) {
    res.cookie('referrer', referrerCode, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    });
  }
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error');
});



app.use('/login',loginRoutes);
app.use('/register',registerRoutes);
app.use('/bank', bankRoutes);
app.use('/payment',paymentRoutes);
app.use('/dashboard',dashboardRoutes);
app.use('/transaction',transactionRoutes);
app.use('/contact', contactRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/courses',coursesRoutes);
app.use('/logout',logoutRoutes);





app.get('/enquiry', (req, res) => {res.render('enquiry')});
app.get('/signup', (req, res) => {res.render('signUp')});
app.get('/privacy-policy', (req, res) => {res.render('privacyPolicy')});
app.get('/refund-policy', (req, res) => {res.render('refundPolicy')});
app.get('/terms-conditions', (req, res) => {res.render('termsAndConditions')});
app.get('/disclaimer', (req, res) => {res.render('disclaimer') });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
