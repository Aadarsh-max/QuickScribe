import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder = "Password" }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center border border-indigo-300 px-4 py-2 rounded-md focus-within:border-purple-500 transition mb-3 bg-white dark:bg-slate-900 dark:border-indigo-600">
      <input
        type={isShowPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-800 dark:text-white outline-none"
      />

      <button
        type="button"
        onClick={toggleShowPassword}
        className="ml-2 focus:outline-none"
        aria-label={isShowPassword ? "Hide password" : "Show password"}
      >
        {isShowPassword ? (
          <FaRegEye className="text-purple-600" size={20} />
        ) : (
          <FaRegEyeSlash className="text-indigo-400" size={20} />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
