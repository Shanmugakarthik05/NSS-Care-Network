import {
  User,
  Heart,
  Calendar,
  Clock,
  Award,
  MapPin,
  Phone,
  Mail,
  IdCard,
  MessageSquare,
  Activity,
  TrendingUp,
  Users,
  Droplet,
  CheckCircle,
  AlertCircle,
  Camera,
  Upload,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
import { volunteersApi, campsApi, bloodRequestsApi } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { DigitalIDCard } from "./DigitalIDCard";
import { VolunteerChat } from "./VolunteerChat";
import { motion } from "motion/react";
import defaultVolunteerPhoto from "figma:asset/ee35148de1070cc99441b36009f709990981e8df.png";

interface VolunteerDashboardProps {
  activeTab?: string;
}

export function VolunteerDashboard({ activeTab = "home" }: VolunteerDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [volunteerData, setVolunteerData] = useState<any>(null);
  const [upcomingCamps, setUpcomingCamps] = useState<any[]>([]);
  const [bloodRequests, setBloodRequests] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState({
    hoursLogged: 0,
    eventsParticipated: 0,
    bloodDonations: 0,
    peopleHelped: 0,
  });
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const [profilePhoto, setProfilePhoto] = useState<string>(() => {
    const stored = localStorage.getItem("volunteer_photo_rajesh.kumar@college.edu");
    return stored || defaultVolunteerPhoto;
  });

  // Mock volunteer data - in real app, this would come from authentication
  const currentVolunteer = {
    id: "VOL12345",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@college.edu",
    phone: "9876543210",
    college: "St. Xavier's College, Mumbai",
    bloodGroup: "O+",
    joinDate: "2024-01-15",
  };

  useEffect(() => {
    if (activeTab === "home") {
      loadDashboardData();
      const interval = setInterval(loadDashboardData, 30000);
      return () => clearInterval(interval);
    } else if (activeTab === "digital-id") {
      loadVolunteerProfile();
    } else if (activeTab === "chat") {
      // Chat component handles its own data
    }
  }, [activeTab]);

  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePhoto(result);
        localStorage.setItem(`volunteer_photo_${currentVolunteer.email}`, result);
        toast.success("Profile photo updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load upcoming camps
      const campsResponse = await campsApi.getAll({ upcoming: true });
      setUpcomingCamps((campsResponse.camps || []).slice(0, 4));

      // Load blood requests
      const requestsResponse = await bloodRequestsApi.getAll({ status: "active" });
      const filteredRequests = (requestsResponse.requests || [])
        .filter((req: any) => req.bloodGroup === currentVolunteer.bloodGroup)
        .slice(0, 3);
      setBloodRequests(filteredRequests);

      // Mock stats
      setStats({
        hoursLogged: 127,
        eventsParticipated: 23,
        bloodDonations: 4,
        peopleHelped: 156,
      });

      // Mock recent activities
      setActivities([
        {
          id: "1",
          type: "camp",
          title: "Participated in Blood Donation Camp",
          location: "City Hospital",
          date: new Date(Date.now() - 86400000 * 2),
          hours: 6,
        },
        {
          id: "2",
          type: "donation",
          title: "Donated Blood",
          location: "Red Cross Center",
          date: new Date(Date.now() - 86400000 * 15),
          hours: 1,
        },
        {
          id: "3",
          type: "camp",
          title: "Health Awareness Camp",
          location: "Community Center",
          date: new Date(Date.now() - 86400000 * 30),
          hours: 5,
        },
        {
          id: "4",
          type: "volunteer",
          title: "Registered New Blood Donors",
          location: "College Campus",
          date: new Date(Date.now() - 86400000 * 45),
          hours: 3,
        },
      ]);

      setVolunteerData(currentVolunteer);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadVolunteerProfile = async () => {
    setVolunteerData(currentVolunteer);
  };

  const renderStatsCard = (
    icon: React.ReactNode,
    label: string,
    value: number,
    color: string,
    suffix: string = ""
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>{icon}</div>
            <div className="text-right">
              <p className="text-2xl">{value}{suffix}</p>
              <p className="text-sm text-gray-600 mt-1">{label}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading && !volunteerData) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="home">Overview</TabsTrigger>
          <TabsTrigger value="digital-id">Digital ID</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="home" className="space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#0077B6] to-[#00A8E8] rounded-lg p-6 text-white"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl mb-2">Welcome back, {currentVolunteer.name}! 👋</h1>
                <p className="text-white/90">
                  You've logged {stats.hoursLogged} volunteer hours this year. Keep up the great work!
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="bg-white text-[#0077B6] hover:bg-gray-100"
                >
                  <IdCard className="w-4 h-4 mr-2" />
                  View Digital ID
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderStatsCard(
              <Clock className="w-6 h-6 text-[#0077B6]" />,
              "Hours Logged",
              stats.hoursLogged,
              "text-[#0077B6]",
              "h"
            )}
            {renderStatsCard(
              <Calendar className="w-6 h-6 text-[#E63946]" />,
              "Events Participated",
              stats.eventsParticipated,
              "text-[#E63946]"
            )}
            {renderStatsCard(
              <Droplet className="w-6 h-6 text-[#E63946]" />,
              "Blood Donations",
              stats.bloodDonations,
              "text-[#E63946]"
            )}
            {renderStatsCard(
              <Users className="w-6 h-6 text-[#0077B6]" />,
              "People Helped",
              stats.peopleHelped,
              "text-[#0077B6]"
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Upcoming Camps & Blood Requests */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Health Camps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#0077B6]" />
                    Upcoming Health Camps
                  </CardTitle>
                  <CardDescription>Events you can participate in</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {upcomingCamps.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No upcoming camps found</p>
                      ) : (
                        upcomingCamps.map((camp, index) => (
                          <motion.div
                            key={camp.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 border rounded-lg hover:border-[#0077B6] transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{camp.name || camp.title}</h4>
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                {camp.type || "Health Camp"}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {camp.location}
                              </p>
                              <p className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(camp.date).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              className="mt-3 bg-[#0077B6] hover:bg-[#005f8f]"
                              onClick={() => toast.success("Registration request sent!")}
                            >
                              Register to Volunteer
                            </Button>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Blood Requests Matching Your Blood Group */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-[#E63946]" />
                    Blood Requests - {currentVolunteer.bloodGroup}
                  </CardTitle>
                  <CardDescription>Urgent requests matching your blood group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bloodRequests.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        No active blood requests for your blood group
                      </p>
                    ) : (
                      bloodRequests.map((request, index) => (
                        <motion.div
                          key={request.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border border-[#E63946]/20 rounded-lg bg-red-50/50"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{request.hospital}</h4>
                              <p className="text-sm text-gray-600">{request.location}</p>
                            </div>
                            <Badge className="bg-[#E63946] text-white">
                              {request.bloodGroup}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            Units needed: {request.units || 2}
                          </p>
                          <Button
                            size="sm"
                            className="bg-[#E63946] hover:bg-[#d32f3f]"
                            onClick={() => toast.success("Response sent to hospital!")}
                          >
                            I Can Donate
                          </Button>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Profile & Activity */}
            <div className="space-y-6">
              {/* Quick Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#0077B6]" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center pb-4 border-b">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#0077B6] to-[#00A8E8] flex items-center justify-center text-white text-2xl">
                      {currentVolunteer.name.charAt(0)}
                    </div>
                    <h3 className="font-medium">{currentVolunteer.name}</h3>
                    <p className="text-sm text-gray-600">{currentVolunteer.college}</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{currentVolunteer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{currentVolunteer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Droplet className="w-4 h-4 text-[#E63946]" />
                      <span>Blood Group: <strong>{currentVolunteer.bloodGroup}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined:{" "}
                        {new Date(currentVolunteer.joinDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#0077B6] hover:bg-[#005f8f] mt-4">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Achievement Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#E63946]" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Volunteer Hours Goal</span>
                      <span className="font-medium">{stats.hoursLogged}/150h</span>
                    </div>
                    <Progress value={(stats.hoursLogged / 150) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Events This Year</span>
                      <span className="font-medium">{stats.eventsParticipated}/30</span>
                    </div>
                    <Progress value={(stats.eventsParticipated / 30) * 100} className="h-2" />
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      🏆 100+ Hours Club
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      🎯 Regular Volunteer
                    </Badge>
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      💉 Blood Donor Hero
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#0077B6]" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px] pr-4">
                    <div className="space-y-4">
                      {activities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-3"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              activity.type === "donation"
                                ? "bg-red-100 text-[#E63946]"
                                : "bg-blue-100 text-[#0077B6]"
                            }`}
                          >
                            {activity.type === "donation" ? (
                              <Droplet className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-gray-600">{activity.location}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.date.toLocaleDateString()} • {activity.hours}h
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Digital ID Tab */}
        <TabsContent value="digital-id" className="space-y-6">
          <div>
            <h2 className="text-2xl mb-2">Your Digital Volunteer ID</h2>
            <p className="text-gray-600 mb-6">
              Your official NSS volunteer identification card. Download or share it as needed.
            </p>
            {volunteerData && <DigitalIDCard volunteer={volunteerData} />}
          </div>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <div>
            <h2 className="text-2xl mb-2">Volunteer Chat</h2>
            <p className="text-gray-600 mb-6">
              Connect and coordinate with fellow volunteers from your NSS unit.
            </p>
            <VolunteerChat currentVolunteer={currentVolunteer} />
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div>
            <h2 className="text-2xl mb-2">Settings</h2>
            <p className="text-gray-600 mb-6">
              Manage your account settings and preferences.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Photo Upload */}
                  <div className="flex flex-col items-center space-y-3 pb-4 border-b">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#0077B6]/20">
                        {profilePhoto ? (
                          <img
                            src={profilePhoto}
                            alt={currentVolunteer.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#0077B6] to-[#00A8E8] flex items-center justify-center text-white text-2xl">
                            {currentVolunteer.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => profilePhotoInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-[#0077B6] text-white p-2 rounded-full shadow-lg hover:bg-[#005f8f] transition-colors"
                        title="Upload photo"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input
                        ref={profilePhotoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePhotoUpload}
                        className="hidden"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Profile Photo</p>
                      <p className="text-xs text-gray-500">Click camera icon to upload</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      defaultValue={currentVolunteer.name}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Email</label>
                    <input
                      type="email"
                      defaultValue={currentVolunteer.email}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Phone</label>
                    <input
                      type="tel"
                      defaultValue={currentVolunteer.phone}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">College/Institution</label>
                    <input
                      type="text"
                      defaultValue={currentVolunteer.college}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Blood Group</label>
                    <select
                      defaultValue={currentVolunteer.bloodGroup}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <Button
                    className="w-full bg-[#0077B6] hover:bg-[#005f8f]"
                    onClick={() => toast.success("Profile updated successfully!")}
                  >
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Blood Request Alerts</p>
                      <p className="text-sm text-gray-600">Get notified of urgent blood requests</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Event Reminders</p>
                      <p className="text-sm text-gray-600">Reminders for registered events</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Chat Messages</p>
                      <p className="text-sm text-gray-600">Get notified of new chat messages</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your information visibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Show Blood Group</p>
                      <p className="text-sm text-gray-600">Visible to other volunteers</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Show Contact Info</p>
                      <p className="text-sm text-gray-600">Phone and email visibility</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Activity Status</p>
                      <p className="text-sm text-gray-600">Show online/offline status in chat</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full border-[#0077B6] text-[#0077B6]"
                    onClick={() => toast.success("Password reset link sent to your email")}
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => toast.success("Data export initiated")}
                  >
                    Download My Data
                  </Button>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-3">
                      Permanently delete your account and all associated data.
                    </p>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => toast.error("Please contact admin to delete your account")}
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
