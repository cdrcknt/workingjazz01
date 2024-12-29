import React from 'react';
import { findModuleById } from './utils/moduleHelpers';
import ModuleHeader from './components/ModuleHeader';
import ModuleBody from './components/ModuleBody';

const ModuleContent = ({ moduleId, user }) => {
  const module = findModuleById(moduleId);

  if (!module) {
    return (
      <div className="p-6 text-center text-gray-600">
        Module not found
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <ModuleHeader title={module.label} userRole={user?.role} />
        <ModuleBody moduleId={moduleId} />
      </div>
    </div>
  );
};

export default ModuleContent;