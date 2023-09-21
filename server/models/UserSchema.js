const mongoose = require('mongoose')
const os = require("os")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        profile_pic: {
            type: String,
            default: "avatar.gif"
        },
        tokens: [
            {
                token: {
                    type: String,
                },
                deviceUser: {
                    type: String,
                },
                deviceInfo: {
                    type: String,
                }
            },
        ],
    }, { timestamps: true }
)

//Hassing the Password

userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

//Generate Web Token

userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY || "THISISOURDEVINFOWEBSITEDEVELOPBYPRAVASCHANDRASARKARLOVEYOUALL");
        let deviceInfo = os.type()
        let deviceUser = os.hostname()
        this.tokens = this.tokens.concat({ token, deviceInfo, deviceUser });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}

const AllUser = mongoose.model("User", userSchema)

module.exports = AllUser