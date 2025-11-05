import { 
  Droplet, 
  Calendar, 
  Users, 
  Building2, 
  Plus, 
  AlertCircle, 
  RefreshCw, 
  TrendingUp,
  Filter,
  Search,
  MapPin,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Edit,
  Bell,
  Shield,
  Mail
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { bloodRequestsApi, campsApi, donorsApi } from "../utils/api";
import { PostBloodRequestDialog } from "./PostBloodRequestDialog";
import { CreateCampDialog } from "./CreateCampDialog";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";

interface HospitalDashboardProps {
  activeTab?: string;
}

export function HospitalDashboard({ activeTab = "home" }: HospitalDashboardProps) {
  const [bloodRequests, setBloodRequests] = useState<any[]>([]);
  const [allBloodRequests, setAllBloodRequests] = useState<any[]>([]);
  const [upcomingCamps, setUpcomingCamps] = useState<any[]>([]);
  const [allCamps, setAllCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    activeRequests: 0,
    urgentRequests: 0,
    upcomingCamps: 0,
    collaborations: 0,
    participants: 0,
  });

  useEffect(() => {
    if (activeTab === "home") {
      loadDashboardData();
      const interval = setInterval(() => {
        loadDashboardData();
      }, 30000);
      return () => clearInterval(interval);
    } else if (activeTab === "blood-requests") {
      loadBloodRequestsData();
      const interval = setInterval(() => {
        loadBloodRequestsData();
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
      const requestsResponse = await bloodRequestsApi.getAll({
        hospital: "City Hospital Mumbai",
      });
      const allRequests = requestsResponse.requests || [];
      setBloodRequests(allRequests.slice(0, 4));

      const campsResponse = await campsApi.getAll({ upcoming: true });
      const hospitalCamps = (campsResponse.camps || [])
        .filter((camp: any) => camp.organizerType === "hospital");
      setUpcomingCamps(hospitalCamps.slice(0, 2));

      // Calculate stats
      const activeRequests = allRequests.filter((r: any) => r.status === "Pending").length;
      const urgentRequests = allRequests.filter((r: any) => r.urgent).length;
      const totalParticipants = hospitalCamps.reduce(
        (sum: number, camp: any) => sum + (camp.totalSpots - camp.spotsAvailable || 0), 
        0
      );

      setStats({
        activeRequests,
        urgentRequests,
        upcomingCamps: hospitalCamps.length,
        collaborations: 12,
        participants: totalParticipants || 342,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadBloodRequestsData = async () => {
    setLoading(true);
    try {
      const requestsResponse = await bloodRequestsApi.getAll({
        hospital: "City Hospital Mumbai",
      });
      setAllBloodRequests(requestsResponse.requests || []);
    } catch (error) {
      console.error("Error loading blood requests:", error);
      toast.error("Failed to load blood requests");
    } finally {
      setLoading(false);
    }
  };

  const loadCampsData = async () => {
    setLoading(true);
    try {
      const campsResponse = await campsApi.getAll({});
      const hospitalCamps = (campsResponse.camps || [])
        .filter((camp: any) => camp.organizerType === "hospital");
      setAllCamps(hospitalCamps);
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
    } else if (activeTab === "blood-requests") {
      loadBloodRequestsData();
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

  const handleViewRequestDetails = (requestId: string) => {
    toast.info("Opening blood request details...");
  };

  const handleManageRegistrations = (campId: string) => {
    toast.info("Opening camp registration management...");
  };

  const handleAcceptCollaboration = (inviteId: string) => {
    toast.success("Collaboration accepted! NSS unit will be notified.");
  };

  const handleViewCollaborationDetails = (inviteId: string) => {
    toast.info("Opening collaboration details...");
  };

  const handleMarkAsFulfilled = (requestId: string) => {
    toast.success("Blood request marked as fulfilled!");
    loadBloodRequestsData();
  };

  const handleCancelRequest = (requestId: string) => {
    toast.info("Blood request cancelled");
    loadBloodRequestsData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-orange-500";
      case "Fulfilled": return "bg-green-600";
      default: return "bg-gray-500";
    }
  };

  // Dashboard Home View
  if (activeTab === "home") {
    const statCards = [
      {
        label: "Active Blood Requests",
        value: stats.activeRequests.toString(),
        change: stats.urgentRequests + " urgent",
        icon: Droplet,
        color: "#E63946",
      },
      {
        label: "Upcoming Camps",
        value: stats.upcomingCamps.toString(),
        change: "3 this month",
        icon: Calendar,
        color: "#0077B6",
      },
      {
        label: "NSS Collaborations",
        value: stats.collaborations.toString(),
        change: "4 colleges",
        icon: Building2,
        color: "#10B981",
      },
      {
        label: "Total Participants",
        value: stats.participants.toString(),
        change: "+67 this month",
        icon: Users,
        color: "#F59E0B",
      },
    ];

    const collaborationInvites = [
      {
        id: "1",
        college: "Delhi College NSS Unit",
        campType: "Blood Donation Drive",
        date: "Dec 1, 2025",
        volunteers: 25,
      },
      {
        id: "2",
        college: "Chennai Medical College NSS",
        campType: "Dental Health Camp",
        date: "Dec 8, 2025",
        volunteers: 18,
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
            <p className="text-gray-600">Welcome back, City Hospital Mumbai</p>
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
            <PostBloodRequestDialog 
              hospitalName="City Hospital Mumbai"
              onSuccess={loadDashboardData}
            />
            <CreateCampDialog 
              organizerType="hospital"
              organizerName="City Hospital Mumbai"
              onSuccess={loadDashboardData}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && stats.activeRequests === 0 ? (
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
          {/* Active Blood Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Blood Requests</CardTitle>
                  <CardDescription>Track your active and past requests</CardDescription>
                </div>
                <PostBloodRequestDialog 
                  hospitalName="City Hospital Mumbai"
                  onSuccess={loadDashboardData}
                  trigger={
                    <Button size="sm" className="bg-[#E63946] hover:bg-[#d12836]">
                      <Plus className="w-4 h-4 mr-1" />
                      New Request
                    </Button>
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading && bloodRequests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#E63946]"></div>
                </div>
              ) : bloodRequests.length > 0 ? (
                bloodRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#E63946] rounded-lg flex items-center justify-center text-white transition-transform duration-300 hover:scale-110">
                          <span>{request.bloodGroup}</span>
                        </div>
                        <div>
                          <h4 className="text-gray-900 mb-1">
                            {request.units} {request.units === 1 ? 'unit' : 'units'} required
                          </h4>
                          <p className="text-sm text-gray-600">{getTimeAgo(request.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${getStatusColor(request.status)} hover:${getStatusColor(request.status)}`}>
                          {request.status}
                        </Badge>
                        {request.urgent && (
                          <Badge className="bg-orange-500 hover:bg-orange-500 animate-pulse">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full hover:bg-[#E63946] hover:text-white hover:border-[#E63946] transition-all duration-300"
                      onClick={() => handleViewRequestDetails(request.id)}
                    >
                      View Details
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Droplet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No blood requests yet. Click "New Request" to add one.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Camps */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Health Camps</CardTitle>
                  <CardDescription>Camps organized by your hospital</CardDescription>
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
                      <p className="text-sm text-gray-600">
                        <Building2 className="w-4 h-4 inline mr-1" />
                        {camp.venue}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">
                        {camp.totalSpots - camp.spotsAvailable}/{camp.totalSpots} registered
                      </span>
                      <span className="text-sm text-gray-600">
                        {Math.round(((camp.totalSpots - camp.spotsAvailable) / camp.totalSpots) * 100)}% full
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                      <div
                        className="bg-[#0077B6] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((camp.totalSpots - camp.spotsAvailable) / camp.totalSpots) * 100}%` }}
                      />
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full hover:bg-[#0077B6] hover:text-white hover:border-[#0077B6] transition-all duration-300"
                      onClick={() => handleManageRegistrations(camp.id)}
                    >
                      Manage Registrations
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No upcoming camps. Click "Create Camp" to organize one.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Collaboration Invites */}
        <Card>
          <CardHeader>
            <CardTitle>NSS Collaboration Invites</CardTitle>
            <CardDescription>Colleges interested in partnering for health camps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {collaborationInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-md"
                >
                  <div>
                    <h4 className="text-gray-900 mb-1">{invite.campType}</h4>
                    <p className="text-sm text-gray-600 mb-1">From: {invite.college}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {invite.date}
                      </span>
                      <span>
                        <Users className="w-4 h-4 inline mr-1" />
                        {invite.volunteers} volunteers
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-[#10B981] hover:bg-[#059669] transition-all duration-300 hover:shadow-md hover:scale-105"
                      onClick={() => handleAcceptCollaboration(invite.id)}
                    >
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="hover:bg-[#0077B6] hover:text-white hover:border-[#0077B6] transition-all duration-300"
                      onClick={() => handleViewCollaborationDetails(invite.id)}
                    >
                      View Details
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

  // Blood Requests Tab
  if (activeTab === "blood-requests") {
    const filteredRequests = allBloodRequests.filter(request => {
      const matchesSearch = request.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.hospital?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || request.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-1">Blood Requests</h1>
            <p className="text-gray-600">Manage all your blood donation requests</p>
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
            <PostBloodRequestDialog 
              hospitalName="City Hospital Mumbai"
              onSuccess={loadBloodRequestsData}
            />
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by blood group or hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "Pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("Pending")}
                  className={filterStatus === "Pending" ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === "Fulfilled" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("Fulfilled")}
                  className={filterStatus === "Fulfilled" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  Fulfilled
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blood Requests List */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 bg-[#E63946] rounded-lg flex items-center justify-center text-white">
                          <div className="text-center">
                            <div className="text-xl">{request.bloodGroup}</div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-gray-900">
                              {request.units} {request.units === 1 ? 'unit' : 'units'} required
                            </h3>
                            <Badge className={`${getStatusColor(request.status)} hover:${getStatusColor(request.status)}`}>
                              {request.status}
                            </Badge>
                            {request.urgent && (
                              <Badge className="bg-orange-500 hover:bg-orange-500 animate-pulse">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1 mb-3">
                            <p className="text-sm text-gray-600">
                              <Building2 className="w-4 h-4 inline mr-1" />
                              {request.hospital}
                            </p>
                            <p className="text-sm text-gray-600">
                              <Clock className="w-4 h-4 inline mr-1" />
                              Posted {getTimeAgo(request.createdAt)}
                            </p>
                            {request.contactNumber && (
                              <p className="text-sm text-gray-600">
                                Contact: {request.contactNumber}
                              </p>
                            )}
                          </div>
                          {request.notes && (
                            <p className="text-sm text-gray-600 italic mb-3">"{request.notes}"</p>
                          )}
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewRequestDetails(request.id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            {request.status === "Pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleMarkAsFulfilled(request.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Mark Fulfilled
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleCancelRequest(request.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Droplet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-gray-900 mb-2">No blood requests found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== "all" 
                    ? "Try adjusting your filters" 
                    : "Create your first blood request to get started"}
                </p>
                <PostBloodRequestDialog 
                  hospitalName="City Hospital Mumbai"
                  onSuccess={loadBloodRequestsData}
                />
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
            <p className="text-gray-600">Manage camps organized by your hospital</p>
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
              organizerType="hospital"
              organizerName="City Hospital Mumbai"
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
                  <p className="text-sm text-gray-600 mb-1">Upcoming Camps</p>
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
                        onClick={() => handleManageRegistrations(camp.id)}
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
                  organizerType="hospital"
                  organizerName="City Hospital Mumbai"
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
          <p className="text-gray-600">Manage your hospital profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Hospital Profile</CardTitle>
              <CardDescription>Update your hospital information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Hospital Name</label>
                  <Input defaultValue="City Hospital Mumbai" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Registration Number</label>
                  <Input defaultValue="MH-MUM-2020-12345" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Contact Email</label>
                  <Input type="email" defaultValue="admin@cityhospital.com" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Contact Phone</label>
                  <Input type="tel" defaultValue="+91 22 1234 5678" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600 mb-2 block">Address</label>
                  <Input defaultValue="123 Medical District, Mumbai, Maharashtra 400001" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Total Beds</label>
                  <Input type="number" defaultValue="500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Blood Bank Available</label>
                  <select className="w-full h-10 px-3 rounded-md border border-gray-300">
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#E63946] hover:bg-[#d12836]">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
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
                    <span className="text-sm">Urgent Requests</span>
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
