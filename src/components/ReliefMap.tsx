import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  MapPin,
  Droplets,
  Utensils,
  Stethoscope,
  Home,
  Users,
  Navigation,
} from "lucide-react";

interface ReliefZone {
  id: string;
  name: string;
  type: "blood-camp" | "food-distribution" | "medical-aid" | "shelter" | "water-supply" | "rescue";
  location: string;
  coordinates: { lat: number; lng: number };
  status: "active" | "inactive";
  volunteers: number;
  peopleHelped: number;
}

const mockReliefZones: ReliefZone[] = [
  {
    id: "1",
    name: "Thanjavur Relief Center",
    type: "food-distribution",
    location: "Thanjavur Town Hall",
    coordinates: { lat: 10.7905, lng: 79.1378 },
    status: "active",
    volunteers: 25,
    peopleHelped: 450,
  },
  {
    id: "2",
    name: "Medical Camp - Zone A",
    type: "medical-aid",
    location: "Thanjavur District Hospital",
    coordinates: { lat: 10.7870, lng: 79.1390 },
    status: "active",
    volunteers: 12,
    peopleHelped: 180,
  },
  {
    id: "3",
    name: "Temporary Shelter Point",
    type: "shelter",
    location: "Community Center, South Zone",
    coordinates: { lat: 10.7850, lng: 79.1350 },
    status: "active",
    volunteers: 15,
    peopleHelped: 320,
  },
  {
    id: "4",
    name: "Water Distribution",
    type: "water-supply",
    location: "East Zone Market",
    coordinates: { lat: 10.7920, lng: 79.1420 },
    status: "active",
    volunteers: 8,
    peopleHelped: 560,
  },
];

const zoneIcons = {
  "blood-camp": Droplets,
  "food-distribution": Utensils,
  "medical-aid": Stethoscope,
  "shelter": Home,
  "water-supply": Droplets,
  "rescue": Users,
};

const zoneColors = {
  "blood-camp": "bg-red-500",
  "food-distribution": "bg-orange-500",
  "medical-aid": "bg-green-500",
  "shelter": "bg-blue-500",
  "water-supply": "bg-cyan-500",
  "rescue": "bg-purple-500",
};

export function ReliefMap() {
  const [selectedZone, setSelectedZone] = useState<ReliefZone | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredZones = filter === "all" 
    ? mockReliefZones 
    : mockReliefZones.filter(z => z.type === filter);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#0077B6]" />
            Relief Zones Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap mb-6">
            <Badge
              variant={filter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("all")}
            >
              All Zones
            </Badge>
            <Badge
              variant={filter === "food-distribution" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("food-distribution")}
            >
              <Utensils className="w-3 h-3 mr-1" />
              Food Distribution
            </Badge>
            <Badge
              variant={filter === "medical-aid" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("medical-aid")}
            >
              <Stethoscope className="w-3 h-3 mr-1" />
              Medical Aid
            </Badge>
            <Badge
              variant={filter === "shelter" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("shelter")}
            >
              <Home className="w-3 h-3 mr-1" />
              Shelter
            </Badge>
            <Badge
              variant={filter === "water-supply" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("water-supply")}
            >
              <Droplets className="w-3 h-3 mr-1" />
              Water Supply
            </Badge>
          </div>

          {/* Map Placeholder - In production, integrate Google Maps API */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 Q25,20 50,50 T100,50" stroke="currentColor" fill="none" strokeWidth="0.5" />
                <path d="M0,60 Q25,30 50,60 T100,60" stroke="currentColor" fill="none" strokeWidth="0.5" />
                <path d="M0,40 Q25,10 50,40 T100,40" stroke="currentColor" fill="none" strokeWidth="0.5" />
              </svg>
            </div>
            
            <div className="relative min-h-[400px] flex items-center justify-center">
              {/* Map pins */}
              <div className="relative w-full h-full">
                {filteredZones.map((zone, idx) => {
                  const Icon = zoneIcons[zone.type];
                  return (
                    <div
                      key={zone.id}
                      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${20 + idx * 20}%`,
                        top: `${30 + (idx % 2) * 30}%`,
                      }}
                      onClick={() => setSelectedZone(zone)}
                    >
                      <div className={`${zoneColors[zone.type]} w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {selectedZone?.id === zone.id && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-xl p-3 border">
                          <p className="text-sm text-gray-900 mb-1">{zone.name}</p>
                          <p className="text-xs text-gray-600 mb-2">{zone.location}</p>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Volunteers: {zone.volunteers}</span>
                            <span className="text-gray-600">Helped: {zone.peopleHelped}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Center text */}
              <div className="text-center">
                <Navigation className="w-12 h-12 text-[#0077B6] mx-auto mb-3 opacity-50" />
                <p className="text-gray-600 text-sm">
                  Interactive Map View
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Click on pins to view zone details
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(zoneIcons).map(([type, Icon]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`${zoneColors[type as keyof typeof zoneColors]} w-6 h-6 rounded-full flex items-center justify-center`}>
                  <Icon className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-gray-700 capitalize">
                  {type.replace("-", " ")}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zone List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredZones.map((zone) => {
          const Icon = zoneIcons[zone.type];
          return (
            <Card key={zone.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className={`${zoneColors[zone.type]} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 mb-1">{zone.name}</h4>
                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {zone.location}
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-blue-50 rounded p-2">
                        <p className="text-xs text-gray-600">Volunteers</p>
                        <p className="text-lg text-gray-900">{zone.volunteers}</p>
                      </div>
                      <div className="bg-green-50 rounded p-2">
                        <p className="text-xs text-gray-600">People Helped</p>
                        <p className="text-lg text-gray-900">{zone.peopleHelped}</p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full bg-[#0077B6] hover:bg-[#005A8C]">
                      <Navigation className="w-3 h-3 mr-1" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
