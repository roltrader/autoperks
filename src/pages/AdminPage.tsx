import { useState } from "react";
import AdminLogin from "@/components/AdminLogin";
import UnifiedManagementDashboard from "@/components/UnifiedManagementDashboard";

const AdminPage = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLogin = (email: string, password: string) => {
    if (email === "info@auto-perks.com" && password === "admin123") {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  return isAdminLoggedIn ? (
    <UnifiedManagementDashboard onLogout={handleAdminLogout} />
  ) : (
    <AdminLogin onLogin={handleAdminLogin} />
  );
};

export default AdminPage;
