import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { findModuleById } from './utils/moduleHelpers';
import ModuleHeader from './components/ModuleHeader';

const ModuleContent = ({ moduleId, user }) => {
  const location = useLocation();
  const module = findModuleById(moduleId);
  const isMainModuleView = location.pathname === `/dashboard/${moduleId}`;

  if (!module) {
    return (
      <div className="p-6 text-center text-gray-600">
        Module not found
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <ModuleHeader title={module.label} userRole={user?.role} />
        
        {isMainModuleView ? (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {module.children?.map((child, index) => {
              const Component = React.lazy(() => import(`../components/modules${child.path}`).catch(() => ({
                default: () => <div>Module not found</div>
              })));

              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{child.label}</h3>
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <Component user={user} />
                    </React.Suspense>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6">
            <Outlet context={{ user }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleContent;