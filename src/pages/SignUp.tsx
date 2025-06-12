import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

type SignUpStep = "account" | "personal" | "fitness";

interface UserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  fitnessLevel: string;
  fitnessGoal: string;
  activityLevel: string;
  healthConditions: string;
}

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("account");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    height: "",
    weight: "",
    fitnessLevel: "",
    fitnessGoal: "",
    activityLevel: "",
    healthConditions: "",
  });

  const handleChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAccountStepNext = () => {
    if (!userData.fullName || !userData.email || !userData.password || !userData.confirmPassword) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep("personal");
  };

  const handlePersonalStepNext = () => {
    if (!userData.gender || !userData.dateOfBirth || !userData.height || !userData.weight) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep("fitness");
  };

  const handlePersonalStepPrevious = () => {
    setCurrentStep("account");
  };

  const handleFitnessStepPrevious = () => {
    setCurrentStep("personal");
  };

  const handleCompleteRegistration = async () => {
    if (!userData.fitnessLevel || !userData.fitnessGoal || !userData.activityLevel) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Register the user with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
          },
        },
      });

      if (authError) {
        toast({
          title: "Registration Failed",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      // If user created successfully, store the additional profile information
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: authData.user.id,
              full_name: userData.fullName,
              gender: userData.gender,
              date_of_birth: userData.dateOfBirth,
              height: parseFloat(userData.height),
              weight: parseFloat(userData.weight),
              fitness_level: userData.fitnessLevel,
              goal: userData.fitnessGoal,
              daily_activity_level: userData.activityLevel,
              health_conditions: userData.healthConditions
            }
          ]);

        if (profileError) {
          toast({
            title: "Profile Creation Failed",
            description: profileError.message,
            variant: "destructive",
          });
          return;
        }

        // Save user profile to localStorage
        const userProfile = {
          name: userData.fullName,
          age: new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear(),
          gender: userData.gender,
          height: parseFloat(userData.height),
          weight: parseFloat(userData.weight),
          fitnessLevel: userData.fitnessLevel,
          fitnessGoal: userData.fitnessGoal,
          activityLevel: userData.activityLevel,
          healthConditions: userData.healthConditions || ''
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        // Dispatch event for Chatbot
        window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: userProfile }));

        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please login to continue.",
        });

        // Redirect to login page
        navigate("/login");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderAccountStep = () => {
    return (
      <>
        <div className="space-y-1.5 group animate-slideUpFadeIn" style={{ animationDelay: '200ms' }}>
          <Label htmlFor="fullName" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={userData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            required
            className="bg-[#2e333d] border-0 focus-visible:ring-1 focus-visible:ring-[#ff8000] transition-all shadow-md hover:shadow-lg font-medium"
          />
        </div>
        <div className="space-y-1.5 group animate-slideUpFadeIn" style={{ animationDelay: '300ms' }}>
          <Label htmlFor="email" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="youremail@example.com"
            value={userData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            className="bg-[#2e333d] border-0 focus-visible:ring-1 focus-visible:ring-[#ff8000] transition-all shadow-md hover:shadow-lg font-medium"
          />
        </div>
        <div className="space-y-1.5 group animate-slideUpFadeIn" style={{ animationDelay: '400ms' }}>
          <Label htmlFor="password" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••••••••"
            value={userData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
            className="bg-[#2e333d] border-0 focus-visible:ring-1 focus-visible:ring-[#ff8000] transition-all shadow-md hover:shadow-lg font-medium"
          />
        </div>
        <div className="space-y-1.5 group animate-slideUpFadeIn" style={{ animationDelay: '500ms' }}>
          <Label htmlFor="confirmPassword" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••••••••"
            value={userData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
            className="bg-[#2e333d] border-0 focus-visible:ring-1 focus-visible:ring-[#ff8000] transition-all shadow-md hover:shadow-lg font-medium"
          />
        </div>
        <Button 
          type="button" 
          className="w-full mt-6 bg-gradient-to-r from-[#ff8000] to-[#ff8000] hover:from-[#f29e37] hover:to-[#f29e37] text-white font-medium shadow-md hover:shadow-xl transition-all animate-slideUpFadeIn"
          style={{ animationDelay: '600ms' }}
          onClick={handleAccountStepNext}
        >
          Next
        </Button>
      </>
    );
  };

  const renderPersonalStep = () => {
    return (
      <>
        <div className="space-y-1.5 group animate-slideUpFadeIn" style={{ animationDelay: '200ms' }}>
          <Label htmlFor="gender" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Gender</Label>
          <Select 
            value={userData.gender} 
            onValueChange={(value) => handleChange("gender", value)}
          >
            <SelectTrigger id="gender" className="w-full bg-[#2e333d] border-0 focus:ring-1 focus:ring-[#ff8000] shadow-md hover:shadow-lg transition-all">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent className="bg-[#2e333d] border-[#444] text-gray-200">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 group animate-slideUpFadeIn" style={{ animationDelay: '300ms' }}>
          <Label htmlFor="dateOfBirth" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={userData.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            required
            className="bg-[#2e333d] border-0 focus-visible:ring-1 focus-visible:ring-[#ff8000] transition-all shadow-md hover:shadow-lg font-medium"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 animate-slideUpFadeIn" style={{ animationDelay: '400ms' }}>
          <div className="space-y-1.5 group">
            <Label htmlFor="height" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="175.0"
              value={userData.height}
              onChange={(e) => handleChange("height", e.target.value)}
              required
              className="bg-[#2e333d] border-0 focus-visible:ring-1 focus-visible:ring-[#ff8000] transition-all shadow-md hover:shadow-lg font-medium"
            />
          </div>
          <div className="space-y-1.5 group">
            <Label htmlFor="weight" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="70.0"
              value={userData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              required
              className="bg-[#2e333d] border-0 focus-visible:ring-1 focus-visible:ring-[#ff8000] transition-all shadow-md hover:shadow-lg font-medium"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-6 animate-slideUpFadeIn" style={{ animationDelay: '500ms' }}>
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 border-[#ff8000] text-[#ff8000] hover:bg-[#ff8000]/10 transition-colors shadow-md"
            onClick={handlePersonalStepPrevious}
          >
            Previous
          </Button>
          <Button 
            type="button" 
            className="flex-1 bg-gradient-to-r from-[#ff8000] to-[#ff8000] hover:from-[#f29e37] hover:to-[#f29e37] text-white font-medium shadow-md hover:shadow-xl transition-all"
            onClick={handlePersonalStepNext}
          >
            Next
          </Button>
        </div>
      </>
    );
  };

  const renderFitnessStep = () => {
    return (
      <>
        <div className="space-y-1.5 group animate-slideUpFadeIn" style={{ animationDelay: '200ms' }}>
          <Label htmlFor="fitnessLevel" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Fitness Level</Label>
          <Select 
            value={userData.fitnessLevel} 
            onValueChange={(value) => handleChange("fitnessLevel", value)}
          >
            <SelectTrigger id="fitnessLevel" className="w-full bg-[#2e333d] border-0 focus:ring-1 focus:ring-[#ff8000] shadow-md hover:shadow-lg transition-all">
              <SelectValue placeholder="Select your fitness level" />
            </SelectTrigger>
            <SelectContent className="bg-[#2e333d] border-[#444] text-gray-200">
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="athlete">Athlete</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 group animate-slideUpFadeIn" style={{ animationDelay: '300ms' }}>
          <Label htmlFor="fitnessGoal" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Fitness Goal</Label>
          <Select 
            value={userData.fitnessGoal} 
            onValueChange={(value) => handleChange("fitnessGoal", value)}
          >
            <SelectTrigger id="fitnessGoal" className="w-full bg-[#2e333d] border-0 focus:ring-1 focus:ring-[#ff8000] shadow-md hover:shadow-lg transition-all">
              <SelectValue placeholder="Select your primary goal" />
            </SelectTrigger>
            <SelectContent className="bg-[#2e333d] border-[#444] text-gray-200">
              <SelectItem value="weight_loss">Weight Loss</SelectItem>
              <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
              <SelectItem value="endurance">Improve Endurance</SelectItem>
              <SelectItem value="strength">Increase Strength</SelectItem>
              <SelectItem value="flexibility">Improve Flexibility</SelectItem>
              <SelectItem value="general_fitness">General Fitness</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 group animate-slideUpFadeIn" style={{ animationDelay: '400ms' }}>
          <Label htmlFor="activityLevel" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Daily Activity Level</Label>
          <Select 
            value={userData.activityLevel} 
            onValueChange={(value) => handleChange("activityLevel", value)}
          >
            <SelectTrigger id="activityLevel" className="w-full bg-[#2e333d] border-0 focus:ring-1 focus:ring-[#ff8000] shadow-md hover:shadow-lg transition-all">
              <SelectValue placeholder="Select your activity level" />
            </SelectTrigger>
            <SelectContent className="bg-[#2e333d] border-[#444] text-gray-200">
              <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
              <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
              <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
              <SelectItem value="very_active">Very Active (exercise multiple times/day)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 group animate-slideUpFadeIn" style={{ animationDelay: '500ms' }}>
          <Label htmlFor="healthConditions" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Health Conditions (if any)</Label>
          <Textarea
            id="healthConditions"
            placeholder="Please list any health conditions or injuries we should be aware of"
            value={userData.healthConditions}
            onChange={(e) => handleChange("healthConditions", e.target.value)}
            className="bg-[#2e333d] border-0 focus-visible:ring-1 focus-visible:ring-[#ff8000] transition-all shadow-md hover:shadow-lg min-h-[80px] font-medium"
          />
        </div>
        <div className="flex gap-4 mt-6 animate-slideUpFadeIn" style={{ animationDelay: '600ms' }}>
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 border-[#ff8000] text-[#ff8000] hover:bg-[#ff8000]/10 transition-colors shadow-md"
            onClick={handleFitnessStepPrevious}
          >
            Previous
          </Button>
          <Button 
            type="button" 
            className="flex-1 bg-gradient-to-r from-[#ff8000] to-[#ff8000] hover:from-[#f29e37] hover:to-[#f29e37] text-white font-medium shadow-md hover:shadow-xl transition-all"
            onClick={handleCompleteRegistration}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : "Complete Registration"}
          </Button>
        </div>
      </>
    );
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: "account", label: "Account" },
      { id: "personal", label: "Personal" },
      { id: "fitness", label: "Fitness" },
    ];

    return (
      <div className="flex justify-center mb-6 animate-fadeIn">
        <div className="grid grid-cols-3 gap-1 w-full">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`text-center px-4 py-2.5 rounded-md transition-all duration-300 ${
                currentStep === step.id
                  ? "bg-gradient-to-r from-[#ff8000] to-[#f29e37] text-white shadow-md"
                  : "bg-[#2e333d] text-gray-400"
              } ${currentStep !== step.id && index < steps.findIndex(s => s.id === currentStep) ? "bg-[#2e333d]/80 text-[#ff8000]" : ""}`}
            >
              {step.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden">
      {/* Enhanced background with animated gradient overlay */}
      <div className="fixed inset-0 -z-10 main-background-image after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-[#000000]/60 after:via-[#121212]/70 after:to-[#ff8000]/10"></div>
      
      {/* Animated fitness-themed elements in the background */}
      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-24 h-24 rounded-full bg-gradient-to-br from-[#ff8000]/20 to-[#ff8000]/5 blur-xl animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-[#ff8000]/15 to-[#ff8000]/5 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] right-[8%] w-16 h-16 rounded-full bg-gradient-to-br from-[#ff8000]/20 to-[#ff8000]/5 blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Improved card with better visual effects */}
      <Card className="w-full max-w-lg bg-[#1e1e1e]/70 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.6)] backdrop-blur-md rounded-xl overflow-hidden animate-fadeIn">
        {/* Card accent top line */}
        <div className="h-1 w-full bg-gradient-to-r from-[#ff8000] via-[#f29e37] to-[#ff8000]"></div>
        
        <CardHeader className="text-center pt-8 pb-4 px-8">
          <div className="flex justify-center mb-4 animate-logoFloat">
            <Dumbbell className="h-14 w-14 text-[#ff8000]" />
          </div>
          <CardTitle className="text-3xl font-medium mb-2 text-white">Create an account</CardTitle>
          <CardDescription className="text-gray-400 text-base">Enter your information to get started with your fitness journey</CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          {renderStepIndicator()}
          <form className="space-y-5">
            {currentStep === "account" && renderAccountStep()}
            {currentStep === "personal" && renderPersonalStep()}
            {currentStep === "fitness" && renderFitnessStep()}
          </form>
          <div className="text-center mt-6 animate-fadeIn">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-[#ff8000] hover:text-[#f29e37] hover:underline transition-colors font-medium">
                Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;