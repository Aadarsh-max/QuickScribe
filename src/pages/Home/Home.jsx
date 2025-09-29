import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/NavigationBar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd, MdOutlineNotes } from "react-icons/md";
import AddEditNotes from './AddEditNotes';
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNotesImg from "../../assets/images/add-note.svg";
import NoDataImg from "../../assets/images/no-data.svg";

const Home = () => {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null,
    });

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: "add",
    });

    const [allNotes, setAllNotes] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [isSearch, setIsSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const handleEdit = (noteDetails) => {
        setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
    };

    const showToastMessage = (message, type) => {
        setShowToastMsg({ isShown: true, message, type });
    };

    const handleCloseToast = () => {
        setShowToastMsg({ isShown: false, message: "" });
    };

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data?.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    const getAllNotes = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get("/get-all-notes");
            if (response.data?.notes) {
                setTimeout(() => {
                    setAllNotes(response.data.notes);
                    setIsLoading(false);
                }, 500);
            }
        } catch (error) {
            console.log("An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    const deleteNote = async (data) => {
        try {
            const response = await axiosInstance.delete(`/delete-note/${data._id}`);
            if (response.data && !response.data.error) {
                showToastMessage("Note Deleted Successfully", 'delete');
                getAllNotes();
            }
        } catch (error) {
            console.log("An unexpected error occurred.");
        }
    };

    const onSearchNote = async (query) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get("/search-notes", { params: { query } });
            if (response.data?.notes) {
                setIsSearch(true);
                setTimeout(() => {
                    setAllNotes(response.data.notes);
                    setIsLoading(false);
                }, 500);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const updateIsPinned = async (noteData) => {
        try {
            const response = await axiosInstance.put(`/update-note-pinned/${noteData._id}`, {
                isPinned: !noteData.isPinned,
            });
            if (response.data?.note) {
                showToastMessage("Note Updated Successfully");
                getAllNotes();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClearSearch = () => {
        setIsSearch(false);
        getAllNotes();
    };

    useEffect(() => {
        getAllNotes();
        getUserInfo();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100, damping: 12 }
        }
    };

    const buttonVariants = {
        rest: { scale: 1 },
        hover: {
            scale: 1.1,
            rotate: 90,
            boxShadow: "0px 4px 20px rgba(79, 70, 229, 0.5)",
            transition: { duration: 0.3 }
        },
        tap: { scale: 0.95 }
    };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10">
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

            <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-10 max-w-screen-xl mx-auto">
                <div className="mb-4 sm:mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center"
                    >
                        <MdOutlineNotes className="text-2xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mr-2 sm:mr-3" />
                        <h1 className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-400">My Notes</h1>
                    </motion.div>
                    <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full mt-2 shadow-lg shadow-purple-500/50" />
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-48 sm:h-64">
                        <div className="relative">
                            <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500" />
                            <div className="absolute inset-0 animate-ping w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-500/20" />
                        </div>
                    </div>
                ) : allNotes.length > 0 ? (
                    <motion.div
                        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {allNotes.map((item) => (
                                <motion.div
                                    key={item._id}
                                    variants={cardVariants}
                                    layout
                                    exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                                >
                                    <NoteCard
                                        title={item.title}
                                        date={item.createdOn}
                                        content={item.content}
                                        tags={item.tags}
                                        isPinned={item.isPinned}
                                        onEdit={() => handleEdit(item)}
                                        onDelete={() => deleteNote(item)}
                                        onPinNote={() => updateIsPinned(item)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-br from-purple-900/30 via-gray-900/50 to-cyan-900/30 backdrop-blur-xl p-4 sm:p-8 rounded-2xl shadow-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                    >
                        <EmptyCard
                            imgSrc={isSearch ? NoDataImg : AddNotesImg}
                            message={
                                isSearch
                                    ? `Oops! No notes found matching your search.`
                                    : `Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, and reminders. Let's get started!`
                            }
                        />
                    </motion.div>
                )}
            </div>

            <motion.button
                className='w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white shadow-2xl shadow-purple-500/50 fixed right-3 bottom-3 sm:right-10 sm:bottom-10 z-10 ring-2 sm:ring-4 ring-purple-400/30 hover:ring-purple-400/60 transition-all duration-300'
                onClick={() => {
                    setOpenAddEditModal({ isShown: true, type: "add", data: null });
                }}
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
            >
                <MdAdd className='text-xl sm:text-3xl' />
            </motion.button>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => {
                    setOpenAddEditModal({ isShown: false, type: "add", data: null });
                }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.85)",
                        backdropFilter: "blur(8px)",
                        zIndex: 20
                    },
                }}
                contentLabel=""
                className="w-[95%] sm:w-3/4 lg:w-2/5 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-2xl mx-auto mt-4 sm:mt-10 p-3 sm:p-6 shadow-2xl border border-purple-500/30 outline-none"
            >
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
                    getAllNotes={getAllNotes}
                    showToastMessage={showToastMessage}
                />
            </Modal>

            <AnimatePresence>
                {showToastMsg.isShown && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-16 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-50 w-[90%] sm:w-auto"
                    >
                        <Toast
                            isShown={showToastMsg.isShown}
                            message={showToastMsg.message}
                            type={showToastMsg.type}
                            onClose={handleCloseToast}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
);
};

export default Home;
