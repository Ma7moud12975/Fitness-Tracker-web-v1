import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      if (data && data.user) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/");
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
      <Card className="w-full max-w-md bg-[#1e1e1e]/70 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.6)] backdrop-blur-md rounded-xl overflow-hidden animate-fadeIn">
        {/* Card accent top line */}
        <div className="h-1 w-full bg-gradient-to-r from-[#ff8000] via-[#f29e37] to-[#ff8000]"></div>
        
        <CardHeader className="text-center pt-8 pb-4 px-8">
          <div className="flex justify-center mb-4 animate-logoFloat">
            <Dumbbell className="h-14 w-14 text-[#ff8000]" />
          </div>
          <CardTitle className="text-3xl font-medium mb-2 text-white">Welcome back</CardTitle>
          <CardDescription className="text-gray-400 text-base">Enter your credentials to sign in</CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5 group animate-slideUpFadeIn" style={{ animationDelay: '200ms' }}>
              <Label htmlFor="email" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="youremail@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#2e333d] border-0 focus-visible:ring-1 focus-visible:ring-[#ff8000] transition-all shadow-md hover:shadow-lg font-medium"
              />
            </div>
            
            <div className="space-y-1.5 group animate-slideUpFadeIn" style={{ animationDelay: '300ms' }}>
              <Label htmlFor="password" className="text-sm font-normal text-gray-300 group-focus-within:text-[#ff8000] transition-colors">Password</Label>
              <Input 
                id="password"
                type="password" 
                placeholder="••••••••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#2e333d] border-0 focus-visible:ring-1 focus-visible:ring-[#ff8000] transition-all shadow-md hover:shadow-lg font-medium"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6 bg-gradient-to-r from-[#ff8000] to-[#ff8000] hover:from-[#f29e37] hover:to-[#f29e37] text-white font-medium shadow-md hover:shadow-xl transition-all animate-slideUpFadeIn"
              style={{ animationDelay: '400ms' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : "Sign in"}
            </Button>
            
            <div className="text-center mt-6 animate-slideUpFadeIn" style={{ animationDelay: '500ms' }}>
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#ff8000] hover:text-[#f29e37] hover:underline transition-colors font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 