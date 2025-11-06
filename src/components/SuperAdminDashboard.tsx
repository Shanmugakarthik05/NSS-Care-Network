import { 
  TrendingUp, 
  Users, 
  Building2, 
  GraduationCap, 
  CheckCircle, 
  Clock,
  MapPin,
  Activity,
  RefreshCw,
  Eye,
  XCircle,
  BarChart3,
  Droplet,
  Calendar,
  FileText,
  Shield,
  Plus
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { statsApi, campsApi, donorsApi, volunteersApi, helpRequestsApi } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";
import { BackendStatus } from "./BackendStatus";

interface SuperAdminDashboardProps {
  activeTab: string;
}

export function SuperAdminDashboard({ activeTab }: SuperAdminDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUnits: 0,
    hospitals: 0,
    volunteers: 0,
    donors: 0,
  });
  const [allCamps, setAllCamps] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === "home") {
      loadDashboardData();

      const interval = setInterval(() => {
        loadDashboardData();
      }, 30000);

      return () => clearInterval(interval);
    } else if (activeTab === "units") {
      loadUnitsData();

      const interval = setInterval(() => {
        loadUnitsData();
      }, 30000);

      return () => clearInterval(interval);
    } else if (activeTab === "analytics") {
      loadAnalyticsData();

      const interval = setInterval(() => {
        loadAnalyticsData();
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
      const [volunteersRes, donorsRes, campsRes] = await Promise.all([
        volunteersApi.getAll(),
        donorsApi.getAll({}),
        campsApi.getAll({}),
      ]);

      setStats({
        totalUnits: 247, // Mock data
        hospitals: 89, // Mock data
        volunteers: volunteersRes.volunteers?.length || 0,
        donors: donorsRes.donors?.length || 0,
      });

      setAllCamps(campsRes.camps || []);

      // Generate mock pending approvals
      setPendingApprovals([
        {
          id: "1",
          name: "Pune Engineering College NSS",
          type: "college",
          location: "Pune, Maharashtra",
          appliedDate: "Nov 1, 2025",
          volunteers: 45,
        },
        {
          id: "2",
          name: "Chennai District Hospital",
          type: "hospital",
          location: "Chennai, Tamil Nadu",
          appliedDate: "Nov 2, 2025",
          beds: 250,
        },
        {
          id: "3",
          name: "Delhi University NSS Unit",
          type: "college",
          location: "Delhi",
          appliedDate: "Nov 3, 2025",
          volunteers: 67,
        },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadUnitsData = async () => {
    setLoading(true);
    try {
      const volunteersRes = await volunteersApi.getAll();
      setStats(prev => ({
        ...prev,
        volunteers: volunteersRes.volunteers?.length || 0,
      }));
    } catch (error) {
      console.error("Error loading units data:", error);
      toast.error("Failed to load units data");
    } finally {
      setLoading(false);
    }
  };

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [campsRes, donorsRes, volunteersRes] = await Promise.all([
        campsApi.getAll({}),
        donorsApi.getAll({}),
        volunteersApi.getAll(),
      ]);

      setAllCamps(campsRes.camps || []);
      setStats(prev => ({
        ...prev,
        donors: donorsRes.donors?.length || 0,
        volunteers: volunteersRes.volunteers?.length || 0,
      }));
    } catch (error) {
      console.error("Error loading analytics data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const loadCampsData = async () => {
    setLoading(true);
    try {
      const campsRes = await campsApi.getAll({});
      setAllCamps(campsRes.camps || []);
    } catch (error) {
      console.error("Error loading camps data:", error);
      toast.error("Failed to load camps data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "home") {
      loadDashboardData();
      toast.success("Dashboard refreshed!");
    } else if (activeTab === "units") {
      loadUnitsData();
      toast.success("Units data refreshed!");
    } else if (activeTab === "analytics") {
      loadAnalyticsData();
      toast.success("Analytics refreshed!");
    } else if (activeTab === "camps") {
      loadCampsData();
      toast.success("Camps data refreshed!");
    } else if (activeTab === "settings") {
      toast.success("Settings refreshed!");
    }
  };

  const handleApprove = (id: string, name: string) => {
    setPendingApprovals(prev => prev.filter(p => p.id !== id));
    toast.success(`${name} has been approved!`);
  };

  const handleReject = (id: string, name: string) => {
    setPendingApprovals(prev => prev.filter(p => p.id !== id));
    toast.error(`${name} has been rejected`);
  };

  // Dashboard Home View
  if (activeTab === "home") {
    const statCards = [
      {
        label: "Total NSS Units",
        value: stats.totalUnits.toString(),
        change: "+12 this month",
        icon: GraduationCap,
        color: "#0077B6",
      },
      {
        label: "Partner Hospitals",
        value: stats.hospitals.toString(),
        change: "+5 this month",
        icon: Building2,
        color: "#E63946",
      },
      {
        label: "Active Volunteers",
        value: stats.volunteers.toLocaleString(),
        change: "+342 this month",
        icon: Users,
        color: "#10B981",
      },
      {
        label: "Total Blood Donors",
        value: stats.donors.toLocaleString(),
        change: "+578 this month",
        icon: Droplet,
        color: "#F59E0B",
      },
    ];

    const monthlyData = [
      { month: "Jun", camps: 45, volunteers: 6200 },
      { month: "Jul", camps: 52, volunteers: 6800 },
      { month: "Aug", camps: 61, volunteers: 7400 },
      { month: "Sep", camps: 58, volunteers: 8100 },
      { month: "Oct", camps: 67, volunteers: 8600 },
      { month: "Nov", camps: 73, volunteers: stats.volunteers },
    ];

    const stateData = [
      { state: "Maharashtra", units: 45 },
      { state: "Karnataka", units: 38 },
      { state: "Tamil Nadu", units: 32 },
      { state: "Delhi", units: 28 },
      { state: "Gujarat", units: 25 },
    ];

    const recentActivities = allCamps.slice(0, 3).map((camp, index) => ({
      id: camp.id || index.toString(),
      type: "camp",
      title: `${camp.name} completed`,
      location: camp.location || "Unknown",
      participants: camp.maxParticipants || 0,
      time: "Recently",
    }));

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
            <h1 className="text-gray-900 mb-1">National Dashboard</h1>
            <p className="text-gray-600">Overview of NSS Care Network across India</p>
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
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Backend Status */}
        <BackendStatus />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))
          ) : (
            statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${stat.color}15` }}
                      >
                        <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-xs text-green-600">{stat.change}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
              <CardDescription>Monthly camps and volunteer participation</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="camps" stroke="#E63946" strokeWidth={2} />
                      <Line type="monotone" dataKey="volunteers" stroke="#0077B6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#E63946] rounded-full"></div>
                      <span className="text-sm text-gray-600">Health Camps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#0077B6] rounded-full"></div>
                      <span className="text-sm text-gray-600">Volunteers</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 5 States by NSS Units</CardTitle>
              <CardDescription>State-wise distribution of registered units</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="state" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="units" fill="#0077B6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Approvals</CardTitle>
                  <CardDescription>New registration requests awaiting verification</CardDescription>
                </div>
                <Badge className="bg-orange-500 hover:bg-orange-500">
                  {pendingApprovals.length} Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))
              ) : pendingApprovals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>No pending approvals!</p>
                </div>
              ) : (
                pendingApprovals.map((approval) => (
                  <motion.div
                    key={approval.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-gray-900 mb-1">{approval.name}</h4>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">
                            {approval.type === "college" ? (
                              <GraduationCap className="w-3 h-3 mr-1" />
                            ) : (
                              <Building2 className="w-3 h-3 mr-1" />
                            )}
                            {approval.type === "college" ? "College" : "Hospital"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {approval.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">{approval.appliedDate}</p>
                        {approval.type === "college" && (
                          <p className="text-sm text-gray-600">{approval.volunteers} volunteers</p>
                        )}
                        {approval.type === "hospital" && (
                          <p className="text-sm text-gray-600">{approval.beds} beds</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-[#10B981] hover:bg-[#059669]"
                        onClick={() => handleApprove(approval.id, approval.name)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReject(approval.id, approval.name)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates across the network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))
              ) : recentActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2" />
                  <p>No recent activities</p>
                </div>
              ) : (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#E63946]15"
                      >
                        <Activity className="w-5 h-5 text-[#E63946]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1">{activity.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {activity.location}
                        </p>
                        {activity.participants > 0 && (
                          <p className="text-sm text-gray-600 mb-1">
                            {activity.participants} participants
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  // Manage Units View
  if (activeTab === "units") {
    const units = [
      {
        id: "1",
        name: "IIT Bombay NSS Unit",
        type: "college",
        location: "Mumbai, Maharashtra",
        volunteers: 156,
        camps: 23,
        status: "active",
        lastActive: "2 hours ago",
      },
      {
        id: "2",
        name: "AIIMS Delhi",
        type: "hospital",
        location: "New Delhi",
        beds: 2500,
        camps: 45,
        status: "active",
        lastActive: "1 hour ago",
      },
      {
        id: "3",
        name: "Anna University NSS",
        type: "college",
        location: "Chennai, Tamil Nadu",
        volunteers: 203,
        camps: 34,
        status: "active",
        lastActive: "5 hours ago",
      },
      {
        id: "4",
        name: "Bangalore Medical College",
        type: "hospital",
        location: "Bangalore, Karnataka",
        beds: 800,
        camps: 19,
        status: "active",
        lastActive: "3 hours ago",
      },
    ];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-1">Manage Units</h1>
            <p className="text-gray-600">View and manage all registered NSS units and hospitals</p>
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
            <Button className="bg-[#0077B6] hover:bg-[#005F8D]">
              <Plus className="w-4 h-4 mr-2" />
              Add Unit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Units</p>
                  <h3 className="text-gray-900">{stats.totalUnits}</h3>
                </div>
                <div className="w-12 h-12 bg-[#0077B6]15 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-[#0077B6]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hospitals</p>
                  <h3 className="text-gray-900">{stats.hospitals}</h3>
                </div>
                <div className="w-12 h-12 bg-[#E63946]15 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#E63946]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Volunteers</p>
                  <h3 className="text-gray-900">{stats.volunteers.toLocaleString()}</h3>
                </div>
                <div className="w-12 h-12 bg-[#10B981]15 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#10B981]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Units</CardTitle>
            <CardDescription>Complete list of registered units and hospitals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))
              ) : (
                units.map((unit) => (
                  <motion.div
                    key={unit.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#8B5CF6] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            unit.type === "college" ? "bg-[#0077B6]15" : "bg-[#E63946]15"
                          }`}
                        >
                          {unit.type === "college" ? (
                            <GraduationCap className={`w-6 h-6 ${unit.type === "college" ? "text-[#0077B6]" : "text-[#E63946]"}`} />
                          ) : (
                            <Building2 className="w-6 h-6 text-[#E63946]" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-gray-900 mb-1">{unit.name}</h4>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline">
                              {unit.type === "college" ? "College" : "Hospital"}
                            </Badge>
                            <Badge className="bg-green-500 hover:bg-green-500">
                              {unit.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {unit.location}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {unit.type === "college" ? (
                              <>
                                <span><Users className="w-3 h-3 inline mr-1" />{unit.volunteers} volunteers</span>
                                <span><Calendar className="w-3 h-3 inline mr-1" />{unit.camps} camps</span>
                              </>
                            ) : (
                              <>
                                <span><Building2 className="w-3 h-3 inline mr-1" />{unit.beds} beds</span>
                                <span><Calendar className="w-3 h-3 inline mr-1" />{unit.camps} camps</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-3">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {unit.lastActive}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Shield className="w-4 h-4 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Analytics View
  if (activeTab === "analytics") {
    const impactData = [
      { category: "Blood Donations", value: stats.donors },
      { category: "Health Camps", value: allCamps.length },
      { category: "Volunteers", value: stats.volunteers },
      { category: "Help Requests", value: 89 },
    ];

    const COLORS = ["#E63946", "#0077B6", "#10B981", "#F59E0B"];

    const performanceData = [
      { month: "Jun", donations: 450, camps: 45, volunteers: 6200 },
      { month: "Jul", donations: 520, camps: 52, volunteers: 6800 },
      { month: "Aug", donations: 610, camps: 61, volunteers: 7400 },
      { month: "Sep", donations: 580, camps: 58, volunteers: 8100 },
      { month: "Oct", donations: 670, camps: 67, volunteers: 8600 },
      { month: "Nov", donations: 730, camps: 73, volunteers: stats.volunteers },
    ];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-1">Analytics</h1>
            <p className="text-gray-600">Comprehensive insights and performance metrics</p>
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
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Analytics
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Impact Overview</CardTitle>
              <CardDescription>Distribution of key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={impactData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {impactData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Monthly performance across all metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="donations" stroke="#E63946" strokeWidth={2} />
                    <Line type="monotone" dataKey="camps" stroke="#0077B6" strokeWidth={2} />
                    <Line type="monotone" dataKey="volunteers" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Droplet className="w-8 h-8 text-[#E63946]" />
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-gray-900">{stats.donors.toLocaleString()}</h3>
              <p className="text-sm text-gray-600 mb-1">Total Donors</p>
              <p className="text-xs text-green-600">+15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-[#0077B6]" />
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-gray-900">{allCamps.length}</h3>
              <p className="text-sm text-gray-600 mb-1">Health Camps</p>
              <p className="text-xs text-green-600">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-[#10B981]" />
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-gray-900">{stats.volunteers.toLocaleString()}</h3>
              <p className="text-sm text-gray-600 mb-1">Volunteers</p>
              <p className="text-xs text-green-600">+22% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-[#F59E0B]" />
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-gray-900">156</h3>
              <p className="text-sm text-gray-600 mb-1">Active Units</p>
              <p className="text-xs text-green-600">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>State-wise breakdown of activities</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="space-y-4">
                {[
                  { state: "Maharashtra", units: 45, volunteers: 2340, camps: 89, growth: 12 },
                  { state: "Karnataka", units: 38, volunteers: 1980, camps: 67, growth: 8 },
                  { state: "Tamil Nadu", units: 32, volunteers: 1670, camps: 54, growth: 15 },
                  { state: "Delhi", units: 28, volunteers: 1450, camps: 48, growth: 5 },
                  { state: "Gujarat", units: 25, volunteers: 1290, camps: 41, growth: 10 },
                ].map((region, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-gray-900">{region.state}</h4>
                      <Badge className="bg-green-500 hover:bg-green-500">
                        +{region.growth}% growth
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Units</p>
                        <p className="text-gray-900">{region.units}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Volunteers</p>
                        <p className="text-gray-900">{region.volunteers.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Camps</p>
                        <p className="text-gray-900">{region.camps}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Health Camps View
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
            <p className="text-gray-600">Manage all health camps across the network</p>
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
            <Button className="bg-[#E63946] hover:bg-[#D62839]">
              <Plus className="w-4 h-4 mr-2" />
              Create Camp
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Camps</p>
                  <h3 className="text-gray-900">{allCamps.length}</h3>
                </div>
                <div className="w-12 h-12 bg-[#E63946]15 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#E63946]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upcoming</p>
                  <h3 className="text-gray-900">{allCamps.filter(c => new Date(c.date) > new Date()).length}</h3>
                </div>
                <div className="w-12 h-12 bg-[#0077B6]15 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#0077B6]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <h3 className="text-gray-900">{allCamps.filter(c => new Date(c.date) <= new Date()).length}</h3>
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
                  <p className="text-sm text-gray-600 mb-1">Total Participants</p>
                  <h3 className="text-gray-900">{allCamps.reduce((acc, c) => acc + (c.maxParticipants || 0), 0).toLocaleString()}</h3>
                </div>
                <div className="w-12 h-12 bg-[#F59E0B]15 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#F59E0B]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Health Camps</CardTitle>
            <CardDescription>Complete listing of camps organized across the network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))
              ) : allCamps.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">No health camps found</p>
                  <p className="text-sm">Create your first camp to get started</p>
                </div>
              ) : (
                allCamps.map((camp) => {
                  const isUpcoming = new Date(camp.date) > new Date();
                  const campDate = new Date(camp.date);
                  const formattedDate = campDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  });

                  return (
                    <motion.div
                      key={camp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-[#E63946] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${isUpcoming ? 'bg-[#E63946]' : 'bg-gray-400'}`}>
                            <span className="text-white text-xs">{campDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                            <span className="text-white">{campDate.getDate()}</span>
                          </div>
                          <div>
                            <h4 className="text-gray-900 mb-1">{camp.name}</h4>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline">
                                {camp.type || 'Health Camp'}
                              </Badge>
                              <Badge className={isUpcoming ? 'bg-[#0077B6] hover:bg-[#0077B6]' : 'bg-gray-500 hover:bg-gray-500'}>
                                {isUpcoming ? 'Upcoming' : 'Completed'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span><MapPin className="w-3 h-3 inline mr-1" />{camp.location || 'Location TBD'}</span>
                              <span><Users className="w-3 h-3 inline mr-1" />{camp.maxParticipants || 0} max participants</span>
                              <span><Clock className="w-3 h-3 inline mr-1" />{camp.time || '10:00 AM'}</span>
                            </div>
                            {camp.description && (
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{camp.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-1" />
                            Report
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Settings View
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
          <p className="text-gray-600">Manage system configuration and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your super admin account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  defaultValue="Admin User"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  defaultValue="admin@nsscare.org"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Phone</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  defaultValue="+91 9876543210"
                />
              </div>
              <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Configure platform-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-gray-900 mb-1">Auto-approve Colleges</p>
                  <p className="text-sm text-gray-600">Automatically approve verified college registrations</p>
                </div>
                <input type="checkbox" className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-gray-900 mb-1">Email Notifications</p>
                  <p className="text-sm text-gray-600">Send email alerts for new registrations</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-gray-900 mb-1">SMS Alerts</p>
                  <p className="text-sm text-gray-600">Send SMS for urgent blood requests</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-gray-900 mb-1">Data Export</p>
                  <p className="text-sm text-gray-600">Allow units to export their data</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-[#0077B6] hover:bg-[#005F8D]">
                <Shield className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Enable Two-Factor Auth
              </Button>
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Login History
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Backup and data management options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Export All Data
              </Button>
              <Button variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Create Backup
              </Button>
              <Button variant="outline" className="w-full text-[#E63946] border-[#E63946] hover:bg-[#E63946] hover:text-white">
                <XCircle className="w-4 h-4 mr-2" />
                Clear Cache
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  return null;
}
