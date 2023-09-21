import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { closeSearchSlider, openSearchSlider } from "../redux/SliderRedux"
import Avatar from "react-avatar"
import { fetchChatsAsync } from "../redux/ChattingRedux"
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
    // const messegeStatus = useSelector((state) => state.messege.status)
    const ChattingData = useSelector((state) => state.chatting.data)
    const Chattingloading = useSelector((state) => state.chatting.loading)
    // const messegeData = useSelector((state) => state.messege.data)
    // const ChattingDetails = useSelector((state) => state.messege.messegeSelect)
    const UserData = useSelector((state) => state.userdetails.userdata)
    const [content, setcontent] = useState("")
    const dispatch = useDispatch()
    // const chatId = ChattingDetails._id
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
        soket.on("connection", () => setSoketConnected(true))
    }, [])

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
        console.log(data)
        soket.emit("new messege", data)

        // if (status === 200) {
        //     dispatch(fetchMessege(chatId))
        // }
    }

    selectedChatCompare = SelectedChat._id


    const [dataDispatched, setDataDispatched] = useState(false);

    useEffect(() => {
        const handleNewMessage = (newMessageReceived) => {

            if (!selectedChatCompare || selectedChatCompare !== newMessageReceived.chat._id) {
                console.log(`Notificate :::: `, newMessageReceived);
            } else {
                setSelectedChatMessege([...SelectedChatMessege, newMessageReceived])

                if (newMessageReceived.sender !== UserData._id) {
                    setDataDispatched(true);
                }
            }
        };

        soket.on("messege recieved", handleNewMessage);


        return () => {
            soket.off("messege recieved", handleNewMessage);
        };
    }, [soket, selectedChatCompare]);
    console.log(SelectedChatMessege)
    return (
        <>
            <div className='flex-1 h-full relative flex'>
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
                                                <div className='h-[40px] rounded-full overflow-hidden w-[40px] mr-3'>
                                                    <Avatar size="40" style={{ fontSize: 40, borderRadius: 100 }} color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])} name={data.chatName.length > 0 ? data.chatName : data.users[0]._id === UserData._id ? data.users[1].name : data.users[0].name} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className='text-white font-bold'>
                                                    {
                                                        data.chatName.length > 0 ? data.chatName : data.users[0]._id === UserData._id ? data.users[1].name : data.users[0].name
                                                    }
                                                </div>
                                                <div className='text-white text-sm'>
                                                    Hei man how are you
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
                                <div className='flex-1 overflow-scroll'>
                                    <ScrollableFeed>
                                        {
                                            SelectedChatMessege.map((data, index) => {
                                                return (
                                                    <div key={index} className={`w-full h-auto bg-red-500 mb-2 flex ${data.sender === UserData._id ? "justify-end" : "justify-start"} px-3`}>
                                                        <div className='w-auto bg-cyan-500 py-2 px-4 rounded-full'>
                                                            {data.content}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </ScrollableFeed>
                                </div>
                                <div className='w-full h-14 min-h-14 bg-slate-500 flex items-center px-5'>
                                    <div className='w-11 h-11 bg-slate-400 rounded-full flex justify-center items-center text-2xl'>
                                        <GrAttachment />
                                    </div>
                                    <div className='w-11 h-11 bg-slate-400 rounded-full mx-5 flex justify-center items-center text-2xl'>
                                        <BsEmojiSmile />
                                    </div>
                                    <div className='flex-1 h-full py-2 '>
                                        <input className='w-full h-full bg-slate-300 rounded-full outline-none px-4' placeholder='Type Messege' onChange={(e) => { setcontent(e.target.value) }} type="text" />
                                    </div>

                                    <div className='w-11 h-11 bg-slate-800 rounded-full ml-5 flex justify-center items-center text-2xl text-white' onClick={SentChattingData}>
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
