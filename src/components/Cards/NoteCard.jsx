import React, { useState } from 'react';
import { motion } from 'framer-motion';
import moment from "moment";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags = [],
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate vibrant background gradient based on title with indigo theme
  const generateCardGradient = (title) => {
    // Create a hash from the title to get consistent colors for the same titles
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Base indigo hue (around 240-260)
    const baseHue = 245;
    
    // Variation based on title hash but staying within indigo family
    const primaryHue = baseHue + (hash % 30) - 15; // Range from 230 to 260
    const secondaryHue = primaryHue + 15;
    
    return {
      background: `linear-gradient(135deg, 
        hsla(${primaryHue}, 85%, 95%, 0.9) 0%, 
        hsla(${secondaryHue}, 70%, 98%, 0.95) 100%)`,
      borderLeft: `4px solid hsla(${primaryHue}, 80%, 60%, 1)`
    };
  };

  const cardStyle = generateCardGradient(title);
  
  // Card animation variants
  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { 
      y: -5,
      boxShadow: "0 10px 25px rgba(79, 70, 229, 0.15)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.98 }
  };
  
  // Pin animation variants with indigo glow effect
  const pinVariants = {
    unpinned: { rotate: 0, scale: 1, filter: "drop-shadow(0 0 0px rgba(79, 70, 229, 0))" },
    pinned: { 
      rotate: [0, -45, 0], 
      scale: [1, 1.3, 1],
      filter: "drop-shadow(0 0 2px rgba(79, 70, 229, 0.5))",
      transition: { duration: 0.5 }
    },
    hover: { 
      scale: 1.2,
      filter: "drop-shadow(0 0 3px rgba(79, 70, 229, 0.7))",
      transition: { type: "spring", stiffness: 500 }
    }
  };
  
  // Button animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.2,
      transition: { type: "spring", stiffness: 500 }
    }
  };
  
  // Truncate content with ellipsis
  const truncateContent = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
  };

  return (
    <motion.div 
      className="rounded-lg overflow-hidden shadow-md"
      style={cardStyle}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h6 className="text-lg font-bold text-indigo-900">{title}</h6>
            <span className="text-xs font-medium text-indigo-500">
              {moment(date).format("Do MMM YYYY")}
            </span>
          </div>
          
          <motion.div
            variants={pinVariants}
            animate={isPinned ? "pinned" : "unpinned"}
            whileHover="hover"
          >
            <motion.button
              className={`p-2 rounded-full ${isPinned ? "text-indigo-600 bg-indigo-100" : "text-gray-400 hover:text-indigo-600"}`}
              onClick={onPinNote}
            >
              <MdOutlinePushPin className="text-lg" />
            </motion.button>
          </motion.div>
        </div>
        
        <div className="min-h-16 my-3">
          <p className="text-sm text-indigo-800 leading-relaxed">
            {truncateContent(content, 100)}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-wrap gap-1">
            {tags && tags.map((item, index) => (
              <span 
                key={index}
                className="inline-block text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
              >
                #{item}
              </span>
            ))}
          </div>
          
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: isHovered ? 1 : 0.6 }}
          >
            <motion.button
              className="p-2 rounded-full hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              onClick={onEdit}
              variants={buttonVariants}
              whileHover="hover"
            >
              <MdCreate className="text-lg" />
            </motion.button>
            
            <motion.button
              className="p-2 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors duration-200"
              onClick={onDelete}
              variants={buttonVariants}
              whileHover="hover"
            >
              <MdDelete className="text-lg" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;
