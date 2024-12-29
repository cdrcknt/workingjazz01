import { modules } from '../data/moduleConfig';

export const findModuleById = (moduleId) => {
  return modules.find(m => m.id === moduleId);
};

export const getModuleChildren = (moduleId) => {
  const module = findModuleById(moduleId);
  return module?.children || [];
};

export const getModulePath = (moduleId, childPath) => {
  return `/dashboard/${moduleId}${childPath || ''}`;
};