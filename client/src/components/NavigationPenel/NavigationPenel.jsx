import React, { useEffect, useState } from 'react'
import { HiUserGroup, HiLogout } from "react-icons/hi"
import { BiSolidMessageSquareAdd } from "react-icons/bi"
import { BsPersonCircle } from "react-icons/bs"
import { useDispatch, useSelector } from 'react-redux'
import { closeSearchSlider, openCreateGroup } from '../redux/SliderRedux'
import { MdOutlineManageAccounts } from "react-icons/md"
import Avatar from 'react-avatar'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'


function NavigationPenel() {

    const navigate = useNavigate()

    const [PersonTable, setPersonTable] = useState(false)

    const UserData = useSelector((state) => state.userdetails.userdata)

    const dispatch = useDispatch()

    useEffect(() => {
        console.log(UserData.status)
    }, [])

    const handleLogout = async () => {
        const userId = UserData._id
        const response = await fetch(
            '/api/logout',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId
                })
            }
        );
        if (response.status === 200) {
            navigate("/")
        } else if (response.status) {
            Swal.fire(
                'Ivalid',
                'Ivalid Logout',
                'error'
            )
        }
    }

    // console.log()

    return (
        <>
            <div className='xl:w-[350px] lg:w-[300px] sm:w-[250px] h-full bg-slate-700 border-slate-900 lg:border-r relative'>
                <div className='w-full h-full flex justify-between items-center px-5'>
                    <div className="relative">
                        <div className="relative">
                            <img className="w-10 h-10 rounded-full" src={UserData.profile_pic} alt="" />
                            <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                        </div>
                    </div>
                    <div className='flex items-center text-slate-300' onClick={() => { dispatch(openCreateGroup()) }}>
                        <div className='text-[27px] hover:bg-slate-500 rounded cursor-pointer duration-300'>
                            <HiUserGroup />
                        </div>
                        <div className='text-[25px] ml-5'>
                            <BiSolidMessageSquareAdd />
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-1 h-full flex justify-between items-center px-5' onClick={() => { dispatch(closeSearchSlider()) }}>
                <div className='flex items-center'>
                    {/* <div className="relative flex justify-center items-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mr-5">
                        <div className='h-full rounded-full overflow-hidden w-full bg-red-500'>
                            {
                                UserData.profile_pic === "" ?
                                    <Avatar size="40" style={{ fontSize: 40, borderRadius: 100 }} color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])} name={"lk"} />
                                    :
                                    <img className='w-full h-auto' src={UserData.profile_pic} />
                            }
                        </div>
                    </div> */}
                    <div className='text-white font-semibold'>
                        {UserData.name}
                    </div>
                </div>
                <div className='text-2xl text-slate-300'>
                    <BsPersonCircle className={`cursor-pointer hover:text-cyan-500 duration-300 ${PersonTable === true ? "text-cyan-500" : "text-slate-300"}`} onClick={() => { setPersonTable(!PersonTable) }} />
                    <div className={`bg-slate-200 w-[200px] h-auto absolute z-50 right-2 rounded-lg px-8 py-8 ${PersonTable === true ? "top-16" : "top-[-500px]"} duration-300 select-none`}>
                        <div className='w-full h-full text-base text-slate-950'>
                            <div className='w-full flex justify-center items-center bg-slate-400 rounded-xl h-10 cursor-pointer'>
                                <div className='text-2xl'>
                                    <MdOutlineManageAccounts />
                                </div>
                                <div>
                                    Profile
                                </div>
                            </div>
                            <div className='w-full flex items-center justify-center bg-slate-400 rounded-xl h-10 mt-4 cursor-pointer'>
                                <div className='text-2xl'>
                                    <HiLogout />
                                </div>
                                <div onClick={handleLogout}>
                                    Log Out
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavigationPenel