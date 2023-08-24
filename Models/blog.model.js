const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
    username: String,
    title: String,
    content: String,
    category: { type: String, enum: ["Tech", "Lifestyle", "Entertainment"] },
    date: { type: Date, default: Date.now() },
    likes: { type: Number, default: 0 },
    comments: [],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, {
    versionKey: false
})
const Blog = mongoose.model("blog", blogSchema)
module.exports = Blog;