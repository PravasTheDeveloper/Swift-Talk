const Chat = require("../models/ChatSchema")
const Messege = require("../models/MessegeSchema")

const sendMessege = async (req, res) => {
    const { chatId, content } = req.body

    try {
        const messegeSave = await new Messege({
            sender: req.id,
            content: content,
            chat: chatId
        }).populate("chat")
        // 


        const savedmsg = await messegeSave.save();
        const messege = await savedmsg.populate("sender")

        const updateLetestMessege = await Chat.findByIdAndUpdate(chatId, {
            letestMessege: messege
        })
        // Save the message to the database


        res.status(200).send(messege);

    } catch (err) {
        res.status(400).json({ err })
        console.log(err)
    }
}

const fetchAllMessege = async (req, res) => {
    try {

        const findMessege = await Messege.find({ chat: req.params.chatId })
            .populate("chat").populate("sender")

        res.send(findMessege)

    } catch (err) {
        res.status(400).json({ err })
        console.log(err)
    }
}

module.exports = { sendMessege, fetchAllMessege }