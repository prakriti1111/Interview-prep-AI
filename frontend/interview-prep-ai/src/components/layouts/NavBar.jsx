import React from 'react'
import ProfileInfoCard from '../Cards/ProfileInfoCard'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <>
        <div className='h-16 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-2.5 px-4 md:px-20 sticky top top-0 z-30  '>
            <div className='container mx-auto flex items-center justify-between gap-5'>
                <Link to="/dashboard">
                <h2 className='text-xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#F472B6] bg-clip-text text-transparent drop-shadow-sm md:text-2xl  leading-5'>
                    Interview Preperation AI
                </h2>
                </Link>

                <ProfileInfoCard />
            </div>
        </div>
    </>
  )
}

export default NavBar