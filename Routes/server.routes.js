const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const User = require("../Models/user.model");
const Blog = require("../Models/blog.model");
const AuthMiddlware = require('../Middleware/AuthMIddleware');
router.get("/", AuthMiddlware, (req, res) => {
    console.log(req.body);
    res.send("Welcome to Blog App By Laxya Rupeja")
})
router.post("/register", async (req, res) => {
    const { username, avatar, email, password } = req.body;
    try {
        const hash = bcrypt.hashSync(password, 2);
        const newUser = User({ username, avatar, email, password: hash })
        await newUser.save();
        res.json({ newUser });
    } catch (error) {
        console.log({ error })
        res.status(404).json({ msg: "Something went wrong", error })
    }
})
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const isExits = await User.findOne({ email });
        if (!isExits) {
            res.status(404).json({ msg: "User doesn't exits" });
            return;
        }
        const match = bcrypt.compareSync(password, isExits.password);
        if (!match) {
            res.status(404).json({ msg: "Wrong Password!!!" });
            return;
        }
        const token = jwt.sign({ userId: isExits._id }, "shhhh");
        res.json({ token });
    } catch (error) {
        console.log({ error })
        res.status(404).json({ msg: "Something went wrong", error })
    }
})
router.get("/blogs", AuthMiddlware, async (req, res) => {
    const { title, category, sort } = req.query;
    try {
        const queries = {};
        if (title) {
            queries.title = { $regex: title, $options: "i" };
        }
        if (category) {
            queries.category = category
        }
        if (sort) {
            const Blogs = await Blog.find(queries).sort({ date: sort }).populate("userId");
            res.json({ Blogs });
        }
        else {
            const Blogs = await Blog.find(queries).populate("userId");
            res.json({ Blogs });
        }

    } catch (error) {
        console.log({ error })
        res.status(404).json({ msg: "Something went wrong", error })
    }
})
router.post("/blogs", AuthMiddlware, async (req, res) => {
    const { title, category, content, username } = req.body;
    try {
        const newBlog = Blog({ title, category, content, userId: req.body.userId, username })
        await newBlog.save();
        res.json({ newBlog })

    } catch (error) {
        console.log({ error })
        res.status(404).json({ msg: "Something went wrong", error })
    }
})
router.patch("/blogs/:id", AuthMiddlware, async (req, res) => {
    const { id } = req.params;
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body);
        res.json({ updateBlog });
    } catch (error) {
        console.log({ error })
        res.status(404).json({ msg: "Something went wrong", error })
    }
})
router.delete("/blogs/:id", AuthMiddlware, async (req, res) => {
    const { id } = req.params;
    try {
        const delBlog = await Blog.findByIdAndDelete(id);
        res.json({ delBlog });
    } catch (error) {
        console.log({ error })
        res.status(404).json({ msg: "Something went wrong", error })
    }
})
router.patch("/blogs/:id/like", AuthMiddlware, async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id);
        blog.likes++;
        await blog.save();
        res.json({ blog })
    } catch (error) {
        console.log({ error })
        res.status(404).json({ msg: "Something went wrong", error })
    }
})
router.patch("/blogs/:id/comment", AuthMiddlware, async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id);
        const user = await User.findById(req.body.userId);
        // console.log(user);
        blog.comments.push({ username: user.username, content: req.body.content });
        // console.log(blog)
        await blog.save();
        res.json({ blog })
    } catch (error) {
        console.log({ error })
        res.status(404).json({ msg: "Something went wrong", error })
    }
})

module.exports = router;
