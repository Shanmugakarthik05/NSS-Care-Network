import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { volunteersApi } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { Plus } from "lucide-react";

interface AddVolunteerDialogProps {
  trigger?: React.ReactNode;
  collegeName?: string;
  onSuccess?: () => void;
}

export function AddVolunteerDialog({ trigger, collegeName, onSuccess }: AddVolunteerDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: collegeName || "",
    bloodGroup: "",
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await volunteersApi.add(formData);
      
      if (response.success) {
        toast.success("Volunteer registered successfully!");
        setOpen(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          college: collegeName || "",
          bloodGroup: "",
        });
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error adding volunteer:", error);
      toast.error("Failed to register volunteer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#0077B6] hover:bg-[#005f8f]">
            <Plus className="w-4 h-4 mr-2" />
            Add Volunteer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Register Volunteer</DialogTitle>
          <DialogDescription>
            Add a new volunteer to your NSS unit
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter volunteer's full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="volunteer@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div>
            <Label htmlFor="college">College/Institution *</Label>
            <Input
              id="college"
              value={formData.college}
              onChange={(e) => handleChange("college", e.target.value)}
              placeholder="Enter college name"
              required
            />
          </div>

          <div>
            <Label htmlFor="bloodGroup">Blood Group (Optional)</Label>
            <Select
              value={formData.bloodGroup}
              onValueChange={(value) => handleChange("bloodGroup", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                {bloodGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#0077B6] hover:bg-[#005f8f]"
            >
              {submitting ? "Registering..." : "Register Volunteer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
