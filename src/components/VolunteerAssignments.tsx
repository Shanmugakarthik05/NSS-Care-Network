import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Calendar, MapPin, Clock, CheckCircle2, Award } from "lucide-react";
import { volunteerAssignmentsApi, campsApi } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { Skeleton } from "./ui/skeleton";
import { CertificateGenerator } from "./CertificateGenerator";

interface VolunteerAssignmentsProps {
  volunteerId: string;
  volunteerName: string;
  college: string;
}

export function VolunteerAssignments({
  volunteerId,
  volunteerName,
  college,
}: VolunteerAssignmentsProps) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [camps, setCamps] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [attendanceDialog, setAttendanceDialog] = useState<any>(null);
  const [hoursInput, setHoursInput] = useState("");
  const [certificateDialog, setCertificateDialog] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const [assignmentsData, campsData] = await Promise.all([
        volunteerAssignmentsApi.getAll({ volunteerId }),
        campsApi.getAll({}),
      ]);

      setAssignments(assignmentsData.assignments || []);

      // Create a map of camps by ID
      const campsMap: Record<string, any> = {};
      (campsData.camps || []).forEach((camp: any) => {
        campsMap[camp.id] = camp;
      });
      setCamps(campsMap);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [volunteerId]);

  const handleMarkAttendance = async () => {
    if (!attendanceDialog || !hoursInput) return;

    const hours = parseFloat(hoursInput);
    if (isNaN(hours) || hours <= 0) {
      toast.error("Please enter valid hours");
      return;
    }

    try {
      setSubmitting(true);
      await volunteerAssignmentsApi.markAttendance(attendanceDialog.id, hours);
      toast.success(
        `Attendance marked! You earned ${Math.floor(hours * 10)} points!`
      );
      setAttendanceDialog(null);
      setHoursInput("");
      fetchAssignments();
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      assigned: "bg-blue-500",
      completed: "bg-green-500",
      cancelled: "bg-gray-500",
    };
    return (
      <Badge className={`${variants[status] || "bg-gray-500"} text-white`}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-gray-600">No Assignments Yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Your college admin will assign you to upcoming camps
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {assignments.map((assignment) => {
          const camp = camps[assignment.campId];
          if (!camp) return null;

          const isPastEvent = new Date(camp.date) < new Date();
          const canMarkAttendance =
            isPastEvent && !assignment.attendanceMarked && assignment.status === "assigned";

          return (
            <Card key={assignment.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#0077B6]/10 to-transparent">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{camp.title}</CardTitle>
                    <p className="mt-1 text-sm text-gray-600">{camp.type}</p>
                  </div>
                  {getStatusBadge(assignment.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-[#0077B6]" />
                    <span>
                      {new Date(camp.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 text-[#0077B6]" />
                    <span>{camp.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-[#0077B6]" />
                    <span>{camp.venue}</span>
                  </div>
                </div>

                {assignment.role && (
                  <div className="rounded-lg bg-[#E63946]/10 p-3">
                    <p className="text-sm">
                      <strong>Your Role:</strong> {assignment.role}
                    </p>
                  </div>
                )}

                {assignment.attendanceMarked && (
                  <div className="rounded-lg bg-green-50 p-3 space-y-2">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">Attendance Marked</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Hours Served: <strong>{assignment.hoursServed} hours</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Points Earned:{" "}
                      <strong className="text-[#E63946]">
                        {Math.floor(assignment.hoursServed * 10)} points
                      </strong>
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {canMarkAttendance && (
                    <Button
                      onClick={() => setAttendanceDialog(assignment)}
                      className="bg-[#0077B6] hover:bg-[#005a8c]"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark Attendance
                    </Button>
                  )}
                  {assignment.attendanceMarked && (
                    <Button
                      onClick={() =>
                        setCertificateDialog({
                          assignment,
                          camp,
                        })
                      }
                      variant="outline"
                      className="border-[#E63946] text-[#E63946] hover:bg-[#E63946]/10"
                    >
                      <Award className="mr-2 h-4 w-4" />
                      View Certificate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mark Attendance Dialog */}
      <Dialog open={!!attendanceDialog} onOpenChange={() => setAttendanceDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              Please enter the number of hours you served at this camp.
            </p>
            <div className="space-y-2">
              <Label htmlFor="hours">Hours Served</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g., 4.5"
                value={hoursInput}
                onChange={(e) => setHoursInput(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                You'll earn {hoursInput ? Math.floor(parseFloat(hoursInput) * 10) : 0}{" "}
                points
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAttendanceDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleMarkAttendance}
              disabled={!hoursInput || submitting}
              className="bg-[#0077B6] hover:bg-[#005a8c]"
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate Dialog */}
      <Dialog
        open={!!certificateDialog}
        onOpenChange={() => setCertificateDialog(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Certificate of Participation</DialogTitle>
          </DialogHeader>
          {certificateDialog && (
            <CertificateGenerator
              volunteerName={volunteerName}
              campTitle={certificateDialog.camp.title}
              campDate={certificateDialog.camp.date}
              hoursServed={certificateDialog.assignment.hoursServed}
              role={certificateDialog.assignment.role || "Volunteer"}
              college={college}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
