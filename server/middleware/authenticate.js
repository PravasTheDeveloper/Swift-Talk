const jwt = require("jsonwebtoken");
const AllUser = require("../models/UserSchema");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        if (token) {
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY || "THISISOURDEVINFOWEBSITEDEVELOPBYPRAVASCHANDRASARKARLOVEYOUALL");

            const rootUser = await AllUser.findOne({ _id: verifyToken._id, "tokens.token": token })

            if (!rootUser) {
                throw new Error("User Not Found")
            } else {
                req.rootUser = rootUser;
                req.token = token;
                req.id = rootUser._id;
                req.userName = rootUser.name;
                req.profile_pic = rootUser.profile_pic;

                next();
            }
        } else {
            throw new Error("Invalid")
        }

    } catch (err) {
        res.status(401).json([]);
        console.log(err)
    }
}

module.exports = authenticate