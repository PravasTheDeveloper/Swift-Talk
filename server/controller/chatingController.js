const Chat = require("../models/ChatSchema")
const AllUser = require("../models/UserSchema")
const mongoose = require("mongoose")

const chattingControl = async (req, res) => {
    const { id } = req.body

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.id } } },
            { users: { $elemMatch: { $eq: id } } }
        ]
    }
    )
        .populate("users", "-password -tokens")
        .populate("letestMessege")

    isChat = await AllUser.populate(isChat, {
        path: "letestMessege.sender",
        select: "name pic email"
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        const chatData = {
            chatName: '',
            isGroupChat: false,
            users: [req.id, id]
        }

        try {
            const createdChat = await Chat.create(chatData)

            // const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");

            if (createdChat) {
                res.status(200).json({ message: "Saved" })
            }
        } catch (err) {
            res.send(err)
        }

    }
}

const fetchChattingControl = async (req, res) => {
    const { userId } = req.body
    req.id = "64fb0f8708e56498e402d8a4"

    try {
        let Chats = await Chat.find({ users: { $elemMatch: { $eq: req.id } } })
            .populate("users", "-password -tokens")
            .populate("groupAdmin", "-password -tokens")
            .populate("letestMessege")
            .sort({ updatedAt: -1 })

        Chats = await AllUser.populate(Chats, {
            path: "letestMessege.sender",
            select: "name pic email"
        })

        res.send(Chats)
    } catch (err) {
        res.send(err)
    }
}

const createGroupControl = async (req, res) => {
    const { name, users } = req.body;

    if (!name || !users) {
        res.status(401).json({ messge: "Please fill all the feild" })
    } else {
        const objectIds = users.map((idString) => new mongoose.Types.ObjectId(idString));

        if (users < 2) {
            res.status(401).json({ messge: "Minimum add 2 people" })
        } else {
            objectIds.push(req.id)
            const groupChatting = await Chat.create({
                chatName: name,
                users: objectIds,
                isGroupChat: true,
                groupAdmin: req.id
            })

            // let Chats = await Chat.find({ _id: groupChatting })
            //     .populate("users", "-password -tokens")
            //     .populate("groupAdmin", "-password -tokens")
            //     .populate("letestMessege")
            //     .sort({ updatedAt: -1 })

            // console.log(groupChatting)

            res.send("ok")
        }
    }

}

const groupNameChangeControl = async (req, res) => {
    const { chatId, chatName } = req.body;

    try {
        const updateChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName
            },
            {
                new: true
            }
        ).populate("users", "-password -tokens")
            .populate("groupAdmin", "-password -tokens")

        if (!updateChat) {
            res.status(403).json({ message: "chat not found" })
        } else {
            res.json(updateChat)
        }
    } catch (err) {
        console.log('error', err);
    }


}

const addMemberControl = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const addMember = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId }
            },
            { new: true }
        ).populate("users", "-password -tokens")
            .populate("groupAdmin", "-password -tokens");

        res.send(addMember);
    } catch (err) {
        console.log('error', err);
        res.status(500).send({ error: 'An error occurred while adding a member to the chat.' });
    }
}



const removeGroupControl = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const addMember = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId }
            },
            { new: true }
        ).populate("users", "-password -tokens")
            .populate("groupAdmin", "-password -tokens");

        res.send(addMember);
    } catch (err) {
        console.log('error', err);
        res.status(500).send({ error: 'An error occurred while adding a member to the chat.' });
    }
}

module.exports = { chattingControl, fetchChattingControl, createGroupControl, groupNameChangeControl, removeGroupControl, addMemberControl }