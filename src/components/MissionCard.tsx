import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  MapPin,
  Calendar,
  Users,
  Phone,
  AlertCircle,
  Droplets,
  Stethoscope,
  Truck,
  Home,
  Utensils,
  Wind,
  Zap,
  Mountain,
  Flame,
  CheckCircle,
  Clock,
} from "lucide-react";

export interface Mission {
  id: string;
  title: string;
  type: "flood" | "cyclone" | "drought" | "earthquake" | "fire" | "medical" | "other";
  status: "active" | "controlled" | "resolved";
  location: string;
  district: string;
  startDate: string;
  endDate?: string;
  description: string;
  organizedBy: string;
  contactPerson: string;
  contactPhone: string;
  volunteers: {
    type: string;
    needed: number;
    assigned: number;
  }[];
  createdAt: string;
  updatedAt?: string;
}

interface MissionCardProps {
  mission: Mission;
  onViewDetails?: (mission: Mission) => void;
  onJoin?: (mission: Mission) => void;
  showActions?: boolean;
  compact?: boolean;
}

const missionIcons = {
  flood: Droplets,
  cyclone: Wind,
  drought: Flame,
  earthquake: Mountain,
  fire: Flame,
  medical: Stethoscope,
  other: AlertCircle,
};

const missionColors = {
  flood: "bg-blue-500",
  cyclone: "bg-purple-500",
  drought: "bg-orange-500",
  earthquake: "bg-red-600",
  fire: "bg-red-500",
  medical: "bg-green-500",
  other: "bg-gray-500",
};

const statusColors = {
  active: "bg-[#E63946] text-white",
  controlled: "bg-yellow-500 text-white",
  resolved: "bg-green-600 text-white",
};

const statusIcons = {
  active: AlertCircle,
  controlled: Clock,
  resolved: CheckCircle,
};

export function MissionCard({ mission, onViewDetails, onJoin, showActions = true, compact = false }: MissionCardProps) {
  const Icon = missionIcons[mission.type];
  const StatusIcon = statusIcons[mission.status];
  
  // Handle cases where volunteers array might be missing or undefined
  const volunteers = mission.volunteers || [];
  const totalNeeded = volunteers.reduce((sum, v) => sum + (v?.needed || 0), 0);
  const totalAssigned = volunteers.reduce((sum, v) => sum + (v?.assigned || 0), 0);
  const progress = totalNeeded > 0 ? (totalAssigned / totalNeeded) * 100 : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with type indicator */}
      <div className={`h-2 ${missionColors[mission.type]}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${missionColors[mission.type]} bg-opacity-10 flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${missionColors[mission.type].replace('bg-', 'text-')}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg text-gray-900 mb-1 truncate">{mission.title}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={statusColors[mission.status]}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {mission.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Location and Date */}
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4 text-[#0077B6] flex-shrink-0" />
            <span className="truncate">{mission.location}, {mission.district}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-[#0077B6] flex-shrink-0" />
            <span>
              {new Date(mission.startDate).toLocaleDateString()}
              {mission.endDate && ` - ${new Date(mission.endDate).toLocaleDateString()}`}
            </span>
          </div>
        </div>

        {/* Description */}
        {!compact && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {mission.description}
          </p>
        )}

        {/* Volunteers Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Volunteers
            </span>
            <span className="text-gray-900">
              {totalAssigned}/{totalNeeded}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Volunteer Requirements */}
        {!compact && volunteers.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <p className="text-xs text-gray-600 mb-2">Help Needed:</p>
            {volunteers.slice(0, 3).map((vol, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 flex items-center gap-2">
                  {vol.type === "Food Preparation" && <Utensils className="w-3 h-3" />}
                  {vol.type === "Medical Team" && <Stethoscope className="w-3 h-3" />}
                  {vol.type === "Supply Transport" && <Truck className="w-3 h-3" />}
                  {vol.type === "Shelter Setup" && <Home className="w-3 h-3" />}
                  {!["Food Preparation", "Medical Team", "Supply Transport", "Shelter Setup"].includes(vol.type) && (
                    <Users className="w-3 h-3" />
                  )}
                  {vol.type}
                </span>
                <span className="text-gray-600">
                  {vol.assigned}/{vol.needed}
                </span>
              </div>
            ))}
            {volunteers.length > 3 && (
              <p className="text-xs text-gray-500 pt-1">
                +{volunteers.length - 3} more categories
              </p>
            )}
          </div>
        )}

        {/* Contact */}
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-blue-50 p-2 rounded">
          <Phone className="w-4 h-4 text-[#0077B6] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="truncate block">{mission.contactPerson}</span>
            <span className="text-xs text-gray-600">{mission.contactPhone}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {onViewDetails && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onViewDetails(mission)}
              >
                View Details
              </Button>
            )}
            {onJoin && mission.status === "active" && (
              <Button
                className="flex-1 bg-[#E63946] hover:bg-[#D62839]"
                onClick={() => onJoin(mission)}
              >
                Join Mission
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
