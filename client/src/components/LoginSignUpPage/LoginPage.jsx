import React from 'react'

function LoginPage() {
    return (
        <>
            <div className='w-full h-auto'>
                <div className='w-full h-[70px] mb-5'>
                    <div className='w-full h-[30px]'>
                        Email *
                    </div>
                    <div className='w-full h-[40px]'>
                        <input type="text" className='w-full h-full rounded-full outline-none px-5 focus:bg-cyan-100 bg-slate-200' placeholder='Enter Your Email' />
                    </div>
                </div>
                <div className='w-full h-[70px] mb-8'>
                    <div className='w-full h-[30px]'>
                        Password *
                    </div>
                    <div className='w-full h-[40px]'>
                        <input type="text" className='w-full h-full rounded-full outline-none px-5 focus:bg-cyan-100 bg-slate-200' placeholder='Enter Your Password' />
                    </div>
                </div>
                <div className='w-full h-[40px] mb-5'>
                    <button className='h-full w-full bg-cyan-500 rounded-full'>Log In</button>
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