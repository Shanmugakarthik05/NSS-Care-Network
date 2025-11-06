import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { BloodDonorFinder } from "./components/BloodDonorFinder";
import { HealthCamps } from "./components/HealthCamps";
import { CampDetails } from "./components/CampDetails";
import { EmergencyHelpRequest } from "./components/EmergencyHelpRequest";
import { DisasterReliefModule } from "./components/DisasterReliefModule";
import { LoginRegister } from "./components/LoginRegister";
import { DashboardLayout } from "./components/DashboardLayout";
import { PublicDashboard } from "./components/PublicDashboard";
import { CollegeDashboard } from "./components/CollegeDashboard";
import { HospitalDashboard } from "./components/HospitalDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { SuperAdminDashboard } from "./components/SuperAdminDashboard";
import { VolunteerDashboard } from "./components/VolunteerDashboard";
import { CampEvent } from "./components/EventCard";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { initSampleData } from "./utils/api";
import { Button } from "./components/ui/button";
import { Database, CheckCircle } from "lucide-react";

type Page = 
  | "home" 
  | "blood-finder" 
  | "health-camps" 
  | "camp-details" 
  | "emergency-help"
  | "disaster-relief"
  | "login"
  | "dashboard";

type UserType = "public" | "college" | "hospital" | "admin" | "volunteer" | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [userType, setUserType] = useState<UserType>(null);
  const [selectedCamp, setSelectedCamp] = useState<CampEvent | null>(null);
  const [dashboardTab, setDashboardTab] = useState("home");
  const [showInitButton, setShowInitButton] = useState(true);
  const [initializing, setInitializing] = useState(false);

  const handleInitData = async () => {
    setInitializing(true);
    try {
      await initSampleData();
      toast.success("Sample data initialized in Supabase successfully!", {
        description: "Your database is now ready with sample donors, camps, and missions.",
      });
      setShowInitButton(false);
      localStorage.setItem("nss-data-initialized", "true");
    } catch (error) {
      console.error("Error initializing data:", error);
      toast.error("Failed to initialize data. Please check your Supabase connection.");
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    // Check if data was already initialized
    if (localStorage.getItem("nss-data-initialized")) {
      setShowInitButton(false);
    }
  }, []);

  const handleNavigate = (page: string, data?: any) => {
    if (page === "camp-details" && data) {
      setSelectedCamp(data);
      setCurrentPage("camp-details");
    } else {
      setCurrentPage(page as Page);
    }
    window.scrollTo(0, 0);
  };

  const handleLogin = (type: string) => {
    setUserType(type as UserType);
    setCurrentPage("dashboard");
    setDashboardTab("home");
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentPage("home");
    setDashboardTab("home");
  };

  // If user is logged in and on dashboard, show dashboard layout
  if (currentPage === "dashboard" && userType) {
    let dashboardContent;
    
    switch (userType) {
      case "college":
        dashboardContent = <CollegeDashboard activeTab={dashboardTab} />;
        break;
      case "hospital":
        dashboardContent = <HospitalDashboard activeTab={dashboardTab} />;
        break;
      case "admin":
        dashboardContent = <SuperAdminDashboard activeTab={dashboardTab} />;
        break;
      case "volunteer":
        dashboardContent = <VolunteerDashboard activeTab={dashboardTab} />;
        break;
      case "public":
        dashboardContent = <PublicDashboard activeTab={dashboardTab} />;
        break;
      default:
        dashboardContent = <PublicDashboard activeTab={dashboardTab} />;
    }

    return (
      <>
        <MockDataBanner />
        <DashboardLayout
          userType={userType}
          onLogout={handleLogout}
          activeTab={dashboardTab}
          onTabChange={setDashboardTab}
        >
          {dashboardContent}
        </DashboardLayout>
        <Toaster />
      </>
    );
  }

  // Public pages
  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      {/* Initialize Data Button - Only shows once */}
      {showInitButton && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleInitData}
            disabled={initializing}
            className="bg-gradient-to-r from-[#E63946] to-[#0077B6] hover:opacity-90 shadow-lg text-white"
            size="lg"
          >
            {initializing ? (
              <>
                <Database className="w-5 h-5 mr-2 animate-spin" />
                Initializing Database...
              </>
            ) : (
              <>
                <Database className="w-5 h-5 mr-2" />
                Initialize Sample Data
              </>
            )}
          </Button>
        </div>
      )}
      
      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
      
      {currentPage === "blood-finder" && <BloodDonorFinder />}
      
      {currentPage === "health-camps" && <HealthCamps onNavigate={handleNavigate} />}
      
      {currentPage === "camp-details" && selectedCamp && (
        <CampDetails 
          event={selectedCamp} 
          onBack={() => setCurrentPage("health-camps")} 
        />
      )}
      
      {currentPage === "emergency-help" && <EmergencyHelpRequest />}
      
      {currentPage === "disaster-relief" && <DisasterReliefModule userType={userType} />}
      
      {currentPage === "login" && <LoginRegister onLogin={handleLogin} />}
      
      <Toaster />
    </div>
  );
}
