import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Phone,
  Building2,
  AlertCircle,
  Loader2,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { reliefMissionsApi } from "../utils/api";

interface VolunteerNeed {
  type: string;
  needed: number;
}

export function MissionManagement() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "flood",
    location: "",
    district: "",
    startDate: "",
    endDate: "",
    description: "",
    organizedBy: "",
    contactPerson: "",
    contactPhone: "",
  });
  const [volunteerNeeds, setVolunteerNeeds] = useState<VolunteerNeed[]>([
    { type: "Food Preparation", needed: 20 },
    { type: "Medical Team", needed: 5 },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (volunteerNeeds.length === 0) {
      toast.error("Please add at least one volunteer requirement");
      return;
    }

    setLoading(true);

    try {
      await reliefMissionsApi.create({
        ...formData,
        status: "active",
        volunteers: volunteerNeeds.map(v => ({ ...v, assigned: 0 })),
        createdAt: new Date().toISOString(),
      });
      
      toast.success("Mission created successfully!", {
        description: "NSS units and volunteers have been notified.",
      });
      
      // Reset form
      setFormData({
        title: "",
        type: "flood",
        location: "",
        district: "",
        startDate: "",
        endDate: "",
        description: "",
        organizedBy: "",
        contactPerson: "",
        contactPhone: "",
      });
      setVolunteerNeeds([
        { type: "Food Preparation", needed: 20 },
        { type: "Medical Team", needed: 5 },
      ]);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create mission:", error);
      toast.error("Failed to create mission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addVolunteerNeed = () => {
    setVolunteerNeeds([...volunteerNeeds, { type: "", needed: 0 }]);
  };

  const updateVolunteerNeed = (index: number, field: keyof VolunteerNeed, value: string | number) => {
    const updated = [...volunteerNeeds];
    updated[index] = { ...updated[index], [field]: value };
    setVolunteerNeeds(updated);
  };

  const removeVolunteerNeed = (index: number) => {
    setVolunteerNeeds(volunteerNeeds.filter((_, i) => i !== index));
  };

  if (!showForm) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mission Management</CardTitle>
            <CardDescription>
              Create and manage disaster relief missions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowForm(true)}
              className="w-full md:w-auto bg-[#E63946] hover:bg-[#D62839]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Mission
            </Button>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#0077B6] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-gray-900 mb-2">Quick Guide</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Create missions for disasters and relief operations</li>
                <li>Specify volunteer requirements for each category</li>
                <li>NSS units and volunteers will be automatically notified</li>
                <li>Track mission progress in real-time</li>
                <li>Generate impact reports after completion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-[#E63946]" />
          </div>
          <div>
            <CardTitle className="text-gray-900">Create Relief Mission</CardTitle>
            <CardDescription>
              Set up a new disaster relief or public service mission
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mission Information */}
          <div className="space-y-4">
            <h4 className="text-sm text-gray-900">Mission Information</h4>
            
            <div className="space-y-2">
              <Label htmlFor="title">Mission Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Flood Relief Mission - Thanjavur"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Disaster Type *</Label>
                <Select value={formData.type} onValueChange={(v) => handleChange("type", v)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flood">Flood</SelectItem>
                    <SelectItem value="cyclone">Cyclone</SelectItem>
                    <SelectItem value="drought">Drought</SelectItem>
                    <SelectItem value="earthquake">Earthquake</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="medical">Medical Emergency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizedBy" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  Organized By *
                </Label>
                <Input
                  id="organizedBy"
                  value={formData.organizedBy}
                  onChange={(e) => handleChange("organizedBy", e.target.value)}
                  placeholder="NSS Care Network + Organization"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mission Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the mission objectives and requirements..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="text-sm text-gray-900">Location Details</h4>
            
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
                  placeholder="Area/Zone name"
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
                    <SelectItem value="Thanjavur">Thanjavur</SelectItem>
                    <SelectItem value="Salem">Salem</SelectItem>
                    <SelectItem value="Tirunelveli">Tirunelveli</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="text-sm text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              Mission Timeline
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm text-gray-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-600" />
              Contact Information
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Officer *</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                  placeholder="Officer name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  placeholder="98765 43210"
                  required
                />
              </div>
            </div>
          </div>

          {/* Volunteer Requirements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                Volunteer Requirements *
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVolunteerNeed}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Category
              </Button>
            </div>

            <div className="space-y-3">
              {volunteerNeeds.map((need, idx) => (
                <div key={idx} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`type-${idx}`}>Category</Label>
                    <Select
                      value={need.type}
                      onValueChange={(v) => updateVolunteerNeed(idx, "type", v)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food Preparation">Food Preparation</SelectItem>
                        <SelectItem value="Medical Team">Medical Team</SelectItem>
                        <SelectItem value="Supply Transport">Supply Transport</SelectItem>
                        <SelectItem value="Shelter Setup">Shelter Setup</SelectItem>
                        <SelectItem value="Relief Distribution">Relief Distribution</SelectItem>
                        <SelectItem value="Rescue Operations">Rescue Operations</SelectItem>
                        <SelectItem value="Counseling">Counseling</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32 space-y-2">
                    <Label htmlFor={`needed-${idx}`}>Needed</Label>
                    <Input
                      id={`needed-${idx}`}
                      type="number"
                      min="1"
                      value={need.needed}
                      onChange={(e) => updateVolunteerNeed(idx, "needed", parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeVolunteerNeed(idx)}
                    disabled={volunteerNeeds.length === 1}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>

            {volunteerNeeds.length > 0 && (
              <div className="flex gap-2 flex-wrap pt-2">
                {volunteerNeeds.map((need, idx) => (
                  <Badge key={idx} variant="secondary">
                    {need.type || "Unnamed"}: {need.needed} volunteers
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#E63946] hover:bg-[#D62839]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Mission
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
