import { Shield, MessageSquare, Search, Phone, AlertTriangle, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";

const SeniorDashboard = () => {
  const userName = "Robert";

  const largeActions = [
    { 
      icon: MessageSquare, 
      label: "Check Message Safety", 
      description: "Scan texts and emails",
      path: "/scanner/message", 
      color: "bg-blue-500/10 text-blue-500" 
    },
    { 
      icon: Search, 
      label: "Check Website Safety", 
      description: "Verify links before clicking",
      path: "/scanner/url", 
      color: "bg-purple-500/10 text-purple-500" 
    },
    { 
      icon: Phone, 
      label: "Get Help Now", 
      description: "24/7 support available",
      path: "/help", 
      color: "bg-green-500/10 text-green-500" 
    },
    { 
      icon: BookOpen, 
      label: "Learning Resources", 
      description: "Easy guides and videos",
      path: "/resources", 
      color: "bg-amber-500/10 text-amber-500" 
    },
  ];

  const safetyTips = [
    "Never share your password with anyone, even if they claim to be from your bank",
    "If an offer seems too good to be true, it probably is a scam",
    "Real companies won't ask for sensitive information via email",
    "Always verify phone numbers before returning suspicious calls",
  ];

  const recentActivity = [
    { action: "Scanned email link", result: "Safe ✓", time: "Yesterday" },
    { action: "Checked website", result: "Warning ⚠️", time: "2 days ago" },
    { action: "Read safety guide", result: "Completed ✓", time: "3 days ago" },
  ];

  return (
    <DashboardLayout theme="senior">
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in" style={{ fontSize: "1.15rem" }}>
        {/* Welcome Banner - Large Text */}
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-3xl p-10 border-2 border-amber-500/30">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
            Welcome, {userName}! 👋
          </h1>
          <p className="text-2xl text-muted-foreground">
            Stay safe and confident online with simple, easy-to-use tools
          </p>
        </div>

        {/* Main Actions - Extra Large Buttons */}
        <div>
          <h2 className="text-3xl font-heading font-bold mb-6">What would you like to do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {largeActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <Card className="p-10 hover-glow cursor-pointer transition-all h-full border-2 hover:border-primary">
                  <div className={`p-6 rounded-2xl w-fit mb-6 ${action.color}`}>
                    <action.icon className="h-12 w-12" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl mb-2">{action.label}</h3>
                  <p className="text-xl text-muted-foreground">{action.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Safety Tips - High Contrast */}
        <Card className="p-10 bg-blue-500/10 border-2 border-blue-500/30">
          <h2 className="text-3xl font-heading font-bold mb-6 flex items-center gap-3">
            <Shield className="h-10 w-10 text-blue-500" />
            Important Safety Tips
          </h2>
          <div className="space-y-5">
            {safetyTips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-2xl bg-background/80 backdrop-blur border-2 border-border"
              >
                <div className="text-3xl flex-shrink-0 mt-1">💡</div>
                <p className="text-xl leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity - Large Text */}
        <Card className="p-10">
          <h2 className="text-3xl font-heading font-bold mb-6">Your Recent Activity</h2>
          <div className="space-y-5">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors border-2 border-border"
              >
                <div>
                  <p className="font-semibold text-xl mb-1">{activity.action}</p>
                  <p className="text-lg text-muted-foreground">{activity.time}</p>
                </div>
                <span className="text-2xl font-bold">{activity.result}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Emergency Contact - Prominent */}
        <Card className="p-10 bg-red-500/10 border-2 border-red-500/30">
          <div className="flex items-start gap-6">
            <div className="p-6 rounded-2xl bg-red-500/10 flex-shrink-0">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-heading font-bold mb-3 text-red-500">
                Need Immediate Help?
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                If you believe you've encountered a scam or need urgent assistance
              </p>
              <Button size="lg" className="text-xl px-10 py-6 rounded-full bg-red-500 hover:bg-red-600">
                <Phone className="mr-3 h-6 w-6" />
                Call Support: 1-800-SAFE-NOW
              </Button>
            </div>
          </div>
        </Card>

        {/* Voice Navigation Note */}
        <Card className="p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🎤</div>
            <div>
              <h3 className="text-2xl font-heading font-semibold mb-2">Voice Navigation Available</h3>
              <p className="text-lg text-muted-foreground">
                Click the microphone icon in the corner to use voice commands (Coming Soon)
              </p>
            </div>
          </div>
        </Card>

        {/* Simple Guide */}
        <Card className="p-10">
          <h2 className="text-3xl font-heading font-bold mb-6">Quick Start Guide</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                1
              </div>
              <div>
                <p className="text-xl font-semibold mb-2">Check Your Messages</p>
                <p className="text-lg text-muted-foreground">
                  Use "Check Message Safety" to scan any suspicious emails or texts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                2
              </div>
              <div>
                <p className="text-xl font-semibold mb-2">Verify Links</p>
                <p className="text-lg text-muted-foreground">
                  Before clicking any link, use "Check Website Safety" to verify it's legitimate
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                3
              </div>
              <div>
                <p className="text-xl font-semibold mb-2">Ask for Help</p>
                <p className="text-lg text-muted-foreground">
                  If you're unsure about anything, use "Get Help Now" for immediate assistance
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SeniorDashboard;
