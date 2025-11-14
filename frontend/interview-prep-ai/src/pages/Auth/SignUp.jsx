import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import uploadImage from '../../utils/uploadImage';

const SignUp = ({setCurrentPage}) => {
  const [profilePic , setProfilePic] = useState(null);
  const [fullName , setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  //Handle Signup Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";

    console.log("signup form ")

    if(!fullName){
      setError("Please enter full name");
      return;

    }

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }
    if(!password){
      setError("Please enter your password");     
      return;
    } 
    setError("");
    //SignUp API Call

    try{
      //upload image if present
      if( profilePic ) {
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadRes.imageUrl || "";
      }
      
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });

      const {token} = response.data;
      if(token) {
        localStorage.setItem("token" , token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    }
    catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }
    }
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gray-50">

      <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center bg-white border rounded-lg shadow-md">
        <h3 className='text-lg font-semibold text-black'>Creeate an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6" >Join us today by entering your details below</p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
            <Input 
              value={fullName}
              onChange={({target}) => setFullName(target.value)}
              label="Full Name"

              placeholder="John"
              type="text"
            
            />
            <Input 
              value={email}
              onChange={({target}) => setEmail(target.value)}
              label="Email Address"

              placeholder="john@example.com"
              type="text"
            
            />
            <Input 
              value={password}
              onChange={({target}) => setPassword(target.value)}
              label="Password"

              placeholder="minimum 8 characters"
              type="password"
            
            />
          </div>
          {
            error && <p className="text-red-500 text-xs pb-2.5"> {error}</p>
          }
          <button type="submit" className='btn-primary'>SignUP</button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <button className="font-semibold text-[#ac7fdc] underline cursor-pointer" 
              onClick={() => {
                setCurrentPage("login");

              }}>
                Login
            </button>
          </p>
        </form>
      </div>
    </div>
    </>
  )
}

export default SignUp