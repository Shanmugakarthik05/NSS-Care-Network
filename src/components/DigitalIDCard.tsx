import { useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Download, Share2, CheckCircle, Upload, Camera } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";
import defaultVolunteerPhoto from "figma:asset/ee35148de1070cc99441b36009f709990981e8df.png";

interface DigitalIDCardProps {
  volunteer: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    bloodGroup?: string;
    joinDate?: string;
  };
}

export function DigitalIDCard({ volunteer }: DigitalIDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string>(() => {
    // Get stored photo from localStorage
    const stored = localStorage.getItem(`volunteer_photo_${volunteer.email}`);
    return stored || defaultVolunteerPhoto;
  });

  // Generate volunteer ID
  const volunteerId = volunteer.id || `NSS${Date.now().toString().slice(-6)}`;
  const validFrom = volunteer.joinDate || new Date().toISOString().split('T')[0];
  const validTo = new Date(new Date(validFrom).setFullYear(new Date(validFrom).getFullYear() + 1))
    .toISOString()
    .split('T')[0];

  const downloadCard = async () => {
    setDownloading(true);
    try {
      // Simple download by opening the card in a new window for printing
      toast.success("Opening card for download. Use Print to PDF or take a screenshot.");
      window.print();
    } catch (error) {
      toast.error("Failed to download card");
    } finally {
      setDownloading(false);
    }
  };

  const shareCard = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `NSS Volunteer ID - ${volunteer.name}`,
          text: `NSS Volunteer ID: ${volunteerId}\nName: ${volunteer.name}\nCollege: ${volunteer.college}`,
        });
      } else {
        navigator.clipboard.writeText(
          `NSS Volunteer ID: ${volunteerId}\nName: ${volunteer.name}\nCollege: ${volunteer.college}`
        );
        toast.success("ID details copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePhoto(result);
        // Store in localStorage
        localStorage.setItem(`volunteer_photo_${volunteer.email}`, result);
        toast.success("Profile photo updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* ID Card Front */}
        <Card className="overflow-hidden border-2 border-[#0077B6] shadow-lg max-w-md mx-auto">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#0077B6] to-[#00A8E8] p-6 text-white relative">
            <div className="absolute top-2 right-2">
              <Badge className="bg-white/20 backdrop-blur-sm border-white/30">
                VOLUNTEER
              </Badge>
            </div>
            <div className="flex items-start gap-4">
              {/* Photo with upload option */}
              <div className="relative">
                <div className="w-24 h-24 rounded-lg bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                  <img
                    src={profilePhoto}
                    alt={volunteer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={triggerFileInput}
                  className="absolute -bottom-2 -right-2 bg-white text-[#0077B6] p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  title="Upload photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-1">{volunteer.name}</h3>
                <p className="text-white/90 text-sm">{volunteer.college}</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            {/* ID Number */}
            <div className="text-center py-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Volunteer ID</p>
              <p className="text-2xl tracking-wider text-[#0077B6]">{volunteerId}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Blood Group</p>
                <p className="text-[#E63946]">{volunteer.bloodGroup || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Phone</p>
                <p className="text-sm">{volunteer.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Email</p>
                <p className="text-sm truncate">{volunteer.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>

            {/* Validity */}
            <div className="flex justify-between text-xs text-gray-600 pt-4 border-t">
              <div>
                <p className="mb-1">Valid From</p>
                <p className="text-gray-900">{new Date(validFrom).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="mb-1">Valid Until</p>
                <p className="text-gray-900">{new Date(validTo).toLocaleDateString()}</p>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center pt-4">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center text-xs text-gray-500">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded" />
                  <p className="mt-2">QR Code</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-600">National Service Scheme (NSS)</p>
              <p className="text-xs text-gray-500">Care Network Portal</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-3 max-w-md mx-auto">
        <Button
          onClick={downloadCard}
          disabled={downloading}
          className="flex-1 bg-[#0077B6] hover:bg-[#005f8f]"
        >
          <Download className="w-4 h-4 mr-2" />
          {downloading ? "Processing..." : "Download Card"}
        </Button>
        <Button
          onClick={shareCard}
          variant="outline"
          className="flex-1 border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6] hover:text-white"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .relative, .relative * {
            visibility: visible;
          }
          .relative {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}
