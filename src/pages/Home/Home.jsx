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
        <div className="min-h-screen bg-[#f5f5dc]">
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-screen-xl mx-auto">
                <div className="mb-6 sm:mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center"
                    >
                        <MdOutlineNotes className="text-3xl sm:text-4xl text-indigo-500 mr-2 sm:mr-3" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900">My Notes</h1>
                    </motion.div>
                    <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mt-2" />
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-60 sm:h-64">
                        <div className="animate-pulse w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                    </div>
                ) : allNotes.length > 0 ? (
                    <motion.div
                        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
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
                        className="bg-white bg-opacity-80 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-indigo-100"
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
                className='w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl fixed right-5 bottom-5 sm:right-10 sm:bottom-10 z-10 ring-4 ring-indigo-200'
                onClick={() => {
                    setOpenAddEditModal({ isShown: true, type: "add", data: null });
                }}
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
            >
                <MdAdd className='text-2xl sm:text-3xl' />
            </motion.button>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => {
                    setOpenAddEditModal({ isShown: false, type: "add", data: null });
                }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(49, 46, 129, 0.4)",
                        backdropFilter: "blur(4px)",
                        zIndex: 20
                    },
                }}
                contentLabel=""
                className="w-11/12 sm:w-3/4 lg:w-2/5 max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl mx-auto mt-10 p-4 sm:p-6 shadow-2xl border-none outline-none"
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
                        className="fixed bottom-20 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-50 w-11/12 sm:w-auto"
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
    );
};

export default Home;
