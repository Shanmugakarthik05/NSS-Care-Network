import { useState, useEffect } from "react";
import { MissionCard, Mission } from "./MissionCard";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlertCircle, Droplets, Wind, Flame, Mountain, Stethoscope, Filter } from "lucide-react";
import { reliefMissionsApi } from "../utils/api";

interface EmergencyFeedProps {
  onViewDetails?: (mission: Mission) => void;
  onJoinMission?: (mission: Mission) => void;
  userType?: string;
}

export function EmergencyFeed({ onViewDetails, onJoinMission, userType }: EmergencyFeedProps) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "controlled" | "resolved">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    loadMissions();
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(loadMissions, 30000);
    return () => clearInterval(interval);
  }, [filter, typeFilter]);

  const loadMissions = async () => {
    try {
      const filters: any = {};
      if (filter !== "all") filters.status = filter;
      if (typeFilter !== "all") filters.type = typeFilter;
      
      const data = await reliefMissionsApi.getAll(filters);
      setMissions(data.missions || []);
    } catch (error) {
      console.error("Failed to load missions:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeMissions = missions.filter(m => m.status === "active");
  const stats = {
    total: missions.length,
    active: activeMissions.length,
    controlled: missions.filter(m => m.status === "controlled").length,
    resolved: missions.filter(m => m.status === "resolved").length,
  };

  const filteredMissions = filter === "all" ? missions : missions.filter(m => m.status === filter);

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Active Emergencies</p>
              <p className="text-3xl mt-1">{stats.active}</p>
            </div>
            <AlertCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Under Control</p>
              <p className="text-3xl mt-1">{stats.controlled}</p>
            </div>
            <AlertCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Resolved</p>
              <p className="text-3xl mt-1">{stats.resolved}</p>
            </div>
            <AlertCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Missions</p>
              <p className="text-3xl mt-1">{stats.total}</p>
            </div>
            <AlertCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Filter by Type:</span>
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={typeFilter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTypeFilter("all")}
            >
              All
            </Badge>
            <Badge
              variant={typeFilter === "flood" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTypeFilter("flood")}
            >
              <Droplets className="w-3 h-3 mr-1" />
              Flood
            </Badge>
            <Badge
              variant={typeFilter === "cyclone" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTypeFilter("cyclone")}
            >
              <Wind className="w-3 h-3 mr-1" />
              Cyclone
            </Badge>
            <Badge
              variant={typeFilter === "drought" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTypeFilter("drought")}
            >
              <Flame className="w-3 h-3 mr-1" />
              Drought
            </Badge>
            <Badge
              variant={typeFilter === "medical" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTypeFilter("medical")}
            >
              <Stethoscope className="w-3 h-3 mr-1" />
              Medical
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs for Status */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList className="grid w-full grid-cols-4 max-w-xl">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="controlled">Controlled ({stats.controlled})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                </div>
              ))}
            </div>
          ) : filteredMissions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No missions found</p>
              <p className="text-sm text-gray-500 mt-1">
                {filter === "active" 
                  ? "No active emergencies at the moment" 
                  : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onViewDetails={onViewDetails}
                  onJoin={onJoinMission}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
