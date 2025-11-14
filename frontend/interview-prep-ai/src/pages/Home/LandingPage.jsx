import React, { useContext, useState } from 'react';
import { APP_FEATURES } from '../../utils/data';
import { useNavigate } from 'react-router-dom';
import { LuSparkles } from "react-icons/lu";
import dashboard from "../../assets/newdash.png";
import Modal from '../../components/Modal';
import Login from "../Auth/Login.jsx";
import SignUp from "../Auth/SignUp.jsx";
import { UserContext } from '../../context/userContext.jsx';
import ProfileInfoCard from '../../components/Cards/ProfileInfoCard.jsx';

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) setOpenAuthModal(true);
    else navigate("/dashboard");
  };

  return (
    <>
      {/* Background */}
      <div className="relative w-full min-h-screen bg-gradient-to-br from-[#F5EBFF] via-[#F8E9F3] to-[#E6E9FF] overflow-hidden">

        {/* Soft light blobs */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#E9D5FF]/40 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-[#FBCFE8]/30 blur-[100px] rounded-full" />

        <div className="container mx-auto px-4 pt-6 pb-[40px] relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#F472B6] bg-clip-text text-transparent drop-shadow-sm">
              Interview Preparation AI
            </div>

            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-gradient-to-r from-[#C084FC] to-[#F9A8D4] text-sm font-semibold text-white px-7 py-2.5 rounded-full border border-white/50 shadow-sm hover:bg-white/60 transition-all"
                onClick={() => setOpenAuthModal(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
              <div className="flex items-center mb-2">
                <div className="flex items-center gap-2 text-[13px] text-[#7C3AED] font-semibold bg-white/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/40 shadow-sm">
                  <LuSparkles /> AI Powered
                </div>
              </div>

              <h1 className="text-5xl font-semibold mb-6 leading-tight text-[#3B3B58]">
                Ace Interviews with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] to-[#F9A8D4] font-bold">
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>

            <div className="w-full md:w-1/2">
              <p className="text-[17px] text-gray-700 mr-0 md:mr-20 mb-6">
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way.
                From preparation to mastery – your ultimate interview toolkit is here.
              </p>
              <button
                className="bg-gradient-to-r from-[#C084FC] to-[#F9A8D4] text-sm font-semibold text-white px-7 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      

      {/* Dashboard Image Section */}
      <div className="w-full min-h-full relative z-10 bg-gradient-to-b from-[#F9F5FF] to-[#FDF2F8] backdrop-blur-xl">
        <section className="flex items-center justify-center">
          <img
            src={dashboard}
            alt="Dashboard Preview"
            className="w-[80vw] rounded-3xl bg-white/40 backdrop-blur-md p-6 shadow-md hover:shadow-lg border border-white/40 transition-all"
          />
        </section>

        {/* Features Section */}
        <div className="container mx-auto px-4 pt-10 pb-20">
          <section className="mt-5">
            <h2 className="text-4xl font-medium text-center mb-12 bg-gradient-to-r from-[#A78BFA] to-[#F472B6] bg-clip-text text-transparent">
              Features That Make You Shine
            </h2>

            <div className="flex flex-col items-center gap-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {APP_FEATURES.slice(0, 3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/50 hover:border-[#cb95f7] hover:shadow-[#e3ccfc] hover:shadow-xl transition-all"
                  >
                    <h3 className="text-base font-semibold mb-3 text-[#6B4EFF]">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
                {APP_FEATURES.slice(3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/50 hover:border-[#cb95f7] hover:shadow-[#e3ccfc] hover:shadow-xl transition-all"
                  >
                    <h3 className="text-base font-semibold mb-3 text-[#6B4EFF]">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="text-sm bg-white/40 backdrop-blur-md text-[#5B4E77] text-center p-5 mt-5 border-t border-white/30 shadow-inner">
          Made with 💜 by Prakriti
        </div>
      </div>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
        </div>
      </Modal>
      </div>
    </>
  );
};

export default LandingPage;
