import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  AlertCircle,
  MapPin,
  Users,
  Heart,
  BarChart3,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { EmergencyFeed } from "./EmergencyFeed";
import { RequestReliefForm } from "./RequestReliefForm";
import { VolunteerMissionRegistration } from "./VolunteerMissionRegistration";
import { ReliefMap } from "./ReliefMap";
import { MissionManagement } from "./MissionManagement";
import { MissionDetails } from "./MissionDetails";
import { Mission } from "./MissionCard";

interface DisasterReliefModuleProps {
  userType?: "public" | "college" | "hospital" | "admin" | "volunteer" | null;
}

type View = "feed" | "request-help" | "volunteer-register" | "map" | "manage" | "mission-details";

export function DisasterReliefModule({ userType }: DisasterReliefModuleProps) {
  const [activeTab, setActiveTab] = useState<View>("feed");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const handleViewMissionDetails = (mission: Mission) => {
    setSelectedMission(mission);
    setActiveTab("mission-details");
  };

  const handleJoinMission = (mission: Mission) => {
    setSelectedMission(mission);
    setActiveTab("volunteer-register");
  };

  const handleBackToFeed = () => {
    setSelectedMission(null);
    setActiveTab("feed");
  };

  // Mission Details View
  if (activeTab === "mission-details" && selectedMission) {
    return (
      <MissionDetails
        mission={selectedMission}
        onBack={handleBackToFeed}
        onJoin={handleJoinMission}
        userType={userType || undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#E63946] to-[#D62839] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl mb-2">
                  Public Service & Disaster Relief
                </h1>
                <p className="text-red-100 text-lg">
                  Coordinating NSS volunteers for community service and emergency response
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-red-100 text-sm">Active Missions</p>
                <p className="text-3xl mt-1">12</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-red-100 text-sm">Volunteers Active</p>
                <p className="text-3xl mt-1">320</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-red-100 text-sm">People Helped</p>
                <p className="text-3xl mt-1">12K+</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-red-100 text-sm">Relief Zones</p>
                <p className="text-3xl mt-1">48</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as View)}>
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm p-2 mb-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
              <TabsTrigger value="feed" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Emergency</span> Feed
              </TabsTrigger>
              
              <TabsTrigger value="request-help" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Request</span> Help
              </TabsTrigger>
              
              <TabsTrigger value="volunteer-register" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Join as</span> Volunteer
              </TabsTrigger>
              
              <TabsTrigger value="map" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Relief</span> Map
              </TabsTrigger>
              
              {(userType === "admin" || userType === "college") && (
                <TabsTrigger value="manage" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Manage</span> Missions
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* Emergency Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-2xl text-gray-900">Active Emergencies & Missions</h2>
                <p className="text-gray-600">Real-time updates on ongoing relief operations</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("request-help")}
                  className="border-[#E63946] text-[#E63946] hover:bg-red-50"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  I Need Help
                </Button>
                <Button
                  onClick={() => setActiveTab("volunteer-register")}
                  className="bg-[#0077B6] hover:bg-[#005A8C]"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Volunteer
                </Button>
              </div>
            </div>
            
            <EmergencyFeed
              onViewDetails={handleViewMissionDetails}
              onJoinMission={handleJoinMission}
              userType={userType || undefined}
            />
          </TabsContent>

          {/* Request Help Tab */}
          <TabsContent value="request-help" className="space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl text-gray-900 mb-2">Request Emergency Assistance</h2>
              <p className="text-gray-600">
                We'll immediately notify nearby NSS units and volunteers to help you
              </p>
            </div>
            
            <RequestReliefForm />
            
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-sm text-gray-500">
                For life-threatening emergencies, please call 108 (Ambulance) or 112 (Emergency Services)
              </p>
            </div>
          </TabsContent>

          {/* Volunteer Registration Tab */}
          <TabsContent value="volunteer-register" className="space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl text-gray-900 mb-2">
                {selectedMission ? "Join This Mission" : "Volunteer Registration"}
              </h2>
              <p className="text-gray-600">
                {selectedMission 
                  ? "Fill in your details to join this relief operation"
                  : "Register to participate in disaster relief and public service activities"}
              </p>
            </div>
            
            <VolunteerMissionRegistration
              mission={selectedMission || undefined}
              onSuccess={() => {
                setSelectedMission(null);
                setActiveTab("feed");
              }}
            />
          </TabsContent>

          {/* Relief Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">Live Relief Zones</h2>
              <p className="text-gray-600">
                Interactive map showing active relief centers and distribution points
              </p>
            </div>
            
            <ReliefMap />
          </TabsContent>

          {/* Mission Management Tab (Admin/College only) */}
          {(userType === "admin" || userType === "college") && (
            <TabsContent value="manage" className="space-y-6">
              <div>
                <h2 className="text-2xl text-gray-900 mb-2">Mission Management</h2>
                <p className="text-gray-600">
                  Create and coordinate disaster relief missions
                </p>
              </div>
              
              <MissionManagement />
            </TabsContent>
          )}
        </Tabs>

        {/* Info Banner */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[#0077B6] rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg text-gray-900 mb-2">About NSS Disaster Relief</h3>
              <p className="text-gray-700 mb-4">
                The National Service Scheme (NSS) coordinates volunteers for community service and disaster response. 
                Our network connects college NSS units, volunteers, and affected communities during emergencies like 
                floods, cyclones, and other disasters.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-900 mb-1">🚨 Emergency Response</p>
                  <p className="text-gray-600">Immediate help during disasters</p>
                </div>
                <div>
                  <p className="text-gray-900 mb-1">🤝 Community Service</p>
                  <p className="text-gray-600">Awareness drives & social activities</p>
                </div>
                <div>
                  <p className="text-gray-900 mb-1">💪 Volunteer Network</p>
                  <p className="text-gray-600">Trained NSS volunteers ready to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
