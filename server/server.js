const express = require("express")
require('dotenv').config();

const cors = require("cors");
const connectDB = require("./configs/db");
const { clerkMiddleware } = require('@clerk/express');
const { clerkWebhooks } = require("./controllers/clerkWebhookes");

const app = express()
app.use(cors());

//middelewere
app.use(express.json())
app.use(clerkMiddleware())

//API to listen clerk webhooks
app.use("/api/clerk",clerkWebhooks)

app.get('/',(req,res)=>{
    res.send("api is working")
})
connectDB()

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{console.log(`Server running on port:${PORT}`)})