import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowBack } from 'react-icons/io'
import { RotatingLines } from 'react-loader-spinner';
import { toast } from 'react-toastify'
import Avatar from 'react-avatar';
import { closeSearchSlider } from './components/redux/SliderRedux'
import { fetchUserDetails } from './components/redux/UserRedux'
import { fetchChatsAsync } from './components/redux/ChattingRedux'
import SliderSearchPerson from './components/SliderSearchPerson/SliderSearchPerson'
import SliderCreateGroup from './components/SliderCreateGroup/SliderCreateGroup';
import { useNavigate } from 'react-router-dom';
import NavigationPenel from './components/NavigationPenel/NavigationPenel';



function HomePageLoading() {
    const navigate = useNavigate()
    const SearchSlider = useSelector((state) => state.slider.searchSlider)
    const Chattingloading = useSelector((state) => state.chatting.loading)
    const createGroupStatus = useSelector((state) => state.slider.createGroup)
    const UserData = useSelector((state) => state.userdetails.userdata)
    // const loading = useSelector((state) => state.userdetails.loading)
    const [Users, setUsers] = useState([])
    const [loading, setloading] = useState(true)
    const dispatch = useDispatch()

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

    const addPersonChat = async (id) => {
        const response = await fetch(`/api/chat`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id })
            }
        )
        const data = await response.json()
        const resstatus = response.status

        if (resstatus === 200) {
            dispatch(fetchChatsAsync())
            dispatch(closeSearchSlider())
        } else {
            toast(`Something went wrong`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    useEffect(() => {
        setloading(true)
        // dispatch(fetchUserDetails())
        dispatch(fetchChatsAsync())
        dispatch(fetchUserDetails())
            .then((result) => {
                if (result.payload.Status === 401) {
                    // console.log(result.payload)

                    setTimeout(() => {
                        // navigate('/');
                        // setloading(false)
                    }, 2000);
                }
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    }, [])

    return (

        <>
            <div className='2xl:container relative  mx-auto w-full h-[90%] bg-slate-800 rounded-lg flex-col flex overflow-hidden'>

                {/* Navigation Penel */}
                <div className='w-full h-[60px] relative bg-slate-800 z-50 border-slate-900 border-b flex  overflow-hidden'>
                    <div className='w-full h-full loader-circle'>

                    </div>
                </div>

                {/* SideBar And Chatting Feild */}

                <div className='flex-1 h-full relative flex overflow-hidden'>
                    <div className='xl:w-[350px] lg:w-[300px] sm:w-[250px] left-[-1000px] lg:left-0 h-full bg-slate-800 border-slate-900 border-r flex flex-col'>
                        <div className='w-full h-full loader-circle'>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePageLoading