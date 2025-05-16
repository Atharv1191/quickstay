// const express = require("express")
// require('dotenv').config();

// const cors = require("cors");
// const connectDB = require("./configs/db");
// const { clerkMiddleware } = require('@clerk/express');
// const { clerkWebhooks } = require("./controllers/clerkWebhookes");

// const app = express()
// app.use(cors());

// //middelewere
// app.use(express.json())
// app.use(clerkMiddleware())

// //API to listen clerk webhooks

// app.post('/webhooks', clerkWebhooks)

// app.get('/',(req,res)=>{
//     res.send("api is working")
// })
// connectDB()

// const PORT = process.env.PORT || 5000

// app.listen(PORT,()=>{console.log(`Server running on port:${PORT}`)})
const express = require("express")
require('dotenv').config();
const cors = require("cors");
const connectDB = require("./configs/db");
const { clerkMiddleware } = require('@clerk/express');
const { clerkWebhooks } = require("./controllers/clerkWebhookes");

const app = express();
app.use(cors());

// 👇 Add this BEFORE express.json
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString(); // save raw body for Svix
  }
}));

// Middleware
app.use(clerkMiddleware());

// Webhook route (MUST use raw body)
app.post('/webhooks', clerkWebhooks);

app.get('/', (req, res) => {
  res.send("api is working");
});

// DB Connection
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
