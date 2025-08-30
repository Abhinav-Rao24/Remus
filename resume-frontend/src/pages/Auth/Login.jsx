// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = ({setCurrentPage}) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const handleLogin = async (e) => {

//   return (
//     <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
//       <h3 className='text-lg font-semibold text-black'> Welcome Back </h3>
//       <p className='text-xs text-slate-700 mt-[5px] mb-6'>
//         Enter your details to login
//       </p>
//       <form onSubmit={handleLogin}>
//         <input
//           value={email}
//           onChange={({ target }) => setEmail(target.value)}
//           label='Email'
//           placeholder='Enter your email' 
//           type="text" />

//         {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
//         <button type='submit' className='btn-primary w-full mb-4'>
//           LOGIN
//         </button>
//         <p className='font-medium text-primary underline cursor-pointer'> Dont have an account?{" "} 
//           <button className='' onClick={() => setCurrentPage("signup")}>
//             Sign Up
//           </button>
//         </p>
//       </form>
//     </div>
//   )
// }
// }

// export default Login;
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input.jsx'; 
import { validateEmail } from '../../utils/helper.js';
import { UserContext } from '../../context/UserContext.jsx';
import axiosInstance from '../../utils/AxiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
//import AuthCard from '../layouts/AuthCard.jsx';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext);

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if(!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if(!password) {
      setError("Password is required.");
      return;
    }

    setError('');

    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);
        navigate('/dashboard');
      }


    } catch (error){
     if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
     } else {
        setError("An error occurred. Please try again.");
     }
    }
  };

  return (
  <div className='w-[90vw] md:w-[33vw] p-5 flex flex-col justify-center'>

    <AuthCard title="Login">
      <h3 className='text-lg font-semibold text-black'> Welcome Back </h3>

      <form onSubmit={handleLogin} className="mt-4">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label='Email'
            placeholder='Enter your email'
            type="text"
            className="mb-6 w-full md:w-[95%] border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-1"
          />
          
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label='Password'
            placeholder='Enter your password'
            type="password"
            className="mt-8 w-full md:w-[95%] border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-1"
          />

        <p className='text-xs text-slate-600 mt-6 mb-4'>
          Enter your details to login
        </p>

        {/* Add password input if needed */}
        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary w-full mb-4'>
          LOGIN
        </button>
      </form>

      <div className='font-medium text-primary cursor-pointer text-center mt-2'>
        Don't have an account?{' '}
        <button
          type="button"
          className="inline underline text-blue-600 hover:text-blue-800"
          onClick={() => {
            if (typeof setCurrentPage === 'function') {
              setCurrentPage("signup");
            } else {
              navigate("/signup");
            }
          }}
        >
          Sign Up
        </button>
      </div>
    </AuthCard>

  </div>
);
};

export default Login;