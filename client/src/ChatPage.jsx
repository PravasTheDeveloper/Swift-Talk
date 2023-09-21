import React, { useEffect, useState } from 'react'
import NavigationPenel from './components/NavigationPenel/NavigationPenel'
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

function ChatPage() {

  const SearchSlider = useSelector((state) => state.slider.searchSlider)
  const Chattingloading = useSelector((state) => state.chatting.loading)
  const createGroupStatus = useSelector((state) => state.slider.createGroup)
  const [Users, setUsers] = useState([])

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
    dispatch(fetchUserDetails())
    dispatch(fetchChatsAsync())
  }, [])

  return (
    <>
      <div className='w-full h-screen bg-slate-900 flex flex-col py-5 px-10 2xl:px-0 '>
        <div className='2xl:container relative  mx-auto w-full h-full bg-slate-800 rounded-lg flex-col flex overflow-hidden'>

          {/* Navigation Penel */}
          <div className='w-full h-[60px] relative bg-slate-700 z-50 border-slate-900 border-b flex'>
            <NavigationPenel />
          </div>

          {/* SideBar And Chatting Feild */}

          <SliderSearchPerson />

          {/* Search Option People */}

          <div className={`h-full w-[350px] absolute  z-50 ${SearchSlider === true ? "left-0" : "left-[-400px]"} duration-300 flex flex-col`}>
            <div className='w-full h-[60px] relative bg-slate-700 border-slate-900 border-b flex justify-center items-center px-5'>
              <div className='text-2xl text-white w-10 h-10 flex justify-center items-center left-0 cursor-pointer' onClick={() => { dispatch(closeSearchSlider()); setUsers([]) }}>
                <IoIosArrowBack />
              </div>
              <input type="text" className='h-[40px] w-full rounded bg-slate-500 px-2 text-sm text-white outline-none' onChange={SearchPerson} placeholder='Search People' />
            </div>
            <div className='w-full flex-1 bg-slate-700 p-10'>
              <div className='w-full h-full'>
                {
                  Users.map((data, index) => {
                    return (
                      <div className='w-full h-16 bg-slate-500 flex items-center px-3 mb-2' onClick={() => { addPersonChat(data._id) }}>
                        <div className='h-[40px] rounded-full overflow-hidden w-[40px] mr-3'>
                          {data.profile_pic.length > 0 ? <img src={data.profile_pic} alt="" /> : <Avatar size="40" style={{ fontSize: 40, borderRadius: 100 }} color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])} name={data.name} />}
                        </div>
                        <dir className="text-white">
                          <div className='font-bold'>
                            {data.name}
                          </div>
                          <div className='text-sm'>
                            {data.email}
                          </div>
                        </dir>
                      </div>
                    )
                  })
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
          </div>

          <div className={`h-full bg-slate-700 w-[350px] absolute z-50 ${createGroupStatus === true ? "left-0" : "left-[-400px]" }  duration-300 flex flex-col border-r border-slate-900`}>
            <SliderCreateGroup />
          </div>

        </div>

      </div>
    </>
  )
}


export default ChatPage