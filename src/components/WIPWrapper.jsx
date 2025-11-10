import React from "react";

const WIPWrapper = ({ children, details = "Parapet & Backlit Positions Not Yet Finalized" }) => {
  return (
    <div className="relative w-full">
      {children}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm overflow-hidden select-none">
        <div className="rotate-[-15deg] text-center space-y-3">
          <div className="bg-yellow-400 text-black font-extrabold text-4xl md:text-5xl px-8 py-4 shadow-lg tracking-wider rounded-md animate-pulse">
            ⚠️ WORK IN PROGRESS ⚠️
          </div>
          <div className="bg-yellow-400 text-black font-semibold text-2xl md:text-3xl px-6 py-3 shadow-md tracking-wide rounded-md animate-pulse">
            {details}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WIPWrapper;
