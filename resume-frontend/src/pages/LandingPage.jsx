import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import HERO_IMG from '../assets/HERO_IMG.png';
import { CardDemo } from '../components/ui/card-demo';
import SignUp from './Auth/SignUp';
import Modal from '../components/ResTemplates/Modal';
import { UserContext } from '../context/UserContext.jsx';
import ProfileInfoCard from '../components/Cards/ProfileInfoCard.jsx';

const LandingPage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [openAuthModal, setOpenAuthModal] = useState(false);
    const [currentPage, setCurrentPage] = useState("login"); // 'login' or 'signup'

    const handleCTA = () => {
        if (user) {
            navigate("/dashboard");
        } else {
            setOpenAuthModal(true);
            setCurrentPage("login");
        }
    };

    return (
        <div className='w-full min-h-full bg-white pb-50'>
            <div className='container mx-auto px-4 py-6'>
                {/*header*/}
                <header className='flex justify-between items-center mb-16'>
                    <div className='text-xl font-bold'>REMUS</div>
                    {user ? (
                        <ProfileInfoCard />
                    ) : (<button
                        className='bg-yellow-100 text-sm font-semibold text-black px-7 py-2.5 rounded-lg hover:bg-yellow-200 transition-colors cursor-pointer'
                        onClick={() => setOpenAuthModal(true)}
                    >
                        Login / Sign Up

                    </button>
                    )}
                </header>

                {/*hero section*/}
                <div className='flex flex-col md:flex-row items-center'>
                    <div className='w-full md:w-1/2 pr-4 mb-8 md:mb-0'>
                        <h1 className='text-5xl font-bold mb-6 leading-tight'>
                            Build your {""}
                            <span className='text-transparent bg-clip-text bg-[radial-gradient(circle,_#FBBF24_0%,_#F59E0B_100%)] bg-[length: 200%_200%] animate-text-shine'>
                                professional resume in minutes
                            </span>

                        </h1>
                        <p className='text-lg text-gray-700 mb-8'>
                            Create a standout resume that gets you noticed by employers.
                            Our easy-to-use resume builder helps you craft a professional resume in minutes.
                        </p>
                        <button
                            className='bg-black text-sm font-semibold text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer'
                            onClick={handleCTA}
                        >
                            Get Started
                        </button>
                    </div>
                    <div className='w-full md:w-1/2'>
                        <img src={HERO_IMG} alt="Hero Image" className='w-full rounded-lg' />
                    </div>
                </div>

                <section className='mt-15'>
                    <h2 className='text-2xl font-bold mb-6 text-center'>
                        Features that make resume building easy
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
                            <h3 className='text-xl font-semibold mb-4'>
                                Easy to Use
                            </h3>
                            <p className="text-gray-600 mt-2 text-base"> Download in an instant</p>
                        </div>

                        <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
                            <h3 className=' text-xl font-semibold mb-4'>
                                Unique Templates
                            </h3>
                            <p className='text-gray-600 mt-2 text-base'>Choose from different templates </p>
                        </div>

                        <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
                            <h3 className='text-xl font-semibold mb-4'>
                                ATS Optimized
                            </h3>
                            <p className='text-gray-600 mt-2 text-base'>Get your resume ATS optimized</p>
                        </div>
                    </div>
                </section>
            </div>
            <div className='text-sm text-center text-gray-500 p-8 mt-8'>
                © 2024 Remus. All rights reserved.
            </div>

            <Modal
                isOpen={openAuthModal}
                onClose={() => {
                    setOpenAuthModal(false);
                    setCurrentPage("login");
                }}
                hideHeader
            >
                <div>
                    {currentPage === "login" && <CardDemo setCurrentPage={setCurrentPage} />}
                    {currentPage === "signup" && (<SignUp setCurrentPage={setCurrentPage} />)}
                </div>
            </Modal>
        </div>
    );
};

export default LandingPage;