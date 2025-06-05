// import React from "react";

const Legend = () => {
  return (
    <div className="flex justify-end items-center space-x-4">
      <div className="flex items-center space-x-1">
        <div className="w-4 h-4 rounded-full bg-blue-700"></div>
        <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
        <div className="w-4 h-4 rounded-full bg-sky-600"></div>
        <div className="w-4 h-4 rounded-full bg-teal-500"></div>

        <span className="bg-gradient-to-r from-blue-700 via-indigo-600 via-sky-600 to-teal-500 bg-clip-text text-transparent">
          Available
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-4 h-4 rounded-full bg-gray-500"></div>
        <span className="text-gray-700">Taken</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="relative w-4 h-4 rounded-full bg-custom-gray">
          <div className="absolute inset-0 before:content-[''] before:absolute before:w-[2px] before:h-full before:bg-white before:rotate-45 before:top-1/2 before:left-1/2 before:translate-x-[-50%] before:translate-y-[-50%]" />
          <div className="absolute inset-0 after:content-[''] after:absolute after:w-[2px] after:h-full after:bg-white after:-rotate-45 after:top-1/2 after:left-1/2 after:translate-x-[-50%] after:translate-y-[-50%]" />
        </div>
        <span className="text-gray-700">Blocked</span>
      </div>
    </div>
  );
};

export default Legend;
