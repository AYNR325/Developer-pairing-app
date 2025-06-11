require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 3000
const authRouter = require('./routes/auth/auth-routes');

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to MongoDB'))
 .catch(err => console.error(err));

// Configure CORS first
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Configure body-parser with increased limits
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/auth",authRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
