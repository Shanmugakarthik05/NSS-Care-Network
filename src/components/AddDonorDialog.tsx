import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { donorsApi } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { Plus } from "lucide-react";

interface AddDonorDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AddDonorDialog({ trigger, onSuccess }: AddDonorDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    location: "",
    college: "",
    phone: "",
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await donorsApi.add(formData);
      
      if (response.success) {
        toast.success("Blood donor registered successfully!");
        setOpen(false);
        setFormData({
          name: "",
          bloodGroup: "",
          location: "",
          college: "",
          phone: "",
        });
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error adding donor:", error);
      toast.error("Failed to register donor. Please try again.");
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
          <Button className="bg-[#E63946] hover:bg-[#d12836]">
            <Plus className="w-4 h-4 mr-2" />
            Add Donor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Register Blood Donor</DialogTitle>
          <DialogDescription>
            Add a new blood donor to the network
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter donor's full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="bloodGroup">Blood Group *</Label>
            <Select
              value={formData.bloodGroup}
              onValueChange={(value) => handleChange("bloodGroup", value)}
              required
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

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="e.g., Andheri West, Mumbai"
              required
            />
          </div>

          <div>
            <Label htmlFor="college">College/Institution *</Label>
            <Input
              id="college"
              value={formData.college}
              onChange={(e) => handleChange("college", e.target.value)}
              placeholder="Enter college or institution name"
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
              className="flex-1 bg-[#E63946] hover:bg-[#d12836]"
            >
              {submitting ? "Registering..." : "Register Donor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
