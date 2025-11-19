import { BookOpen, Video, FileText, Download, Shield, Heart, Users, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Resources = () => {
  const categories = [
    {
      icon: Shield,
      title: "Cyber Safety",
      description: "Learn how to protect yourself online",
      resources: [
        { type: "guide", title: "Complete Guide to Online Privacy", time: "15 min read" },
        { type: "video", title: "Recognizing Phishing Scams", time: "8 min" },
        { type: "article", title: "Two-Factor Authentication Setup", time: "5 min read" },
      ],
    },
    {
      icon: Heart,
      title: "Mental Health",
      description: "Digital wellness and emotional support",
      resources: [
        { type: "guide", title: "Managing Social Media Anxiety", time: "12 min read" },
        { type: "video", title: "Digital Detox Tips", time: "10 min" },
        { type: "article", title: "Dealing with Cyberbullying", time: "8 min read" },
      ],
    },
    {
      icon: Users,
      title: "For Parents",
      description: "Resources for keeping kids safe online",
      resources: [
        { type: "guide", title: "Parental Control Complete Guide", time: "20 min read" },
        { type: "video", title: "Talking to Kids About Online Safety", time: "12 min" },
        { type: "article", title: "Age-Appropriate Internet Use", time: "10 min read" },
      ],
    },
    {
      icon: Lightbulb,
      title: "Tips & Tricks",
      description: "Quick tips for everyday safety",
      resources: [
        { type: "guide", title: "Password Security Best Practices", time: "6 min read" },
        { type: "video", title: "Secure Your Accounts in 5 Steps", time: "5 min" },
        { type: "article", title: "Privacy Settings Checklist", time: "4 min read" },
      ],
    },
  ];

  const featuredGuides = [
    {
      title: "The Ultimate Cyber Safety Guide",
      description: "Everything you need to know about staying safe online in 2024",
      image: "📚",
      tags: ["Comprehensive", "All Ages", "Updated"],
    },
    {
      title: "Teen Online Safety Handbook",
      description: "A complete guide for teenagers navigating the digital world",
      image: "🎓",
      tags: ["Teens", "Social Media", "Gaming"],
    },
    {
      title: "Senior's Internet Guide",
      description: "Easy-to-follow safety tips for seniors new to the internet",
      image: "👴",
      tags: ["Seniors", "Easy", "Step-by-step"],
    },
  ];

  const legalResources = [
    {
      title: "Cyberbullying Laws by State",
      description: "Know your legal rights and protections",
    },
    {
      title: "Reporting Online Harassment",
      description: "Step-by-step guide to reporting incidents",
    },
    {
      title: "Digital Privacy Rights",
      description: "Understanding your data protection rights",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-heading font-bold mb-4 flex items-center gap-3">
            <BookOpen className="h-10 w-10 text-primary" />
            Resources Hub
          </h1>
          <p className="text-xl text-muted-foreground">
            Educational content, guides, and support materials for digital safety
          </p>
        </div>

        {/* Featured Guides */}
        <div>
          <h2 className="text-2xl font-heading font-semibold mb-6">Featured Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGuides.map((guide, index) => (
              <Card key={index} className="p-6 hover-glow cursor-pointer transition-all">
                <div className="text-6xl mb-4">{guide.image}</div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {guide.title}
                </h3>
                <p className="text-muted-foreground mb-4">{guide.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {guide.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button className="w-full rounded-full" variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read Guide
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Resource Categories */}
        <Tabs defaultValue="cyber-safety" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="cyber-safety">Cyber Safety</TabsTrigger>
            <TabsTrigger value="mental-health">Mental Health</TabsTrigger>
            <TabsTrigger value="parents">For Parents</TabsTrigger>
            <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
          </TabsList>

          {categories.map((category, catIndex) => (
            <TabsContent key={catIndex} value={category.title.toLowerCase().replace(" ", "-")} className="space-y-6">
              <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-primary/10">
                    <category.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-heading font-bold mb-2">{category.title}</h3>
                    <p className="text-lg text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {category.resources.map((resource, resIndex) => (
                    <Card key={resIndex} className="p-6 hover-glow cursor-pointer bg-background/80">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {resource.type === "video" && <Video className="h-6 w-6 text-blue-500" />}
                          {resource.type === "guide" && <BookOpen className="h-6 w-6 text-purple-500" />}
                          {resource.type === "article" && <FileText className="h-6 w-6 text-green-500" />}
                          <div>
                            <h4 className="font-semibold text-lg mb-1">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground">{resource.time}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-full">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Legal Resources */}
        <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <h2 className="text-2xl font-heading font-semibold mb-6 flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            Legal Resources & Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {legalResources.map((resource, index) => (
              <Card key={index} className="p-6 bg-background/80 hover-glow cursor-pointer">
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {resource.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {resource.description}
                </p>
                <Button variant="outline" size="sm" className="rounded-full">
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </Card>

        {/* Emergency Contacts */}
        <Card className="p-6 bg-red-500/10 border-red-500/20">
          <h3 className="font-heading font-semibold text-xl mb-4 text-red-500">
            Emergency Contacts & Helplines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground/80">
            <div className="p-4 rounded-lg bg-background/80">
              <p className="font-semibold mb-1">National Suicide Prevention Lifeline</p>
              <p className="text-muted-foreground">1-800-273-8255</p>
            </div>
            <div className="p-4 rounded-lg bg-background/80">
              <p className="font-semibold mb-1">Cyberbullying Hotline</p>
              <p className="text-muted-foreground">1-800-273-8255</p>
            </div>
            <div className="p-4 rounded-lg bg-background/80">
              <p className="font-semibold mb-1">Teen Crisis Text Line</p>
              <p className="text-muted-foreground">Text HOME to 741741</p>
            </div>
            <div className="p-4 rounded-lg bg-background/80">
              <p className="font-semibold mb-1">National Domestic Violence Hotline</p>
              <p className="text-muted-foreground">1-800-799-7233</p>
            </div>
          </div>
        </Card>

        {/* Download Materials */}
        <Card className="p-6">
          <h2 className="text-2xl font-heading font-semibold mb-6">
            Downloadable Materials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-6 justify-start" size="lg">
              <FileText className="mr-3 h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Safety Checklist PDF</p>
                <p className="text-sm text-muted-foreground">Quick reference guide</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-6 justify-start" size="lg">
              <Download className="mr-3 h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Phishing Examples</p>
                <p className="text-sm text-muted-foreground">Real-world examples</p>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Resources;
