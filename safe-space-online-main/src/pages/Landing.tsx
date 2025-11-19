import { Shield, Users, MessageSquare, Search, Lock, Heart, Sparkles, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Background3D } from "@/components/Background3D";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Landing = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Message Scanner",
      description: "AI-powered detection of toxic, harassing, and dangerous messages in real-time.",
      color: "text-blue-500",
    },
    {
      icon: Search,
      title: "Phishing Detector",
      description: "Scan URLs and links to protect yourself from scams and malicious websites.",
      color: "text-purple-500",
    },
    {
      icon: Users,
      title: "Safe Community",
      description: "Connect with others in a moderated, supportive space for sharing experiences.",
      color: "text-green-500",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data stays yours. End-to-end encryption and zero data selling.",
      color: "text-red-500",
    },
    {
      icon: Heart,
      title: "Mental Wellbeing",
      description: "Tools and resources for digital wellness and emotional support.",
      color: "text-pink-500",
    },
    {
      icon: Sparkles,
      title: "Personalized",
      description: "Tailored protection based on your age, gender, and personal needs.",
      color: "text-amber-500",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your account and tell us about yourself",
    },
    {
      number: "02",
      title: "Personalize",
      description: "Choose your age group and preferences",
    },
    {
      number: "03",
      title: "Stay Safe",
      description: "Get real-time protection across all platforms",
    },
    {
      number: "04",
      title: "Connect",
      description: "Join our supportive community",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Parent",
      content: "SAFESPACE gives me peace of mind knowing my kids are protected online. The parental controls are intuitive and effective.",
      rating: 5,
    },
    {
      name: "Alex K.",
      role: "Teen User",
      content: "Finally, a platform that understands what teens go through online. The community is supportive and judgment-free.",
      rating: 5,
    },
    {
      name: "Dr. Lisa Chen",
      role: "Educator",
      content: "An essential tool for digital literacy. I recommend SAFESPACE to all my students and their families.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen relative">
      <Background3D />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Trusted by 100,000+ users worldwide</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
              A Safer Digital World
              <br />
              <span className="gradient-text">For Everyone</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Personalized digital safety protection for every age and gender. Navigate the online world with confidence and dignity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/signin">
                <Button className="btn-hero text-lg px-10 py-6 rounded-full">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="text-lg px-10 py-6 rounded-full border-2 hover-glow"
              >
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-muted/30 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay safe and confident in the digital world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 hover-glow transition-all duration-300 border-border/50 bg-card/50 backdrop-blur"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`p-4 rounded-2xl bg-primary/10 w-fit mb-6`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-heading font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              How SAFESPACE Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple 4-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-center">
                  <div className="text-6xl font-heading font-bold text-primary/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-heading font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-muted/30 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Loved by Our Community
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what people are saying about SAFESPACE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-8 hover-glow bg-card/50 backdrop-blur border-border/50"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative">
        <div className="container mx-auto">
          <Card className="p-12 md:p-16 text-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-50" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                Ready to Experience Digital Safety?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust SAFESPACE for their digital wellbeing
              </p>
              <Link to="/signin">
                <Button className="btn-hero text-lg px-12 py-6 rounded-full">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
