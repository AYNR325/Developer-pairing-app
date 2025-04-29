
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');

const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000
const authRouter = require('./routes/auth/auth-routes');

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to MongoDB'))
 .catch(err => console.error(err));

 app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(cors(
    {
        origin:process.env.CLIENT_BASE_URL,
        methods:['GET', 'POST','DELETE','PUT'],
        allowedHeaders:[
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
            "stripe-signature"
        ],
        credentials:true
    }
))

app.use("/api/auth",authRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
