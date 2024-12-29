import React from 'react';

const AuthInput = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
      </div>
      <input
        {...props}
        className="w-full px-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder:text-gray-400
        focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all duration-200
        hover:bg-gray-50/70"
      />
    </div>
  );
};

export default AuthInput;