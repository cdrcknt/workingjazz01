import React from 'react';
import ModuleHeader from './ModuleHeader';

const ModuleWrapper = ({ title, userRole, children }) => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <ModuleHeader title={title} userRole={userRole} />
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default ModuleWrapper;