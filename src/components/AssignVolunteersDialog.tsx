import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Search, UserPlus, Users } from "lucide-react";
import { volunteersApi, volunteerAssignmentsApi } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface AssignVolunteersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  camp: any;
  collegeName: string;
}

export function AssignVolunteersDialog({
  open,
  onOpenChange,
  camp,
  collegeName,
}: AssignVolunteersDialogProps) {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [roleInput, setRoleInput] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchVolunteers();
    }
  }, [open, collegeName]);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const data = await volunteersApi.getAll(collegeName);
      setVolunteers(data.volunteers || []);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      toast.error("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  const toggleVolunteer = (volunteerId: string) => {
    const newSelected = new Set(selectedVolunteers);
    if (newSelected.has(volunteerId)) {
      newSelected.delete(volunteerId);
      const newRoles = { ...roleInput };
      delete newRoles[volunteerId];
      setRoleInput(newRoles);
    } else {
      newSelected.add(volunteerId);
    }
    setSelectedVolunteers(newSelected);
  };

  const handleRoleChange = (volunteerId: string, role: string) => {
    setRoleInput({
      ...roleInput,
      [volunteerId]: role,
    });
  };

  const handleAssign = async () => {
    if (selectedVolunteers.size === 0) {
      toast.error("Please select at least one volunteer");
      return;
    }

    try {
      setSubmitting(true);
      const assignments = Array.from(selectedVolunteers).map((volunteerId) => {
        const volunteer = volunteers.find((v) => v.id === volunteerId);
        return volunteerAssignmentsApi.create({
          volunteerId,
          volunteerName: volunteer?.name || "",
          campId: camp.id,
          campTitle: camp.title,
          campDate: camp.date,
          campVenue: camp.venue,
          college: collegeName,
          role: roleInput[volunteerId] || "General Volunteer",
        });
      });

      await Promise.all(assignments);
      toast.success(
        `Successfully assigned ${selectedVolunteers.size} volunteer(s) to ${camp.title}`
      );
      onOpenChange(false);
      setSelectedVolunteers(new Set());
      setRoleInput({});
    } catch (error) {
      console.error("Error assigning volunteers:", error);
      toast.error("Failed to assign volunteers");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Volunteers to Camp</DialogTitle>
          <DialogDescription>
            Select volunteers from {collegeName} to assign to{" "}
            <strong>{camp?.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search volunteers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Count */}
          {selectedVolunteers.size > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-[#0077B6]/10 p-3">
              <Users className="h-4 w-4 text-[#0077B6]" />
              <span className="text-sm text-[#0077B6]">
                {selectedVolunteers.size} volunteer(s) selected
              </span>
            </div>
          )}

          {/* Volunteers List */}
          <ScrollArea className="h-[400px] rounded-lg border p-4">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                Loading volunteers...
              </div>
            ) : filteredVolunteers.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-sm text-gray-500">
                <UserPlus className="mb-2 h-12 w-12 text-gray-400" />
                <p>No volunteers found</p>
                <p className="text-xs">
                  {searchQuery
                    ? "Try a different search term"
                    : "Add volunteers to your college first"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredVolunteers.map((volunteer) => {
                  const isSelected = selectedVolunteers.has(volunteer.id);
                  return (
                    <div
                      key={volunteer.id}
                      className={`rounded-lg border p-4 transition-colors ${
                        isSelected
                          ? "border-[#0077B6] bg-[#0077B6]/5"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleVolunteer(volunteer.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div>
                            <Label className="cursor-pointer text-base">
                              {volunteer.name}
                            </Label>
                            <p className="text-sm text-gray-600">
                              {volunteer.email}
                            </p>
                            <div className="mt-1 flex gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs"
                              >
                                {volunteer.bloodGroup || "N/A"}
                              </Badge>
                              {volunteer.points > 0 && (
                                <Badge className="bg-[#E63946] text-xs text-white">
                                  {volunteer.points} points
                                </Badge>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="pt-2">
                              <Label
                                htmlFor={`role-${volunteer.id}`}
                                className="text-sm text-gray-600"
                              >
                                Assign Role (optional)
                              </Label>
                              <Input
                                id={`role-${volunteer.id}`}
                                placeholder="e.g., Registration Desk, Blood Collection..."
                                value={roleInput[volunteer.id] || ""}
                                onChange={(e) =>
                                  handleRoleChange(volunteer.id, e.target.value)
                                }
                                className="mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedVolunteers.size === 0 || submitting}
            className="bg-[#0077B6] hover:bg-[#005a8c]"
          >
            {submitting
              ? "Assigning..."
              : `Assign ${selectedVolunteers.size || ""} Volunteer${
                  selectedVolunteers.size !== 1 ? "s" : ""
                }`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
