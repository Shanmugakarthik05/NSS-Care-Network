import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { 
  Users, 
  Phone, 
  User, 
  Building2, 
  Clock, 
  Heart,
  MapPin,
  CheckCircle,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Mission } from "./MissionCard";
import { volunteerMissionRegistrationsApi } from "../utils/api";

interface VolunteerMissionRegistrationProps {
  mission?: Mission;
  onSuccess?: () => void;
}

export function VolunteerMissionRegistration({ mission, onSuccess }: VolunteerMissionRegistrationProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    college: "",
    email: "",
    availability: "full-day",
    skills: [] as string[],
    preferredArea: "",
    emergencyContact: "",
    emergencyPhone: "",
    missionId: mission?.id || "",
  });

  useEffect(() => {
    if (mission) {
      setFormData(prev => ({ ...prev, missionId: mission.id }));
    }
  }, [mission]);

  const availableSkills = [
    "First Aid",
    "Driving",
    "Cooking",
    "Medical",
    "Logistics",
    "Communication",
    "Rescue Operations",
    "Counseling",
    "Teaching",
    "Technology",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.skills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }

    setLoading(true);

    try {
      await volunteerMissionRegistrationsApi.create({
        ...formData,
        registrationDate: new Date().toISOString(),
        status: "pending",
      });
      
      toast.success("Registration submitted successfully!", {
        description: mission 
          ? "You'll be notified once approved for this mission."
          : "You'll be contacted when a suitable mission arises.",
      });
      
      setSubmitted(true);
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (error) {
      console.error("Failed to submit registration:", error);
      toast.error("Failed to submit registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl text-gray-900 mb-2">Registration Successful!</h3>
          <p className="text-gray-600 mb-1">
            Thank you for volunteering your time and skills.
          </p>
          <p className="text-sm text-gray-500">
            {mission 
              ? "You'll be notified once your registration is approved."
              : "We'll contact you when a suitable mission arises."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Heart className="w-6 h-6 text-[#0077B6]" />
          </div>
          <div>
            <CardTitle className="text-gray-900">
              {mission ? `Register for: ${mission.title}` : "Volunteer Registration"}
            </CardTitle>
            <CardDescription>
              {mission 
                ? "Fill in your details to join this relief mission"
                : "Register as a volunteer for future relief operations"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {mission && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#0077B6] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-gray-900 mb-1">Mission Details</p>
                <p className="text-gray-600 mb-2">{mission.description}</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{mission.location}, {mission.district}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-sm text-gray-900">Personal Information</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="98765 43210"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="college" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  College/Organization *
                </Label>
                <Input
                  id="college"
                  value={formData.college}
                  onChange={(e) => handleChange("college", e.target.value)}
                  placeholder="Your college name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label htmlFor="availability" className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              Availability *
            </Label>
            <Select value={formData.availability} onValueChange={(v) => handleChange("availability", v)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-day">Full Day (8+ hours)</SelectItem>
                <SelectItem value="half-day">Half Day (4-8 hours)</SelectItem>
                <SelectItem value="few-hours">Few Hours (2-4 hours)</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              Your Skills (Select all that apply) *
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSkills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={formData.skills.includes(skill)}
                    onCheckedChange={() => toggleSkill(skill)}
                  />
                  <label
                    htmlFor={skill}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {skill}
                  </label>
                </div>
              ))}
            </div>
            {formData.skills.length > 0 && (
              <div className="flex gap-2 flex-wrap pt-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Area */}
          <div className="space-y-2">
            <Label htmlFor="preferredArea" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              Preferred Area/District (Optional)
            </Label>
            <Input
              id="preferredArea"
              value={formData.preferredArea}
              onChange={(e) => handleChange("preferredArea", e.target.value)}
              placeholder="e.g., Chennai, Madurai"
            />
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h4 className="text-sm text-gray-900">Emergency Contact</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contact Person Name *</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleChange("emergencyContact", e.target.value)}
                  placeholder="Parent/Guardian name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Contact Phone *</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                  placeholder="98765 43210"
                  required
                />
              </div>
            </div>
          </div>

          {/* Info Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-[#0077B6] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-gray-900 mb-1">Volunteer Guidelines</p>
                <ul className="text-gray-600 space-y-1 list-disc list-inside">
                  <li>You must be 18+ or have guardian permission</li>
                  <li>Training will be provided before deployment</li>
                  <li>Follow safety protocols at all times</li>
                  <li>Respect the privacy and dignity of affected people</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#0077B6] hover:bg-[#005A8C]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
