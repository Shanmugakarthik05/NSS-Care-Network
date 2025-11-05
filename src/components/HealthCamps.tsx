import { Calendar, Filter, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { EventCard, CampEvent } from "./EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { campsApi } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface HealthCampsProps {
  onNavigate: (page: string, data?: any) => void;
}

export function HealthCamps({ onNavigate }: HealthCampsProps) {
  const [campType, setCampType] = useState("");
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allCamps, setAllCamps] = useState<CampEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCamps();
  }, []);

  const loadCamps = async () => {
    setLoading(true);
    try {
      const response = await campsApi.getAll();
      setAllCamps(response.camps || []);
    } catch (error) {
      console.error("Error fetching camps:", error);
      toast.error("Failed to fetch camps. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    try {
      const response = await campsApi.getAll({
        type: campType && campType !== "all" ? campType : undefined,
        location: location && location !== "all" ? location : undefined,
      });
      setAllCamps(response.camps || []);
    } catch (error) {
      console.error("Error filtering camps:", error);
      toast.error("Failed to filter camps. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const upcomingCamps = allCamps.filter((camp) => {
    const campDate = new Date(camp.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    campDate.setHours(0, 0, 0, 0);
    return campDate >= today;
  });

  const pastCamps = allCamps.filter((camp) => {
    const campDate = new Date(camp.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    campDate.setHours(0, 0, 0, 0);
    return campDate < today;
  });

  const campTypes = [
    "Blood Donation",
    "Eye Care",
    "Dental Care",
    "General Health",
    "Women's Health",
    "Diabetes",
  ];

  const locations = ["Mumbai", "Pune", "Bangalore", "Delhi", "Chennai", "Kolkata"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#0077B6] to-[#005f8f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white mb-3">Health Camps & Events</h1>
          <p className="text-white/90">
            Browse and register for upcoming health camps across India
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#0077B6]" />
            <h3 className="text-gray-900">Search & Filter</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search camps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Camp Type</label>
              <Select value={campType} onValueChange={setCampType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {campTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleApplyFilters}
                disabled={loading}
                className="w-full bg-[#0077B6] hover:bg-[#005f8f]"
              >
                {loading ? "Loading..." : "Apply Filters"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming Camps
            </TabsTrigger>
            <TabsTrigger value="past">Past Camps</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B6]"></div>
                <p className="text-gray-600 mt-4">Loading camps...</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {upcomingCamps.length} upcoming camps available
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingCamps.length > 0 ? (
                    upcomingCamps.map((camp) => (
                      <EventCard
                        key={camp.id}
                        event={camp}
                        onClick={() => onNavigate("camp-details", camp)}
                      />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12 bg-gray-50 rounded-xl">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No upcoming camps available</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="past">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {pastCamps.length} past camps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastCamps.length > 0 ? (
                pastCamps.map((camp) => (
                  <EventCard
                    key={camp.id}
                    event={camp}
                    onClick={() => onNavigate("camp-details", camp)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No past camps to display</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
