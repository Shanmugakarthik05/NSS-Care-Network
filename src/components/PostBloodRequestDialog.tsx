import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { bloodRequestsApi } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { Plus } from "lucide-react";

interface PostBloodRequestDialogProps {
  trigger?: React.ReactNode;
  hospitalName?: string;
  onSuccess?: () => void;
}

export function PostBloodRequestDialog({ trigger, hospitalName, onSuccess }: PostBloodRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: "",
    units: "",
    hospital: hospitalName || "",
    urgent: false,
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await bloodRequestsApi.create({
        bloodGroup: formData.bloodGroup,
        units: parseInt(formData.units),
        hospital: formData.hospital,
        urgent: formData.urgent,
      });
      
      if (response.success) {
        toast.success("Blood request posted successfully!");
        setOpen(false);
        setFormData({
          bloodGroup: "",
          units: "",
          hospital: hospitalName || "",
          urgent: false,
        });
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error posting blood request:", error);
      toast.error("Failed to post blood request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#E63946] hover:bg-[#d12836]">
            <Plus className="w-4 h-4 mr-2" />
            Post Blood Request
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Post Blood Request</DialogTitle>
          <DialogDescription>
            Request blood units from NSS network donors
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bloodGroup">Blood Group Required *</Label>
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
            <Label htmlFor="units">Number of Units *</Label>
            <Input
              id="units"
              type="number"
              min="1"
              max="10"
              value={formData.units}
              onChange={(e) => handleChange("units", e.target.value)}
              placeholder="Enter number of units needed"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              1 unit = approximately 450ml
            </p>
          </div>

          <div>
            <Label htmlFor="hospital">Hospital Name *</Label>
            <Input
              id="hospital"
              value={formData.hospital}
              onChange={(e) => handleChange("hospital", e.target.value)}
              placeholder="Enter hospital name"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgent"
              checked={formData.urgent}
              onCheckedChange={(checked) => handleChange("urgent", checked as boolean)}
            />
            <Label
              htmlFor="urgent"
              className="text-sm cursor-pointer"
            >
              Mark as urgent (emergency case)
            </Label>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-900">
              <strong>Note:</strong> Your request will be visible to all NSS units
              and registered blood donors in the network.
            </p>
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
              {submitting ? "Posting..." : "Post Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
