import React from 'react';
import { getModuleChildren } from '../utils/moduleHelpers';
import { Link } from 'react-router-dom';

const ModuleBody = ({ moduleId }) => {
  const children = getModuleChildren(moduleId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children.map((child, index) => (
        <Link
          key={index}
          to={child.path}
          className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
        >
          <span className="font-medium text-gray-900">{child.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default ModuleBody;