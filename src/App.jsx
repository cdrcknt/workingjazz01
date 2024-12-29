import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import StoreManagementSystem from './components/StoreManagementSystem';
import ModuleContent from './modules/ModuleContent';
import EmployeeRegistration from './components/modules/registration/EmployeeRegistration';
import ProductRegistration from './components/modules/registration/ProductRegistration';
import EmployeeRecords from './components/modules/employee/EmployeeRecords';
import TimeTracking from './components/modules/employee/TimeTracking';
import Scheduling from './components/modules/employee/Scheduling';
import UserManual from './components/modules/help/UserManual';
import AboutSystem from './components/modules/about/AboutSystem';
import AboutDevelopers from './components/modules/about/AboutDevelopers';
import UpdateRecords from './components/modules/maintenance/UpdateRecords';
import Archive from './components/modules/maintenance/Archive';
import Backup from './components/modules/maintenance/Backup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/dashboard/*" element={<StoreManagementSystem />}>
        <Route path="registration" element={<ModuleContent moduleId="registration" />} />
        <Route path="registration/employee" element={<EmployeeRegistration />} />
        <Route path="registration/product" element={<ProductRegistration />} />
        <Route path="employee" element={<ModuleContent moduleId="employee" />} />
        <Route path="employee/records" element={<EmployeeRecords />} />
        <Route path="employee/time-tracking" element={<TimeTracking />} />
        <Route path="employee/scheduling" element={<Scheduling />} />
        <Route path="help/user-manual" element={<UserManual />} />
        <Route path="about/system" element={<AboutSystem />} />
        <Route path="about/developers" element={<AboutDevelopers />} />
        <Route path="maintenance/update-records" element={<UpdateRecords />} />
        <Route path="maintenance/archive" element={<Archive />} />
        <Route path="maintenance/backup" element={<Backup />} />
      </Route>
    </Routes>
  );
}

export default App;