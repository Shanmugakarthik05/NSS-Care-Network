import { useState, useEffect } from "react";
import {
  Droplet,
  Calendar,
  AlertCircle,
  Heart,
  Users,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  ChevronRight,
  Activity,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { bloodRequestsApi, campsApi, helpRequestsApi, donorsApi } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface BloodRequest {
  id: string;
  bloodGroup: string;
  hospitalName: string;
  location: string;
  urgency: string;
  contactNumber: string;
  createdAt: string;
  units?: number;
}

interface Camp {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  organizer: string;
  capacity?: number;
  registered?: number;
}

interface PublicDashboardProps {
  activeTab: string;
}

export function PublicDashboard({ activeTab }: PublicDashboardProps) {
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [upcomingCamps, setUpcomingCamps] = useState<Camp[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDonors: 0,
    activeCamps: 0,
    requestsFulfilled: 0,
    volunteersActive: 0,
  });
  const [loading, setLoading] = useState(false);
  
  // Settings state
  const [name, setName] = useState("Guest User");
  const [email, setEmail] = useState("guest@example.com");
  const [phone, setPhone] = useState("+91 9876543210");
  const [location, setLocation] = useState("Mumbai");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    urgentAlerts: true,
  });

  useEffect(() => {
    if (activeTab === "home") {
      loadDashboardData();
      
      // Auto-refresh data every 30 seconds for real-time updates
      const interval = setInterval(() => {
        loadDashboardData();
      }, 30000);
      
      return () => clearInterval(interval);
    } else if (activeTab === "camps") {
      loadAllCamps();
      
      // Auto-refresh camps every 30 seconds
      const interval = setInterval(() => {
        loadAllCamps();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch recent blood requests
      const bloodReqResponse = await bloodRequestsApi.getAll();
      setBloodRequests((bloodReqResponse.requests || []).slice(0, 5));

      // Fetch upcoming camps
      const campsResponse = await campsApi.getAll({ upcoming: true });
      const camps = campsResponse.camps || [];
      setUpcomingCamps(camps.slice(0, 3));

      // Fetch my help requests (mock for now)
      const helpResponse = await helpRequestsApi.getAll();
      setMyRequests((helpResponse.requests || []).slice(0, 3));

      // Calculate stats
      const donorsResponse = await donorsApi.getAll();
      setStats({
        totalDonors: donorsResponse.donors?.length || 0,
        activeCamps: camps.length || 0,
        requestsFulfilled: bloodReqResponse.requests?.length || 0,
        volunteersActive: 150, // Mock data
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadAllCamps = async () => {
    setLoading(true);
    try {
      const response = await campsApi.getAll();
      setUpcomingCamps(response.camps || []);
    } catch (error) {
      console.error("Error loading camps:", error);
      toast.error("Failed to load camps");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleRegisterCamp = (campId: string) => {
    toast.success("Registration successful! You'll receive confirmation shortly.");
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  const statCards = [
    {
      title: "Blood Donors",
      value: stats.totalDonors,
      icon: Droplet,
      color: "#E63946",
      change: "+12%",
    },
    {
      title: "Active Camps",
      value: stats.activeCamps,
      icon: Calendar,
      color: "#0077B6",
      change: "+8%",
    },
    {
      title: "Requests Fulfilled",
      value: stats.requestsFulfilled,
      icon: Heart,
      color: "#10B981",
      change: "+25%",
    },
    {
      title: "Active Volunteers",
      value: stats.volunteersActive,
      icon: Users,
      color: "#F59E0B",
      change: "+5%",
    },
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const locations = ["Mumbai", "Pune", "Bangalore", "Delhi", "Chennai", "Kolkata"];

  const handleRefresh = () => {
    if (activeTab === "home") {
      loadDashboardData();
      toast.success("Dashboard refreshed!");
    } else if (activeTab === "camps") {
      loadAllCamps();
      toast.success("Camps refreshed!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">
            {activeTab === "home" && "Welcome back!"}
            {activeTab === "camps" && "Health Camps"}
            {activeTab === "settings" && "Settings"}
          </h1>
          <p className="text-gray-600">
            {activeTab === "home" && "Access health services, find donors, and stay updated with NSS activities"}
            {activeTab === "camps" && "Browse and register for upcoming health camps"}
            {activeTab === "settings" && "Manage your account and preferences"}
          </p>
        </div>
        {(activeTab === "home" || activeTab === "camps") && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        )}
      </div>

      {/* Dashboard Home */}
      {activeTab === "home" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-gray-900">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600">{stat.change}</span>
                        </div>
                      </div>
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 hover:rotate-12"
                        style={{ backgroundColor: `${stat.color}15` }}
                      >
                        <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Fast access to essential services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-between bg-[#E63946] hover:bg-[#d12836] transition-all duration-300 hover:shadow-lg hover:scale-105"
                    onClick={() => toast.info("Redirecting to Blood Donor Finder...")}
                  >
                    <span className="flex items-center gap-2">
                      <Droplet className="w-4 h-4" />
                      Find Blood Donor
                    </span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    className="w-full justify-between bg-[#0077B6] hover:bg-[#005f8f] transition-all duration-300 hover:shadow-lg hover:scale-105"
                    onClick={() => toast.info("Redirecting to Health Camps...")}
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Register for Camp
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    className="w-full justify-between bg-[#F59E0B] hover:bg-[#D97706] transition-all duration-300 hover:shadow-lg hover:scale-105"
                    onClick={() => toast.info("Redirecting to Emergency Help...")}
                  >
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Request Emergency Help
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                    onClick={() => toast.info("Opening donor registration...")}
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Become a Donor
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Blood Requests */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Urgent Blood Requests</CardTitle>
                      <CardDescription>Recent requests from hospitals</CardDescription>
                    </div>
                    <Activity className="w-5 h-5 text-[#E63946]" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#E63946]"></div>
                    </div>
                  ) : bloodRequests.length > 0 ? (
                    <div className="space-y-3">
                      {bloodRequests.slice(0, 4).map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-md cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#E63946] rounded-lg flex items-center justify-center text-white transition-transform duration-300 hover:scale-110">
                              {request.bloodGroup}
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">{request.hospitalName}</p>
                              <p className="text-xs text-gray-600 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {request.location}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={
                              request.urgency === "Critical"
                                ? "bg-red-100 text-red-800 animate-pulse"
                                : "bg-orange-100 text-orange-800"
                            }
                          >
                            {request.urgency}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Droplet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No urgent requests at the moment</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Camps */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Health Camps</CardTitle>
                    <CardDescription>Register now and make a difference</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Use 'Health Camps' in the sidebar to view all camps")}
                    className="text-[#0077B6] border-[#0077B6] hover:bg-[#0077B6] hover:text-white"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#0077B6]"></div>
                  </div>
                ) : upcomingCamps.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {upcomingCamps.map((camp) => (
                      <div
                        key={camp.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-[#0077B6]"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge className="bg-[#0077B6] text-white">{camp.type}</Badge>
                          <Clock className="w-4 h-4 text-gray-400" />
                        </div>
                        <h4 className="text-gray-900 mb-2">{camp.title}</h4>
                        <div className="space-y-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(camp.date)}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {camp.location}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-[#0077B6] hover:bg-[#005f8f] transition-all duration-300"
                          onClick={() => handleRegisterCamp(camp.id)}
                        >
                          Register Now
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No upcoming camps available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Requests */}
            <Card>
              <CardHeader>
                <CardTitle>My Recent Requests</CardTitle>
                <CardDescription>Track your submitted help requests</CardDescription>
              </CardHeader>
              <CardContent>
                {myRequests.length > 0 ? (
                  <div className="space-y-3">
                    {myRequests.map((request, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm text-gray-900">{request.helpType || "Emergency Help"}</p>
                          <p className="text-xs text-gray-600">{request.location || "Mumbai"}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {request.status || "In Progress"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent requests</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
      )}

      {/* Health Camps Tab */}
      {activeTab === "camps" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Health Camps</CardTitle>
                <CardDescription>Browse and register for upcoming health camps</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B6]"></div>
                    <p className="text-gray-600 mt-4">Loading camps...</p>
                  </div>
                ) : upcomingCamps.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingCamps.map((camp) => (
                      <div
                        key={camp.id}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge className="bg-[#0077B6] text-white">{camp.type}</Badge>
                          {camp.capacity && camp.registered && (
                            <span className="text-xs text-gray-600">
                              {camp.registered}/{camp.capacity} registered
                            </span>
                          )}
                        </div>
                        <h4 className="text-gray-900 mb-3">{camp.title}</h4>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(camp.date)}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {camp.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {camp.organizer}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Button
                            className="w-full bg-[#0077B6] hover:bg-[#005f8f]"
                            onClick={() => handleRegisterCamp(camp.id)}
                          >
                            Register Now
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => toast.info("Opening camp details...")}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No camps available at the moment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select value={bloodGroup} onValueChange={setBloodGroup}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-600">Receive updates via email</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        emailNotifications: !notifications.emailNotifications,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.emailNotifications ? "bg-[#0077B6]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.emailNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">SMS Notifications</p>
                    <p className="text-xs text-gray-600">Receive updates via SMS</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        smsNotifications: !notifications.smsNotifications,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.smsNotifications ? "bg-[#0077B6]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.smsNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">Urgent Alerts</p>
                    <p className="text-xs text-gray-600">Receive critical emergency alerts</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        urgentAlerts: !notifications.urgentAlerts,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.urgentAlerts ? "bg-[#E63946]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.urgentAlerts ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>Control your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Manage Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start text-[#E63946] border-[#E63946] hover:bg-[#E63946] hover:text-white">
                  Delete Account
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button
                className="bg-[#0077B6] hover:bg-[#005f8f]"
                onClick={handleSaveSettings}
              >
                Save Changes
              </Button>
            </div>
          </div>
      )}
    </div>
  );
}
