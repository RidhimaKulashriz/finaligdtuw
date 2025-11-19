import { useState } from "react";
import { Users, Plus, Heart, MessageCircle, Shield, TrendingUp, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";

const Community = () => {
  const [safeMode, setSafeMode] = useState(true);

  const trendingTopics = [
    { name: "Cyberbullying Support", count: 234 },
    { name: "Privacy Tips", count: 189 },
    { name: "Online Safety", count: 156 },
    { name: "Digital Wellness", count: 143 },
    { name: "Parent Corner", count: 98 },
  ];

  const posts = [
    {
      id: 1,
      author: "SafeUser123",
      avatar: "👤",
      time: "2 hours ago",
      title: "How I dealt with online harassment",
      content: "I wanted to share my story about dealing with harassment on social media and how SAFESPACE helped me...",
      tags: ["Support", "Harassment", "Story"],
      likes: 42,
      comments: 15,
      anonymous: false,
    },
    {
      id: 2,
      author: "Anonymous",
      avatar: "🎭",
      time: "5 hours ago",
      title: "Need advice: Suspicious messages from stranger",
      content: "I've been receiving weird messages from someone I don't know. They're asking personal questions...",
      tags: ["Advice", "Scam Alert"],
      likes: 28,
      comments: 23,
      anonymous: true,
    },
    {
      id: 3,
      author: "TechSavvy_Parent",
      avatar: "👨‍👩‍👧",
      time: "1 day ago",
      title: "Best parental control tips for teens",
      content: "As a parent of two teenagers, I've learned a lot about balancing safety with privacy...",
      tags: ["Parents", "Tips", "Teens"],
      likes: 67,
      comments: 31,
      anonymous: false,
    },
    {
      id: 4,
      author: "DigitalWarrior",
      avatar: "🛡️",
      time: "1 day ago",
      title: "Recognizing phishing emails - A guide",
      content: "Here's everything I've learned about identifying phishing attempts and protecting yourself...",
      tags: ["Education", "Phishing", "Guide"],
      likes: 89,
      comments: 18,
      anonymous: false,
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-2 flex items-center gap-3">
              <Users className="h-10 w-10 text-primary" />
              Community Forum
            </h1>
            <p className="text-xl text-muted-foreground">
              A safe space to share, learn, and support each other
            </p>
          </div>
          <Button className="btn-hero">
            <Plus className="mr-2 h-5 w-5" />
            New Post
          </Button>
        </div>

        {/* Search & Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search posts, topics, or tags..."
                className="pl-10"
              />
            </div>
            <Button
              variant={safeMode ? "default" : "outline"}
              onClick={() => setSafeMode(!safeMode)}
              className="rounded-full"
            >
              <Shield className="mr-2 h-5 w-5" />
              Safe Mode {safeMode ? "ON" : "OFF"}
            </Button>
          </div>
        </Card>

        {/* Trending Topics */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
          <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Trending Topics
          </h2>
          <div className="flex flex-wrap gap-3">
            {trendingTopics.map((topic, index) => (
              <button
                key={index}
                className="px-4 py-2 rounded-full bg-background hover:bg-muted transition-colors border border-border"
              >
                <span className="font-medium">{topic.name}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {topic.count} posts
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="p-6 hover-glow transition-all cursor-pointer">
              {/* Post Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{post.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{post.author}</span>
                    {post.anonymous && (
                      <Badge variant="secondary" className="text-xs">
                        Anonymous
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{post.time}</span>
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2">
                    {post.title}
                  </h3>
                  <p className="text-foreground/80 mb-3">{post.content}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Interactions */}
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                      <Heart className="h-5 w-5" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-primary transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Community Guidelines */}
        <Card className="p-6 bg-blue-500/10 border-blue-500/20">
          <h3 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            Community Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground/80">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Be kind and respectful to everyone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Share experiences to help others</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Use content warnings when needed</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>No harassment or bullying</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>No sharing personal information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>No spam or promotional content</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            All posts are moderated to ensure a safe and supportive environment
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Community;
