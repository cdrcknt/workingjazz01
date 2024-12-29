import React from 'react';
import { Coffee } from 'lucide-react';

const AuthCard = ({ children, title, subtitle }) => {
  return (
    <div className="animate-fade-in w-full max-w-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 mb-6 shadow-lg shadow-blue-500/30 animate-pulse-slow">
          <Coffee className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
        <p className="text-gray-600 mt-3 text-lg font-medium">{subtitle}</p>
      </div>
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/70 p-8 space-y-6 border border-gray-100">
        {children}
      </div>
    </div>
  );
};

export default AuthCard;