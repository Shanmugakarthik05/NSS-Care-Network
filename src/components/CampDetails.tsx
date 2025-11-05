import { Calendar, MapPin, Building2, Users, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { CampEvent } from "./EventCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { campsApi } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface CampDetailsProps {
  event: CampEvent;
  onBack: () => void;
}

export function CampDetails({ event, onBack }: CampDetailsProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setRegistering(true);

    try {
      const response = await campsApi.register(event.id, {
        name,
        phone,
        email,
      });

      if (response.success) {
        setRegistered(true);
        toast.success("Successfully registered for the camp!");
      }
    } catch (error) {
      console.error("Error registering for camp:", error);
      toast.error("Failed to register. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#0077B6] to-[#005f8f] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Camps
          </Button>
          <h1 className="text-white">{event.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <ImageWithFallback
                src={event.image}
                alt={event.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Badge className="bg-[#E63946] hover:bg-[#E63946]">
                  {event.type}
                </Badge>
                {event.spotsAvailable && event.spotsAvailable < 20 && (
                  <Badge variant="outline" className="border-orange-500 text-orange-600">
                    Limited Spots
                  </Badge>
                )}
              </div>

              <h2 className="text-gray-900 mb-4">Event Details</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#0077B6] mt-0.5" />
                  <div>
                    <p className="text-gray-900">Date & Time</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(event.date)} • {event.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#0077B6] mt-0.5" />
                  <div>
                    <p className="text-gray-900">Venue</p>
                    <p className="text-sm text-gray-600">{event.venue}</p>
                    <a
                      href="#"
                      className="text-sm text-[#0077B6] hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      View on Map
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-[#0077B6] mt-0.5" />
                  <div>
                    <p className="text-gray-900">Organized By</p>
                    <p className="text-sm text-gray-600">{event.organizer}</p>
                    <Badge variant="outline" className="mt-1">
                      {event.organizerType === "college" ? "College NSS Unit" : "Hospital"}
                    </Badge>
                  </div>
                </div>

                {event.spotsAvailable && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#0077B6] mt-0.5" />
                    <div>
                      <p className="text-gray-900">Available Spots</p>
                      <p className="text-sm text-gray-600">
                        {event.spotsAvailable} registrations available
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* About This Camp */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-900 mb-4">About This Camp</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This health camp is organized to provide free medical services to the community.
                Our team of experienced medical professionals will conduct comprehensive health
                checkups and provide guidance on maintaining a healthy lifestyle.
              </p>
              <h3 className="text-gray-900 mb-3">What to Expect:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0077B6] mt-2"></div>
                  <span>Free health screening and consultation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0077B6] mt-2"></div>
                  <span>Expert medical advice from qualified doctors</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0077B6] mt-2"></div>
                  <span>Distribution of health awareness materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0077B6] mt-2"></div>
                  <span>Refreshments and certificates for participants</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Registration Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              {!registered ? (
                <>
                  <h3 className="text-gray-900 mb-4">Register for This Camp</h3>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={registering}
                      className="w-full bg-[#E63946] hover:bg-[#d12836]"
                    >
                      {registering ? "Registering..." : "Register Now"}
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 mt-4">
                    By registering, you agree to receive updates about this event.
                  </p>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-gray-900 mb-2">Registration Successful!</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    You've been registered for this camp. Check your email for confirmation details.
                  </p>
                  <Button
                    onClick={() => {
                      setRegistered(false);
                      setName("");
                      setPhone("");
                      setEmail("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Register Another Person
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
