import React, { useState } from "react";
import FitnessTracker from "@/components/FitnessTracker/FitnessTracker";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Dumbbell, LogOut } from "lucide-react";
import Chatbot from "@/components/FitnessTracker/Chatbot";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import FoodScanner from "@/components/FitnessTracker/FoodScanner";

const Index = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const [showFoodScanner, setShowFoodScanner] = useState(false);

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
          <FitnessTracker className="" />

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
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
            <div className="p-6 bg-card rounded-lg border flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Food Scanner</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Scan your food using your device's camera to get instant nutritional information and track your daily caloric intake with ease.
                </p>
              </div>
              <button
                className="w-full bg-primary text-white py-2 rounded mt-2 flex items-center justify-center gap-2 hover:bg-primary/90 transition"
                onClick={() => setShowFoodScanner(true)}
              >
                {/* Replace old icon with a modern camera icon from Lucide */}
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="inline-block align-middle">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h2l2-3h10l2 3h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                </svg>
                Scan Food
              </button>
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

      {/* Food Scanner Modal */}
      {showFoodScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative bg-card rounded-lg shadow-lg max-w-md w-full mx-4">
            <button
              className="absolute top-2 right-2 text-xl text-muted-foreground hover:text-primary"
              onClick={() => setShowFoodScanner(false)}
              aria-label="Close Food Scanner"
            >
              &times;
            </button>
            <FoodScanner />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
