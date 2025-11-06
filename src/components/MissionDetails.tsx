import { useState } from "react";
import { Mission } from "./MissionCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  MapPin,
  Calendar,
  Users,
  Phone,
  Building2,
  AlertCircle,
  Clock,
  CheckCircle,
  ArrowLeft,
  Utensils,
  Stethoscope,
  Truck,
  Home,
  FileText,
  TrendingUp,
} from "lucide-react";

interface MissionDetailsProps {
  mission: Mission;
  onBack: () => void;
  onJoin?: (mission: Mission) => void;
  userType?: string;
}

export function MissionDetails({ mission, onBack, onJoin, userType }: MissionDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Handle cases where volunteers array might be missing or undefined
  const volunteers = mission.volunteers || [];
  const totalNeeded = volunteers.reduce((sum, v) => sum + (v?.needed || 0), 0);
  const totalAssigned = volunteers.reduce((sum, v) => sum + (v?.assigned || 0), 0);
  const progress = totalNeeded > 0 ? (totalAssigned / totalNeeded) * 100 : 0;

  const statusColors = {
    active: "bg-[#E63946] text-white",
    controlled: "bg-yellow-500 text-white",
    resolved: "bg-green-600 text-white",
  };

  const StatusIcon = mission.status === "active" ? AlertCircle : mission.status === "controlled" ? Clock : CheckCircle;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Missions
          </Button>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={statusColors[mission.status]}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {mission.type}
                  </Badge>
                </div>
                <h1 className="text-3xl text-gray-900 mb-2">{mission.title}</h1>
                <p className="text-gray-600">{mission.description}</p>
              </div>
              {onJoin && mission.status === "active" && (
                <Button
                  className="bg-[#E63946] hover:bg-[#D62839]"
                  onClick={() => onJoin(mission)}
                >
                  Join Mission
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-5 h-5 text-[#0077B6]" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm">{mission.location}, {mission.district}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-[#0077B6]" />
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm">
                    {new Date(mission.startDate).toLocaleDateString()}
                    {mission.endDate && ` - ${new Date(mission.endDate).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 className="w-5 h-5 text-[#0077B6]" />
                <div>
                  <p className="text-xs text-gray-500">Organized By</p>
                  <p className="text-sm">{mission.organizedBy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-xl mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="w-5 h-5 text-[#0077B6]" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Contact Officer</p>
                    <p className="text-gray-900">{mission.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{mission.contactPhone}</p>
                  </div>
                  <Button className="w-full mt-4 bg-[#0077B6] hover:bg-[#005A8C]">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </CardContent>
              </Card>

              {/* Mission Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5 text-[#0077B6]" />
                    Mission Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Total Volunteers</p>
                      <p className="text-2xl text-gray-900">{totalAssigned}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Target</p>
                      <p className="text-2xl text-gray-900">{totalNeeded}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="text-gray-900">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mission Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-[#0077B6]" />
                  Mission Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{mission.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Volunteers Tab */}
          <TabsContent value="volunteers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0077B6]" />
                  Volunteer Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {volunteers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No volunteer requirements specified for this mission</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {volunteers.map((vol, idx) => {
                      const volProgress = vol.needed > 0 ? (vol.assigned / vol.needed) * 100 : 0;
                      const isFulfilled = vol.assigned >= vol.needed;

                      return (
                        <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isFulfilled ? 'bg-green-100' : 'bg-blue-100'}`}>
                              {vol.type === "Food Preparation" && <Utensils className={`w-5 h-5 ${isFulfilled ? 'text-green-600' : 'text-blue-600'}`} />}
                              {vol.type === "Medical Team" && <Stethoscope className={`w-5 h-5 ${isFulfilled ? 'text-green-600' : 'text-blue-600'}`} />}
                              {vol.type === "Supply Transport" && <Truck className={`w-5 h-5 ${isFulfilled ? 'text-green-600' : 'text-blue-600'}`} />}
                              {vol.type === "Shelter Setup" && <Home className={`w-5 h-5 ${isFulfilled ? 'text-green-600' : 'text-blue-600'}`} />}
                              {!["Food Preparation", "Medical Team", "Supply Transport", "Shelter Setup"].includes(vol.type) && (
                                <Users className={`w-5 h-5 ${isFulfilled ? 'text-green-600' : 'text-blue-600'}`} />
                              )}
                            </div>
                            <div>
                              <p className="text-gray-900">{vol.type}</p>
                              <p className="text-sm text-gray-500">
                                {vol.assigned} of {vol.needed} volunteers assigned
                              </p>
                            </div>
                          </div>
                          {isFulfilled && (
                            <Badge className="bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Fulfilled
                            </Badge>
                          )}
                        </div>
                        <Progress value={volProgress} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#0077B6]" />
                  Mission Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Overall Progress */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                    <h4 className="text-sm text-gray-700 mb-2">Overall Mission Completion</h4>
                    <div className="flex items-end gap-4">
                      <div className="text-4xl text-gray-900">{Math.round(progress)}%</div>
                      <div className="flex-1 pb-2">
                        <Progress value={progress} className="h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div>
                    <h4 className="text-sm text-gray-700 mb-4">Category Breakdown</h4>
                    <div className="space-y-4">
                      {volunteers.map((vol, idx) => {
                        const volProgress = vol.needed > 0 ? (vol.assigned / vol.needed) * 100 : 0;
                        return (
                          <div key={idx}>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-700">{vol.type}</span>
                              <span className="text-gray-900">{Math.round(volProgress)}%</span>
                            </div>
                            <Progress value={volProgress} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="border-t pt-6">
                    <h4 className="text-sm text-gray-700 mb-4">Mission Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#0077B6] rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">Mission Started</p>
                          <p className="text-xs text-gray-500">
                            {new Date(mission.startDate).toLocaleDateString()} at{" "}
                            {new Date(mission.startDate).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      {mission.endDate && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm text-gray-900">Expected Completion</p>
                            <p className="text-xs text-gray-500">
                              {new Date(mission.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
