import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

// Dummy challenges for demonstration
const challenges = [
  {
    icon: <Dumbbell className="w-6 h-6 text-purple-400" />, 
    title: "Weekly Warrior",
    description: "Complete 5 workouts this week."
  },
  {
    icon: <Dumbbell className="w-6 h-6 text-pink-400" />, 
    title: "Rep Master",
    description: "Achieve 100 reps in a single session."
  },
  {
    icon: <Dumbbell className="w-6 h-6 text-blue-400" />, 
    title: "Streak Starter",
    description: "Exercise 3 days in a row."
  }
];

export const ChallengesWidget = () => {
  return (
    <Card className="min-w-[220px] bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Challenges</span>
          <Dumbbell className="w-5 h-5 text-purple-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {challenges.map((challenge, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div>{challenge.icon}</div>
              <div>
                <div className="font-semibold text-sm">{challenge.title}</div>
                <div className="text-xs text-muted-foreground">{challenge.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}