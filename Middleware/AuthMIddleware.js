const jwt = require('jsonwebtoken');
const User = require('../Models/user.model');
const AuthMiddlware = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        if (!token) {
            res.status(404).json({ msg: "token not avaible" })
            return;
        }
        var decoded = jwt.verify(token, 'shhhh');
        const isExits = await User.findById(decoded.userId);
        if (!isExits) {
            res.status(404).json({ msg: "User not exits" })
            return;
        }
        req.body.userId = decoded.userId;
        req.body.username = isExits.username;
        next();
    } catch (error) {
        res.status(404).json({ msg: "Something went wrong", error })
    }
}
module.exports = AuthMiddlware;
