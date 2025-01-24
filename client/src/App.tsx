import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import Dashboard from "./pages/User/Dashboard/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/Admin/Dashboard/Dashboard";
import AdminReports from "./pages/Admin/Reports/Reports";
import AdminNotifications from "./pages/Admin/Notifications/Notifications";
import AdminUserReports from "./pages/Admin/UserReports/UserReports";
import Post from "./pages/User/Post/Post";
import CompanyDashboard from "./pages/Company/CompanyDashboard";
import Model from "./pages/Model/Model";
import RegisterCompany from "./pages/Admin/RegisterCompany/RegisterCompany";

const App = () => {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register-user" element={<RegisterPage />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/users-reports" element={<AdminUserReports />} />
        <Route path="/post" element={<Post />} />
        <Route path="/model" element={<Model />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/admin/add-company" element={<RegisterCompany />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;