import { 
  Users, 
  Droplet, 
  Calendar, 
  AlertCircle, 
  Plus, 
  TrendingUp, 
  RefreshCw,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Clock,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Bell,
  Shield,
  Building2,
  UserPlus
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { helpRequestsApi, volunteersApi, donorsApi, campsApi } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { AddDonorDialog } from "./AddDonorDialog";
import { CreateCampDialog } from "./CreateCampDialog";
import { AddVolunteerDialog } from "./AddVolunteerDialog";
import { AssignVolunteersDialog } from "./AssignVolunteersDialog";
import { motion } from "motion/react";

interface CollegeDashboardProps {
  activeTab?: string;
}

export function CollegeDashboard({ activeTab = "home" }: CollegeDashboardProps) {
  const [nearbyHelpRequests, setNearbyHelpRequests] = useState<any[]>([]);
  const [upcomingCamps, setUpcomingCamps] = useState<any[]>([]);
  const [allVolunteers, setAllVolunteers] = useState<any[]>([]);
  const [allDonors, setAllDonors] = useState<any[]>([]);
  const [allCamps, setAllCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("all");
  const [stats, setStats] = useState({
    volunteers: 0,
    donors: 0,
    camps: 0,
    hours: 0,
  });

  useEffect(() => {
    if (activeTab === "home") {
      loadDashboardData();
      const interval = setInterval(() => {
        loadDashboardData();
      }, 30000);
      return () => clearInterval(interval);
    } else if (activeTab === "volunteers") {
      loadVolunteersData();
      const interval = setInterval(() => {
        loadVolunteersData();
      }, 30000);
      return () => clearInterval(interval);
    } else if (activeTab === "donors") {
      loadDonorsData();
      const interval = setInterval(() => {
        loadDonorsData();
      }, 30000);
      return () => clearInterval(interval);
    } else if (activeTab === "camps") {
      loadCampsData();
      const interval = setInterval(() => {
        loadCampsData();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const helpResponse = await helpRequestsApi.getAll({ status: "pending" });
      setNearbyHelpRequests((helpResponse.requests || []).slice(0, 3));

      const volunteersResponse = await volunteersApi.getAll();
      const donorsResponse = await donorsApi.getAll({});
      const campsResponse = await campsApi.getAll({ upcoming: true });

      setStats({
        volunteers: volunteersResponse.volunteers?.length || 0,
        donors: donorsResponse.donors?.length || 0,
        camps: campsResponse.camps?.length || 0,
        hours: 1247,
      });

      setUpcomingCamps((campsResponse.camps || []).slice(0, 3));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadVolunteersData = async () => {
    setLoading(true);
    try {
      const volunteersResponse = await volunteersApi.getAll();
      setAllVolunteers(volunteersResponse.volunteers || []);
    } catch (error) {
      console.error("Error loading volunteers:", error);
      toast.error("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  const loadDonorsData = async () => {
    setLoading(true);
    try {
      const donorsResponse = await donorsApi.getAll({});
      setAllDonors(donorsResponse.donors || []);
    } catch (error) {
      console.error("Error loading donors:", error);
      toast.error("Failed to load donors");
    } finally {
      setLoading(false);
    }
  };

  const loadCampsData = async () => {
    setLoading(true);
    try {
      const campsResponse = await campsApi.getAll({});
      const collegeCamps = (campsResponse.camps || [])
        .filter((camp: any) => camp.organizerType === "college");
      setAllCamps(collegeCamps);
    } catch (error) {
      console.error("Error loading camps:", error);
      toast.error("Failed to load camps");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "home") {
      loadDashboardData();
    } else if (activeTab === "volunteers") {
      loadVolunteersData();
    } else if (activeTab === "donors") {
      loadDonorsData();
    } else if (activeTab === "camps") {
      loadCampsData();
    }
    toast.success("Refreshed!");
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const createdAt = new Date(date);
    const diffMs = now.getTime() - createdAt.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleRespondToRequest = (requestId: string) => {
    toast.success("Your response has been recorded! Contact details shared with requester.");
  };

  const handleViewCampDetails = (campId: string) => {
    toast.info("Opening camp details...");
  };

  const handleAcceptCollaboration = (requestId: string) => {
    toast.success("Collaboration request accepted! Hospital will be notified.");
  };

  const handleDeclineCollaboration = (requestId: string) => {
    toast.info("Collaboration request declined.");
  };

  const handleEditVolunteer = (volunteerId: string) => {
    toast.info("Opening volunteer edit form...");
  };

  const handleDeleteVolunteer = (volunteerId: string) => {
    toast.success("Volunteer removed from the list");
    loadVolunteersData();
  };

  const handleEditDonor = (donorId: string) => {
    toast.info("Opening donor edit form...");
  };

  const handleDeleteDonor = (donorId: string) => {
    toast.success("Donor removed from the list");
    loadDonorsData();
  };

  const handleManageCamp = (campId: string) => {
    toast.info("Opening camp management...");
  };

  // Dashboard Home View
  if (activeTab === "home") {
    const statCards = [
      {
        label: "Total Volunteers",
        value: stats.volunteers.toString(),
        change: "+12 this month",
        icon: Users,
        color: "#0077B6",
      },
      {
        label: "Registered Donors",
        value: stats.donors.toString(),
        change: "+8 this month",
        icon: Droplet,
        color: "#E63946",
      },
      {
        label: "Camps Organized",
        value: stats.camps.toString(),
        change: "upcoming",
        icon: Calendar,
        color: "#10B981",
      },
      {
        label: "Hours Served",
        value: stats.hours.toLocaleString(),
        change: "+89 this month",
        icon: TrendingUp,
        color: "#F59E0B",
      },
    ];

    const collaborationRequests = [
      {
        id: "1",
        from: "City Hospital, Mumbai",
        campType: "General Health Checkup",
        date: "Dec 5, 2025",
        status: "pending",
      },
      {
        id: "2",
        from: "Eye Care Center",
        campType: "Vision Screening",
        date: "Dec 12, 2025",
        status: "pending",
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-1">Dashboard</h1>
            <p className="text-gray-600">Welcome back, Mumbai City College NSS Unit</p>
          </div>
          <div className="flex gap-3">
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
            <AddDonorDialog 
              onSuccess={loadDashboardData}
            />
            <AddVolunteerDialog 
              collegeName="Mumbai City College NSS Unit"
              onSuccess={loadDashboardData}
            />
            <CreateCampDialog 
              organizerType="college"
              organizerName="Mumbai City College NSS Unit"
              onSuccess={loadDashboardData}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && stats.volunteers === 0 ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                  </div>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))
          ) : (
            statCards.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 hover:rotate-12"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <h3 className="text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nearby Help Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Nearby Help Requests</CardTitle>
                  <CardDescription>Respond to emergency needs in your area</CardDescription>
                </div>
                <Badge className="bg-[#E63946] hover:bg-[#E63946]">
                  {nearbyHelpRequests.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && nearbyHelpRequests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#E63946]"></div>
                </div>
              ) : nearbyHelpRequests.length > 0 ? (
                nearbyHelpRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-gray-900">{request.helpType}</h4>
                          {request.urgent && (
                            <Badge className="bg-orange-500 hover:bg-orange-500 animate-pulse">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{request.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{getTimeAgo(request.createdAt)}</span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-[#0077B6] border-[#0077B6] hover:bg-[#0077B6] hover:text-white transition-all duration-300 hover:shadow-md"
                        onClick={() => handleRespondToRequest(request.id)}
                      >
                        Respond
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No pending help requests</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Unit's Upcoming Camps */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Camps</CardTitle>
                  <CardDescription>Camps organized by your unit</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && upcomingCamps.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#0077B6]"></div>
                </div>
              ) : upcomingCamps.length > 0 ? (
                upcomingCamps.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-gray-900">{camp.title}</h4>
                      <Badge className="bg-[#0077B6] text-white">{camp.type}</Badge>
                    </div>
                    <div className="space-y-1 mb-3">
                      <p className="text-sm text-gray-600">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {formatDate(camp.date)}
                      </p>
                      <p className="text-sm text-gray-600">{camp.location}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        <Users className="w-4 h-4 inline mr-1" />
                        {camp.registered || 0} / {camp.capacity || 100} registered
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="hover:bg-[#0077B6] hover:text-white hover:border-[#0077B6] transition-all duration-300"
                        onClick={() => handleViewCampDetails(camp.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No upcoming camps</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Collaboration Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Camp Collaboration Requests</CardTitle>
            <CardDescription>Hospitals requesting collaboration for health camps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {collaborationRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-md"
                >
                  <div>
                    <h4 className="text-gray-900 mb-1">{request.campType}</h4>
                    <p className="text-sm text-gray-600 mb-1">From: {request.from}</p>
                    <p className="text-sm text-gray-600">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Proposed Date: {request.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-[#10B981] hover:bg-[#059669] transition-all duration-300 hover:shadow-md hover:scale-105"
                      onClick={() => handleAcceptCollaboration(request.id)}
                    >
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-300"
                      onClick={() => handleDeclineCollaboration(request.id)}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Volunteers Tab
  if (activeTab === "volunteers") {
    const filteredVolunteers = allVolunteers.filter(volunteer =>
      volunteer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.skills?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-1">Volunteers</h1>
            <p className="text-gray-600">Manage your NSS unit volunteers</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <AddVolunteerDialog 
              collegeName="Mumbai City College NSS Unit"
              onSuccess={loadVolunteersData}
            />
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Volunteers</p>
                  <h3 className="text-gray-900">{allVolunteers.length}</h3>
                </div>
                <div className="w-12 h-12 bg-[#0077B6]15 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0077B6]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active This Month</p>
                  <h3 className="text-gray-900">{Math.floor(allVolunteers.length * 0.75)}</h3>
                </div>
                <div className="w-12 h-12 bg-[#10B981]15 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#10B981]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                  <h3 className="text-gray-900">1,247</h3>
                </div>
                <div className="w-12 h-12 bg-[#F59E0B]15 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#F59E0B]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Volunteers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))
          ) : filteredVolunteers.length > 0 ? (
            filteredVolunteers.map((volunteer) => (
              <motion.div
                key={volunteer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-[#0077B6] rounded-full flex items-center justify-center text-white">
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-1">{volunteer.name}</h3>
                          <Badge variant="outline" className="mb-2">
                            {volunteer.role || "Volunteer"}
                          </Badge>
                          <div className="space-y-1 text-sm text-gray-600">
                            {volunteer.email && (
                              <p>
                                <Mail className="w-3 h-3 inline mr-1" />
                                {volunteer.email}
                              </p>
                            )}
                            {volunteer.phone && (
                              <p>
                                <Phone className="w-3 h-3 inline mr-1" />
                                {volunteer.phone}
                              </p>
                            )}
                            {volunteer.skills && (
                              <p className="text-xs text-gray-500 mt-2">
                                Skills: {volunteer.skills}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEditVolunteer(volunteer.id)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteVolunteer(volunteer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="col-span-2">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-gray-900 mb-2">No volunteers found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? "Try adjusting your search" 
                    : "Add your first volunteer to get started"}
                </p>
                <AddVolunteerDialog 
                  collegeName="Mumbai City College NSS Unit"
                  onSuccess={loadVolunteersData}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>
    );
  }

  // Blood Donors Tab
  if (activeTab === "donors") {
    const filteredDonors = allDonors.filter(donor => {
      const matchesSearch = donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           donor.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBloodGroup = filterBloodGroup === "all" || donor.bloodGroup === filterBloodGroup;
      return matchesSearch && matchesBloodGroup;
    });

    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-1">Blood Donors</h1>
            <p className="text-gray-600">Manage registered blood donors from your unit</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <AddDonorDialog onSuccess={loadDonorsData} />
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterBloodGroup === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterBloodGroup("all")}
                >
                  All
                </Button>
                {bloodGroups.slice(0, 4).map(group => (
                  <Button
                    key={group}
                    variant={filterBloodGroup === group ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterBloodGroup(group)}
                    className={filterBloodGroup === group ? "bg-[#E63946] hover:bg-[#d12836]" : ""}
                  >
                    {group}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Donors</p>
                  <h3 className="text-gray-900">{allDonors.length}</h3>
                </div>
                <div className="w-12 h-12 bg-[#E63946]15 rounded-lg flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-[#E63946]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available Now</p>
                  <h3 className="text-gray-900">
                    {allDonors.filter(d => d.availableForDonation).length}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-[#10B981]15 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#10B981]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">This Month</p>
                  <h3 className="text-gray-900">23</h3>
                </div>
                <div className="w-12 h-12 bg-[#F59E0B]15 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#F59E0B]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Units</p>
                  <h3 className="text-gray-900">156</h3>
                </div>
                <div className="w-12 h-12 bg-[#8B5CF6]15 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#8B5CF6]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))
          ) : filteredDonors.length > 0 ? (
            filteredDonors.map((donor) => (
              <motion.div
                key={donor.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-[#E63946] rounded-lg flex items-center justify-center text-white">
                          <span>{donor.bloodGroup}</span>
                        </div>
                        <div>
                          <h3 className="text-gray-900 mb-1">{donor.name}</h3>
                          <Badge 
                            className={donor.availableForDonation ? "bg-green-600" : "bg-gray-500"}
                          >
                            {donor.availableForDonation ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      {donor.location && (
                        <p>
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {donor.location}
                        </p>
                      )}
                      {donor.phone && (
                        <p>
                          <Phone className="w-3 h-3 inline mr-1" />
                          {donor.phone}
                        </p>
                      )}
                      {donor.lastDonationDate && (
                        <p className="text-xs text-gray-500">
                          Last donated: {formatDate(donor.lastDonationDate)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEditDonor(donor.id)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteDonor(donor.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="col-span-3">
              <CardContent className="p-12 text-center">
                <Droplet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-gray-900 mb-2">No donors found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterBloodGroup !== "all"
                    ? "Try adjusting your filters" 
                    : "Add your first donor to get started"}
                </p>
                <AddDonorDialog onSuccess={loadDonorsData} />
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>
    );
  }

  // Health Camps Tab
  if (activeTab === "camps") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-1">Health Camps</h1>
            <p className="text-gray-600">Manage camps organized by your NSS unit</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <CreateCampDialog 
              organizerType="college"
              organizerName="Mumbai City College NSS Unit"
              onSuccess={loadCampsData}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Camps</p>
                  <h3 className="text-gray-900">{allCamps.length}</h3>
                </div>
                <div className="w-12 h-12 bg-[#0077B6]15 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#0077B6]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upcoming</p>
                  <h3 className="text-gray-900">
                    {allCamps.filter(c => new Date(c.date) > new Date()).length}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-[#10B981]15 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#10B981]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Participants</p>
                  <h3 className="text-gray-900">
                    {allCamps.reduce((sum, camp) => sum + (camp.totalSpots - camp.spotsAvailable || 0), 0)}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-[#F59E0B]15 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#F59E0B]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Camps List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-48 w-full" />
                </CardContent>
              </Card>
            ))
          ) : allCamps.length > 0 ? (
            allCamps.map((camp) => (
              <motion.div
                key={camp.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-gray-900 flex-1">{camp.title}</h3>
                      <Badge className="bg-[#0077B6] text-white">{camp.type}</Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        {formatDate(camp.date)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        {camp.venue}
                      </p>
                      <p className="text-sm text-gray-600">
                        <Users className="w-4 h-4 inline mr-2" />
                        {camp.totalSpots - camp.spotsAvailable}/{camp.totalSpots} registered
                      </p>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                      <div
                        className="bg-[#0077B6] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((camp.totalSpots - camp.spotsAvailable) / camp.totalSpots) * 100}%` }}
                      />
                    </div>

                    {camp.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{camp.description}</p>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleManageCamp(camp.id)}
                      >
                        <Users className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="col-span-2">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-gray-900 mb-2">No camps organized yet</h3>
                <p className="text-gray-600 mb-4">Create your first health camp to get started</p>
                <CreateCampDialog 
                  organizerType="college"
                  organizerName="Mumbai City College NSS Unit"
                  onSuccess={loadCampsData}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>
    );
  }

  // Settings Tab
  if (activeTab === "settings") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-gray-900 mb-1">Settings</h1>
          <p className="text-gray-600">Manage your NSS unit profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Unit Profile</CardTitle>
              <CardDescription>Update your NSS unit information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Unit Name</label>
                  <Input defaultValue="Mumbai City College NSS Unit" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">College Name</label>
                  <Input defaultValue="Mumbai City College" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Unit Code</label>
                  <Input defaultValue="NSS-MH-MUM-2020-001" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Contact Email</label>
                  <Input type="email" defaultValue="nss@mumbaicitycollege.edu.in" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Contact Phone</label>
                  <Input type="tel" defaultValue="+91 22 9876 5432" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Program Officer</label>
                  <Input defaultValue="Dr. Rajesh Kumar" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600 mb-2 block">Address</label>
                  <Input defaultValue="Mumbai City College, Andheri East, Mumbai 400069" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#0077B6] hover:bg-[#005F8D]">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Email Notifications</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Emergency Alerts</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Weekly Reports</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Public Profile</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Show Contact Info</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Current Password</label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div></div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">New Password</label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Confirm New Password</label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button className="bg-[#0077B6] hover:bg-[#005F8D]">
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return null;
}
