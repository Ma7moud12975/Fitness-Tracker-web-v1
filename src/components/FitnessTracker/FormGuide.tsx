
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseType, EXERCISES } from "@/services/exerciseService";
import { Info } from "lucide-react";

interface FormGuideProps {
  exerciseType: ExerciseType;
  className?: string;
}

const FormGuide: React.FC<FormGuideProps> = ({ exerciseType, className }) => {
  const exercise = EXERCISES[exerciseType];

  if (exerciseType === ExerciseType.NONE) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-base">
          <Info className="w-4 h-4 mr-2" />
          Form Guide: {exercise.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ul className="space-y-2">
            {exercise.formInstructions.map((instruction, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-primary/10 text-primary font-medium rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm">{instruction}</span>
              </li>
            ))}
          </ul>
          
          <div className="pt-2 border-t">
            <h4 className="text-sm font-medium mb-1">Muscles Targeted:</h4>
            <div className="flex flex-wrap gap-1">
              {exercise.musclesTargeted.map((muscle, index) => (
                <span 
                  key={index}
                  className="text-xs bg-secondary px-2 py-1 rounded-full"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormGuide;
