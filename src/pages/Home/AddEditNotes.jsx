import React, { useState, useEffect } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add animation on mount
  useEffect(() => {
    // Focus on title input when component mounts
    document.getElementById("title-input")?.focus();
  }, []);

  // Add Note
  const addNewNote = async () => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Note
  const editNote = async () => {
    setIsSubmitting(true);
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      document.getElementById("title-input").focus();
      return;
    }

    if (!content) {
      setError("Please enter the content");
      document.getElementById("content-input").focus();
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <motion.div 
      className="relative bg-white rounded-lg shadow-lg p-6 border border-indigo-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 bg-white shadow-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MdClose className="text-xl" />
      </motion.button>

      <div className="flex flex-col gap-2">
        <label className="input-label text-indigo-500 font-medium tracking-wider">TITLE</label>
        <motion.input
          id="title-input"
          type="text"
          className="text-2xl text-slate-800 outline-none border-b-2 border-transparent focus:border-indigo-300 transition-colors"
          placeholder="Study Data Structures"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          whileFocus={{ scale: 1.01 }}
        />
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <label className="input-label text-indigo-500 font-medium tracking-wider">CONTENT</label>
        <motion.textarea
          id="content-input"
          type="text"
          className="text-sm text-slate-700 outline-none bg-indigo-50 p-4 rounded-lg resize-none transition-colors focus:bg-indigo-100 focus:shadow-inner"
          placeholder="Write your note content here..."
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
          whileFocus={{ scale: 1.01 }}
        />
      </div>

      <div className="mt-5">
        <label className="input-label text-indigo-500 font-medium tracking-wider">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && (
        <motion.p 
          className="text-red-500 text-xs pt-4 flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}

      <motion.button
        className={`btn-primary font-medium mt-5 p-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-lg shadow-md ${isSubmitting ? 'opacity-80' : ''}`}
        onClick={handleAddNote}
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {type === "edit" ? "UPDATING..." : "ADDING..."}
          </span>
        ) : (
          <span>{type === "edit" ? "UPDATE" : "ADD"}</span>
        )}
      </motion.button>
    </motion.div>
  );
};

export default AddEditNotes;