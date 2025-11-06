import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertCircle, MapPin, Phone, User, FileText, Camera, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { reliefRequestsApi } from "../utils/api";

export function RequestReliefForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    district: "",
    helpType: "",
    description: "",
    urgency: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await reliefRequestsApi.create({
        ...formData,
        status: "pending",
        requestDate: new Date().toISOString(),
      });
      
      toast.success("Help request submitted successfully!", {
        description: "Nearby NSS units and volunteers have been notified.",
      });
      
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          phone: "",
          location: "",
          district: "",
          helpType: "",
          description: "",
          urgency: "medium",
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to submit request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl text-gray-900 mb-2">Request Received!</h3>
          <p className="text-gray-600 mb-1">
            We've notified nearby NSS units and volunteers.
          </p>
          <p className="text-sm text-gray-500">
            You'll be contacted shortly. Stay safe!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-[#E63946]" />
          </div>
          <div>
            <CardTitle className="text-gray-900">Request Emergency Help</CardTitle>
            <CardDescription>
              Fill in the details below and we'll notify nearby NSS units immediately
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Information */}
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

          {/* Location Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                Specific Location *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Street/Area name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">District *</Label>
              <Select value={formData.district} onValueChange={(v) => handleChange("district", v)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Coimbatore">Coimbatore</SelectItem>
                  <SelectItem value="Madurai">Madurai</SelectItem>
                  <SelectItem value="Trichy">Trichy</SelectItem>
                  <SelectItem value="Salem">Salem</SelectItem>
                  <SelectItem value="Thanjavur">Thanjavur</SelectItem>
                  <SelectItem value="Tirunelveli">Tirunelveli</SelectItem>
                  <SelectItem value="Vellore">Vellore</SelectItem>
                  <SelectItem value="Kanyakumari">Kanyakumari</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Help Type and Urgency */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="helpType">Type of Help Needed *</Label>
              <Select value={formData.helpType} onValueChange={(v) => handleChange("helpType", v)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select help type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Medical">Medical Assistance</SelectItem>
                  <SelectItem value="Rescue">Rescue/Evacuation</SelectItem>
                  <SelectItem value="Clothes">Clothes</SelectItem>
                  <SelectItem value="Shelter">Shelter</SelectItem>
                  <SelectItem value="Water">Clean Water</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level *</Label>
              <Select value={formData.urgency} onValueChange={(v) => handleChange("urgency", v)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">🔴 Critical - Immediate</SelectItem>
                  <SelectItem value="high">🟠 High - Within hours</SelectItem>
                  <SelectItem value="medium">🟡 Medium - Within a day</SelectItem>
                  <SelectItem value="low">🟢 Low - Not urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-600" />
              Describe Your Situation *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Please provide details about your situation and what help you need..."
              rows={4}
              required
            />
          </div>

          {/* Emergency Notice */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-[#E63946] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-gray-900 mb-1">Emergency Notice</p>
                <p className="text-gray-600">
                  Your request will be immediately sent to nearby NSS college units and volunteers. 
                  For life-threatening emergencies, please also call emergency services (108/112).
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setFormData({
                name: "",
                phone: "",
                location: "",
                district: "",
                helpType: "",
                description: "",
                urgency: "medium",
              })}
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#E63946] hover:bg-[#D62839]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
