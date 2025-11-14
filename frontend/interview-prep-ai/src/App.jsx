import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';


import LandingPage from "./pages/Home/LandingPage.jsx";
import Dashboard from "./pages/Home/Dashboard.jsx";
import Interviewprep from "./pages/InterviewPrep/InterviewPrep.jsx";
import UserProvider from './context/userContext.jsx';


const App = () => {
  return (
    <>

    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Deafult Route */}
            <Route path='/' element={<LandingPage />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview-prep/:sessionId" element={<Interviewprep />} />
          </Routes>
        </Router>

        <Toaster toastOptions={{
          className: "",
          style: {
            fontSize: '13px',
          },
        }} 
      />
      </div>
    </UserProvider>
    </>
  )
}

export default App
