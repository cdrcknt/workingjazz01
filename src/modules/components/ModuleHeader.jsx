import React from 'react';

const ModuleHeader = ({ title, userRole }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-semibold text-blue-600">{title}</h2>
    <div className="text-sm text-gray-500">
      {userRole === 'admin' ? 'Admin Access' : 'Employee Access'}
    </div>
  </div>
);

export default ModuleHeader;