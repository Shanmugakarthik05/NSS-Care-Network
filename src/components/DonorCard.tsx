import { Phone, MapPin, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";

export interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  location: string;
  college: string;
  verified: boolean;
  phone: string;
  lastDonation?: string;
}

interface DonorCardProps {
  donor: Donor;
  showUrgent?: boolean;
}

export function DonorCard({ donor, showUrgent }: DonorCardProps) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  const maskPhone = (phone: string) => {
    return `${phone.slice(0, 3)}****${phone.slice(-2)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-gray-900">{donor.name}</h3>
            {donor.verified && (
              <Shield className="w-4 h-4 text-green-600 fill-green-100" />
            )}
          </div>
          <p className="text-sm text-gray-600">{donor.college}</p>
        </div>
        <div className="flex gap-2">
          <Badge
            className="bg-[#E63946] hover:bg-[#E63946] text-white"
          >
            {donor.bloodGroup}
          </Badge>
          {showUrgent && (
            <Badge className="bg-orange-500 hover:bg-orange-500 text-white">
              Urgent
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{donor.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span className="text-sm">
            {phoneRevealed ? donor.phone : maskPhone(donor.phone)}
          </span>
        </div>
        {donor.lastDonation && (
          <p className="text-xs text-gray-500">
            Last donation: {donor.lastDonation}
          </p>
        )}
      </div>

      <Button
        onClick={() => setPhoneRevealed(!phoneRevealed)}
        variant="outline"
        className="w-full border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6] hover:text-white"
      >
        {phoneRevealed ? "Hide Contact" : "Show Contact"}
      </Button>
    </div>
  );
}
