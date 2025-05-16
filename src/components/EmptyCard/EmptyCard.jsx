import React from "react";

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center">
      <img src={imgSrc} alt="No notes" className="w-60 opacity-90" />

      <p className="w-4/5 sm:w-1/2 text-sm font-medium leading-7 mt-5 text-indigo-600 dark:text-purple-400">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
