import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

function LoginPage() {

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, password
                })
            })

            const status = response.status

            if (status === 200) {
                navigate("/chat")
            } else {
                Swal.fire(
                    'Invalid',
                    'Email Or Password is Wrong',
                    'error'
                )
            }
        } catch (err) {
            Swal.fire(
                'Invalid',
                'Something went Wrong',
                'error'
            )
        }
    }



    return (
        <>
            <div className='w-full h-auto'>
                <div className='w-full h-[70px] mb-5'>
                    <div className='w-full h-[30px]'>
                        Email *
                    </div>
                    <div className='w-full h-[40px]'>
                        <input type="text" className='w-full h-full rounded-full outline-none px-5 focus:bg-cyan-100 bg-slate-200' onChange={(e) => { setemail(e.target.value) }} placeholder='Enter Your Email' />
                    </div>
                </div>
                <div className='w-full h-[70px] mb-8'>
                    <div className='w-full h-[30px]'>
                        Password *
                    </div>
                    <div className='w-full h-[40px]'>
                        <input type="text" className='w-full h-full rounded-full outline-none px-5 focus:bg-cyan-100 bg-slate-200' onChange={(e) => { setpassword(e.target.value) }} placeholder='Enter Your Password' />
                    </div>
                </div>
                <div className='w-full h-[40px] mb-5'>
                    <button className='h-full w-full bg-cyan-500 rounded-full' onClick={handleSubmit}>Log In</button>
                </div>
                <div className='w-full h-[50px] mb-5 text-center flex items-center justify-center'>
                    Don't Have An Accout ? <span className='text-rose-500 underline'>Sign Up</span>
                </div>
                <div className='w-full h-[50px] text-center flex items-center justify-center'>
                    <span className='text-slate-500 underline'>Forget Password</span>
                </div>

            </div>
        </>
    )
}

export default LoginPage