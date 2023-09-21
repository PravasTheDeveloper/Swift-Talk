import React, { useState } from 'react'
import { RotatingLines } from 'react-loader-spinner';
import AlertTost from '../AleartTost/AlertTost';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


function SignUpPage() {

    const navigate = useNavigate()

    const [pics, setpics] = useState()
    const [loading, setloading] = useState(false)

    const [UserDetails, setUserDetails] = useState({
        name: "",
        email: "",
        password: "",
        c_password: "",
        profile_pic: ""
    })

    const PostDetails = (pics) => {

        setloading(true)

        if (pics.type === "image/png" || pics.type === "image/gif" || pics.type === "image/jpeg" || pics.type === "image/jpg") {
            const data = new FormData();

            data.append("file", pics);
            data.append("upload_preset", "swifttalk");
            data.append("cloud_name", "dxhaelva2");

            fetch("https://api.cloudinary.com/v1_1/dxhaelva2/image/upload", {
                method: "POST",
                body: data
            }).then((res) => {
                return res.json();
            }).then((data) => {
                setUserDetails({ ...UserDetails, profile_pic: data.url.toString() })
            }).catch(err => {
                console.log(err);
            });

        }
        setTimeout(() => {
            setloading(false)
        }, 1000);
    };

    const handleInput = (e) => {
        let value = e.target.value
        let name = e.target.name

        setUserDetails({ ...UserDetails, [name]: value })
    }

    const PostDataApi = async () => {
        setloading(true)
        const { name, email, password, c_password, profile_pic } = UserDetails

        if (!name || !email || !password || !c_password) {
            toast.error('Please Fill All The Feild', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            if (password !== c_password) {
                toast.warn('Password and Confirm Password must be same', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                if (!UserDetails.profile_pic) {
                    toast.warn('SomeThing Went Wrong', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                } else {
                    try {
                        const response = await fetch("/api/register", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                name, email, password, profile_pic
                            })
                        })

                        if (response.status === 200) {
                            Swal.fire(
                                'REGISTERED',
                                'Your Registration is Successful',
                                'success'
                            )
                            // const data = response.json
                            localStorage.setItem("userInfo", JSON.stringify(data));
                            navigate("/chat")
                        } else if (response.status === 402) {
                            toast.warn('User already Exisist', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                        } else {
                            toast.warn('Something went wrong se console', {
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


                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        }
        setTimeout(() => {
            setloading(false)
        }, 2000);
    }

    console.log(UserDetails)


    return (
        <>
            <div className='w-full h-auto'>
                <div className='w-full h-[70px] mb-5'>
                    <div className='w-full h-[30px]'>
                        Name *
                    </div>
                    <div className='w-full h-[40px]'>
                        <input type="text" className='w-full h-full rounded-full outline-none px-5 focus:bg-cyan-100 bg-slate-200' name='name' onChange={handleInput} value={UserDetails.name} placeholder='Enter Your Name' />
                    </div>
                </div>
                <div className='w-full h-[70px] mb-5'>
                    <div className='w-full h-[30px]'>
                        Email *
                    </div>
                    <div className='w-full h-[40px]'>
                        <input type="text" className='w-full h-full rounded-full outline-none px-5 focus:bg-cyan-100 bg-slate-200' name='email' onChange={handleInput} value={UserDetails.email} placeholder='Enter Your Email' />
                    </div>
                </div>
                <div className='w-full h-[70px] mb-5'>
                    <div className='w-full h-[30px]'>
                        Password *
                    </div>
                    <div className='w-full h-[40px]'>
                        <input type="text" className='w-full h-full rounded-full outline-none px-5 focus:bg-cyan-100 bg-slate-200' name='password' onChange={handleInput} value={UserDetails.password} placeholder='Enter Your Password' />
                    </div>
                </div>
                <div className='w-full h-[70px] mb-8'>
                    <div className='w-full h-[30px]'>
                        Confirm Password *
                    </div>
                    <div className='w-full h-[40px]'>
                        <input type="text" className='w-full h-full rounded-full outline-none px-5 focus:bg-cyan-100 bg-slate-200' name='c_password' onChange={handleInput} value={UserDetails.c_password} placeholder='Enter Your Password' />
                    </div>
                </div>
                <div className='w-full h-[70px] mb-8'>
                    <div className='w-full h-[40px]'>
                        Upload Your Image <input type="file" accept="image/png, image/jpeg, image/jpg, image/gif" onChange={(e) => { PostDetails(e.target.files[0]); }} />
                    </div>
                </div>

                <div className='w-full h-[40px] mb-5'>
                    <button className={`h-full w-full ${loading === true ? "bg-cyan-700" : "bg-cyan-500"} hover:bg-cyan-700 hover:text-white duration-200 rounded-full flex justify-center items-center`} onClick={PostDataApi}>
                        {loading === true ? <RotatingLines
                            strokeColor="#fff"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="30"
                            visible={true}
                        /> :
                            <div>
                                Sign Up
                            </div>
                        }
                    </button>
                </div>
                <div className='w-full h-[50px] mb-5 text-center flex items-center justify-center'>
                    Already Have An Accout ? <span className='text-rose-500 underline'>Log In</span>
                </div>
            </div>
            <AlertTost />
        </>
    )
}

export default SignUpPage