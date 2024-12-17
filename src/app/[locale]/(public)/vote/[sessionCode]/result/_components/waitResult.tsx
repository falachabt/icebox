"use client"

import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Sparkles } from 'lucide-react';

const LoadingResults = ({ isResultReady = false }) => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" mt-[16%] h-full bg-gradient-to-br  flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center space-y-8">
          {/* Trophy icon */}
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
            <Trophy className="w-10 h-10 text-gray-800" />
          </div>

          {/* Loading text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              Preparing the winner's podium{dots}
            </h2>
            <p className="text-gray-500">
              Get ready to discover your achievements!
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gray-800 rounded-full" />
          </div>

          {/* Icon row */}
          <div className="flex space-x-4">
            {[Trophy, Crown, Sparkles].map((Icon, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <Icon className="w-6 h-6 text-gray-800" />
              </div>
            ))}
          </div>

          {isResultReady && (
            <button className="mt-4 px-8 py-3 rounded-xl bg-gray-800 text-white font-medium
                             hover:bg-gray-900 transition-all focus:outline-none focus:ring-2 
                             focus:ring-gray-300 focus:ring-offset-2">
              View Results
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingResults;