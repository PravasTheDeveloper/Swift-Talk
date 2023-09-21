const bcrypt = require("bcryptjs");
const AllUser = require("../models/UserSchema");
const Chat = require("../models/ChatSchema");


// For The Registration System

const userSignUp = async (req, res) => {
    const { name, email, password, profile_pic } = req.body;

    try {

        if (!name || !email || !password) {
            res.status(401).json({ messege: "Fill all the feild" })
        } else {
            const findUser = await AllUser.findOne({ email })

            if (findUser) {
                res.status(402).json({ messege: "This Email Is Already Exisist" })
            } else {
                const newUser = await AllUser.create({
                    name, email, password, profile_pic
                })

                const registered = await newUser.save();

                if (registered) {
                    const token = await newUser.generateAuthToken();

                    const cookie = res.cookie("jwtoken", token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true
                    })

                    res.status(200).json({ messege: "Sign Up Successful" })
                }

            }
        }

    } catch (err) {
        res.status(400).json({ messege: `The Error is ${err}` })
    }
}

// For The Login System

const userLogIn = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Plese Fill All The Fill" });
    } else {
        try {
            const userLogin = await AllUser.findOne({ email: email });

            if (userLogin) {
                const isMatch = await bcrypt.compare(password, userLogin.password);
                const token = await userLogin.generateAuthToken();

                // const cookie = res.cookie("jwtoken", token, {
                //     expires: new Date(Date.now() + 25892000000),
                //     httpOnly: true
                // })P

                if (isMatch) {
                    res.status(200).json({ messege: "LOGIN SUCCESSFULL" });
                } else {
                    res.status(400).json({ error: "Invalid Crediential !" });
                }
            } else {
                res.status(400).json({ error: "Invalid Login !" });
            }


        } catch (error) {
            res.status(400).json({ error: "Something Went Wrong" });
            // console.log(error);
        }
    }
}

const userDetails = async (req, res) => {
    res.send(req.rootUser)
    // console.log(req.rootUser)
}

// Find User

const findUser = async (req, res) => {
    try {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        } : {};

        const findUser = await AllUser.find(keyword).find({ _id: { $ne: req.id } })

        res.status(200).send(findUser)
    } catch (err) {
        console.log(err)
    }


}

const findUserChatting = async (req, res) => {
    try {
        const findUser = await Chat.find({
            users: { $elemMatch: { $eq: req.id } },
        })
            .populate("users", "-password -tokens");



        res.status(200).send(findUser);
    } catch (err) {
        console.error('err', err);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = { userSignUp, userLogIn, findUser, findUserChatting, userDetails }