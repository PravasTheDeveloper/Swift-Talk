import React, { useEffect, useState } from 'react'
import LoginPage from './components/LoginSignUpPage/LoginPage'
import SignUpPage from './components/LoginSignUpPage/SignUpPage'
import AlertTost from './components/AleartTost/AlertTost'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserDetails } from './components/redux/UserRedux'
import { useNavigate } from 'react-router-dom'

function HomePage() {

    const [LoginSignUpFunc, setLoginSignUpFunc] = useState(false)

    const userData = useSelector((state) => state.userdetails)
    const navigate = useNavigate()

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchUserDetails())
    }, [])

    if (userData.status === 200) {
        // navigate("/chat")
    } else {
    }

    return (
        <>
            <div className='w-full h-screen home_page_bg_style flex flex-col items-center justify-center'>
                <div className='bg-white min-w-[500px] text-center py-4 text-xl rounded-xl mb-5'>
                    SWIFTTALK
                </div>
                <div className='bg-white min-w-[500px] h-auto p-10 rounded-xl'>
                    <div className='w-full h-[40px] flex text-center mb-10'>
                        <div className='flex-1'>
                            <button className={`${LoginSignUpFunc === false ? "bg-cyan-400" : "bg-slate-300 hover:bg-slate-400 "} w-[150px] h-full rounded-full`} onClick={() => setLoginSignUpFunc(false)}>
                                Login
                            </button>
                        </div>
                        <div className='flex-1'>
                            <button className={`${LoginSignUpFunc === true ? "bg-cyan-400 " : "bg-slate-300 hover:bg-slate-400"} w-[150px] h-full rounded-full`} onClick={() => setLoginSignUpFunc(true)}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                    <div className='w-full h-auto'>
                        {LoginSignUpFunc === false ? <LoginPage /> : <SignUpPage />}
                    </div>
                </div>
            </div>

        </>
    )
}

export default HomePage