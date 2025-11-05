import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { campsApi } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { Plus } from "lucide-react";

interface CreateCampDialogProps {
  trigger?: React.ReactNode;
  organizerType: "college" | "hospital";
  organizerName?: string;
  onSuccess?: () => void;
}

export function CreateCampDialog({ trigger, organizerType, organizerName, onSuccess }: CreateCampDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    venue: "",
    organizer: organizerName || "",
    totalSpots: "",
  });

  const campTypes = [
    "Blood Donation",
    "General Health",
    "Eye Care",
    "Dental Care",
    "Women's Health",
    "Diabetes",
    "Mental Health",
    "Vaccination",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const totalSpots = parseInt(formData.totalSpots);
      
      const response = await campsApi.create({
        title: formData.title,
        type: formData.type,
        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        organizer: formData.organizer,
        organizerType,
        totalSpots,
        spotsAvailable: totalSpots,
        image: "https://images.unsplash.com/photo-1589104759909-e355f8999f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoJTIwY2FtcCUyMGNvbW11bml0eXxlbnwxfHx8fDE3NjIyNjM0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      });
      
      if (response.success) {
        toast.success("Health camp created successfully!");
        setOpen(false);
        setFormData({
          title: "",
          type: "",
          date: "",
          time: "",
          venue: "",
          organizer: organizerName || "",
          totalSpots: "",
        });
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error creating camp:", error);
      toast.error("Failed to create camp. Please try again.");
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
            Create Camp
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Health Camp</DialogTitle>
          <DialogDescription>
            Organize a new health camp event
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Camp Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Free Eye Checkup Camp"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Camp Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange("type", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select camp type" />
              </SelectTrigger>
              <SelectContent>
                {campTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                placeholder="e.g., 9:00 AM - 2:00 PM"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="venue">Venue *</Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) => handleChange("venue", e.target.value)}
              placeholder="Full address of the camp location"
              required
            />
          </div>

          <div>
            <Label htmlFor="organizer">Organizer Name *</Label>
            <Input
              id="organizer"
              value={formData.organizer}
              onChange={(e) => handleChange("organizer", e.target.value)}
              placeholder="Organization/Institution name"
              required
            />
          </div>

          <div>
            <Label htmlFor="totalSpots">Total Registration Spots *</Label>
            <Input
              id="totalSpots"
              type="number"
              min="1"
              value={formData.totalSpots}
              onChange={(e) => handleChange("totalSpots", e.target.value)}
              placeholder="Maximum number of participants"
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
              className="flex-1 bg-[#0077B6] hover:bg-[#005f8f]"
            >
              {submitting ? "Creating..." : "Create Camp"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
