import { Droplet, Calendar, AlertCircle, Users, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ImpactCounter } from "./ImpactCounter";
import { EventCard, CampEvent } from "./EventCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { campsApi } from "../utils/api";

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [upcomingCamps, setUpcomingCamps] = useState<CampEvent[]>([]);

  useEffect(() => {
    loadUpcomingCamps();
  }, []);

  const loadUpcomingCamps = async () => {
    try {
      const response = await campsApi.getAll({ upcoming: true });
      setUpcomingCamps((response.camps || []).slice(0, 3));
    } catch (error) {
      console.error("Error loading camps:", error);
    }
  };


  const galleryImages = [
    "https://images.unsplash.com/photo-1623863568368-69e4cbe6cc0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHVkZW50cyUyMHZvbHVudGVlcnMlMjBuc3N8ZW58MXx8fHwxNzYyMjYzNDI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1758599668338-4c55a3bd0ce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzZXJ2aWNlJTIwaGVscGluZyUyMGhhbmRzfGVufDF8fHx8MTc2MjI2MzQyOHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1612468552791-27742d57610b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudHMlMjB0ZWFtd29ya3xlbnwxfHx8fDE3NjIyMzcyMTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1746806942689-f8966f63ed75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMGRvbmF0aW9uJTIwdm9sdW50ZWVyJTIwaGVscGluZ3xlbnwxfHx8fDE3NjIyNjM0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  const quickActions = [
    {
      icon: Droplet,
      title: "Find Blood Donor",
      description: "Search for blood donors in your area",
      color: "#E63946",
      action: "blood-finder",
    },
    {
      icon: Calendar,
      title: "Health Camps",
      description: "Browse and register for upcoming camps",
      color: "#0077B6",
      action: "health-camps",
    },
    {
      icon: AlertCircle,
      title: "Emergency Help",
      description: "Request immediate assistance",
      color: "#F59E0B",
      action: "emergency-help",
    },
    {
      icon: Users,
      title: "Volunteer Login",
      description: "Access your college or hospital dashboard",
      color: "#10B981",
      action: "login",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#0077B6] to-[#005f8f] text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-white mb-6">
              Your Blood, Their Life
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Join India's largest student-led blood donation and health support network.
              Together, we can save lives and build healthier communities.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => onNavigate("blood-finder")}
                className="bg-[#E63946] hover:bg-[#d12836] text-white"
                size="lg"
              >
                <Droplet className="w-5 h-5 mr-2" />
                Find Blood Donor
              </Button>
              <Button
                onClick={() => onNavigate("emergency-help")}
                variant="outline"
                className="bg-white text-[#0077B6] hover:bg-gray-100 border-white"
                size="lg"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                Request Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={() => onNavigate(action.action)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer p-6 group"
            >
              <div
                className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <action.icon className="w-6 h-6" style={{ color: action.color }} />
              </div>
              <h3 className="text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{action.description}</p>
              <div className="flex items-center text-sm group-hover:gap-2 transition-all" style={{ color: action.color }}>
                <span>Get started</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Counter */}
      <ImpactCounter />

      {/* Upcoming Camps */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-gray-900 mb-2">Upcoming Health Camps</h2>
              <p className="text-gray-600">Register now and make a difference</p>
            </div>
            <Button
              onClick={() => onNavigate("health-camps")}
              variant="outline"
              className="border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6] hover:text-white"
            >
              View All
            </Button>
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
              <div className="col-span-3 text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming camps available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-2">Moments That Matter</h2>
            <p className="text-gray-600">Real stories from our NSS community</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <ImageWithFallback
                  src={image}
                  alt={`NSS Activity ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-br from-[#E63946] to-[#d12836] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of volunteers across India in saving lives and building healthier communities.
          </p>
          <Button
            onClick={() => onNavigate("login")}
            className="bg-white text-[#E63946] hover:bg-gray-100"
            size="lg"
          >
            Join NSS Network
          </Button>
        </div>
      </div>
    </div>
  );
}
