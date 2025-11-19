import { Shield, MessageSquare, Search, AlertTriangle, Heart, MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";

const AdultWomanDashboard = () => {
  const userName = "Sarah";
  const safetyScore = 85;

  const quickActions = [
    { icon: MessageSquare, label: "Scan Message", path: "/scanner/message", color: "bg-blue-500/10 text-blue-500" },
    { icon: Search, label: "Scan URL", path: "/scanner/url", color: "bg-purple-500/10 text-purple-500" },
    { icon: AlertTriangle, label: "Report Abuse", path: "/report", color: "bg-red-500/10 text-red-500" },
    { icon: Heart, label: "Wellness Check", path: "/wellness", color: "bg-pink-500/10 text-pink-500" },
  ];

  const emergencyTools = [
    { icon: Phone, label: "Fake Call", description: "Trigger a fake emergency call" },
    { icon: MapPin, label: "Share Location", description: "Send your location to trusted contacts" },
    { icon: AlertTriangle, label: "SOS Alert", description: "Send immediate help signal" },
  ];

  const recentActivity = [
    { type: "scan", message: "Scanned 3 messages", time: "2 hours ago", status: "safe" },
    { type: "url", message: "Checked suspicious link", time: "Yesterday", status: "warning" },
    { type: "community", message: "Posted in community", time: "2 days ago", status: "safe" },
  ];

  return (
    <DashboardLayout theme="adult-woman">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-2xl p-8 border border-purple-500/20">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            You're doing great! Your digital wellbeing is our priority.
          </p>
        </div>

        {/* Safety Score */}
        <Card className="p-6 bg-gradient-to-br from-card to-primary/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-heading font-semibold">Safety Score</h3>
              <p className="text-muted-foreground text-sm">Your overall digital safety rating</p>
            </div>
            <div className="text-4xl font-bold text-primary">{safetyScore}%</div>
          </div>
          <Progress value={safetyScore} className="h-3" />
          <p className="text-sm text-muted-foreground mt-3">
            Great job! Your safety practices are strong. Keep it up!
          </p>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-heading font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <Card className="p-6 hover-glow cursor-pointer transition-all h-full">
                  <div className={`p-4 rounded-xl w-fit mb-4 ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">{action.label}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Emergency Tools */}
        <Card className="p-6 border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-heading font-semibold">Emergency Tools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emergencyTools.map((tool, index) => (
              <button
                key={index}
                className="p-6 rounded-xl border-2 border-red-500/30 hover:border-red-500 bg-background/50 transition-all text-left group"
              >
                <tool.icon className="h-8 w-8 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">{tool.label}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            These tools are available 24/7 for your safety and peace of mind
          </p>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-2xl font-heading font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    activity.status === "safe" ? "bg-green-500/10 text-green-500" :
                    activity.status === "warning" ? "bg-amber-500/10 text-amber-500" :
                    "bg-red-500/10 text-red-500"
                  }`}>
                    {activity.type === "scan" ? <MessageSquare className="h-5 w-5" /> :
                     activity.type === "url" ? <Search className="h-5 w-5" /> :
                     <Shield className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  activity.status === "safe" ? "bg-green-500/10 text-green-500" :
                  activity.status === "warning" ? "bg-amber-500/10 text-amber-500" :
                  "bg-red-500/10 text-red-500"
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Wellness Resources */}
        <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20">
          <h2 className="text-2xl font-heading font-semibold mb-4">Wellness Resources</h2>
          <p className="text-muted-foreground mb-6">
            Take care of your mental health and digital wellbeing
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-full">Mental Health Support</Button>
            <Button variant="outline" className="rounded-full">Legal Resources</Button>
            <Button variant="outline" className="rounded-full">Safety Tips</Button>
            <Button variant="outline" className="rounded-full">Community Guidelines</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdultWomanDashboard;
