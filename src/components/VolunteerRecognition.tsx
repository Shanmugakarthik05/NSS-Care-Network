import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Award, Clock, Target, Trophy, Star, Zap } from "lucide-react";
import { Progress } from "./ui/progress";

interface VolunteerRecognitionProps {
  hoursServed: number;
  campsAttended: number;
  points: number;
}

export function VolunteerRecognition({
  hoursServed,
  campsAttended,
  points,
}: VolunteerRecognitionProps) {
  // Calculate level based on points
  const getLevel = (pts: number) => {
    if (pts >= 1000) return { name: "Champion", icon: Trophy, color: "text-yellow-500" };
    if (pts >= 500) return { name: "Expert", icon: Star, color: "text-purple-500" };
    if (pts >= 250) return { name: "Advanced", icon: Zap, color: "text-blue-500" };
    if (pts >= 100) return { name: "Intermediate", icon: Target, color: "text-green-500" };
    return { name: "Beginner", icon: Award, color: "text-gray-500" };
  };

  // Calculate badges earned
  const badges = [];
  if (hoursServed >= 50) badges.push({ name: "50+ Hours", icon: Clock, color: "bg-blue-500" });
  if (hoursServed >= 100) badges.push({ name: "Century", icon: Clock, color: "bg-purple-500" });
  if (campsAttended >= 5) badges.push({ name: "Regular", icon: Award, color: "bg-green-500" });
  if (campsAttended >= 10) badges.push({ name: "Dedicated", icon: Star, color: "bg-yellow-500" });
  if (points >= 500) badges.push({ name: "Top Contributor", icon: Trophy, color: "bg-red-500" });

  const currentLevel = getLevel(points);
  const LevelIcon = currentLevel.icon;

  // Calculate progress to next level
  const nextLevelThreshold = points >= 1000 ? 1000 : points >= 500 ? 1000 : points >= 250 ? 500 : points >= 100 ? 250 : 100;
  const prevLevelThreshold = points >= 1000 ? 1000 : points >= 500 ? 500 : points >= 250 ? 250 : points >= 100 ? 100 : 0;
  const progressPercentage = ((points - prevLevelThreshold) / (nextLevelThreshold - prevLevelThreshold)) * 100;

  return (
    <div className="space-y-4">
      {/* Current Level */}
      <Card className="border-[#0077B6]/20 bg-gradient-to-br from-[#0077B6]/5 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LevelIcon className={`h-6 w-6 ${currentLevel.color}`} />
            Volunteer Level: {currentLevel.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl text-[#E63946]">{points}</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
            <div>
              <div className="text-3xl text-[#0077B6]">{hoursServed}</div>
              <div className="text-sm text-gray-600">Hours</div>
            </div>
            <div>
              <div className="text-3xl text-gray-900">{campsAttended}</div>
              <div className="text-sm text-gray-600">Camps</div>
            </div>
          </div>

          {points < 1000 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress to next level</span>
                <span>{Math.min(100, Math.round(progressPercentage))}%</span>
              </div>
              <Progress value={Math.min(100, progressPercentage)} className="h-2" />
              <p className="text-xs text-gray-500">
                {nextLevelThreshold - points} more points to reach the next level
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badges */}
      {badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#E63946]" />
              Achievements Unlocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, index) => {
                const BadgeIcon = badge.icon;
                return (
                  <Badge
                    key={index}
                    className={`${badge.color} text-white flex items-center gap-1 px-3 py-1.5`}
                  >
                    <BadgeIcon className="h-3 w-3" />
                    {badge.name}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Points Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">How Points Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>• Service hour</span>
            <span className="text-[#0077B6]">10 points</span>
          </div>
          <div className="flex justify-between">
            <span>• Camp completion</span>
            <span className="text-[#0077B6]">Auto-calculated</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
