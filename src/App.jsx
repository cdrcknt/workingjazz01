import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
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
import AddSupplier from './components/modules/supplier/AddSupplier';
import ManageSuppliers from './components/modules/supplier/ManageSuppliers';
import OrderHistory from './components/modules/supplier/OrderHistory';
import CreatePromotion from './components/modules/promotions/CreatePromotion';
import DiscountApplication from './components/modules/promotions/DiscountApplication';
import LoyaltyProgram from './components/modules/promotions/LoyaltyProgram';
import ActivePromotions from './components/modules/promotions/ActivePromotions';
import CustomerOrderEntry from './components/modules/order/CustomerOrderEntry';
import OrderQueue from './components/modules/order/OrderQueue';
import InventoryDashboard from './components/modules/inventory/InventoryDashboard';
import PaymentModule from './components/modules/payment/PaymentModule';
import ReportsModule from './components/modules/reports/ReportsModule';
import SalesReport from './components/modules/reports/SalesReport';
import ProductReport from './components/modules/reports/ProductReport';
import ServiceReport from './components/modules/reports/ServiceReport';
import UserLogs from './components/modules/reports/UserLogs';
import InventoryReport from './components/modules/reports/InventoryReport';
import FinancialSummary from './components/modules/reports/FinancialSummary';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/reset-password" element={<ResetPasswordScreen />} />
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
        <Route path="supplier/add" element={<AddSupplier />} />
        <Route path="supplier/manage" element={<ManageSuppliers />} />
        <Route path="supplier/history" element={<OrderHistory />} />
        <Route path="promotions" element={<ModuleContent moduleId="promotions" />} />
        <Route path="promotions/create" element={<CreatePromotion />} />
        <Route path="promotions/discounts" element={<DiscountApplication />} />
        <Route path="promotions/loyalty" element={<LoyaltyProgram />} />
        <Route path="promotions/active" element={<ActivePromotions />} />
        <Route path="order" element={<ModuleContent moduleId="order" />} />
        <Route path="order/new" element={<CustomerOrderEntry />} />
        <Route path="order/queue" element={<OrderQueue />} />
        <Route path="inventory" element={<InventoryDashboard />} />
        <Route path="payment/*" element={<PaymentModule />} />
        <Route path="reports" element={<ReportsModule />} />
        <Route path="reports/sales" element={<SalesReport />} />
        <Route path="reports/products" element={<ProductReport />} />
        <Route path="reports/services" element={<ServiceReport />} />
        <Route path="reports/user-logs" element={<UserLogs />} />
        <Route path="reports/inventory" element={<InventoryReport />} />
        <Route path="reports/financial" element={<FinancialSummary />} />
      </Route>
    </Routes>
  );
}