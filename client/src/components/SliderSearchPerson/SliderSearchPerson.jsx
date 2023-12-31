import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { closeSearchSlider, openSearchSlider } from "../redux/SliderRedux"
import Avatar from "react-avatar"
import { addLatestChatting, fetchChatsAsync } from "../redux/ChattingRedux"
import { RotatingLines } from 'react-loader-spinner';
// import { fetchMessege, selectChattingOption, addSoketMessege } from "../redux/MessegeRedux"
import { TbMessageCircleOff } from "react-icons/tb"
import ScrollableFeed from 'react-scrollable-feed'
import { AiOutlineSend } from "react-icons/ai"
import { GrAttachment } from "react-icons/gr"
import { BsEmojiSmile } from "react-icons/bs"
import io from "socket.io-client"

const soket = io("http://localhost:5000")

function SliderSearchPerson() {

    var selectedChatCompare;

    const ChattingData = useSelector((state) => state.chatting.data)
    const Chattingloading = useSelector((state) => state.chatting.loading)

    const UserData = useSelector((state) => state.userdetails.userdata)
    const [content, setcontent] = useState("")
    const dispatch = useDispatch()

    const [SoketConnected, setSoketConnected] = useState(false)
    const [SelectedChatMessege, setSelectedChatMessege] = useState([])

    const [SelectedChat, setSelectedChat] = useState([])

    const ChattingHandle = (newChattignData) => {
        setSelectedChat(newChattignData)
        fetchSelectedChatMessege(newChattignData._id)
    }

    const fetchSelectedChatMessege = async (id) => {

        try {
            const response = await fetch(`/api/messege/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const Status = response.status;
            const Messege = await response.json();
            setSelectedChatMessege(Messege)

            soket.emit("join chat", id)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        dispatch(fetchChatsAsync())
        soket.emit("setup", UserData)
        soket.on("connection", () => console.log(`connect`))
        soket.on("disconnected", () => console.log(`disconnect`))
    }, [soket])

    const SentChattingData = async () => {
        const chatId = SelectedChat._id
        const response = await fetch("/api/messege",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatId, content
                })
            }
        )

        const status = response.status
        const data = await response.json()

        // console.log(data)
        soket.emit("new messege", data)

        if (status === 200) {
            setcontent("")
        }
    }

    selectedChatCompare = SelectedChat._id


    const [dataDispatched, setDataDispatched] = useState(false);

    useEffect(() => {
        const handleNewMessage = (newMessageReceived) => {

            if (!selectedChatCompare || selectedChatCompare !== newMessageReceived.chat._id) {
                console.log(`Notificate :::: `, newMessageReceived);
            } else {
                setSelectedChatMessege((prev) => [...prev, newMessageReceived])
                dispatch(addLatestChatting({ selectedChatCompare, newMessageReceived }))

                if (newMessageReceived.sender !== UserData._id) {
                    setDataDispatched(true);
                }
            }
        };

        soket.on("messege recieved", handleNewMessage);
        soket.on("disconnect", () => console.log(`disconnect`))

        return () => {
            soket.off("messege recieved", handleNewMessage);
        };
    }, [soket, selectedChatCompare]);
    // console.log(ChattingData)
    return (
        <>
            <div className='flex-1 h-full relative flex overflow-hidden'>
                <div className='xl:w-[350px] lg:w-[300px] sm:w-[250px] left-[-1000px] lg:left-0 h-full bg-slate-700 border-slate-900 border-r flex flex-col'>
                    <div className='w-full h-[60px] flex justify-center items-center px-5'>
                        <input type="text" className='h-[40px] w-full rounded bg-slate-500 px-2 text-sm text-white outline-none' placeholder='Search People' onFocus={() => { dispatch(openSearchSlider()) }} />
                    </div>
                    <div className='w-full flex-1 border-t-2 p-5'>
                        <div className='w-full h-full'>
                            {
                                ChattingData.map((data, index) => {
                                    return (
                                        <div className='w-full h-16 bg-slate-500 flex items-center px-2 mb-4 cursor-pointer hover:bg-slate-900 duration-200' key={index} onClick={() => { ChattingHandle(data) }}>
                                            <div className=''>
                                                <div className='h-[40px] rounded-full w-[40px] mr-3'>
                                                    {/* <img  /> */}
                                                    <div className="relative">
                                                        <img className="w-10 h-10 rounded-full" src={data.users[0]._id === UserData._id ? data.users[1].profile_pic : data.users[0].profile_pic} alt="" />
                                                        <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className='text-white font-bold'>
                                                    {
                                                        data.chatName.length > 0 ? data.chatName : data.users[0]._id === UserData._id ? data.users[1].name : data.users[0].name
                                                    }
                                                </div>
                                                <div className='text-white text-sm'>
                                                    {data.letestMessege.content}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                )
                            }

                        </div>
                    </div>
                    <div className={`w-full h-full scroll_page_bg_style absolute left-0 top-0 flex justify-center items-center ${Chattingloading === false ? "hidden" : "none"}`}>
                        <RotatingLines
                            strokeColor="#fff"
                            strokeWidth="5"
                            animationDuration="0.5"
                            width="100"
                            visible={true}
                        />
                    </div>
                </div >
                <div className='flex-1 h-full' onClick={() => { dispatch(closeSearchSlider()) }}>
                    {/* Messege Feild */}
                    {
                        SelectedChat === "" ?
                            <div className='w-full h-full flex flex-col justify-center items-center'>
                                <div className='w-full h-full bg-slate-800 px-5 text-slate-400 flex justify-center items-center flex-col'>
                                    <TbMessageCircleOff className='text-[80px]' />
                                    <div className='font-bold mt-10'>
                                        Select Chatting Person To Chat
                                    </div>
                                </div>
                            </div>
                            :
                            <div className='w-full h-full flex flex-col'>
                                <div className='w-full h-14 bg-slate-500 px-5'>
                                    <div className='w-full h-full flex items-center justify-between'>
                                        <div className='flex items-center'>
                                            <div className='mr-5 w-[40px] h-[40px] rounded-full overflow-hidden'>
                                                {
                                                    // ChattingDetails.chatName !== "" ? <img src='/group.gif' /> : <Avatar size="40" style={{ fontSize: 40, borderRadius: 100 }} color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])} name="John Due" />
                                                }

                                            </div>
                                            <div className='text-white font-semibold'>
                                                {/* {ChattingDetails.chatName !== "" ? ChattingDetails.chatName : ChattingDetails.users[0]._id === UserData._id ? ChattingDetails.users[1].name : ChattingDetails.users[0].name} */}
                                            </div>
                                        </div>
                                        <div>
                                            hello
                                        </div>
                                    </div>
                                </div>

                                <ScrollableFeed className='flex-1 Show__Chatting__Data my-5'>
                                    {
                                        SelectedChatMessege.map((data, index) => {
                                            return (
                                                <div key={index} className={`w-full h-auto mb-2 flex ${data.sender._id === UserData._id ? "justify-end" : "justify-start"} text-white px-3`}>
                                                    <div className={`w-auto bg-cyan-500 ${data.sender._id === UserData._id ? "bg-cyan-600 " : "bg-slate-700 "} py-2 px-4 rounded-full`}>
                                                        {data.content}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </ScrollableFeed>

                                <div className='w-full h-14 min-h-14 bg-slate-500 flex items-center px-5'>
                                    <div className='w-11 h-11 bg-slate-400 rounded-full flex justify-center items-center text-2xl'>
                                        <GrAttachment />
                                    </div>
                                    <div className='w-11 h-11 bg-slate-400 rounded-full mx-5 flex justify-center items-center text-2xl'>
                                        <BsEmojiSmile />
                                    </div>
                                    <div className='flex-1 h-full py-2 '>
                                        <input className='w-full h-full bg-slate-300 rounded-full outline-none px-4' placeholder='Type Messege' value={content} onChange={(e) => { setcontent(e.target.value) }} type="text" />
                                    </div>

                                    <div className='w-11 h-11 bg-slate-800 hover:bg-slate-300 hover:text-black cursor-pointer duration-200 rounded-full ml-5 flex justify-center items-center text-2xl text-white' onClick={SentChattingData}>
                                        <AiOutlineSend />
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}

export default SliderSearchPerson
