import React, { useEffect, useRef, useState } from 'react'
import { RotatingLines } from 'react-loader-spinner';
import AlertTost from '../AleartTost/AlertTost';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import AvatarEditor from 'react-avatar-editor';


function SignUpPage() {


    const navigate = useNavigate();

    const [loading, setloading] = useState(false);
    const [image, setImage] = useState(null);
    const [ProfilePicBar, setProfilePicBar] = useState(false)
    const editorRef = React.createRef();

    const [UserDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: '',
        c_password: '',
        profile_pic: '',
    });

    const handleImageChange = (e) => {
        setProfilePicBar(true)
        const file = e.target.files[0];
        setImage(URL.createObjectURL(file));
    };


    const PostDetails = async (pics) => {
        try {
            setloading(true);

            const canvas = editorRef.current.getImage();
            const blobPromise = new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    resolve(blob);
                });
            });

            const blob = await blobPromise;

            // Create a File object from the Blob
            const canvasFile = new File([blob], 'canvas_image.png', {
                type: 'image/png', // Set the appropriate MIME type
            });

            const data = new FormData();
            data.append('file', canvasFile);
            data.append('upload_preset', 'swifttalk');
            data.append('cloud_name', 'dxhaelva2');

            const response = await fetch(
                'https://api.cloudinary.com/v1_1/dxhaelva2/image/upload',
                {
                    method: 'POST',
                    body: data,
                }
            );

            if (response.status === 200) {
                const cloudinaryData = await response.json();
                setUserDetails({
                    ...UserDetails,
                    profile_pic: cloudinaryData.url.toString(),
                });
                // setTimeout(() => {

                // }, 2000);
                console.log('Image uploaded successfully.');
            } else {
                const errorData = await response.json();
                console.error('Cloudinary upload failed:', errorData.message);
            }
            // console.log(UserDetails)
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setProfilePicBar(false)
            setloading(false);
        }
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

                        // const data = response.json()

                        if (response.status === 200) {
                            Swal.fire(
                                'REGISTERED',
                                'Your Registration is Successful',
                                'success'
                            )
                            // const data = response.json
                            // localStorage.setItem("userInfo", JSON.stringify(data));
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
                {/* <div className='w-full h-[70px] mb-8'>
                    <div className='w-full h-[40px]'>
                        Upload Your Image <input type="file" accept="image/png, image/jpeg, image/jpg, image/gif" onChange={(e) => {PostDetails(e.target.files[0])}} />
                    </div>
                </div> */}
                <div className='w-full h-[70px] mb-8'>
                    <div className='w-full h-[40px]'>
                        Upload Your Image <input type="file" accept="image/png, image/jpeg, image/jpg, image/gif" onChange={handleImageChange} />
                    </div>
                    <div className={`w-full h-full scroll_page_bg_style absolute top-0 left-0 ${ProfilePicBar ? "flex" : "hidden"} justify-center items-center flex-col`}>
                        {image && (

                            <AvatarEditor
                                ref={editorRef}
                                image={image}
                                width={300}
                                height={300}
                                border={10}
                                color={[255, 255, 255, 0.6]} // Border color and opacity
                                scale={1} // Zoom level
                            />

                        )}
                        {image && <button onClick={PostDetails} className='bg-cyan-500 mt-10 text-lg px-10 py-2 rounded-full'>Save</button>}
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


