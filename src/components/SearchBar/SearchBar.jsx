import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-violet-100/70 rounded-md shadow-sm">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-xs bg-transparent py-[11px] text-gray-800 placeholder:text-gray-400 outline-none"
        value={value}
        onChange={onChange}
      />

      {value && (
        <IoMdClose
          className="text-xl text-violet-400 hover:text-violet-600 cursor-pointer transition"
          onClick={onClearSearch}
        />
      )}

      <FaMagnifyingGlass
        className="ml-2 text-violet-400 hover:text-violet-600 cursor-pointer transition"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
