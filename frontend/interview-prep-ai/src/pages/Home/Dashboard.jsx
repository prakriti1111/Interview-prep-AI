import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu';
import {CARD_BG} from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import SummaryCard from '../../components/Cards/SummaryCard';
import moment from "moment";
import Modal from '../../components/Modal';
import CreateSessionForm from './CreateSessionForm';
import DeleteAlertContent from '../../components/Loaders/DeleteAlertContent';


const Dashboard = () => {

  const navigate = useNavigate();

  const [openCreateModal , setOpenCreateModal] = useState(false);
  const [sessions , setSessions ] = useState([]);

  const [openDeleteAlert , setOpenDeleteAlert ] = useState({
    open: false,
    data: null,
  });

  const fetchAllSession = async () => {
    try{
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data);
    }
    catch(error) {
      console.error("Error fetching session data: ", error);
    }
  };

  const deleteSession = async (sessionData) => {
      try{
        await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));

        toast.success("Session Deleted Successfully");
        setOpenDeleteAlert({
          open: false ,
          data: null , 

        });
        fetchAllSession();
      }
      catch(error) {
        console.error("error deleting session data: ", error);
      }
  };

  useEffect( () => {
    fetchAllSession();
  } , []);

  return (
    <DashboardLayout>
      <div className='relative w-full min-h-screen bg-gradient-to-br from-[#e4cefa] via-[#f4dcec] to-[#d9ddf8] overflow-hidden container mx-auto pt-4 pb-4'>
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#E9D5FF]/40 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-[#FBCFE8]/30 blur-[100px] rounded-full" />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-4'>

          {sessions?.map((data , index ) => (
            <SummaryCard
              key={data?._id}
              colors = {CARD_BG[index % CARD_BG.length]}
              role={data?.role || ""}
              topicsToFocus = {data?.topicsToFocus || ""}
              experience={data?.experience || "-"}
              questions={data?.questions?.length || "-"}
              description={data?.description || ""}
              lastUpdated={
                data?.updateAt ? moment(data.updateAt).format("Do MMM YYYY")
                : ""
              }
              onSelect={() => navigate(`/interview-prep/${data?._id}`)}
              onDelete={() => setOpenDeleteAlert({open : true , data})}
            />

          ))}

        </div>
        <button className='h-12 md:h-12 flex items-center justify-center gap-3 bg-gradient-to-r from-[#C084FC] to-[#F9A8D4] text-sm font-semibold text-white  shadow-md hover:shadow-2xl hover:shadow-purple-300 transition-all  px-7 py-2.5 rounded-full  cursor-pointer  fixed bottom-10 md:bottom-20 right-10 md:right-20' onClick={() => setOpenCreateModal(true)}>
          <LuPlus className='text-2xl text-white' />
            Add New
        </button>
      </div>
      <Modal
        isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
        }}
        hideHeader
      >
        <div>
          <CreateSessionForm />

        </div>
      </Modal>
      <Modal 
      isOpen={openDeleteAlert?.open}
      onClose = {() => {
        setOpenDeleteAlert({ open : false , data: null});

      }}
      title="Delete Alert">
        <div className='w-[30vw]'>
          <DeleteAlertContent 
            content="Are you sure you want to delete this session details?"
            onDelete={() => deleteSession(openDeleteAlert.data)} />
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default Dashboard