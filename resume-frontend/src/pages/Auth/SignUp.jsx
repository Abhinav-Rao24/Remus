import React , { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input.jsx'; 
import { validateEmail } from '../../utils/helper.js';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector.jsx';


const SignUp = ({setCurrentPage}) => {

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handleSignUp = async (e)=>{
    e.preventDefault();
    let profileImageUrl = '';

    if(!fullName){
      setError("Full name is required.");
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address.");
      return;
    }
    if(!password){
      setError("Password is required.");
      return;
    }
    setError('');

    //signup api call
    try{

    } catch (error) {

    }
  };

  return (
    <div className='w-full min-h-full bg-white p-3 flex flex-col items-center justify-center'>
      <h3 className='text-lg font-semibold text-black'> Create Account</h3>
      <p className='text-xs text-slate-600 mt-6 mb-4'> Enter details</p>

        <form onSubmit={handleSignUp} >
          <ProfilePhotoSelector image = {profilePic} setImage={setProfilePic} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>

            <Input 
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label='Full Name'
              placeholder='Enter your full name'
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label='Email' 
              placeholder='Enter your email'
              type="text"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label='Password'
              placeholder='Enter your password'
              type="password"
            />
          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>Sign Up</button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <button 
              type = "button"
              className='font-medium text-blue-600 hover:text-blue-800 underline' 
              onClick={() => {
                if (typeof setCurrentPage === 'function') {
                  setCurrentPage("login");
                } else {
                  navigate('/login');
                }
              }}
            >
              Login
            </button>
          </p>
        </form>
    </div>

    );
};

export default SignUp;