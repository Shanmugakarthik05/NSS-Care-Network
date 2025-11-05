import { Calendar, MapPin, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export interface CampEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  organizerType: "college" | "hospital";
  image: string;
  spotsAvailable?: number;
}

interface EventCardProps {
  event: CampEvent;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer">
      <div className="h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge className="bg-[#E63946] hover:bg-[#E63946]">
            {event.type}
          </Badge>
          {event.spotsAvailable !== undefined && (
            <span className="text-sm text-gray-600">
              {event.spotsAvailable} spots left
            </span>
          )}
        </div>
        <h3 className="text-gray-900 mb-3">{event.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {formatDate(event.date)} • {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">{event.organizer}</span>
          </div>
        </div>
        <Button
          onClick={onClick}
          className="w-full bg-[#0077B6] hover:bg-[#005f8f]"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
