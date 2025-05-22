import React from "react";
import FitnessTracker from "@/components/FitnessTracker/FitnessTracker";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Dumbbell, LogOut } from "lucide-react";
import Chatbot from "@/components/FitnessTracker/Chatbot";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Fitness Tracker Pro</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm mr-2">
                Welcome, {user.user_metadata?.full_name || user.email}
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSignOut}
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Real-Time Fitness Tracking</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track your exercises with AI-powered pose detection. Get real-time feedback on your form
              and count repetitions automatically.
            </p>
          </div>

          {/* Fitness Tracker Component */}
          <FitnessTracker />

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 bg-card rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Pose Detection</h3>
              <p className="text-muted-foreground text-sm">
                The application uses TensorFlow.js pose detection to track key body landmarks during workouts,
                providing accurate movement analysis.
              </p>
            </div>
            
            <div className="p-6 bg-card rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Rep Counter</h3>
              <p className="text-muted-foreground text-sm">
                Automatically counts your exercise repetitions in real-time using AI detection,
                helping you track your sets and maintain consistent workout records.
              </p>
            </div>
            
            <div className="p-6 bg-card rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Form Feedback</h3>
              <p className="text-muted-foreground text-sm">
                Get immediate feedback on your exercise form to help you perform exercises safely and effectively
                while maximizing results.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Fitness Tracker Pro - Web Edition | Based on <a href="https://github.com/a1harfoush/Fitness_Tracker_Pro" className="text-primary hover:underline">Fitness Tracker Pro</a>
          </p>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
};

export default Index;
