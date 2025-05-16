import React, { useEffect, useState } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

const Toast = ({ isShown, message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isShown) {
      setVisible(true);

      const timeout = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out transition
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isShown, onClose]);

  return (
    <div
      className={`fixed top-20 right-6 z-50 transform transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-10px] pointer-events-none"
      }`}
    >
      <div
        className={`min-w-60 bg-white border shadow-lg rounded-md relative overflow-hidden after:w-[5px] after:h-full ${
          type === "delete" ? "after:bg-red-500" : "after:bg-green-500"
        } after:absolute after:left-0 after:top-0 after:rounded-l-md`}
      >
        <div className="flex items-center gap-3 py-2 px-4">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              type === "delete" ? "bg-red-50" : "bg-green-50"
            }`}
          >
            {type === "delete" ? (
              <MdDeleteOutline className="text-xl text-red-500" />
            ) : (
              <LuCheck className="text-xl text-green-500" />
            )}
          </div>
          <p className="text-sm text-slate-800">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
