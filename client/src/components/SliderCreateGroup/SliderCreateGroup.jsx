import React, { useRef, useState } from 'react'
import Avatar from "react-avatar"
import { RxCross2 } from "react-icons/rx"
import { closeCreateGroup } from '../redux/SliderRedux';
import { useDispatch } from 'react-redux';

function SliderCreateGroup() {

    const containerRef = useRef(null);
    const [Users, setUsers] = useState([])
    const [AllUsers, setAllUsers] = useState({})
    const [CreateGroupPenel, setCreateGroupPenel] = useState(false)
    const dispatch = useDispatch()
    const [GroupName, setGroupName] = useState("")

    const handleMouseWheel = (e) => {
        if (containerRef.current) {
            const scrollAmount = .5;
            containerRef.current.scrollLeft += e.deltaY * scrollAmount;
        }
    };

    const SearchPerson = async (event) => {
        const search = event.target.value

        if (search === "") {
            setUsers([])
        } else {

            const response = await fetch(`/api/user?search=${search}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            const data = await response.json()

            if (response.status === 200) {
                setUsers(data)
            }
        }

    }

    const SetUserList = (id, name, profile_pic) => {
        setAllUsers({ ...AllUsers, [id]: { id, name, profile_pic } });
    }

    const removeUser = (id) => {
        const updatedUsers = { ...AllUsers };
        delete updatedUsers[id];
        setAllUsers(updatedUsers);
    };

    // 

    const CreateGroupFunction = async () => {
        const name = GroupName
        const users = Object.keys(AllUsers)
        const response = await fetch(`/api/createGroup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,users
            })
        });
    }
    return (
        <>
            <div className='w-full h-full flex flex-col px-5 py-8'>
                <div className='w-full h-[40px] flex items-center'>
                    <div className='w-5 h-5 bg-slate-300 absolute top-[5px] left-[5px] rounded-full flex justify-center items-center cursor-pointer hover:bg-rose-400 duration-200 hover:text-white' onClick={() => { dispatch(closeCreateGroup()) }}>
                        <RxCross2 />
                    </div>
                    <input type="text" className='h-[40px] w-full rounded bg-slate-500 px-2 text-sm text-white outline-none' placeholder='Search People' onChange={SearchPerson} />
                </div>
                <div ref={containerRef}
                    className={`w-full h-[110px] bg-slate-500 mt-5 flex overflow-x-scroll overflow-y-hidden py-2 duration-200 GroupChatCreate pl-2`}
                    onWheel={handleMouseWheel}
                >
                    {
                        Object.values(AllUsers).map((data, index) => {
                            return (
                                <div key={index} className='w-[50px] h-auto mr-5 relative'>
                                    <div className='h-[50px] w-[50px] rounded-full overflow-hidden '>
                                        <Avatar size="50" style={{ fontSize: 40, borderRadius: 100 }} color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])} name={data.name} />
                                    </div>
                                    <div className='w-[50px] text-sm font-semibold text-white text-center mt-1'>
                                        {data.name}
                                    </div>
                                    <div className='w-5 h-5 bg-slate-300 absolute top-[-5px] right-0 rounded-full flex justify-center items-center cursor-pointer hover:bg-rose-400 duration-200 hover:text-white' onClick={() => { removeUser(data.id) }}>
                                        <RxCross2 />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='w-full flex-1 my-5 bg-slate-800'>
                    {
                        Users.map((data, index) => {
                            return (
                                <div key={index} className='w-full h-16 bg-slate-500 flex items-center mb-2 cursor-pointer' onClick={() => { SetUserList(data._id, data.name, data.profile_pic) }}>
                                    <div className='ml-4'>
                                        <div className='h-[40px] rounded-full overflow-hidden w-[40px] mr-3'>

                                            <Avatar size="40" style={{ fontSize: 40, borderRadius: 100 }} color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])} name={data.name} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className='text-white font-bold'>
                                            {data.name}
                                        </div>
                                        {/* <div className='text-white text-sm'>
                                    </div> */}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='w-full h-10'>
                    <button className={`w-full h-10  ${Object.keys(AllUsers).length < 1 ? "bg-slate-400" : "bg-cyan-500"} rounded-full text-white text-sm font-semibold`} onClick={() => { Object.keys(AllUsers).length < 2 ? alert("Minumum Select 2 Person") : setCreateGroupPenel(true) }}>Create Group</button>
                </div>
            </div>
            {
                CreateGroupPenel === true ? <div className='w-full h-full flex items-center scroll_page_bg_style absolute p-4'>
                    <div className='w-full h-[190px] bg-slate-400 px-3 p-5 rounded relative'>
                        <div className='text-sm font-semibold mb-3'>
                            Insert Group Name
                        </div>
                        <input type="text" className='w-full h-10 outline-none rounded' onChange={(e) => { setGroupName(e.target.value) }} />
                        <div className='w-full h-10'>
                            <button className='w-full h-10 bg-cyan-600 rounded-full text-white text-sm font-semibold mt-5' onClick={CreateGroupFunction}>Create Group</button>
                        </div>
                        <div className='w-5 h-5 bg-slate-300 absolute top-[-5px] right-[-5px] rounded-full flex justify-center items-center cursor-pointer hover:bg-rose-400 duration-200 hover:text-white' onClick={() => { setCreateGroupPenel(false) }}>
                            <RxCross2 />
                        </div>
                    </div>
                </div> :
                    null
            }

        </>
    )
}

export default SliderCreateGroup