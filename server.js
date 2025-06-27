require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const coupleRoutes = require('./routes/couple');
const adminRoutes = require('./routes/admin');

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/couple', coupleRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
  console.log(`LoveFy backend running on port ${port}`);
});