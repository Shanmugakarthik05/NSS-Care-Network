import { 
  TrendingUp, 
  Users, 
  Building2, 
  GraduationCap, 
  CheckCircle, 
  Clock,
  MapPin,
  Activity
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AdminDashboard() {
  const stats = [
    {
      label: "Total NSS Units",
      value: "247",
      change: "+12 this month",
      icon: GraduationCap,
      color: "#0077B6",
    },
    {
      label: "Partner Hospitals",
      value: "89",
      change: "+5 this month",
      icon: Building2,
      color: "#E63946",
    },
    {
      label: "Active Volunteers",
      value: "8,920",
      change: "+342 this month",
      icon: Users,
      color: "#10B981",
    },
    {
      label: "Total Blood Donors",
      value: "12,450",
      change: "+578 this month",
      icon: Activity,
      color: "#F59E0B",
    },
  ];

  const monthlyData = [
    { month: "Jun", camps: 45, volunteers: 6200 },
    { month: "Jul", camps: 52, volunteers: 6800 },
    { month: "Aug", camps: 61, volunteers: 7400 },
    { month: "Sep", camps: 58, volunteers: 8100 },
    { month: "Oct", camps: 67, volunteers: 8600 },
    { month: "Nov", camps: 73, volunteers: 8920 },
  ];

  const stateData = [
    { state: "Maharashtra", units: 45 },
    { state: "Karnataka", units: 38 },
    { state: "Tamil Nadu", units: 32 },
    { state: "Delhi", units: 28 },
    { state: "Gujarat", units: 25 },
  ];

  const pendingApprovals = [
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
  ];

  const recentActivities = [
    {
      id: "1",
      type: "camp",
      title: "Blood Donation Camp completed",
      location: "Mumbai",
      participants: 120,
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "registration",
      title: "New hospital registered",
      location: "Bangalore",
      participants: null,
      time: "5 hours ago",
    },
    {
      id: "3",
      type: "camp",
      title: "Eye Care Camp completed",
      location: "Chennai",
      participants: 89,
      time: "1 day ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-1">National Dashboard</h1>
          <p className="text-gray-600">Overview of NSS Care Network across India</p>
        </div>
        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
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
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
            <CardDescription>Monthly camps and volunteer participation</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 States by NSS Units</CardTitle>
            <CardDescription>State-wise distribution of registered units</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="units" fill="#0077B6" />
              </BarChart>
            </ResponsiveContainer>
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
            {pendingApprovals.map((approval) => (
              <div
                key={approval.id}
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
                  <Button size="sm" className="bg-[#10B981] hover:bg-[#059669]">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates across the network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.type === "camp" ? "bg-[#E63946]15" : "bg-[#0077B6]15"
                    }`}
                  >
                    {activity.type === "camp" ? (
                      <Activity className="w-5 h-5 text-[#E63946]" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-[#0077B6]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">{activity.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {activity.location}
                    </p>
                    {activity.participants && (
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
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
