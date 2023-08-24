const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const router = require('./Routes/server.routes');
app.use(express.json())
app.use(cors());
app.use("/api", router)
app.listen(8080, async () => {
    await mongoose.connect("mongodb+srv://laxya:laksh@cluster0.zwu6tqa.mongodb.net/MasaiBlogs?retryWrites=true&w=majority")
    console.log("Server started on PORT 8080");
})