import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ModuleItem = ({ icon: Icon, label, isOpen, onClick, children, isActive }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChildClick = (child, event) => {
    event.stopPropagation(); // Prevent triggering parent click
    if (child.path) {
      navigate(`/dashboard${child.path}`);
    }
  };

  const isChildActive = (childPath) => {
    return location.pathname === `/dashboard${childPath}`;
  };

  return (
    <div className="mb-1">
      <button
        onClick={onClick}
        className={`w-full flex items-center p-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 ${
          isActive ? 'bg-blue-50 text-blue-600 font-medium' : ''
        }`}
      >
        <Icon className={`w-5 h-5 mr-2.5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
        <span className="flex-1 text-left">{label}</span>
        {children && (
          isOpen ? 
          <ChevronDown className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} /> : 
          <ChevronRight className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
        )}
      </button>
      {children && isOpen && (
        <div className="ml-6 mt-1 space-y-1">
          {children.map((child, index) => (
            <button
              key={index}
              onClick={(e) => handleChildClick(child, e)}
              className={`w-full flex items-center p-2 text-sm ${
                isChildActive(child.path)
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              } rounded-lg transition-colors duration-200`}
            >
              {child.label || child}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleItem;