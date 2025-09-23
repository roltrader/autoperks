import { useState } from "react";
import AdminLogin from "@/components/AdminLogin";
import UnifiedManagementDashboard from "@/components/UnifiedManagementDashboard";

const AdminPage = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLogin = (email: string, password: string) => {
    // Updated admin credentials
    if (email === "info@auto-perks.com" && password === "admin123") {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  if (!isAdminLoggedIn) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return <UnifiedManagementDashboard onLogout={handleAdminLogout} />;
};

export default AdminPage;