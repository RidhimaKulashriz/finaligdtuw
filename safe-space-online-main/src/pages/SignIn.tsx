import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Shield, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Background3D } from "@/components/Background3D";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<"auth" | "personalize">("auth");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        await register({
          username: formData.name,
          email: formData.email,
          password: formData.password,
        });
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  const handlePersonalize = (ageGroup: string, gender: string) => {
    // Map selections to dashboard routes
    let route = "/dashboard/adult-woman"; // default
    
    if (ageGroup === "child") {
      route = gender === "boy" ? "/dashboard/child-boy" : "/dashboard/child-girl";
    } else if (ageGroup === "teen") {
      route = "/dashboard/teen";
    } else if (ageGroup === "adult") {
      if (gender === "nonbinary") {
        route = "/dashboard/nonbinary";
      } else if (gender === "man" || gender === "boy") {
        route = "/dashboard/adult-man";
      } else {
        route = "/dashboard/adult-woman";
      }
    } else if (ageGroup === "senior") {
      route = "/dashboard/senior";
    } else if (gender === "nonbinary") {
      route = "/dashboard/nonbinary";
    }
    
    navigate(route);
  };

  if (step === "personalize") {
    return (
      <div className="min-h-screen flex items-center justify-center relative px-4">
        <Background3D />
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <Card className="w-full max-w-4xl p-8 md:p-12 relative z-10 glass border-primary/20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Personalize Your Experience
            </h2>
            <p className="text-muted-foreground text-lg">
              Help us tailor SAFESPACE to your needs
            </p>
          </div>

          {/* Age Group Selection */}
          <div className="mb-12">
            <h3 className="text-2xl font-heading font-semibold mb-6">
              Select Your Age Group
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: "child", label: "Child", age: "8-12", emoji: "🧒" },
                { id: "teen", label: "Teen", age: "13-17", emoji: "🎓" },
                { id: "adult", label: "Adult", age: "18-45", emoji: "💼" },
                { id: "senior", label: "Senior", age: "45+", emoji: "👴" },
              ].map((group) => (
                <button
                  key={group.id}
                  onClick={() => {
                    const ageGroup = group.id;
                    // Show gender selection for relevant groups
                    if (group.id === "child" || group.id === "adult") {
                      document.getElementById("gender-section")?.scrollIntoView({ behavior: "smooth" });
                      document.getElementById("gender-section")?.setAttribute("data-age-group", ageGroup);
                    } else {
                      handlePersonalize(ageGroup, "any");
                    }
                  }}
                  className="p-6 rounded-2xl border-2 border-border hover:border-primary transition-all hover-glow text-center group"
                >
                  <div className="text-5xl mb-3">{group.emoji}</div>
                  <h4 className="font-heading font-semibold text-xl mb-1">
                    {group.label}
                  </h4>
                  <p className="text-muted-foreground text-sm">{group.age}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Gender Selection */}
          <div id="gender-section" className="mb-8">
            <h3 className="text-2xl font-heading font-semibold mb-6">
              Select Your Gender (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: "girl", label: "Girl/Woman", emoji: "👧", color: "border-pink-500/50 hover:border-pink-500" },
                { id: "boy", label: "Boy/Man", emoji: "👦", color: "border-blue-500/50 hover:border-blue-500" },
                { id: "nonbinary", label: "Non-binary", emoji: "🌟", color: "border-purple-500/50 hover:border-purple-500" },
                { id: "prefer-not", label: "Prefer not to say", emoji: "✨", color: "border-gray-500/50 hover:border-gray-500" },
              ].map((gender) => (
                <button
                  key={gender.id}
                  onClick={() => {
                    const ageGroup = document.getElementById("gender-section")?.getAttribute("data-age-group") || "adult";
                    const genderKey = gender.id === "girl" ? "girl" : 
                                     gender.id === "boy" ? "boy" : 
                                     gender.id === "nonbinary" ? "nonbinary" : 
                                     gender.id === "prefer-not" ? (ageGroup === "child" ? "boy" : "man") : "any";
                    handlePersonalize(ageGroup, genderKey);
                  }}
                  className={`p-6 rounded-2xl border-2 transition-all hover-glow text-center group ${gender.color}`}
                >
                  <div className="text-5xl mb-3">{gender.emoji}</div>
                  <h4 className="font-heading font-semibold text-lg">
                    {gender.label}
                  </h4>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            This helps us personalize your safety features and content
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <Background3D />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md p-8 relative z-10 glass border-primary/20">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-heading font-bold gradient-text">
              SAFESPACE
            </span>
          </Link>
          <h2 className="text-3xl font-heading font-bold mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-muted-foreground">
            {isSignUp ? "Start your journey to digital safety" : "Sign in to continue to SAFESPACE"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full btn-hero" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </>
            ) : (
              <>
                {isSignUp ? "Create Account" : "Sign In"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>

        {!isSignUp && (
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SignIn;
