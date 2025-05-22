import React from "react";
import { BadgeCheck, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dummy achievements for demonstration
const achievements = [
  {
    icon: <BadgeCheck className="w-6 h-6 text-green-400" />,
    title: "First Rep!",
    description: "Completed your first exercise rep."
  },
  {
    icon: <Trophy className="w-6 h-6 text-yellow-400" />,
    title: "Consistency Star",
    description: "Worked out 3 days in a row."
  },
  {
    icon: <BadgeCheck className="w-6 h-6 text-blue-400" />,
    title: "Form Master",
    description: "Achieved 90%+ form accuracy."
  }
];

export const AchievementBadges = () => {
  return (
    <Card className="min-w-[220px] bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Achievements</span>
          <Trophy className="w-5 h-5 text-yellow-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {achievements.map((ach, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div>{ach.icon}</div>
              <div>
                <div className="font-semibold text-sm">{ach.title}</div>
                <div className="text-xs text-muted-foreground">{ach.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}