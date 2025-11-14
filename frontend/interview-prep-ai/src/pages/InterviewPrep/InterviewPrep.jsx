import React, { useState } from 'react'
import {useParams} from 'react-router-dom';
import moment from "moment";
import {AnimatePresence , motion} from "framer-motion";
import {LuCircleAlert , LuListCollapse} from "react-icons/lu";
import SpinnerLoader from '../../components/Loaders/SpinnerLoader';
import {toast} from "react-hot-toast";
import { useEffect } from 'react';
import RoleInfoHeader from './components/RoleInfoHeader';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import QuestionCard from '../../components/Cards/QuestionCard';
import AIResponsePreview from './components/AIResponsePreview';
import Drawer from '../../components/Drawer';
import SkeletonLoader from '../../components/Loaders/SkeletonLoader';




const InterviewPrep = () => {

  const {sessionId} = useParams();

  const [sessionData , setSessionData] = useState(null);
  const [errorMsg , setErrorMsg ] = useState("");

  const [openLeanMoreDrawer , setOpenLeanMoreDrawer] = useState(false);
  const [explaination , setExplaination ] = useState(null);

  const [isLoading , setIsLoading ] = useState(false);
  const [isUpdateLoader , setIsUpdateLoader] = useState(false);

  //Fetch session data by session id
  const fetchSessionDetailsById = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );

      if(response.data && response.data.session) {
        setSessionData(response.data.session);
      }
    }
    catch(error){
      console.error("Error: ", error);
    }
  };

  const generateConceptExplaination = async (question) => {
      try{
        setErrorMsg("");
        setExplaination(null);

        setIsLoading(true);
        setOpenLeanMoreDrawer(true);

        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLAINATION,{
          question,
        });
        if(response.data) {
          setExplaination(response.data);
        }
      }
      catch(error) {
        setExplaination(null)
        setErrorMsg("Failed to generate explaination , try again later");
        console.error("Error: " , error);
      }
      finally {
        setIsLoading(false);
      }
  };

  //Pin Question
  const toggleQuestionPinStatus = async (questionId) => {
      try{
        const response = await axiosInstance.post(
          API_PATHS.QUESTION.PIN(questionId)
        );
        console.log(response);

        if(response.data && response.data.question ){
          //toast.success('Question Pinned SuccessFully')
          fetchSessionDetailsById();
        }
      }
      catch(error){
        console.error("Error: " , error);
      }
  };

  //Add more questions to a session
  const uploadMoreQuestions = async () => {
    try{
      setIsUpdateLoader(true);

      //Call AI API to generate questions
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,{
          role: seesionData?.role , 
          experience: sessionData?.experience , 
          topicsToFocus: sessionData?.topicsToFocus , 
          numberOfQuestions: 10 , 
        }
      );

      // Should be array like [{question , answer} , ...]

      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION , 
        {
          sessionId , 
          questions: generatedQuestions , 
        }
      );
      if(response.data) {
        toast.success("Added More Q&A!!");
        fetchSessionDetailsById();
      }
    }
    catch(error){
      if(error.message && error.response.data.message) {
        setError(error.response.data.message);
      }
      else {
        setError("Something went wrong. Please try again.")
      }
    }
    finally {
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if(sessionId) {
      fetchSessionDetailsById();

    }
    return () => {

    };
  } , []);

  return (
    <>
      <DashboardLayout> 
        <RoleInfoHeader
          role={sessionData?.role || ""}
          topicsToFocus={sessionData?.topicsToFocus || ""}
          experience={sessionData?.experience || ""}
          questions={sessionData?.questions?.length || "-"}
          description={sessionData?.description || ""}
          lastUpdate={
            sessionData?.updateAt? moment(sessionData.updateAt).format("Do MMM YYYY")
            : ""
          }
          />
        <div className='container mx-auto pt-4 pb-4 px-4 md:px-15 relative w-full min-h-screen bg-gradient-to-br from-[#e4cefa] via-[#f4dcec] to-[#d9ddf8] overflow-hidden' >
          <h2 className='text-xl font-bold color-black'>
            Interview Questions & Answers
          </h2>
          <div className='grid grid-cols-12 gap-4 mt-5 mb-10'>
            <div
              className={`col-span-12 ${openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-8"}`}
            >
              <AnimatePresence>
                {sessionData?.questions?.map((data , index) => {
                  return(
                    <motion.div
                      key={data._id || index}
                      initial = {{opacity: 0 , y: -20}}
                      animate={{opacity: 1 , y: 0}}
                      exit = {{opacity: 0 , scale: 0.95}}
                      transition={
                        {
                          duration: 0.4,
                          type: "spring",
                          stiffness: 100,
                          delay: index*0.1,
                          damping: 15,

                        }
                      }
                      layout //this is the key prop that animates position changes
                      layoutId={`question-${data._id || index}`}
                    >
                    <>
                      <QuestionCard
                        question={data?.question}
                        answer = {data?.answer}
                        onLeanMore={() => 
                          generateConceptExplaination(data.question)
                        }
                        isPinned={data?.isPinned}
                        onTogglePin={() => toggleQuestionPinStatus(data._id)}
                      />

                    </>

                    {!isLoading && sessionData?.questions?.length == index+1 && (
                      <div className='flex items-center justify-center mt-5'>
                        <button
                          className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer"
                          disabled={isLoading || isUpdateLoader}
                          onClick={uploadMoreQuestions}
                          >
                            {isUpdateLoader ? (
                              <SpinnerLoader />

                            )
                          :
                          (
                            <LuListCollapse className='text-lg' />
                          )
                    }{" "}Load More
                          </button>
                      </div>
                    )}
                  </motion.div>
                )
                })}
              </AnimatePresence>
            </div>

          </div>
          <div>
            <Drawer
              isOpen = {openLeanMoreDrawer}
              onClose={() => setOpenLeanMoreDrawer(false)}
              title = {!isLoading && explaination?.title}
            >
              {errorMsg && (
                <p className='flex gap-2 text-sm text-amber-600 font-medium' >
                  <LuCircleAlert className='mt-1' />{errorMsg}
                </p>
              ) }
              {isLoading && <SkeletonLoader />}
              {!isLoading && explaination && (
                <AIResponsePreview 
                    content={
                      typeof explaination === "object"
                        ? explaination.explanation || explaination.explaination || ""
                        : explaination
                    }
                  />
              )}
              
            </Drawer>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}

export default InterviewPrep 