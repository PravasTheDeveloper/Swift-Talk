const express = require("express")
const router = express.Router()

const { userSignUp, userLogIn, findUser, findUserChatting, userDetails, userLogout } = require("../controller/userController")
const authenticate = require("../middleware/authenticate")
// const User = require("../models/UserSchema")
const {
    chattingControl,
    fetchChattingControl,
    createGroupControl,
    groupNameChangeControl,
    removeGroupControl,
    addMemberControl
} = require("../controller/chatingController")
const { sendMessege, fetchAllMessege } = require("../controller/messegeController")



router.get("/", async (req, res) => {
    res.send("Hei There")
})

// All UserAuth Routes
router.get("/api/userdetails", authenticate, userDetails)
router.post("/api/register", userSignUp)
router.post("/api/login", userLogIn)
router.get("/api/user", authenticate, findUser)
router.get("/api/userchatting", authenticate, findUserChatting)
router.post("/api/logout" ,userLogout)

// All Chatting Routes

router.post("/api/chat", authenticate, chattingControl)
router.get("/api/chat", authenticate, fetchChattingControl)
router.post("/api/createGroup", authenticate, createGroupControl)
router.put("/api/changeGroupName", groupNameChangeControl)
router.put("/api/addMemberGroup", addMemberControl)
router.put("/api/removeGroup", removeGroupControl)


// Messeges Chatting Routes

router.post("/api/messege", authenticate, sendMessege)
router.get("/api/messege/:chatId", authenticate, fetchAllMessege)



// All Uncorrected Routes

router.get("/api/testSignUp", authenticate, async (req, res) => {
    console.log(req.rootUser)
    res.send("fuck")
})



module.exports = router