import { 
  Home, 
  Calendar, 
  Users, 
  Droplet, 
  Settings, 
  LogOut, 
  Bell,
  Menu,
  X,
  Heart,
  BarChart3,
  IdCard,
  MessageSquare
} from "lucide-react";
import { useState, ReactNode } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: string;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardLayout({ 
  children, 
  userType, 
  onLogout,
  activeTab,
  onTabChange
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getNavItems = () => {
    const common = [
      { id: "home", icon: Home, label: "Dashboard" },
      { id: "camps", icon: Calendar, label: "Health Camps" },
      { id: "settings", icon: Settings, label: "Settings" },
    ];

    if (userType === "college") {
      return [
        ...common.slice(0, 1),
        { id: "volunteers", icon: Users, label: "Volunteers" },
        { id: "donors", icon: Droplet, label: "Blood Donors" },
        ...common.slice(1),
      ];
    } else if (userType === "hospital") {
      return [
        ...common.slice(0, 1),
        { id: "blood-requests", icon: Droplet, label: "Blood Requests" },
        ...common.slice(1),
      ];
    } else if (userType === "admin") {
      return [
        { id: "home", icon: Home, label: "Dashboard" },
        { id: "units", icon: Users, label: "Manage Units" },
        { id: "analytics", icon: BarChart3, label: "Analytics" },
        { id: "camps", icon: Calendar, label: "Health Camps" },
        { id: "settings", icon: Settings, label: "Settings" },
      ];
    } else if (userType === "volunteer") {
      return [
        { id: "home", icon: Home, label: "Overview" },
        { id: "digital-id", icon: IdCard, label: "Digital ID" },
        { id: "chat", icon: MessageSquare, label: "Volunteer Chat" },
        { id: "settings", icon: Settings, label: "Settings" },
      ];
    } else if (userType === "public") {
      return common;
    }

    return common;
  };

  const navItems = getNavItems();

  const getUserLabel = () => {
    switch (userType) {
      case "college": return "College NSS Unit";
      case "hospital": return "Hospital Admin";
      case "admin": return "Super Admin";
      case "volunteer": return "NSS Volunteer";
      case "public": return "Public User";
      default: return "User";
    }
  };

  const getUserColor = () => {
    switch (userType) {
      case "college": return "#0077B6";
      case "hospital": return "#E63946";
      case "admin": return "#8B5CF6";
      case "volunteer": return "#0077B6";
      default: return "#10B981";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${getUserColor()}15` }}
                >
                  <Heart className="w-5 h-5" style={{ color: getUserColor() }} />
                </div>
                <span className="text-gray-900 hidden sm:block">NSS Care Network</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E63946] rounded-full"></span>
              </button>
              <div className="hidden sm:block">
                <p className="text-sm text-gray-600">{getUserLabel()}</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200
            transform transition-transform duration-200 ease-in-out lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            mt-16 lg:mt-0
          `}
        >
          <div className="h-full flex flex-col py-6">
            <div className="px-4 mb-6">
              <Badge 
                className="text-white"
                style={{ backgroundColor: getUserColor() }}
              >
                {getUserLabel()}
              </Badge>
            </div>

            <nav className="flex-1 px-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${activeTab === item.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="px-3 mt-auto">
              <Button
                onClick={onLogout}
                variant="outline"
                className="w-full justify-start text-gray-600 border-gray-300"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
