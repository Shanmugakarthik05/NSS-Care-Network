import { AlertCircle, Upload, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { helpRequestsApi } from "../utils/api";
import { toast } from "sonner@2.0.3";

export function EmergencyHelpRequest() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [helpType, setHelpType] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestId, setRequestId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);

    try {
      const response = await helpRequestsApi.create({
        name,
        phone,
        location,
        helpType,
        description,
        urgent: helpType === "Blood Requirement" || helpType === "Medical Emergency",
      });

      if (response.success) {
        setRequestId(response.request.id);
        setSubmitted(true);
        toast.success("Emergency request submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting help request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const helpTypes = [
    "Blood Requirement",
    "Medical Emergency",
    "Ambulance Required",
    "Medicine/Medical Supplies",
    "Other Health Support",
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-gray-900 mb-2">Request Submitted Successfully</h2>
            <p className="text-gray-600 mb-6">
              Your emergency help request has been received. Our nearest NSS units and hospitals
              have been notified. Someone will contact you shortly.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                <strong>Request ID:</strong> {requestId}
              </p>
              <p className="text-sm text-blue-900 mt-1">
                Please save this ID for reference.
              </p>
            </div>
            <Button
              onClick={() => {
                setSubmitted(false);
                setName("");
                setPhone("");
                setLocation("");
                setHelpType("");
                setDescription("");
                setRequestId("");
              }}
              className="w-full bg-[#0077B6] hover:bg-[#005f8f]"
            >
              Submit Another Request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#E63946] to-[#d12836] text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8" />
            <h1 className="text-white">Emergency Help Request</h1>
          </div>
          <p className="text-white/90">
            Submit your emergency request and get immediate assistance from nearby NSS units and hospitals
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-orange-900 mb-1">
                  <strong>For Life-Threatening Emergencies:</strong>
                </p>
                <p className="text-sm text-orange-800">
                  Please call emergency services (108/112) immediately if this is a critical medical emergency.
                  Use this form for non-critical but urgent health support needs.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter detailed address or landmark"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Include area, city, and pincode for faster response
              </p>
            </div>

            <div>
              <Label htmlFor="helpType">Type of Help Required *</Label>
              <Select value={helpType} onValueChange={setHelpType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select help type" />
                </SelectTrigger>
                <SelectContent>
                  {helpTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide details about your requirement (e.g., blood group needed, specific medicines, etc.)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Be as specific as possible to help us assist you better
              </p>
            </div>

            <div>
              <Label htmlFor="photo">Upload Photo (Optional)</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0077B6] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-gray-900 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0077B6] mt-2"></div>
                  <span>Your request will be sent to nearest NSS college units and hospitals</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0077B6] mt-2"></div>
                  <span>Volunteers will review and respond to your request</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0077B6] mt-2"></div>
                  <span>You'll receive a call or message with assistance details</span>
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#E63946] hover:bg-[#d12836]"
              size="lg"
            >
              {submitting ? "Submitting..." : "Submit Emergency Request"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
